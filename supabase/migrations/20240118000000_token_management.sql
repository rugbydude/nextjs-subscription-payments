-- Create enum for transaction types
CREATE TYPE transaction_type AS ENUM ('PURCHASE', 'USAGE', 'REFUND', 'BONUS');

-- Token transactions table
CREATE TABLE token_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type transaction_type NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Token usage table
CREATE TABLE token_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tokens INTEGER NOT NULL,
    feature TEXT NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add token_balance column to users profile
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS token_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifetime_purchased INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifetime_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_purchase_date TIMESTAMPTZ;

-- Create function to update token balance
CREATE OR REPLACE FUNCTION update_token_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type IN ('PURCHASE', 'BONUS') THEN
        UPDATE public.profiles 
        SET token_balance = token_balance + NEW.amount,
            lifetime_purchased = lifetime_purchased + NEW.amount,
            last_purchase_date = NOW()
        WHERE id = NEW.user_id;
    ELSIF NEW.type = 'USAGE' THEN
        UPDATE public.profiles 
        SET token_balance = token_balance + NEW.amount,
            lifetime_used = lifetime_used + ABS(NEW.amount)
        WHERE id = NEW.user_id;
    ELSIF NEW.type = 'REFUND' THEN
        UPDATE public.profiles 
        SET token_balance = token_balance + NEW.amount,
            lifetime_purchased = lifetime_purchased - NEW.amount
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for token balance updates
CREATE TRIGGER update_token_balance_trigger
AFTER INSERT ON token_transactions
FOR EACH ROW
EXECUTE FUNCTION update_token_balance();

-- Create indexes for better performance
CREATE INDEX idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at);
CREATE INDEX idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX idx_token_usage_created_at ON token_usage(created_at);

-- Create view for daily usage stats
CREATE OR REPLACE VIEW token_daily_usage AS
SELECT 
    user_id,
    DATE_TRUNC('day', created_at) as date,
    SUM(ABS(tokens)) as tokens
FROM token_usage
GROUP BY user_id, DATE_TRUNC('day', created_at);

-- Create view for feature usage stats
CREATE OR REPLACE VIEW token_feature_usage AS
SELECT 
    user_id,
    feature,
    SUM(tokens) as tokens
FROM token_usage
GROUP BY user_id, feature;

-- Create view for project usage stats
CREATE OR REPLACE VIEW token_project_usage AS
SELECT 
    u.user_id,
    u.project_id,
    p.name as project_name,
    SUM(u.tokens) as tokens
FROM token_usage u
LEFT JOIN projects p ON u.project_id = p.id
WHERE u.project_id IS NOT NULL
GROUP BY u.user_id, u.project_id, p.name;

-- Create function to consume tokens
CREATE OR REPLACE FUNCTION consume_tokens(amount_to_consume INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_balance INTEGER;
BEGIN
    -- Get current balance
    SELECT token_balance INTO current_balance
    FROM profiles
    WHERE id = auth.uid();

    -- Check if user has enough tokens
    IF current_balance < amount_to_consume THEN
        RAISE EXCEPTION 'Insufficient tokens. Available: %, Required: %', current_balance, amount_to_consume;
    END IF;

    -- Update balance and record transaction in a single transaction
    BEGIN
        -- Update balance
        UPDATE profiles
        SET 
            token_balance = token_balance - amount_to_consume,
            lifetime_used = lifetime_used + amount_to_consume
        WHERE id = auth.uid();

        -- Record transaction
        INSERT INTO token_transactions (
            user_id,
            amount,
            type,
            description
        ) VALUES (
            auth.uid(),
            -amount_to_consume,
            'USAGE',
            'Token consumption'
        );

        RETURN TRUE;
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to consume tokens: %', SQLERRM;
    END;
END;
$$; 