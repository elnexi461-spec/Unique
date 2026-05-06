# UOU Infinite — Unique Open University Institutional OS

A next-generation Nigerian digital university platform with cinematic onboarding, AI-gated learning, and credential issuance.

## Run & Operate

```
# Start everything (frontend + API server)
PORT=8080 pnpm --filter @workspace/api-server run dev & PORT=22169 BASE_PATH=/ pnpm --filter @workspace/uou-infinite run dev
```

Workflow: **UOU Infinite App** (managed via Replit workflow system)

Required env vars:
- `DATABASE_URL` — PostgreSQL (auto-provisioned via Replit DB)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY` — optional, enables Sentinel AI Chat

Push DB schema: `pnpm --filter @workspace/db run push`
Seed demo data: `POST /api/seed` (idempotent, safe to run multiple times)

## Stack

- **Frontend**: React 18 + Vite 7, Tailwind CSS v4, Framer Motion, Recharts, Wouter, TanStack Query
- **Backend**: Express 5 + Node 24, Pino logging, JWT auth
- **DB**: Drizzle ORM + PostgreSQL (Replit managed)
- **Build**: pnpm workspace monorepo, esbuild for API server

## Where things live

```
artifacts/uou-infinite/src/
  pages/
    landing.tsx            # 3-phase flow: intro → persona picker → main landing
    demo-persona.tsx       # Full-screen persona selector after cinematic intro
    founder.tsx            # War Room: Friday Brief / Analytics / Controls tabs
    student/portal.tsx     # Student dashboard with Neural Skill Graph
    student/lecture.tsx    # Recall → Lecture → Quiz → Gold Card flow
    student/grades.tsx     # Academic record with AI registrar insight
    student/timetable.tsx  # Live timetable with countdown
    student/credential.tsx # QR-based credential passport
  components/
    CinematicIntro.tsx       # Real UOU logo bouncing + portal zoom (9.5s, tap-to-skip)
    LectureImageSlider.tsx   # 5-slide sequential viewer (replaces video)
    GoldCard.tsx             # 3D gold shimmer on quiz pass
    QuizGateway.tsx          # 10-question gateway, 120s timer, Web Crypto key
    SentinelPulse.tsx        # Bottom blue pulse bar
    SkillGraph.tsx           # Recharts radar + circular progress
    RemedialBridge.tsx       # Three-strike + 2hr localStorage cooldown
    sentinel-chat.tsx        # UOU Sentinel AI assistant
    layout.tsx               # Sidebar nav for all roles
  data/
    mockDatabase.ts          # DEMO_PERSONAS, MOCK_STUDENTS (50 Nigerian), CORE_LECTURES (5),
                             # FRIDAY_BRIEF_WEEK18, GOLD_CARD_HISTORY
artifacts/api-server/src/routes/
  seed.ts                  # POST /api/seed — seeds 50 students, 5 courses, 249 Gold Cards, 4 demo users
lib/db/src/schema/         # Drizzle table definitions
lib/api-spec/openapi.yaml  # OpenAPI contract (source of truth)
```

## Architecture decisions

- **OpenAI is optional at import time** — `lib/integrations-openai-ai-server/src/client.ts` exports `openaiAvailable` + `requireOpenAI()` so the API server starts without the integration; AI routes fail gracefully per-request
- **Three-strike logic is client-side** — tracked in React state + `localStorage` (no DB writes needed for strike count + cooldown)
- **Quiz key via Web Crypto API** — cryptographic key generated client-side on pass, stored as a "Golden Key" credential
- **Cinematic intro is skippable** — auto-dismisses after ~9.5s or on user click; `sessionStorage.uou_intro_done` prevents repeat on navigation
- **JWT auth** — stateless tokens, roles: `student` | `lecturer` | `coordinator` | `founder`
- **Seed endpoint is idempotent** — checks for existing records before inserting; safe to run multiple times

## Product

- **Phase flow**: Cinematic intro (9.5s) → Demo Persona Selector → Full Landing → Role Portal
- **Demo Personas** (all use password `Demo@1234`):
  - Student: `demo.student@uou.edu.ng` → `/student`
  - Coordinator: `demo.coordinator@uou.edu.ng` → `/coordinator`
  - Lecturer: `prof.imumolen@uou.edu.ng` → `/lecturer`
  - Founder: `admin.founder@uou.edu.ng` → `/founder`
- **Lecture flow**: Recall bridge → 5-slide sequential viewer (24s/slide, anti-cheat) → 10-question assessment → Gold Card ceremony
- **Friday Brief** (Week 18): KPI grid, campus breakdown (Zaria/Lagos/Kano), Sentinel AI insights, Top 5 scholars
- **Founder War Room**: Tabbed — Friday Brief / Analytics / Controls (seed, announcements, data bridge, red switch)
- **Supernatural Seed**: 51 scholars across 3 campuses, 5 core courses, 249 Gold Cards
- **Credential QR system** — verifiable student credentials with public gateway

## User preferences

- Brand: UOU Institutional Blue (#3B82F6), background navy `hsl(222 72% 6%)`, gold #F59E0B
- Real UOU logo PNG (`artifacts/uou-infinite/public/uou-logo.png`, background removed) used everywhere
- **No teal (#64FFDA) anywhere** — fully replaced with electric blue (#60A5FA) throughout all components
- Cinematic, slow animations preferred — nothing feels rushed
- Oxford prestige level visual quality

## Gotchas

- Run `pnpm --filter @workspace/db run push` after schema changes before restarting workflow
- `qrcode.react` must be in `artifacts/uou-infinite/package.json` (added)
- API server PORT must be `8080`; frontend PORT must be `22169` with `BASE_PATH=/`
- The "UOU Infinite App" workflow runs both services with `&` — both must succeed
- Seed the DB via `POST /api/seed` for demo users and student data to work
- Vite handles workspace imports at runtime — `tsc --noEmit` TS6305 errors are expected and harmless

## Pointers

- DB schema: `lib/db/src/schema/index.ts`
- API contract: `lib/api-spec/openapi.yaml`
- Theme/CSS: `artifacts/uou-infinite/src/index.css`
