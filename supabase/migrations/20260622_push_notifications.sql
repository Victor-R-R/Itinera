-- Push subscriptions per user/device
create table if not exists public.push_subscriptions (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  endpoint   text not null,
  subscription jsonb not null,
  created_at timestamptz default now() not null,
  unique (user_id, endpoint)
);

alter table public.push_subscriptions enable row level security;

create policy "Users manage own push subscriptions"
  on public.push_subscriptions for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Notification deduplication log (service role only — no user policies)
create table if not exists public.notification_logs (
  id                uuid default gen_random_uuid() primary key,
  trip_id           text not null,
  notification_type text not null,
  sent_at           timestamptz default now() not null,
  unique (trip_id, notification_type)
);

alter table public.notification_logs enable row level security;
-- No policies = accessible only via service role key
