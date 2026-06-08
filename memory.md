# Memory — 04 Database Schema

Last updated: 2026-06-08

## What was built

All 4 InsForge tables created with RLS policies:
- `profiles` — 24 columns, FK to auth.users(id) RESTRICT, RLS SELECT/INSERT/UPDATE
- `agent_runs` — 8 columns, FK to profiles RESTRICT, RLS SELECT/INSERT/UPDATE
- `jobs` — 23 columns, source CHECK (search|url), FK to agent_runs SET NULL + profiles RESTRICT, RLS SELECT/INSERT/UPDATE/DELETE
- `agent_logs` — 7 columns, level CHECK (info|success|warning|error), FK to agent_runs CASCADE + profiles RESTRICT + jobs SET NULL, RLS SELECT/INSERT

Storage bucket `resumes` created — private, authenticated access only.

`db/001_schema.sql` — version-controlled migration file.

Phase 1 Foundation complete. Progress tracker updated.

## Decisions made

- RLS + app-level defense-in-depth: both layers enforce user scoping
- profiles.id REFERENCES auth.users(id) with RESTRICT
- Profile creation on-demand — no trigger. Feature 06 handles upsert
- JSONB columns default NULL, text[] columns default '{}'
- agent_logs.run_id CASCADE delete, agent_logs.job_id SET NULL on delete
- jobs.run_id SET NULL on delete (jobs survive agent_run deletion)

## Current state

- Phase 1 (Foundation) fully complete: Homepage, Auth, PostHog, Database Schema
- All 4 tables verified via get-table-schema, RLS policies confirmed, policies use `auth.uid()`
- resumes bucket verified via list-buckets
- PostHog review issues from earlier session still outstanding (not addressed this session)

## Next session starts with

Phase 2 — 05 Profile Page: Full UI. Build complete profile page with mock data following build-plan.md:84-99. Includes profile completion indicator, resume upload area, all form fields across 5 sections (Personal Info, Professional Info, Work Experience, Education, Job Preferences).

## Open questions

- PostHog review issues (9 total, 3 critical) from 03 remain unfixed — revisit when PostHog events are needed (Phase 3)
- profiles FK to auth.users not showing in foreignKeys output — may be silently skipped. Functionally not critical since app sets id, but worth revisiting
