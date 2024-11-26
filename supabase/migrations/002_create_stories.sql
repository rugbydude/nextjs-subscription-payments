-- Create stories table
create table if not exists stories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  acceptance_criteria text,
  priority text check (priority in ('low', 'medium', 'high')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table stories enable row level security;

-- Create policies
create policy "Users can view their own stories"
  on stories for select
  using (auth.uid() = user_id);

create policy "Users can create their own stories"
  on stories for insert
  with check (auth.uid() = user_id);
