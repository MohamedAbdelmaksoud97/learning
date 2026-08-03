begin;

update public.profiles profile
set level = 'advanced'
where profile.role = 'student'
  and profile.level = 'beginner'
  and exists (
    select 1
    from public.lessons lesson
    where lesson.level = 'beginner'
      and lesson.is_active = true
  )
  and not exists (
    select 1
    from public.lessons lesson
    where lesson.level = 'beginner'
      and lesson.is_active = true
      and not exists (
        select 1
        from public.lesson_progress progress
        where progress.user_id = profile.id
          and progress.lesson_id = lesson.id
          and progress.completed = true
      )
  );

update public.profiles profile
set level = 'expert'
where profile.role = 'student'
  and profile.level = 'advanced'
  and exists (
    select 1
    from public.lessons lesson
    where lesson.level = 'advanced'
      and lesson.is_active = true
  )
  and not exists (
    select 1
    from public.lessons lesson
    where lesson.level = 'advanced'
      and lesson.is_active = true
      and not exists (
        select 1
        from public.lesson_progress progress
        where progress.user_id = profile.id
          and progress.lesson_id = lesson.id
          and progress.completed = true
      )
  );

commit;
