# SeaLaunch AI

**Built at the Sea × OpenAI Regional Codex Hackathon, Singapore (319 teams applied, 40 selected).**

SeaLaunch turns one Shopee seller into an AI commerce team. Seven specialized agents work from a seller brief to evaluate product opportunities, model unit economics, check risk, shape packaging, and produce a Shopee-ready launch pack.

[Live product demo](https://codexhackathon-sealaunch.vercel.app/) · [Hackathon pitch](https://sealaunch-pitch.vercel.app/)

> The current demo uses transparent mock/static data from `src/lib/mock-data.ts`, shaped to match a future backend. The featured case is a Mini Desk Vacuum for Singapore.

## Product walkthrough

### One seller, one AI commerce team

![SeaLaunch homepage showing the seven-department AI commerce company](public/screenshots/homepage.png)

### Seven specialized departments

Market, Sourcing, Margin, Risk, Listing, Packaging, and Committee agents each own a specific commerce decision, then contribute to one final recommendation.

![SeaLaunch organization map showing seven specialized agent departments](public/screenshots/agent-departments.png)

### Ranked opportunities with real unit economics

![SeaLaunch opportunity board ranking five product opportunities](public/screenshots/opportunity-board.png)

### A Shopee-ready launch pack

![SeaLaunch Shopee launch pack for the Mini Desk Vacuum demo case](public/screenshots/shopee-launch-pack.png)

## Technical architecture

The current repository is a frontend demo backed by transparent mock/static data. The diagram below describes the target production architecture: an orchestrated agent runtime, department-level responsibilities, risk checkpoints, provider integrations, and an auditable run-result contract.

![SeaLaunch target multi-agent workflow and production system architecture](public/screenshots/technical-architecture.png)

## Product flow

`Seller brief` → `AI company` → `Opportunity board` → `Packaging studio` → `Shopee listing`

- `/app/brief` — capture the seller's market, category, and operating constraints
- `/app/org-room` — watch seven AI departments analyze the brief
- `/app/board` — compare ranked opportunities, margins, and risk signals
- `/app/studio` — turn the selected opportunity into a packaging concept
- `/app/listing` — generate the final Shopee-ready launch pack
- `/app/history`, `/app/dashboard`, and `/app/org-room/[dept]` — inspect previous cases, metrics, and department-level evidence

## Stack

Next.js App Router · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion · Zustand · Vitest

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # store, flow, and mock-data unit tests
npm run build    # production build
```

See [`docs/superpowers/specs/2026-06-06-sealaunch-ai-website-design.md`](docs/superpowers/specs/2026-06-06-sealaunch-ai-website-design.md) for the design specification.
