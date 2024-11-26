-- Enable extensions
create extension if not exists "uuid-ossp";

-- Update projects table
alter table projects 
add column if not exists token_usage integer default 0,
add column if not exists progress integer default 0 check (progress >= 0 and progress <= 100),
add column if not exists start_date timestamp with time zone,
add column if not exists end_date timestamp with time zone;

-- Update epics table
alter table epics 
add column if not exists token_usage integer default 0,
add column if not exists progress integer default 0 check (progress >= 0 and progress <= 100),
add column if not exists start_date timestamp with time zone,
add column if not exists end_date timestamp with time zone,
add column if not exists user_stories_count integer default 0;

-- Add trigger for user_stories_count
create or replace function update_epic_stories_count()
returns trigger as $$
begin
    if (TG_OP = 'INSERT') then
        update epics
        set user_stories_count = user_stories_count + 1
        where id = NEW.epic_id;
    elsif (TG_OP = 'DELETE') then
        update epics
        set user_stories_count = user_stories_count - 1
        where id = OLD.epic_id;
    end if;
    return null;
end;
$$ language plpgsql;

create trigger update_epic_stories_count
after insert or delete on stories
for each row
execute function update_epic_stories_count();

-- Add token usage tracking function
create or replace function track_token_usage()
returns trigger as $$
begin
    NEW.token_usage = COALESCE(NEW.token_usage, 0) + 1;
    return NEW;
end;
$$ language plpgsql;

create trigger track_project_token_usage
before update of token_usage on projects
for each row
execute function track_token_usage();

create trigger track_epic_token_usage
before update of token_usage on epics
for each row
execute function track_token_usage();
