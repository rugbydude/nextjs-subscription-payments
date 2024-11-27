-- Enable extensions
create extension if not exists "uuid-ossp";

-- Projects table
create table if not exists public.projects (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    status text check (status in ('active', 'on_hold', 'completed', 'archived')) default 'active',
    priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    progress integer default 0 check (progress >= 0 and progress <= 100),
    token_usage integer default 0,
    user_id uuid references auth.users not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb default '{}'::jsonb
);

-- Add RLS policies
alter table public.projects enable row level security;

create policy "Users can view own projects"
    on projects for select
    using (auth.uid() = user_id);

create policy "Users can create own projects"
    on projects for insert
    with check (auth.uid() = user_id);

create policy "Users can update own projects"
    on projects for update
    using (auth.uid() = user_id);

create policy "Users can delete own projects"
    on projects for delete
    using (auth.uid() = user_id);

-- Add update trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_projects_updated_at
    before update on projects
    for each row
    execute function update_updated_at_column();
