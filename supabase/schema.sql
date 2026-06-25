create type public.user_level as enum ('beginner', 'advanced', 'expert');
create type public.user_role as enum ('student', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  level public.user_level,
  role public.user_role not null default 'student',
  is_active boolean not null default true,
  has_completed_placement_test boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.questions (
  id text primary key,
  level public.user_level not null default 'beginner',
  question_text text not null,
  explanation text,
  question_order integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.question_options (
  id text primary key,
  question_id text not null references public.questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false
);

create table public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null,
  total_questions integer not null,
  percentage integer not null,
  final_level public.user_level not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.user_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  selected_option_id text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  level public.user_level not null,
  title text not null,
  description text,
  summary text,
  vocabulary jsonb not null default '[]'::jsonb,
  drive_file_id text not null,
  lesson_order integer not null default 1,
  duration_minutes integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  watched boolean not null default false,
  watched_at timestamptz,
  completed boolean not null default false,
  completed_at timestamptz,
  quiz_score integer,
  quiz_total integer,
  quiz_percentage integer,
  quiz_passed boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create table public.lesson_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  question_text text not null,
  explanation text,
  question_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.lesson_question_options (
  id uuid primary key default gen_random_uuid(),
  lesson_question_id uuid not null references public.lesson_questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false
);

create index lesson_questions_lesson_order_idx
  on public.lesson_questions (lesson_id, question_order);

create table public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level public.user_level not null,
  applies_to_all boolean not null default false,
  instructor_name text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  live_url text,
  replay_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  type text,
  link_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.success_stories (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  title text not null,
  description text not null,
  before_level public.user_level,
  after_level public.user_level,
  score integer,
  image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.test_attempts enable row level security;
alter table public.user_answers enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.lesson_questions enable row level security;
alter table public.lesson_question_options enable row level security;
alter table public.live_sessions enable row level security;
alter table public.notifications enable row level security;
alter table public.success_stories enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create policy "Users can read own profile" on public.profiles for select
to authenticated using ((select auth.uid()) = id or public.is_admin());
create policy "Users can update own profile basics" on public.profiles for update
to authenticated using ((select auth.uid()) = id or public.is_admin())
with check ((select auth.uid()) = id or public.is_admin());

create policy "Authenticated users read active questions" on public.questions for select
to authenticated using (is_active = true or public.is_admin());
create policy "Admins manage questions" on public.questions for all
to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated users read options" on public.question_options for select
to authenticated using (true);
create policy "Admins manage question options" on public.question_options for all
to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Users manage own attempts" on public.test_attempts for all
to authenticated using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());
create policy "Users manage own answers" on public.user_answers for all
to authenticated using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());

create policy "Authenticated users read active lessons" on public.lessons for select
to authenticated using (is_active = true or public.is_admin());
create policy "Admins manage lessons" on public.lessons for all
to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Users manage own lesson progress" on public.lesson_progress for all
to authenticated using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());

create policy "Authenticated users read active lesson questions" on public.lesson_questions for select
to authenticated using (is_active = true or public.is_admin());
create policy "Admins manage lesson questions" on public.lesson_questions for all
to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated users read lesson question options" on public.lesson_question_options for select
to authenticated using (
  exists (
    select 1
    from public.lesson_questions lq
    where lq.id = lesson_question_id
      and (lq.is_active = true or public.is_admin())
  )
);
create policy "Admins manage lesson question options" on public.lesson_question_options for all
to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Authenticated users read active live sessions" on public.live_sessions for select
to authenticated using (is_active = true or public.is_admin());
create policy "Admins manage live sessions" on public.live_sessions for all
to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Users read own notifications" on public.notifications for select
to authenticated using ((select auth.uid()) = user_id or public.is_admin());
create policy "Users update own notifications" on public.notifications for update
to authenticated using ((select auth.uid()) = user_id or public.is_admin())
with check ((select auth.uid()) = user_id or public.is_admin());
create policy "Admins insert notifications" on public.notifications for insert
to authenticated with check (public.is_admin());

create policy "Authenticated users read published stories" on public.success_stories for select
to authenticated using (is_published = true or public.is_admin());
create policy "Anyone can read published stories" on public.success_stories for select
to anon using (is_published = true);
create policy "Admins manage stories" on public.success_stories for all
to authenticated using (public.is_admin()) with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.success_stories to anon;
grant select on public.questions, public.question_options, public.lessons, public.lesson_questions, public.lesson_question_options, public.live_sessions, public.success_stories to authenticated;
grant select, insert, update on public.profiles, public.test_attempts, public.user_answers, public.lesson_progress, public.notifications to authenticated;
grant insert, update, delete on public.lessons, public.live_sessions, public.notifications, public.success_stories to authenticated;
grant insert, update, delete on public.questions, public.question_options to authenticated;
grant insert, update, delete on public.lesson_questions, public.lesson_question_options to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
