-- schema.sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects table
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  status text check (status in ('active', 'completed', 'archived')) default 'active',
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Epics table
create table if not exists epics (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  status text check (status in ('todo', 'in-progress', 'done')) default 'todo',
  project_id uuid references projects on delete cascade not null,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stories table
create table if not exists stories (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  acceptance_criteria jsonb not null default '[]',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  status text check (status in ('todo', 'in-progress', 'done')) default 'todo',
  epic_id uuid references epics on delete cascade,
  user_id uuid references auth.users not null,
  tags text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table projects enable row level security;
alter table epics enable row level security;
alter table stories enable row level security;

-- RLS Policies
create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can create own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can view own epics"
  on epics for select
  using (auth.uid() = user_id);

create policy "Users can create own epics"
  on epics for insert
  with check (auth.uid() = user_id);

create policy "Users can view own stories"
  on stories for select
  using (auth.uid() = user_id);

create policy "Users can create own stories"
  on stories for insert
  with check (auth.uid() = user_id);