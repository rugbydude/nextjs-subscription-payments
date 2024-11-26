-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Token balances table
create table if not exists token_balances (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    balance integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_user_balance unique (user_id)
);

-- Token transactions table
create table if not exists token_transactions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    amount integer not null,
    type text not null check (type in ('purchase', 'consumption')),
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table token_balances enable row level security;
alter table token_transactions enable row level security;

create policy "Users can view own token balance"
    on token_balances for select
    using (auth.uid() = user_id);

create policy "Users can view own transactions"
    on token_transactions for select
    using (auth.uid() = user_id);
