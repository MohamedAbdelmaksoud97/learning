alter table public.success_stories
  add column if not exists score_currency text not null default 'SAR';

alter table public.success_stories
  drop constraint if exists success_stories_score_currency_check;

alter table public.success_stories
  add constraint success_stories_score_currency_check
  check (score_currency in ('SAR', 'USD'));
