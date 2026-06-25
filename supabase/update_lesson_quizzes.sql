create table if not exists public.lesson_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  question_text text not null,
  explanation text,
  question_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_question_options (
  id uuid primary key default gen_random_uuid(),
  lesson_question_id uuid not null references public.lesson_questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false
);

alter table public.lesson_questions enable row level security;
alter table public.lesson_question_options enable row level security;

drop policy if exists "Authenticated users read active lesson questions" on public.lesson_questions;
create policy "Authenticated users read active lesson questions" on public.lesson_questions for select
to authenticated using (is_active = true or public.is_admin());

drop policy if exists "Admins manage lesson questions" on public.lesson_questions;
create policy "Admins manage lesson questions" on public.lesson_questions for all
to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Authenticated users read lesson question options" on public.lesson_question_options;
create policy "Authenticated users read lesson question options" on public.lesson_question_options for select
to authenticated using (
  exists (
    select 1
    from public.lesson_questions lq
    where lq.id = lesson_question_id
      and (lq.is_active = true or public.is_admin())
  )
);

drop policy if exists "Admins manage lesson question options" on public.lesson_question_options;
create policy "Admins manage lesson question options" on public.lesson_question_options for all
to authenticated using (public.is_admin()) with check (public.is_admin());

create index if not exists lesson_questions_lesson_order_idx
  on public.lesson_questions (lesson_id, question_order);

grant select on public.lesson_questions, public.lesson_question_options to authenticated;
grant insert, update, delete on public.lesson_questions, public.lesson_question_options to authenticated;
