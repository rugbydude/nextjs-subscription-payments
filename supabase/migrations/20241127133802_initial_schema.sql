-- Enable extensions
create extension if not exists "uuid-ossp";

-- Create base tables
create table if not exists public.projects (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    status text check (status in ('active', 'completed', 'archived')) default 'active',
    priority text check (priority in ('low', 'medium', 'high')) default 'medium',
    progress integer default 0 check (progress >= 0 and progress <= 100),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    token_usage integer default 0,
    user_id uuid references auth.users not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.epics (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    status text check (status in ('todo', 'in-progress', 'done')) default 'todo',
    priority text check (priority in ('low', 'medium', 'high')) default 'medium',
    progress integer default 0 check (progress >= 0 and progress <= 100),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    token_usage integer default 0,
    project_id uuid references public.projects on delete cascade not null,
    user_id uuid references auth.users not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.stories (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    acceptance_criteria jsonb default '[]'::jsonb,
    status text check (status in ('todo', 'in-progress', 'done')) default 'todo',
    priority text check (priority in ('low', 'medium', 'high')) default 'medium',
    epic_id uuid references public.epics on delete cascade,
    user_id uuid references auth.users not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;
alter table public.epics enable row level security;
alter table public.stories enable row level security;

-- Create policies
create policy "Users can view own projects"
    on public.projects for select
    using (auth.uid() = user_id);

create policy "Users can insert own projects"
    on public.projects for insert
    with check (auth.uid() = user_id);

create policy "Users can update own projects"
    on public.projects for update
    using (auth.uid() = user_id);

create policy "Users can delete own projects"
    on public.projects for delete
    using (auth.uid() = user_id);

-- Repeat similar policies for epics and stories
