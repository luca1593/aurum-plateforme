# Workspace

## Overview

B2B/B2C professional talent placement & services marketplace platform. Luxury brand "Aurum" — noir/gold aesthetic, conversion-optimized landing site with full admin back-office and client portal.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (react-vite artifact at `/`)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- `artifacts/platform` — React + Vite frontend, served at `/`
- `artifacts/api-server` — Express API server, served at `/api`

## Pages (Frontend)

### Public
- `/` — Landing page (hero, proof stats, service profiles, process, differentiators, testimonials, CTA)
- `/services` — Services catalogue with filter UI
- `/contact` — "Book a Call" form (name, company, email, need)
- `/faq` — FAQ accordion
- `/legal` — GDPR/Terms placeholder
- `/client` — Client portal (enter Contact ID to view pipeline status & matched candidates)

### Admin Back-office
- `/admin` — Dashboard analytics (KPI cards, leads by stage chart, recent leads)
- `/admin/crm` — CRM Pipeline (Kanban board — 7 stages: New → Closed Won/Lost)
- `/admin/candidates` — Candidate database (filterable by role, language, status; add/edit/delete)
- `/admin/matching` — Matching system (assign candidates to client needs with score)

## API Endpoints

- `GET /api/healthz` — Health check
- `POST /api/contact` — Submit contact/lead
- `GET /api/contact/stats` — Lead statistics
- `GET /api/contact/list` — List all contacts
- `GET /api/candidates` — List candidates (filterable: language, role, minExperience, maxRate, status)
- `POST /api/candidates` — Create candidate
- `GET /api/candidates/:id` — Get candidate
- `PATCH /api/candidates/:id` — Update candidate
- `DELETE /api/candidates/:id` — Delete candidate
- `GET /api/pipeline` — Get CRM pipeline (leads grouped by stage)
- `POST /api/pipeline/leads` — Add lead to pipeline
- `PATCH /api/pipeline/leads/:id` — Move lead to stage / update notes
- `DELETE /api/pipeline/leads/:id` — Remove lead from pipeline
- `GET /api/matching?contactId=X` — Get matches for a contact
- `POST /api/matching` — Assign a candidate to a contact
- `GET /api/admin/stats` — Full admin analytics
- `GET /api/client/:contactId` — Client portal data (stage, matches, status message)

## Database Schema

- `contacts` — (id, name, company, email, need, created_at)
- `candidates` — (id, name, role, skills[], language, experience_years, hourly_rate, availability, status, bio, location, created_at)
- `pipeline_leads` — (id, contact_id → contacts, stage, notes, value, created_at, updated_at)
- `matches` — (id, contact_id → contacts, candidate_id → candidates, score, status, notes, created_at)

## GitHub Push
- The user wants to push to GitHub but has not yet provided a valid Personal Access Token (ghp_...) or repository URL.
- Do NOT use the Replit GitHub integration (user dismissed it).
- Use git remote add + git push with the user's token and repo URL as credentials.
- Store the token as a secret (GITHUB_TOKEN) and the repo URL as GITHUB_REPO_URL via environment-secrets skill.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run build` — build API server

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
