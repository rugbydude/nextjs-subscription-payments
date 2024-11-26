-- Create token_balances table
create table if not exists token_balances (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  balance integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_token_balances_updated_at
  before update on token_balances
  for each row
  execute procedure update_updated_at_column();

-- RLS Policies
alter table token_balances enable row level security;

create policy "Users can view their own token balance"
  on token_balances for select
  using (auth.uid() = user_id);

create policy "Users can update their own token balance"
  on token_balances for update
  using (auth.uid() = user_id);
