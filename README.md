# PEGCC — Platform for Exceptional Genomic Cancer Cases

**Stack:** Next.js 14 • Prisma • Postgres (Neon) • Vercel  
**Status:** Public MVP live (Quick Case → Feed)

## What it does
- **Quick Case** (2-minute) submission with light PHI guardrails
- Persists cases to **Postgres (Neon)** via Prisma
- **Feed** renders dynamically (no caching) to show new submissions instantly
- **Audit log** entry on case creation (“CASE_CREATED”)
- (Planned) Auth (email magic link + ORCID), vocab lookups (OncoTree/HGNC/ICD), tags, follow, search

---

## URLs
- **Production:** `https://<your-app>.vercel.app`
- **Quick Case:** `/quick-case`
- **Feed:** `/feed`

---

## Environment variables

Create a file **`.env`** in the project root (do not commit it):

