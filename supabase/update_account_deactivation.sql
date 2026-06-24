alter table public.profiles
add column if not exists is_active boolean not null default true;

update public.profiles
set is_active = true
where is_active is null;

do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
