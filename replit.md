# UOU Infinite — Unique Open University Institutional OS

A next-generation digital university platform with cinematic onboarding, AI-gated learning, and credential issuance.

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

## Stack

- **Frontend**: React 18 + Vite 7, Tailwind CSS v4, Framer Motion, Recharts, Wouter, TanStack Query
- **Backend**: Express 5 + Node 24, Pino logging, JWT auth
- **DB**: Drizzle ORM + PostgreSQL (Replit managed)
- **Build**: pnpm workspace monorepo, esbuild for API server

## Where things live

```
artifacts/uou-infinite/src/
  pages/landing.tsx          # Homepage with staggered animations
  pages/student/            # portal, lecture, credential pages
  components/
    CinematicIntro.tsx       # UOU orb + portal zoom (9.5s sequence)
    GoldCard.tsx             # 3D gold shimmer on quiz pass
    QuizGateway.tsx          # 10-question gateway, 120s timer, Web Crypto key
    SentinelPulse.tsx        # Bottom blue pulse bar
    SkillGraph.tsx           # Recharts radar + circular progress
    RemedialBridge.tsx       # Three-strike + 2hr localStorage cooldown
    sentinel-chat.tsx        # UOU Sentinel AI assistant
    AntiCheatPlayer.tsx      # Lecture video with anti-cheat
artifacts/api-server/src/routes/  # Express route handlers
lib/db/src/schema/               # Drizzle table definitions
lib/api-spec/openapi.yaml        # OpenAPI contract (source of truth)
```

## Architecture decisions

- **OpenAI is optional at import time** — `lib/integrations-openai-ai-server/src/client.ts` exports `openaiAvailable` + `requireOpenAI()` so the API server starts without the integration; AI routes fail gracefully per-request
- **Three-strike logic is client-side** — tracked in React state + `localStorage` (no DB writes needed for strike count + cooldown)
- **Quiz key via Web Crypto API** — cryptographic key generated client-side on pass, stored as a "Golden Key" credential
- **Cinematic intro is skippable** — auto-dismisses after ~9.5s or on user click
- **JWT auth** — stateless tokens, roles: `student` | `lecturer` | `admin`

## Product

- Cinematic intro with UOU logo orb physics and portal zoom
- Role-based portals: Student (Neural Skill Graph, lecture flow) / Lecturer / Admin (Founder's War Room)
- Assessment Gateway — 10 application-based questions, 120s countdown, pass → Gold Card ceremony
- Three-Strike remedial bridge — 3 failures triggers AI remedial + 2hr cooldown
- Sentinel Pulse — animated status bar showing AI sentinel activity
- Credential QR system — verifiable student credentials
- Admissions portal (The Nexus) with AI course matching

## User preferences

- Brand: UOU Institutional Blue (#3B82F6), background #040B1A deep navy, gold #F59E0B
- No teal (#64FFDA) anywhere — fully replaced with electric blue
- Cinematic, slow animations preferred — nothing feels rushed

## Gotchas

- Run `pnpm --filter @workspace/db run push` after schema changes before restarting workflow
- `qrcode.react` must be in `artifacts/uou-infinite/package.json` (added)
- API server PORT must be `8080`; frontend PORT must be `22169` with `BASE_PATH=/`
- The "UOU Infinite App" workflow runs both services with `&` — both must succeed

## Pointers

- DB schema: `lib/db/src/schema/index.ts`
- API contract: `lib/api-spec/openapi.yaml`
- Theme/CSS: `artifacts/uou-infinite/src/index.css`
