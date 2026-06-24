alter table public.live_sessions
add column if not exists applies_to_all boolean not null default false;

drop policy if exists "Admins manage questions" on public.questions;
create policy "Admins manage questions" on public.questions for all
to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage question options" on public.question_options;
create policy "Admins manage question options" on public.question_options for all
to authenticated using (public.is_admin()) with check (public.is_admin());

grant insert, update, delete on public.questions, public.question_options to authenticated;
