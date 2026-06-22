-- User profile: stores persistent preferences (locale, etc.)
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  locale     text not null default 'es',
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users manage own profile"
  on public.profiles for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
