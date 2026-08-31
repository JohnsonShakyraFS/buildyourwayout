-- ============================================================
-- Build Your Way Out — mood_selections table
-- Run this once in Supabase: Dashboard → SQL Editor → New query
-- Tracks the last build a user got per mood, so the no-repeat
-- logic works across devices, not just per-browser.
-- ============================================================

create table mood_selections (
  user_id uuid not null references auth.users(id) on delete cascade,
  mood_key text not null,
  last_build_id text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, mood_key)
);

alter table mood_selections enable row level security;

create policy "Users can view their own mood selections"
  on mood_selections for select
  using (auth.uid() = user_id);

create policy "Users can insert their own mood selections"
  on mood_selections for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own mood selections"
  on mood_selections for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);