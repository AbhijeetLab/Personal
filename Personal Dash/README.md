# Ledger — Personal Dashboard (Overview page)

A dark, high-contrast personal dashboard: net worth + cash flow on top, a
three-column Work / Family / Personal to-do board below. Built with
Next.js 14 (App Router) + TypeScript + Tailwind CSS. No backend — state is
kept in React Context and persisted to `localStorage`, so it's a true
"npm install, run, and it works" project, and a natural place to wire up a
real database later.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to vercel.com → **Add New Project** → import the repo.
3. Framework preset is auto-detected as **Next.js** — no config needed.
4. Deploy. Every push to `main` redeploys automatically.

Or from the CLI:

```bash
npm i -g vercel
vercel
```

## Project structure

```
app/
  layout.tsx        Root layout — loads fonts, wraps app in AppProvider
  page.tsx           The Overview page (sidebar + header + widgets)
  globals.css         Design tokens, scrollbars, focus rings, custom inputs
lib/
  types.ts            Task / Finance / Segment types + SEGMENT_META (colors)
  store.tsx            AppProvider — all state + CRUD actions + localStorage
components/
  Sidebar.tsx           Collapsible desktop rail + mobile drawer
  Header.tsx             Search, date, quick add trigger, notifications
  QuickAddModal.tsx        Task / Journal quick-create
  ValueSnapshotWidget.tsx  Net worth, sparkline, assets vs liabilities
  Sparkline.tsx             SVG trend line, no chart library needed
  FinanceModal.tsx          Income / expense / savings / assets / stocks / crypto editor
  TodoOverviewWidget.tsx    Work | Family | Personal columns
  TaskModal.tsx              Full task editor: fields, progress, comments, delete
  Modal.tsx                   Shared modal shell (ESC to close, focus trap-lite)
```

## Where to plug in a real backend

Everything reads and writes through `lib/store.tsx`. Swap the
`localStorage` effects for API calls (e.g. to Postgres via Vercel
Postgres/Neon, or Supabase) and every component keeps working unchanged —
they only ever call `useApp()`.

## Notes

- Data seeds itself with realistic demo values on first run so the page
  never looks empty. Clear `localStorage` (or use a private window) to see
  the empty state.
- Colors, type scale, and spacing are Tailwind theme tokens in
  `tailwind.config.ts` — change them there, not inline, to keep the design
  consistent.
