-- migration: 20240325_dashboard_views.sql

-- Create materialized view for dashboard stats
create materialized view if not exists dashboard_stats as
select
    u.id as user_id,
    count(distinct p.id) as total_projects,
    count(distinct e.id) as total_epics,
    count(distinct s.id) as total_stories,
    count(distinct case when s.status = 'done' then s.id end) as completed_stories
from
    auth.users u
    left join projects p on p.user_id = u.id
    left join epics e on e.project_id = p.id
    left join stories s on s.epic_id = e.id
group by
    u.id;

-- Create refresh function
create or replace function refresh_dashboard_stats()
returns trigger as $$
begin
    refresh materialized view concurrently dashboard_stats;
    return null;
end;
$$ language plpgsql;

-- Add triggers to refresh stats
create trigger refresh_dashboard_stats_projects
    after insert or update or delete on projects
    for each statement
    execute function refresh_dashboard_stats();

create trigger refresh_dashboard_stats_epics
    after insert or update or delete on epics
    for each statement
    execute function refresh_dashboard_stats();

create trigger refresh_dashboard_stats_stories
    after insert or update or delete on stories
    for each statement
    execute function refresh_dashboard_stats();

-- Add RLS policy for dashboard stats
alter materialized view dashboard_stats enable row level security;

create policy "Users can view own dashboard stats"
    on dashboard_stats
    for select
    using (auth.uid() = user_id);

-- Add indexes for recent items queries
create index if not exists idx_projects_user_updated
    on projects (user_id, updated_at desc);

create index if not exists idx_stories_user_created
    on stories (user_id, created_at desc);

-- Grant permissions
grant select on dashboard_stats to authenticated;