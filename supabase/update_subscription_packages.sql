begin;

do $$
begin
  create type public.subscription_package as enum ('bronze', 'diamond');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.content_package_scope as enum ('bronze', 'diamond', 'both');
exception
  when duplicate_object then null;
end $$;

alter table public.profiles
  add column if not exists subscription_package public.subscription_package;

update public.profiles
set subscription_package = 'bronze'
where subscription_package is null;

alter table public.profiles
  alter column subscription_package set default 'bronze',
  alter column subscription_package set not null;

alter table public.lessons
  add column if not exists package_access public.content_package_scope;

update public.lessons
set package_access = 'both'
where package_access is null;

alter table public.lessons
  alter column package_access set default 'both',
  alter column package_access set not null;

alter table public.live_sessions
  add column if not exists package_access public.content_package_scope;

update public.live_sessions
set package_access = 'both'
where package_access is null;

alter table public.live_sessions
  alter column package_access set default 'both',
  alter column package_access set not null;

create index if not exists profiles_subscription_package_level_idx
  on public.profiles (subscription_package, level);
create index if not exists lessons_package_access_level_idx
  on public.lessons (package_access, level);
create index if not exists live_sessions_package_access_level_idx
  on public.live_sessions (package_access, level);

create or replace function public.can_access_package(
  requested_scope public.content_package_scope
)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles profile
    where profile.id = (select auth.uid())
      and profile.is_active = true
      and (
        requested_scope = 'both'
        or requested_scope::text = profile.subscription_package::text
      )
  );
$$;

revoke execute on function public.can_access_package(public.content_package_scope)
  from public, anon;
grant execute on function public.can_access_package(public.content_package_scope)
  to authenticated;

create or replace function public.can_access_level(
  requested_level public.user_level
)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles profile
    where profile.id = (select auth.uid())
      and profile.is_active = true
      and profile.level is not null
      and case profile.level
        when 'expert' then true
        when 'advanced' then requested_level in ('beginner', 'advanced')
        else requested_level = 'beginner'
      end
  );
$$;

revoke execute on function public.can_access_level(public.user_level)
  from public, anon;
grant execute on function public.can_access_level(public.user_level)
  to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, subscription_package)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    case
      when new.raw_user_meta_data ->> 'subscription_package' = 'diamond'
        then 'diamond'::public.subscription_package
      else 'bronze'::public.subscription_package
    end
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop policy if exists "Authenticated users read active lessons" on public.lessons;
create policy "Authenticated users read accessible lessons"
on public.lessons for select
to authenticated
using (
  public.is_admin()
  or (
    is_active = true
    and public.can_access_package(package_access)
    and public.can_access_level(level)
  )
);

drop policy if exists "Authenticated users read active lesson questions" on public.lesson_questions;
create policy "Authenticated users read accessible lesson questions"
on public.lesson_questions for select
to authenticated
using (
  public.is_admin()
  or (
    is_active = true
    and exists (
      select 1
      from public.lessons lesson
      where lesson.id = lesson_id
    )
  )
);

drop policy if exists "Authenticated users read lesson question options" on public.lesson_question_options;
create policy "Authenticated users read accessible lesson question options"
on public.lesson_question_options for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.lesson_questions question
    where question.id = lesson_question_id
  )
);

drop policy if exists "Users manage own lesson progress" on public.lesson_progress;
create policy "Users manage accessible lesson progress"
on public.lesson_progress for all
to authenticated
using (
  public.is_admin()
  or (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.lessons lesson
      where lesson.id = lesson_id
    )
  )
)
with check (
  public.is_admin()
  or (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.lessons lesson
      where lesson.id = lesson_id
    )
  )
);

drop policy if exists "Authenticated users read active live sessions" on public.live_sessions;
create policy "Authenticated users read accessible live sessions"
on public.live_sessions for select
to authenticated
using (
  public.is_admin()
  or (
    is_active = true
    and public.can_access_package(package_access)
    and (applies_to_all = true or public.can_access_level(level))
  )
);

revoke update on table public.profiles from authenticated;
grant update (full_name, level, has_completed_placement_test)
  on table public.profiles to authenticated;
grant select, update on table public.profiles to service_role;

commit;
