-- ============================================================
-- Build Your Way Out — reflections table
-- Run this once in Supabase: Dashboard → SQL Editor → New query
-- ============================================================

create table reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood_label text not null,
  mood_key text,
  build_id text,
  project text not null,
  before_feeling text not null,
  after_feeling text not null,
  lesson text not null,
  created_at timestamptz not null default now()
);

-- Index to make "fetch my reflections, newest first" fast
create index reflections_user_id_created_at_idx
  on reflections (user_id, created_at desc);

-- Row Level Security: each user can only ever see/write their own rows
alter table reflections enable row level security;

create policy "Users can view their own reflections"
  on reflections for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reflections"
  on reflections for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own reflections"
  on reflections for delete
  using (auth.uid() = user_id);