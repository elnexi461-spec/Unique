# UOU Infinite — Institutional Operating System for Unique Open University

## Run & Operate

- `pnpm run typecheck` — full typecheck across all packages (builds libs first)
- `pnpm run typecheck:libs` — build composite libs (db, api-zod, api-client-react, integrations)
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Workflows: API Server (port 8080 → /api), Frontend (port auto → /), Mockup Sandbox (/\_\_mockup)

**Demo credentials** (all password: `password123`):
- Founder: `founder@uou.edu.ng`
- Coordinator: `coordinator@uou.edu.ng`
- Lecturer: `prof.adeleke@uou.edu.ng`
- Student: `emeka@student.uou.edu.ng`

## Stack

- **Monorepo**: pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend**: React + Vite + Wouter + Framer Motion + Recharts + shadcn/ui
- **Backend**: Express 5, PostgreSQL + Drizzle ORM, JWT auth (SESSION_SECRET)
- **AI**: OpenAI via `@workspace/integrations-openai-ai-server` (AI_INTEGRATIONS_OPENAI_API_KEY)
- **Codegen**: Orval (OpenAPI → React Query hooks + Zod schemas)
- **QR**: qrcode.react for student credential NFT-style verification

## Where Things Live

- `lib/api-spec/openapi.yaml` — authoritative OpenAPI spec (source of truth)
- `lib/db/src/schema/` — Drizzle schema files (users, students, lecturers, courses, enrollments, admissions, log_entries, conversations, messages)
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/api-server/src/middlewares/auth.ts` — JWT middleware + RBAC
- `artifacts/api-server/src/lib/jwt.ts` — JWT sign/verify
- `artifacts/uou-infinite/src/pages/` — all UI pages by role (founder/, coordinator/, lecturer/, student/, admin/)
- `artifacts/uou-infinite/src/components/` — layout, error-boundary, sentinel-chat, command-menu

## Architecture Decisions

- **Contract-first API**: OpenAPI spec drives all codegen; never edit generated files directly
- **JWT in localStorage** (`uou_token`): custom-fetch reads it automatically for every API call
- **Password hashing**: SHA256 + "uou_salt" suffix (simple, no bcrypt dependency)
- **AI SSE streaming**: `/api/openai/conversations/:id/messages` streams GPT responses via text/event-stream
- **At-risk scoring**: Computed on-the-fly from login_count, GPA, and last_login_at (no separate table)
- **QR credential**: Token stored in students table; `/api/verify/:token` is public (no auth required)
- **lib/api-zod index.ts**: Must remain as single `export * from "./generated/api"` — Orval regenerates it

## Product

Four role-based personas accessible after JWT login:
1. **Founder War Room** — live KPI bento grid, Recharts dashboards (engagement, geo, course distribution), telemetry log
2. **Coordinator Hub** — students list, lecturers, course catalog, AI admissions pipeline with OpenAI match scoring
3. **Lecturer Portal** — course and grade management view
4. **Student Portal** — course browser, proof-of-skill credential with QR code, UOU Sentinel AI chatbot (SSE)

Public routes: `/` (landing), `/login`, `/register`, `/verify/:token` (credential QR gateway)

## User Preferences

- Deep navy (#0A192F) + cyan (#64FFDA) glassmorphism theme — no light mode
- Framer Motion on all page transitions and card animations
- Cmd+K command palette (`CommandMenu`) for power-user navigation
- UOU Sentinel chatbot visible only to students (floating bottom-right widget)
- Error boundary with self-repairing animation (3s spin before showing retry button)

## Gotchas

- Run `pnpm run typecheck:libs` before API server typecheck (needs generated `.d.ts` from lib/integrations-openai-ai-server)
- Do not add `queryKey` workarounds everywhere — pass `getXQueryKey()` helpers from Orval when needed
- Never call `pnpm dev` at workspace root — use restart_workflow for individual artifacts
- `conversations` and `messages` tables come from AI integration template schemas
