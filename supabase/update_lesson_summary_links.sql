alter table public.lessons
add column if not exists summary_links jsonb not null default '[]'::jsonb;

update public.lessons
set summary_links = '[]'::jsonb
where summary_links is null;
