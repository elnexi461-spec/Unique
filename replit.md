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
- **AI**: OpenAI via `@workspace/integrations-openai-ai-server`
- **Codegen**: Orval (OpenAPI → React Query hooks + Zod schemas)
- **Scheduler**: node-cron (midnight sentinel auto-heal)
- **Import**: multer + papaparse (CSV/JSON/URL student import)

## Where Things Live

- `lib/api-spec/openapi.yaml` — authoritative OpenAPI spec (source of truth)
- `lib/db/src/schema/` — Drizzle schema (users, students, lecturers, courses, enrollments, admissions, log_entries, conversations, messages, **grades, attendance, timetable, announcements, lecture_keys**)
- `artifacts/api-server/src/routes/` — all Express route handlers (auth, students, grades, attendance, timetable, announcements, system, import)
- `artifacts/api-server/src/middlewares/auth.ts` — `requireAuth` / `requireRole` JWT middleware
- `artifacts/uou-infinite/src/pages/` — all UI pages by role
- `artifacts/uou-infinite/src/components/` — CinematicIntro, AnnouncementTicker, AntiCheatPlayer, layout, sentinel-chat, command-menu

## Architecture Decisions

- **Contract-first API**: OpenAPI spec drives all codegen; never edit generated files directly
- **JWT in localStorage** (`uou_token`): custom-fetch reads it; `getAuthToken()` from `./lib/auth`
- **Route prefix**: `app.use("/api", router)` — all route handlers must NOT include `/api` prefix
- **Password hashing**: SHA256 + "uou_salt" suffix
- **AI SSE streaming**: `/api/openai/conversations/:id/messages` streams GPT responses
- **Anti-cheat**: HTML5 video `timeupdate` enforces max-watched position; forward-skipping snaps back
- **Key lifecycle**: 16-char hex keys expire in 24h; midnight cron prunes expired keys
- **SSE channels**: `/api/announcements/stream` (all users), `/api/system/live-feed` (founder/coordinator)
- **Cinematic intro**: Framer Motion spring bounce ball → letter morph → zoom portal; sessionStorage flag `uou_intro_done` prevents replay

## Product

Four role-based personas accessible after JWT login:

1. **Founder War Room** — KPI bento grid, Recharts dashboards, Red Switch (manual system refresh), Live Feed SSE, Announcement Hub (broadcasts to all dashboards), Data Bridge (CSV/JSON/URL student import), telemetry log
2. **Coordinator Hub** — students, lecturers, course catalog, AI admissions, Sentinel Scheduler (timetable management with auto-activating Zoom/Meet links)
3. **Lecturer Portal** — course view, Grade Entry (test/exam/assignment/attendance → weighted GPA with AI insight)
4. **Student Portal** — course browser, timetable with live lecture links, AI grade report + CGPA, anti-cheat video player (key generation on 100% completion), cryptographic credential

Public routes: `/` (cinematic landing), `/login`, `/register`, `/verify/:token`

## User Preferences

- Deep navy (#0A192F) + cyan (#64FFDA) glassmorphism theme — no light mode
- Framer Motion on all page transitions and card animations
- Cmd+K command palette (`CommandMenu`) for power-user navigation
- UOU Sentinel chatbot visible only to students (floating bottom-right widget)
- Announcement ticker (SSE) pinned to top of all authenticated dashboards
- Error boundary with self-repairing animation

## Gotchas

- Run `pnpm run typecheck:libs` before API server typecheck (needs generated `.d.ts`)
- Route handlers must use `requireAuth`/`requireRole` — NOT `authenticate`/`authorize`
- DB table names use `Table` suffix in existing schema (e.g. `usersTable`, `coursesTable`) — new tables don't (grades, attendance, timetable, announcements, lectureKeys)
- Never call `pnpm dev` at workspace root — use restart_workflow for individual artifacts
- Cinematic intro stored in `sessionStorage` — replay by clearing `uou_intro_done`
- SSE endpoints need `X-Accel-Buffering: no` header for nginx proxy compatibility
