create table if not exists public.token_balances (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null unique,
    balance integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.token_balances enable row level security;

create policy "Users can view own token balance" on public.token_balances 
    for select using (auth.uid() = user_id);
create policy "Users can update own token balance" on public.token_balances 
    for update using (auth.uid() = user_id);
