-- CoolVideo schema. Run in the Supabase SQL editor or with `supabase db push`.
-- user_id stores the Clerk user id (e.g. "user_2abc..."). The Next.js server talks to
-- Supabase with the service-role key and always filters by the Clerk user id; the RLS
-- policies below additionally protect the tables if you ever query them from the browser
-- using Supabase's Clerk third-party auth integration (auth.jwt()->>'sub' = Clerk user id).

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null,
  source_url    text not null,
  title         text,
  description   text,
  og_image      text,
  brand         jsonb not null default '{}'::jsonb,
  aspect_ratio  text not null default '16:9',
  created_at    timestamptz not null default now()
);

create index if not exists projects_user_id_created_at_idx
  on public.projects (user_id, created_at desc);

create table if not exists public.generations (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  user_id     text not null,
  parent_id   uuid references public.generations (id) on delete cascade,
  style       text not null,
  kind        text not null check (kind in ('image', 'video')),
  -- waiting: video waiting for its source image; submitting: claimed by a worker
  status      text not null default 'queued'
              check (status in ('waiting', 'submitting', 'queued', 'in_progress', 'completed', 'failed')),
  prompt      text not null,
  model       text not null,
  request_id  text,
  result_url  text,
  error       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists generations_project_id_idx on public.generations (project_id);
create index if not exists generations_user_id_idx on public.generations (user_id);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists generations_touch_updated_at on public.generations;
create trigger generations_touch_updated_at
  before update on public.generations
  for each row execute function public.touch_updated_at();

alter table public.projects enable row level security;
alter table public.generations enable row level security;

drop policy if exists "owner can read projects" on public.projects;
create policy "owner can read projects" on public.projects
  for select using ((auth.jwt() ->> 'sub') = user_id);

drop policy if exists "owner can read generations" on public.generations;
create policy "owner can read generations" on public.generations
  for select using ((auth.jwt() ->> 'sub') = user_id);
