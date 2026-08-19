# Alchemist HQ — Supabase Setup Guide

This connects **Daily Streak** and **Net Worth** (plus Tasks & Journal, which use the
same pattern) to a real Supabase database instead of browser-only demo data.

## 1. Create a Supabase project
1. Go to https://supabase.com → New Project.
2. Wait for it to finish provisioning.
3. Go to **Project Settings → API**. Copy:
   - **Project URL** → looks like `https://xxxxx.supabase.co`
   - **anon public key** → a long JWT string

## 2. Create the tables
Go to **SQL Editor** in Supabase and run this whole block:

```sql
-- ── Daily Streak ─────────────────────────────────────────────
create table streak_habits (
  id bigint generated always as identity primary key,
  name text not null,
  sort_order int not null default 0
);

create table streak_state (
  id int primary key,               -- always row id = 1 (single row)
  count int not null default 0,
  last_completed_date date,
  completed_habit_ids jsonb not null default '[]'::jsonb
);

-- ── Net Worth / Finance ─────────────────────────────────────
create table finance_entries (
  id bigint generated always as identity primary key,
  type text not null check (type in ('income','expense','savings','liability','investment','snapshot')),
  label text,
  amount numeric not null default 0,
  date date
);

-- ── Tasks & Journal (used by the same app) ───────────────────
create table tasks (
  id bigint generated always as identity primary key,
  segment text not null check (segment in ('Work','Personal','Family')),
  text text not null,
  priority text not null default 'Medium',
  progress int not null default 0,
  comment text,
  date date not null,
  completed boolean not null default false
);

create table journal_entries (
  id bigint generated always as identity primary key,
  text text not null,
  mood text,
  time text,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────
-- This is a single-user personal app gated by the client-side password,
-- so we allow the anon key full access. Do NOT expose this key publicly
-- outside this app.
alter table streak_habits enable row level security;
alter table streak_state enable row level security;
alter table finance_entries enable row level security;
alter table tasks enable row level security;
alter table journal_entries enable row level security;

create policy "anon full access" on streak_habits for all using (true) with check (true);
create policy "anon full access" on streak_state for all using (true) with check (true);
create policy "anon full access" on finance_entries for all using (true) with check (true);
create policy "anon full access" on tasks for all using (true) with check (true);
create policy "anon full access" on journal_entries for all using (true) with check (true);

-- Seed the single streak_state row so the first upsert has something to match
insert into streak_state (id, count, last_completed_date, completed_habit_ids)
values (1, 0, null, '[]'::jsonb);
```

## 3. Add your credentials via config.js (not hardcoded in the HTML)
Credentials are no longer hardcoded in `alchemist_hq.html` — this keeps the HTML
safe to commit to a public repo or share.

1. Copy `config.example.js` → `config.js` (same folder as `alchemist_hq.html`).
2. Fill in your real values:
   ```js
   window.APP_CONFIG = {
     APP_PASSWORD: "your-chosen-password",
     SUPABASE_URL: "https://xxxxx.supabase.co",
     SUPABASE_ANON_KEY: "your-anon-public-key"
   };
   ```
3. `config.js` is listed in `.gitignore` — it will never get committed, so your
   password and keys stay out of version control.
4. Open `alchemist_hq.html`. If `config.js` is missing or incomplete, the app
   shows a clear "Missing config.js" screen instead of failing silently.
   Once it's filled in correctly, the amber "running on local demo data only"
   banner disappears — that's confirmation the app is talking to Supabase.

## 4. Deploying
This is a static site (one HTML file + one config file) — any static host works:

- **Netlify / Vercel / Cloudflare Pages**: drag-and-drop deploy, or connect the
  repo. Since `config.js` is gitignored, add it manually via the host's file
  manager after deploying, or use the platform's environment-variable/build
  step to generate it at build time if you want it fully automated.
- **GitHub Pages**: push everything except `config.js`, then add `config.js`
  directly to the deployed branch/folder (not the source repo) — e.g. via the
  GitHub web UI on a separate deploy-only branch, or a private repo.
- **Self-hosted**: just serve the folder (`alchemist_hq.html` + `config.js`)
  with any static file server (nginx, Caddy, `python -m http.server`, etc.).

Because `SUPABASE_ANON_KEY` is meant to be public (protected by your RLS
policies, not secrecy) it's fine if it ends up visible in the deployed
`config.js`. `APP_PASSWORD` is only a soft, client-side gate — see the note in
`config.example.js` — so don't use this setup for anything that needs real
access control.

## 4. Verify it's live
- Check a habit in **Daily Streak** → open Supabase **Table Editor → streak_state** →
  you should see `completed_habit_ids` update immediately, and `count`/`last_completed_date`
  update once all habits are checked.
- Add a **Net Worth Snapshot** or any finance entry in the drawer → check
  **Table Editor → finance_entries** → the row appears there.
- Reload the page in a new tab → the same streak count and net worth figures should
  load back from the database instead of resetting.

## Troubleshooting
If you see a red banner at the top saying it couldn't load or save something, it's
almost always one of:
- A typo in a table name (must match exactly: `streak_habits`, `streak_state`,
  `finance_entries`, `tasks`, `journal_entries`).
- RLS enabled without the policy above — the anon key gets rejected silently by
  Supabase, which the app surfaces as a save/load error banner.
- Missing the seed row in `streak_state` — without it, `upsert` still works (it
  creates row 1), but the very first read before any write happened would show 0s,
  which is expected.
