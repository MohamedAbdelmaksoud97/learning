alter table public.lesson_progress
  add column if not exists watched boolean not null default false,
  add column if not exists watched_at timestamptz,
  add column if not exists quiz_score integer,
  add column if not exists quiz_total integer,
  add column if not exists quiz_percentage integer,
  add column if not exists quiz_passed boolean not null default false;

update public.lesson_progress
set quiz_passed = true
where completed = true;
