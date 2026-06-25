grant select on public.success_stories to anon;

drop policy if exists "Anyone can read published stories" on public.success_stories;
create policy "Anyone can read published stories" on public.success_stories
for select
to anon
using (is_published = true);
