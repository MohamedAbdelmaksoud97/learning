alter table public.lessons
add column if not exists summary text,
add column if not exists vocabulary jsonb not null default '[]'::jsonb;

update public.lessons
set vocabulary = '[]'::jsonb
where vocabulary is null;
