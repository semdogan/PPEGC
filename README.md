# PEGCC • Prisma (SQLite) Mockup

Quick Case form → SQLite via Prisma → shows in Feed. Zero DB setup.

## Run locally
```bash
npm i
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Open **http://localhost:3000/quick-case** to submit, **/feed** to view.

## Files
- `prisma/schema.prisma` → SQLite DB at `prisma/dev.db`
- `app/quick-case/page.tsx` → minimal form
- `app/api/cases/route.ts` → create/list API with basic PHI guard
- `app/feed/page.tsx` → recent cases
- `prisma/seed.cjs` → 3 synthetic cases

## Switch to Postgres later
Change the datasource to Postgres and set `DATABASE_URL`, then migrate:
```prisma
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
```
```bash
npx prisma migrate dev
```
