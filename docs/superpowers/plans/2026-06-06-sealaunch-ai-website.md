# SeaLaunch AI Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the SeaLaunch AI marketing + product website — all 11 pages from the PRD — as a Next.js app with a bold editorial visual system, animated flow, and mock data.

**Architecture:** Next.js App Router. Marketing homepage at `/`, a standalone `/login`, and a persistent App Shell under `/app/*` that hosts the 5-step seller flow plus the Phase 2 deep pages. A single Zustand store holds the seller brief, department results, opportunities, selection, packaging output, and listing. All data is mock/static for now, shaped to match the future backend. Framer Motion drives page transitions and entrance/status animations.

**Tech Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, shadcn/ui, Framer Motion, Zustand, Vitest (logic tests), next/font (Fraunces + IBM Plex Mono + Hanken Grotesk).

**Reference spec:** `docs/superpowers/specs/2026-06-06-sealaunch-ai-website-design.md`

---

## File Structure

```
package.json, next.config.ts, tsconfig.json, postcss.config.mjs, vitest.config.ts
src/
  app/
    layout.tsx                     Root layout: fonts + <html>/<body>
    globals.css                    Tailwind v4 import + @theme design tokens
    page.tsx                       Page 1  Homepage (marketing)
    login/page.tsx                 Page 7  Login / Entry
    app/
      layout.tsx                   App Shell: top bar + progress + transitions
      brief/page.tsx               Page 3  Seller Brief
      upload/page.tsx              Page 4  Product Signal Upload (Phase 2)
      org-room/page.tsx            Page 5  AI Commerce Org Room
      org-room/[dept]/page.tsx     Page 6  Department Output Detail (Phase 2)
      committee/page.tsx           Page 8  Committee Review (Phase 2)
      board/page.tsx               Page 9  Opportunity Board
      studio/page.tsx              Page 10 Packaging Studio
      listing/page.tsx             Page 11 Shopee Listing Studio
      dashboard/page.tsx           ROI / Check Dashboard (Phase 2)
  lib/
    types.ts                       Shared TypeScript types
    flow.ts                        Flow step definitions + progress mapping
    mock-data.ts                   Demo data (Mini Desk Vacuum in Singapore)
    store.ts                       Zustand store
  components/
    primitives/
      status.tsx                   StatusText + DecisionChip
      count-up.tsx                 Animated number count-up
      motion.tsx                   PageTransition + Stagger helpers
      dept-row.tsx                 Numbered department row
    marketing/
      site-nav.tsx                 Homepage top nav
    shell/
      shell-bar.tsx                App shell top bar (logo + steps)
      progress-bar.tsx             Orange flow progress bar
    ui/                            shadcn components (button, input, etc.)
```

**Tailwind v4 note:** This project uses Tailwind v4, which is configured via CSS (`@theme` in `globals.css`), not a `tailwind.config.ts`. Design tokens are CSS custom properties exposed as utility classes (e.g. `bg-ivory`, `text-orange`, `font-display`).

**Testing approach:** Logic (the Zustand store, flow/progress mapping, mock-data integrity) is unit-tested with Vitest. Pages and visual components are verified by `npm run build` (TypeScript + Next compile) passing and by rendering in the dev server. This is the appropriate test boundary for a presentational frontend — we test the logic that can break silently, and compile-check the views.

---

# PHASE 0 — Foundation

### Task 1: Scaffold the Next.js app

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx` (all via scaffolder, then trimmed)

- [ ] **Step 1: Scaffold into the current directory**

The project root already contains `PRD.md`, `docs/`, and git history, so scaffold in place with a temp dir then move, to avoid the "directory not empty" prompt.

Run:
```bash
cd /Users/laurenma/Documents/Sealaunch_fe_2
npx create-next-app@latest .sealaunch-scaffold \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --no-turbopack --yes
```
Expected: a new `.sealaunch-scaffold/` folder containing a Next.js app.

- [ ] **Step 2: Move scaffold contents into the project root**

Run:
```bash
cd /Users/laurenma/Documents/Sealaunch_fe_2/.sealaunch-scaffold
shopt -s dotglob
mv -n package.json package-lock.json next.config.* tsconfig.json next-env.d.ts \
   postcss.config.* eslint.config.* .eslintrc* src public ../ 2>/dev/null
cd ..
rm -rf .sealaunch-scaffold
shopt -u dotglob
```
Merge the scaffold's `.gitignore` lines (it adds `/node_modules`, `/.next`, etc.) into the existing root `.gitignore`:
```bash
cat >> /Users/laurenma/Documents/Sealaunch_fe_2/.gitignore <<'EOF'
/node_modules
/.next
/out
next-env.d.ts
EOF
```

- [ ] **Step 3: Verify it builds and runs**

Run:
```bash
cd /Users/laurenma/Documents/Sealaunch_fe_2 && npm run build
```
Expected: "Compiled successfully" with a route list including `/`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app (App Router, TS, Tailwind v4)"
```

---

### Task 2: Install dependencies (Framer Motion, Zustand, Vitest, shadcn)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`, `components.json` (shadcn)

- [ ] **Step 1: Install runtime + dev deps**

Run:
```bash
cd /Users/laurenma/Documents/Sealaunch_fe_2
npm install framer-motion zustand
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```
Expected: installs succeed, `package.json` lists `framer-motion`, `zustand`, `vitest`.

- [ ] **Step 2: Create Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 3: Add test script**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Initialize shadcn/ui**

Run:
```bash
npx shadcn@latest init --yes -b neutral
npx shadcn@latest add button input --yes
```
Expected: creates `components.json`, `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, and `src/lib/utils.ts` (the `cn` helper).

- [ ] **Step 5: Verify**

Run:
```bash
npm run build && npm test
```
Expected: build compiles; `vitest run` reports "No test files found" (exit 0 is fine — we add tests next).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add framer-motion, zustand, vitest, shadcn/ui"
```

---

### Task 3: Fonts + design tokens

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`

- [ ] **Step 1: Wire up the three fonts in the root layout**

Replace `src/app/layout.tsx` with:
```tsx
import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SeaLaunch AI — Zero-person company. Endless profit.",
  description:
    "An AI commerce company built for one Shopee seller. Six departments, one run.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexMono.variable} ${hanken.variable}`}
    >
      <body className="bg-ivory text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Define design tokens in globals.css**

Replace `src/app/globals.css` with:
```css
@import "tailwindcss";

@theme {
  --color-ink: #111111;
  --color-ink-soft: #888888;
  --color-ink-faint: #bbbbbb;
  --color-ivory: #faf6f0;
  --color-ivory-deep: #f5f0e8;
  --color-surface: #ffffff;
  --color-orange: #ee4d2d;
  --color-go: #16a34a;
  --color-watch: #d97706;
  --color-reject: #dc2626;
  --color-hairline: #e8e0d5;

  --font-display: var(--font-fraunces);
  --font-mono: var(--font-plex-mono);
  --font-sans: var(--font-hanken);
}

/* Hairline divider used instead of card borders */
.hairline {
  border-color: rgba(0, 0, 0, 0.08);
}

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 3: Verify tokens compile and apply**

Replace `src/app/page.tsx` temporarily with a token smoke test:
```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-ivory p-10">
      <h1 className="font-display text-6xl font-black tracking-tight text-ink">
        Zero-person <span className="italic font-light text-orange">company.</span>
      </h1>
      <p className="font-mono text-orange tracking-[0.3em] uppercase text-xs mt-4">
        Shopee · Singapore
      </p>
    </main>
  );
}
```
Run:
```bash
npm run build
```
Expected: compiles successfully (the homepage is rebuilt for real in Task 9).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire up Fraunces/Plex Mono/Hanken fonts + design tokens"
```

---

### Task 4: Shared types

**Files:**
- Create: `src/lib/types.ts`
- Test: `src/lib/types.test.ts`

- [ ] **Step 1: Write the types**

Create `src/lib/types.ts`:
```ts
export type DeptStatus =
  | "waiting"
  | "running"
  | "complete"
  | "blocked"
  | "review";

export type Decision = "go" | "watch" | "reject";

export interface SellerBrief {
  targetMarket: string; // "Singapore"
  targetPlatform: "Shopee";
  sellerType: string;
  productMode: "have_product" | "know_category" | "recommend";
  categories: string[];
  keywords: string;
  budgetRange: string;
  expectedMargin: string;
  maxFulfillmentDays: number;
  riskPreference: "conservative" | "balanced" | "high_risk";
  language: string;
}

export interface DepartmentResult {
  id: string; // "market", "sourcing", ...
  department: string; // "Market Department"
  shortName: string; // "Market"
  agent: string; // "Market Agent"
  question: string;
  status: DeptStatus;
  keyFinding: string;
  score: number; // 0-100
  evidence: string[];
  /** key→value rows shown in the output stream / detail page */
  outputPreview: { label: string; value: string }[];
  /** narrative used on the Department Detail page */
  mission: string;
  inputUsed: string[];
  reasoning: string;
  warnings: string[];
  impactOnCommittee: string;
}

export interface Opportunity {
  id: string;
  productName: string;
  productDirection: string;
  sourcePrice: string;
  suggestedSellingPrice: string;
  grossMargin: string;
  netProfit: string;
  netMargin: string;
  availableStock: string;
  fulfillmentTime: string;
  marketHeat: string;
  riskLevel: "Low" | "Medium" | "High";
  confidenceScore: number;
  decision: Decision;
  keyReason: string;
}

export interface PackagingTab {
  id: string;
  label: string;
  status: DeptStatus; // reuse for done/active/waiting dots
}

export interface PackagingOutput {
  productId: string;
  localizedShopeeTitle: string;
  titleCharCount: number;
  sellingPoints: string[];
  productDescription: string;
  positioningAngle: string;
  bundleStrategy: string;
  giftStrategy: string;
  imagePrompts: string[];
  heroImageDirection: string;
  lifestyleImageDirection: string;
  featureImageDirection: string;
  complianceNotes: string[];
  priceUpliftReasoning: string;
}

export interface ShopeeListing {
  productId: string;
  fields: { key: string; value: string; editable: boolean }[];
  preview: {
    image: string; // url or "" for placeholder slot
    title: string;
    price: string;
    bullets: string[];
  };
}
```

- [ ] **Step 2: Write a type-shape test**

Create `src/lib/types.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import type { DepartmentResult, Opportunity } from "./types";

describe("types", () => {
  it("constructs a DepartmentResult", () => {
    const d: DepartmentResult = {
      id: "market",
      department: "Market Department",
      shortName: "Market",
      agent: "Market Agent",
      question: "Is there demand?",
      status: "complete",
      keyFinding: "Visible demand.",
      score: 82,
      evidence: ["a", "b"],
      outputPreview: [{ label: "market_heat", value: "medium-high" }],
      mission: "Judge demand.",
      inputUsed: ["keyword"],
      reasoning: "Searched Shopee.",
      warnings: [],
      impactOnCommittee: "Raises confidence.",
    };
    expect(d.score).toBe(82);
  });

  it("constructs an Opportunity with a valid decision", () => {
    const o: Opportunity = {
      id: "p1",
      productName: "Mini Desk Vacuum",
      productDirection: "Office",
      sourcePrice: "SGD 3.80",
      suggestedSellingPrice: "SGD 14.90",
      grossMargin: "60%",
      netProfit: "SGD 4.60",
      netMargin: "31%",
      availableStock: "In stock",
      fulfillmentTime: "10-14 days",
      marketHeat: "Medium-high",
      riskLevel: "Low",
      confidenceScore: 82,
      decision: "go",
      keyReason: "Clear scenario.",
    };
    expect(["go", "watch", "reject"]).toContain(o.decision);
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npm test`
Expected: 2 tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: shared TypeScript types for departments, opportunities, listing"
```

---

### Task 5: Flow definitions + progress mapping

**Files:**
- Create: `src/lib/flow.ts`
- Test: `src/lib/flow.test.ts`

- [ ] **Step 1: Write flow.ts**

Create `src/lib/flow.ts`:
```ts
export const FLOW_STEPS = [
  { key: "brief", label: "Brief", href: "/app/brief" },
  { key: "company", label: "Company", href: "/app/org-room" },
  { key: "board", label: "Board", href: "/app/board" },
  { key: "studio", label: "Studio", href: "/app/studio" },
  { key: "listing", label: "Listing", href: "/app/listing" },
] as const;

export type FlowKey = (typeof FLOW_STEPS)[number]["key"];

/** Percentage the progress bar fills for a given step. */
export function progressFor(key: FlowKey): number {
  const index = FLOW_STEPS.findIndex((s) => s.key === key);
  return ((index + 1) / FLOW_STEPS.length) * 100;
}

/** Map a pathname under /app to its flow key, or null for non-flow pages. */
export function flowKeyForPath(pathname: string): FlowKey | null {
  if (pathname.startsWith("/app/brief")) return "brief";
  if (pathname.startsWith("/app/org-room")) return "company";
  if (pathname.startsWith("/app/board")) return "board";
  if (pathname.startsWith("/app/studio")) return "studio";
  if (pathname.startsWith("/app/listing")) return "listing";
  return null;
}
```

- [ ] **Step 2: Write flow.test.ts**

Create `src/lib/flow.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { progressFor, flowKeyForPath, FLOW_STEPS } from "./flow";

describe("flow", () => {
  it("has 5 steps", () => {
    expect(FLOW_STEPS).toHaveLength(5);
  });
  it("progresses 20/40/60/80/100", () => {
    expect(progressFor("brief")).toBe(20);
    expect(progressFor("company")).toBe(40);
    expect(progressFor("listing")).toBe(100);
  });
  it("maps paths to flow keys", () => {
    expect(flowKeyForPath("/app/org-room")).toBe("company");
    expect(flowKeyForPath("/app/org-room/market")).toBe("company");
    expect(flowKeyForPath("/app/dashboard")).toBeNull();
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npm test`
Expected: all flow tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: flow step definitions and progress mapping"
```

---

### Task 6: Mock data

**Files:**
- Create: `src/lib/mock-data.ts`
- Test: `src/lib/mock-data.test.ts`

- [ ] **Step 1: Write the mock data**

Create `src/lib/mock-data.ts`:
```ts
import type {
  DepartmentResult,
  Opportunity,
  PackagingOutput,
  PackagingTab,
  SellerBrief,
  ShopeeListing,
} from "./types";

export const DEMO_BRIEF: SellerBrief = {
  targetMarket: "Singapore",
  targetPlatform: "Shopee",
  sellerType: "Solo seller",
  productMode: "have_product",
  categories: ["Home Appliances", "Electronics accessories"],
  keywords: "mini desk vacuum",
  budgetRange: "SGD 500 – 2,000",
  expectedMargin: "30%",
  maxFulfillmentDays: 14,
  riskPreference: "balanced",
  language: "English",
};

export const DEPARTMENTS: DepartmentResult[] = [
  {
    id: "market",
    department: "Market Department",
    shortName: "Market",
    agent: "Market Agent",
    question: "Which products actually have demand?",
    status: "complete",
    keyFinding:
      "Mini desk vacuum has visible demand in Shopee Singapore — office and student desk scenarios.",
    score: 82,
    evidence: [
      "Steady search interest for 'desk vacuum' and 'keyboard cleaner'.",
      "Medium competitor density — room for a differentiated listing.",
      "Strong review counts on adjacent desk-cleaning tools.",
    ],
    outputPreview: [
      { label: "market_heat", value: "Medium-high" },
      { label: "competitor_density", value: "Medium" },
      { label: "price_band", value: "SGD 8.90 – 19.90" },
    ],
    mission:
      "Judge market heat, search trends, competitor landscape, price band and platform opportunity.",
    inputUsed: ["keyword: mini desk vacuum", "market: Singapore", "platform: Shopee"],
    reasoning:
      "Sampled Shopee SG search results and adjacent categories; estimated demand from competitor review velocity and price clustering.",
    warnings: [],
    impactOnCommittee: "Raises overall confidence — demand is the strongest signal.",
  },
  {
    id: "sourcing",
    department: "Sourcing Department",
    shortName: "Sourcing",
    agent: "Sourcing Agent",
    question: "Can we find stable, low-cost suppliers?",
    status: "complete",
    keyFinding: "3 viable suppliers found. MOQ from 50 units. Fulfillment 10–14 days.",
    score: 76,
    evidence: [
      "3 suppliers with consistent stock history.",
      "Unit cost SGD 3.20–4.50 depending on MOQ.",
      "Two suppliers offer SG-friendly shipping.",
    ],
    outputPreview: [
      { label: "source_price", value: "SGD 3.20 – 4.50" },
      { label: "MOQ", value: "50 units" },
      { label: "reliability", value: "Medium-high" },
    ],
    mission:
      "Find usable supply; judge suppliers, stock, MOQ, fulfillment stability and feasibility.",
    inputUsed: ["product: mini desk vacuum", "budget: SGD 500–2,000"],
    reasoning:
      "Matched product against supplier catalogues; ranked by stock consistency and landed cost.",
    warnings: ["One supplier has inconsistent lead times — avoid for first run."],
    impactOnCommittee: "Supports Go — supply is feasible within budget.",
  },
  {
    id: "margin",
    department: "Margin Department",
    shortName: "Margin",
    agent: "Margin Agent",
    question: "Does it still profit after every fee?",
    status: "running",
    keyFinding:
      "Base scenario nets 31% margin after platform fees, shipping and return reserve.",
    score: 78,
    evidence: [
      "Suggested price SGD 14.90 vs SGD 3.80 landed cost.",
      "Platform + payment fees ~ SGD 1.60.",
      "Return reserve and packaging modeled at SGD 0.90.",
    ],
    outputPreview: [
      { label: "suggested_price", value: "SGD 14.90" },
      { label: "net_margin", value: "31%" },
      { label: "scenario", value: "low 22% · base 31% · high 38%" },
    ],
    mission:
      "Compute real profit: price, cost, platform fees, logistics, ad room, and low/base/high scenarios.",
    inputUsed: ["source_price: SGD 3.80", "price_band: SGD 8.90–19.90"],
    reasoning:
      "Modeled net margin across low/base/high price and return assumptions; included Shopee SG fee schedule.",
    warnings: [],
    impactOnCommittee: "Base margin clears the 30% target — supports Go.",
  },
  {
    id: "risk",
    department: "Risk Department",
    shortName: "Risk",
    agent: "Risk Agent",
    question: "Is it safe to sell under Shopee rules?",
    status: "waiting",
    keyFinding: "Low risk overall; avoid exaggerated suction/medical claims.",
    score: 71,
    evidence: [
      "No battery-shipping red flags for USB-rechargeable unit.",
      "No trademark conflicts on generic naming.",
      "Claim language must avoid 'medical-grade' wording.",
    ],
    outputPreview: [
      { label: "risk_level", value: "Low" },
      { label: "violation_flags", value: "None hard" },
      { label: "note", value: "Avoid exaggerated claims" },
    ],
    mission:
      "Judge platform rules, compliance, infringement, exaggerated claims, battery/electronic safety.",
    inputUsed: ["product specs", "listing draft"],
    reasoning:
      "Checked Shopee SG prohibited/claim rules and battery shipping guidance.",
    warnings: ["Exaggerated suction claims would trigger review."],
    impactOnCommittee: "No blockers — Watch only if claims are aggressive.",
  },
  {
    id: "listing",
    department: "Listing Department",
    shortName: "Listing",
    agent: "Listing Agent",
    question: "How do we turn it into a Shopee page?",
    status: "waiting",
    keyFinding: "All Shopee fields can be generated; title and attributes ready.",
    score: 80,
    evidence: [
      "Category maps to Home Appliances › Vacuum Cleaners.",
      "Title fits Shopee length with primary keywords.",
      "Required attributes available from specs.",
    ],
    outputPreview: [
      { label: "category", value: "Home Appliances › Vacuum" },
      { label: "fields", value: "Complete" },
      { label: "title_len", value: "74 chars" },
    ],
    mission:
      "Generate title, selling points, keywords, image prompts, description and Shopee fields.",
    inputUsed: ["packaging output", "category attributes"],
    reasoning: "Mapped product to Shopee taxonomy and required field set.",
    warnings: [],
    impactOnCommittee: "Listing readiness supports Go.",
  },
  {
    id: "committee",
    department: "Committee Department",
    shortName: "Committee",
    agent: "Committee Agent",
    question: "Go / Watch / Reject — the final call.",
    status: "waiting",
    keyFinding: "Go. Demand, supply and margin align; risk is manageable.",
    score: 82,
    evidence: [
      "Profit viability strong (weight 30%).",
      "Market demand visible (weight 25%).",
      "Compliance risk low (weight 20%).",
    ],
    outputPreview: [
      { label: "decision", value: "Go" },
      { label: "confidence", value: "82%" },
      { label: "next", value: "Select for Packaging Studio" },
    ],
    mission:
      "Aggregate all departments, resolve conflicts, and output Go / Watch / Reject.",
    inputUsed: ["all department scores"],
    reasoning:
      "Weighted profit 30% · demand 25% · risk 20% · fulfillment 15% · listing 10%.",
    warnings: [],
    impactOnCommittee: "This is the Committee.",
  },
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "mini-desk-vacuum",
    productName: "Mini Desk Vacuum",
    productDirection: "Office · Student desk · HDB home",
    sourcePrice: "SGD 3.80",
    suggestedSellingPrice: "SGD 14.90",
    grossMargin: "60%",
    netProfit: "SGD 4.60",
    netMargin: "31%",
    availableStock: "In stock",
    fulfillmentTime: "10–14 days",
    marketHeat: "Medium-high",
    riskLevel: "Low",
    confidenceScore: 82,
    decision: "go",
    keyReason: "Clear scenario, good visuals, manageable risk.",
  },
  {
    id: "cable-organizer",
    productName: "Cable Organizer Set",
    productDirection: "WFH · Travel · Desk setup",
    sourcePrice: "SGD 1.20",
    suggestedSellingPrice: "SGD 8.90",
    grossMargin: "65%",
    netProfit: "SGD 2.50",
    netMargin: "28%",
    availableStock: "In stock",
    fulfillmentTime: "7–12 days",
    marketHeat: "Medium",
    riskLevel: "Low",
    confidenceScore: 79,
    decision: "go",
    keyReason: "Low risk, lightweight, easy fulfillment.",
  },
  {
    id: "portable-dehumidifier",
    productName: "Portable Dehumidifier",
    productDirection: "HDB bedroom · Wardrobe",
    sourcePrice: "SGD 6.50",
    suggestedSellingPrice: "SGD 22.90",
    grossMargin: "55%",
    netProfit: "SGD 5.50",
    netMargin: "24%",
    availableStock: "Low stock",
    fulfillmentTime: "14–21 days",
    marketHeat: "High",
    riskLevel: "Medium",
    confidenceScore: 66,
    decision: "watch",
    keyReason: "Strong humid-climate demand, but electronics + after-sales risk.",
  },
  {
    id: "compact-steamer",
    productName: "Compact Garment Steamer",
    productDirection: "Travel · Clothing care",
    sourcePrice: "SGD 7.20",
    suggestedSellingPrice: "SGD 24.90",
    grossMargin: "54%",
    netProfit: "SGD 5.40",
    netMargin: "22%",
    availableStock: "In stock",
    fulfillmentTime: "14–21 days",
    marketHeat: "Medium",
    riskLevel: "Medium",
    confidenceScore: 61,
    decision: "watch",
    keyReason: "Clear use case, but electrical safety and leak risk.",
  },
];

export const PACKAGING_TABS: PackagingTab[] = [
  { id: "brief", label: "Product Brief", status: "complete" },
  { id: "title", label: "Shopee Title", status: "running" },
  { id: "points", label: "Selling Points", status: "complete" },
  { id: "positioning", label: "Positioning", status: "waiting" },
  { id: "bundle", label: "Bundle Strategy", status: "waiting" },
  { id: "gift", label: "Gift Strategy", status: "waiting" },
  { id: "prompts", label: "Image Prompts", status: "waiting" },
  { id: "main", label: "Main Image", status: "waiting" },
  { id: "lifestyle", label: "Lifestyle Image", status: "waiting" },
  { id: "feature", label: "Feature Image", status: "waiting" },
  { id: "preview", label: "Listing Preview", status: "waiting" },
  { id: "compliance", label: "Compliance Notes", status: "waiting" },
];

export const PACKAGING_OUTPUT: PackagingOutput = {
  productId: "mini-desk-vacuum",
  localizedShopeeTitle:
    "Mini Desk Vacuum Cleaner USB Rechargeable Portable Keyboard Dust Cleaner for Home Office HDB",
  titleCharCount: 92,
  sellingPoints: [
    "USB rechargeable — no battery replacement, office-friendly",
    "Compact design fits any HDB desk or student dorm",
    "Keyboard crevice nozzle — removes crumbs and dust effectively",
  ],
  productDescription:
    "Keep your desk spotless with this compact USB rechargeable mini vacuum. Perfect for keyboards, crumbs and fine dust in small home-office and student spaces.",
  positioningAngle:
    "From a single cleaning gadget into a complete desk cleaning kit for HDB home offices.",
  bundleStrategy: "Desk vacuum + cleaning brush + small storage pouch.",
  giftStrategy: "Free mini brush / replacement nozzle.",
  imagePrompts: [
    "Clean desk with mini vacuum picking up keyboard crumbs, soft daylight",
    "HDB home office desk, laptop and mini vacuum, lifestyle scene",
    "Close-up of crevice nozzle cleaning a mechanical keyboard",
  ],
  heroImageDirection: "Clean desk scene with the vacuum and keyboard crumbs.",
  lifestyleImageDirection: "HDB home office / student dorm context.",
  featureImageDirection: "Keyboard cleaning close-up with feature callouts.",
  complianceNotes: [
    "Avoid 'medical-grade' or exaggerated suction claims.",
    "State USB rechargeable clearly; no separate battery shipping.",
  ],
  priceUpliftReasoning:
    "Packaged as a desk cleaning kit, the listing supports SGD 14.90 vs SGD 8–10 for a bare tool.",
};

export const LISTING: ShopeeListing = {
  productId: "mini-desk-vacuum",
  fields: [
    {
      key: "item_name",
      value:
        "Mini Desk Vacuum Cleaner USB Rechargeable Portable Keyboard Dust Cleaner for Home Office HDB",
      editable: true,
    },
    { key: "price", value: "SGD 14.90", editable: true },
    { key: "stock", value: "100", editable: true },
    { key: "category", value: "Home Appliances › Vacuum Cleaners", editable: false },
    { key: "brand", value: "No Brand", editable: true },
    { key: "condition", value: "New", editable: false },
    {
      key: "description",
      value:
        "Keep your desk spotless with this compact USB rechargeable mini vacuum. Ideal for keyboards, crumbs and fine dust.",
      editable: true,
    },
    { key: "sku", value: "SL-MDV-001", editable: true },
    { key: "variation", value: "White / Pink", editable: true },
    { key: "package_weight", value: "0.35 kg", editable: true },
    { key: "package_dimensions", value: "18 × 8 × 8 cm", editable: true },
  ],
  preview: {
    image: "",
    title:
      "Mini Desk Vacuum Cleaner USB Rechargeable Portable Keyboard Dust Cleaner",
    price: "SGD 14.90",
    bullets: [
      "USB rechargeable, no battery needed",
      "Compact for HDB desk and student dorm",
      "Keyboard crevice nozzle included",
    ],
  },
};

export const HOMEPAGE_STATS = [
  { value: 5, suffix: " products", label: "validated per run", sub: "market · margin · risk" },
  { prefix: "SGD ", value: 14.9, decimals: 2, label: "avg suggested price", sub: "from SGD 3.80 cost" },
  { value: 31, suffix: "%", label: "net margin after", sub: "fees · shipping · returns" },
  { value: 11, suffix: " min", label: "brief to Shopee-ready", sub: "launch pack" },
];

export const BOARD_SUMMARY = {
  found: OPPORTUNITIES.length,
  go: OPPORTUNITIES.filter((o) => o.decision === "go").length,
  watch: OPPORTUNITIES.filter((o) => o.decision === "watch").length,
  reject: OPPORTUNITIES.filter((o) => o.decision === "reject").length,
  avgMargin: "28%",
  riskFlags: 1,
};
```

- [ ] **Step 2: Write the integrity test**

Create `src/lib/mock-data.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  DEPARTMENTS,
  OPPORTUNITIES,
  BOARD_SUMMARY,
  PACKAGING_TABS,
} from "./mock-data";

describe("mock data", () => {
  it("has the six departments in order", () => {
    expect(DEPARTMENTS.map((d) => d.id)).toEqual([
      "market",
      "sourcing",
      "margin",
      "risk",
      "listing",
      "committee",
    ]);
  });
  it("board summary counts match opportunity decisions", () => {
    expect(BOARD_SUMMARY.go).toBe(
      OPPORTUNITIES.filter((o) => o.decision === "go").length,
    );
    expect(BOARD_SUMMARY.found).toBe(OPPORTUNITIES.length);
  });
  it("every opportunity has a valid decision", () => {
    for (const o of OPPORTUNITIES) {
      expect(["go", "watch", "reject"]).toContain(o.decision);
    }
  });
  it("packaging has 12 tabs", () => {
    expect(PACKAGING_TABS).toHaveLength(12);
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npm test`
Expected: all mock-data tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: mock data for the Mini Desk Vacuum demo flow"
```

---

### Task 7: Zustand store

**Files:**
- Create: `src/lib/store.ts`
- Test: `src/lib/store.test.ts`

- [ ] **Step 1: Write the store**

Create `src/lib/store.ts`:
```ts
"use client";

import { create } from "zustand";
import type {
  DepartmentResult,
  Opportunity,
  PackagingOutput,
  SellerBrief,
  ShopeeListing,
} from "./types";
import {
  DEMO_BRIEF,
  DEPARTMENTS,
  OPPORTUNITIES,
  PACKAGING_OUTPUT,
  LISTING,
} from "./mock-data";
import type { FlowKey } from "./flow";

interface AppState {
  brief: SellerBrief | null;
  departments: DepartmentResult[];
  opportunities: Opportunity[];
  selectedProductId: string | null;
  packaging: PackagingOutput | null;
  listing: ShopeeListing | null;
  currentStep: FlowKey;

  setBrief: (brief: SellerBrief) => void;
  loadDemoBrief: () => void;
  startRun: () => void;
  selectProduct: (id: string) => void;
  setStep: (step: FlowKey) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  brief: null,
  departments: DEPARTMENTS,
  opportunities: OPPORTUNITIES,
  selectedProductId: null,
  packaging: null,
  listing: null,
  currentStep: "brief",

  setBrief: (brief) => set({ brief }),
  loadDemoBrief: () => set({ brief: DEMO_BRIEF }),
  startRun: () => set({ departments: DEPARTMENTS, currentStep: "company" }),
  selectProduct: (id) =>
    set({
      selectedProductId: id,
      packaging: PACKAGING_OUTPUT,
      listing: LISTING,
    }),
  setStep: (step) => set({ currentStep: step }),
  reset: () =>
    set({
      brief: null,
      selectedProductId: null,
      packaging: null,
      listing: null,
      currentStep: "brief",
    }),
}));
```

- [ ] **Step 2: Write the store test**

Create `src/lib/store.test.ts`:
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "./store";

describe("app store", () => {
  beforeEach(() => useAppStore.getState().reset());

  it("starts with no brief and step=brief", () => {
    const s = useAppStore.getState();
    expect(s.brief).toBeNull();
    expect(s.currentStep).toBe("brief");
  });

  it("loadDemoBrief populates the brief", () => {
    useAppStore.getState().loadDemoBrief();
    expect(useAppStore.getState().brief?.keywords).toBe("mini desk vacuum");
  });

  it("startRun advances to company step", () => {
    useAppStore.getState().startRun();
    expect(useAppStore.getState().currentStep).toBe("company");
  });

  it("selectProduct sets selection + packaging + listing", () => {
    useAppStore.getState().selectProduct("mini-desk-vacuum");
    const s = useAppStore.getState();
    expect(s.selectedProductId).toBe("mini-desk-vacuum");
    expect(s.packaging).not.toBeNull();
    expect(s.listing).not.toBeNull();
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npm test`
Expected: all store tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Zustand app store with flow state and selection"
```

---

### Task 8: Shared primitive components

**Files:**
- Create: `src/components/primitives/status.tsx`, `src/components/primitives/count-up.tsx`, `src/components/primitives/motion.tsx`, `src/components/primitives/dept-row.tsx`

- [ ] **Step 1: Status + decision primitives**

Create `src/components/primitives/status.tsx`:
```tsx
import type { DeptStatus, Decision } from "@/lib/types";

const STATUS_META: Record<DeptStatus, { glyph: string; label: string; cls: string }> = {
  complete: { glyph: "●", label: "COMPLETE", cls: "text-go" },
  running: { glyph: "◉", label: "RUNNING", cls: "text-orange" },
  waiting: { glyph: "○", label: "WAITING", cls: "text-ink-faint" },
  blocked: { glyph: "✕", label: "BLOCKED", cls: "text-reject" },
  review: { glyph: "⚠", label: "REVIEW", cls: "text-watch" },
};

export function StatusText({ status }: { status: DeptStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`font-mono text-[11px] font-semibold tracking-wide ${m.cls}`}>
      <span className={status === "running" ? "animate-pulse" : ""}>{m.glyph}</span>{" "}
      {m.label}
    </span>
  );
}

const DECISION_META: Record<Decision, { label: string; cls: string }> = {
  go: { label: "GO", cls: "text-go bg-go/[0.07]" },
  watch: { label: "WATCH", cls: "text-watch bg-watch/[0.07]" },
  reject: { label: "REJECT", cls: "text-reject bg-reject/[0.07]" },
};

export function DecisionChip({ decision }: { decision: Decision }) {
  const m = DECISION_META[decision];
  return (
    <span
      className={`font-display text-xs font-extrabold px-2 py-1 ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
```

- [ ] **Step 2: Count-up number**

Create `src/components/primitives/count-up.tsx`:
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  durationMs = 1200,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 3: Motion helpers**

Create `src/components/primitives/motion.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const FadeItem = motion.div;
```

- [ ] **Step 4: Department row**

Create `src/components/primitives/dept-row.tsx`:
```tsx
import type { DepartmentResult } from "@/lib/types";
import { StatusText } from "./status";

export function DeptRow({
  index,
  dept,
  onClick,
  active,
}: {
  index: number;
  dept: DepartmentResult;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-8 border-t hairline py-5 text-left last:border-b"
    >
      <span className="font-mono text-sm text-ink-faint w-9 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={`font-display text-2xl font-semibold tracking-tight w-56 shrink-0 transition-colors group-hover:text-orange ${
          active ? "text-orange" : "text-ink"
        }`}
      >
        {dept.shortName}
      </span>
      <span className="font-display text-lg font-light italic text-ink-soft flex-1">
        {dept.question}
      </span>
      <StatusText status={dept.status} />
    </button>
  );
}
```

- [ ] **Step 5: Verify it compiles**

Run: `npm run build`
Expected: compiles (components are unused until pages import them — that is fine).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: shared primitives (status, count-up, motion, dept-row)"
```

---

### Task 9: Marketing nav + App Shell

**Files:**
- Create: `src/components/marketing/site-nav.tsx`, `src/components/shell/shell-bar.tsx`, `src/components/shell/progress-bar.tsx`, `src/app/app/layout.tsx`

- [ ] **Step 1: Marketing nav**

Create `src/components/marketing/site-nav.tsx`:
```tsx
import Link from "next/link";

export function SiteNav() {
  return (
    <nav className="flex items-center justify-between border-b hairline px-14 py-6">
      <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
        Sea<span className="italic text-orange">Launch</span> AI
      </Link>
      <div className="flex items-center gap-8">
        <span className="text-sm text-ink-soft">Platform</span>
        <span className="text-sm text-ink-soft">How it works</span>
        <span className="text-sm text-ink-soft">Pricing</span>
        <Link
          href="/app/brief"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
        >
          Build my team
        </Link>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Progress bar**

Create `src/components/shell/progress-bar.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-0.5 w-full bg-ivory-deep">
      <motion.div
        className="h-full bg-orange"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Shell bar**

Create `src/components/shell/shell-bar.tsx`:
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FLOW_STEPS, flowKeyForPath } from "@/lib/flow";

export function ShellBar() {
  const pathname = usePathname();
  const activeKey = flowKeyForPath(pathname);
  const activeIndex = FLOW_STEPS.findIndex((s) => s.key === activeKey);

  return (
    <div className="flex items-center justify-between border-b hairline bg-surface px-14 py-3">
      <Link href="/" className="font-display text-lg font-semibold text-ink">
        Sea<span className="italic text-orange">Launch</span> AI
      </Link>
      <div className="flex items-center">
        {FLOW_STEPS.map((step, i) => {
          const state =
            i < activeIndex ? "done" : i === activeIndex ? "active" : "todo";
          const cls =
            state === "done"
              ? "text-go"
              : state === "active"
                ? "text-ink"
                : "text-ink-faint";
          const glyph = state === "done" ? "✓" : state === "active" ? "●" : "○";
          return (
            <span
              key={step.key}
              className={`border-r hairline px-3 font-mono text-[10px] font-semibold tracking-wide last:border-r-0 ${cls}`}
            >
              {glyph} {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: App shell layout**

Create `src/app/app/layout.tsx`:
```tsx
"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ShellBar } from "@/components/shell/shell-bar";
import { ProgressBar } from "@/components/shell/progress-bar";
import { PageTransition } from "@/components/primitives/motion";
import { flowKeyForPath, progressFor } from "@/lib/flow";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const key = flowKeyForPath(pathname);
  const percent = key ? progressFor(key) : 0;

  return (
    <div className="min-h-screen bg-ivory">
      <ShellBar />
      <ProgressBar percent={percent} />
      <AnimatePresence mode="wait">
        <PageTransition key={pathname}>{children}</PageTransition>
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 5: Add a temporary brief page so /app/* compiles**

Create `src/app/app/brief/page.tsx`:
```tsx
export default function BriefPage() {
  return <div className="p-14 font-display text-3xl">Seller Brief — coming in Task 11</div>;
}
```

- [ ] **Step 6: Verify**

Run: `npm run build`
Expected: compiles; route list shows `/app/brief`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: marketing nav, app shell with step bar + animated progress"
```

---

# PHASE 1 — Core Flow Pages

### Task 10: Homepage (`/`)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build the homepage**

Replace `src/app/page.tsx` with:
```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/marketing/site-nav";
import { CountUp } from "@/components/primitives/count-up";
import { staggerContainer, staggerItem } from "@/components/primitives/motion";
import { DEPARTMENTS, HOMEPAGE_STATS } from "@/lib/mock-data";
import { FLOW_STEPS } from "@/lib/flow";

export default function Home() {
  return (
    <main className="min-h-screen bg-ivory">
      <SiteNav />

      {/* Hero */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="px-14 pt-20 pb-16"
      >
        <motion.p
          variants={staggerItem}
          className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-orange mb-8"
        >
          Shopee Singapore · Built for one seller
        </motion.p>
        <motion.h1
          variants={staggerItem}
          className="font-display text-[96px] leading-[0.9] font-black tracking-[-0.03em] text-ink mb-10"
        >
          Zero-person
          <br />
          company.
          <br />
          <span className="font-light italic text-orange">Endless</span> profit.
        </motion.h1>
        <motion.div
          variants={staggerItem}
          className="flex items-end justify-between gap-10"
        >
          <p className="font-display text-[22px] font-light italic leading-relaxed text-ink-soft max-w-xl">
            An entire AI commerce company — market, sourcing, margin, risk and
            listing — working a{" "}
            <span className="not-italic font-semibold text-ink">
              single seller&apos;s
            </span>{" "}
            Shopee store. No team. No agency. No payroll.
          </p>
          <div className="flex flex-col items-end gap-3.5 shrink-0">
            <Link
              href="/app/brief"
              className="flex items-center gap-3 rounded-full bg-orange px-8 py-[18px] text-base font-bold text-white"
            >
              Build my AI commerce team →
            </Link>
            <span className="font-mono text-[11px] text-ink-faint">
              _ or watch a 90-second launch
            </span>
          </div>
        </motion.div>
      </motion.section>

      {/* Money band */}
      <section className="grid grid-cols-4 bg-ink px-14 py-12">
        {HOMEPAGE_STATS.map((s, i) => (
          <div
            key={i}
            className="border-r border-white/10 pr-9 last:border-r-0 last:pr-0"
          >
            <div className="font-display text-[56px] font-black leading-none tracking-tight text-white mb-3">
              <CountUp
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals ?? 0}
              />
            </div>
            <div className="font-mono text-[11px] leading-relaxed text-white/50">
              {s.label}
              <br />
              <span className="text-orange">{s.sub}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Departments */}
      <section className="px-14 py-16">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-[42px] font-black tracking-tight text-ink">
            Six departments. <span className="font-light italic text-orange">One run.</span>
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
            AI Commerce Company
          </span>
        </div>
        <div>
          {DEPARTMENTS.filter((d) => d.id !== "committee").map((d, i) => (
            <div
              key={d.id}
              className="group flex items-center gap-8 border-t hairline py-6 last:border-b"
            >
              <span className="font-mono text-sm text-ink-faint w-9">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[30px] font-semibold tracking-tight text-ink w-60 transition-colors group-hover:text-orange">
                {d.shortName}
              </span>
              <span className="font-display text-[19px] font-light italic text-ink-soft flex-1">
                {d.question}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Flow strip */}
      <section className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t hairline px-14 py-10">
        {["Seller Brief", "AI Commerce Co.", "Opportunity Board", "Packaging Studio", "Shopee-ready Launch Pack"].map(
          (label, i, arr) => (
            <span key={label} className="flex items-center gap-4">
              <span
                className={`font-mono text-[11px] font-medium tracking-wide ${
                  i === 1 || i === arr.length - 1 ? "text-orange" : "text-ink"
                }`}
              >
                {label}
              </span>
              {i < arr.length - 1 && <span className="text-ink-faint">→</span>}
            </span>
          ),
        )}
      </section>

      {/* Footer CTA */}
      <section className="border-t hairline px-14 py-20 text-center">
        <h2 className="font-display text-[52px] font-black tracking-tight text-ink mb-6">
          Your team is <span className="font-light italic text-orange">ready</span>.
        </h2>
        <Link
          href="/app/brief"
          className="inline-flex rounded-full bg-orange px-8 py-[18px] text-base font-bold text-white"
        >
          Build my AI commerce team →
        </Link>
        <p className="font-mono text-[10px] text-ink-faint mt-6">
          {FLOW_STEPS.length} steps · Shopee Singapore · English
        </p>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify build + visual check**

Run:
```bash
npm run build && npm run dev
```
Open `http://localhost:3000`. Expected: hero staggers in, money band counts up on view, department rows hover orange. Stop the dev server (Ctrl-C) when done.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: homepage — hero, money band, department flow, CTA"
```

---

### Task 11: Seller Brief (`/app/brief`)

**Files:**
- Modify: `src/app/app/brief/page.tsx`

- [ ] **Step 1: Build the brief page**

Replace `src/app/app/brief/page.tsx` with:
```tsx
"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { DEMO_BRIEF } from "@/lib/mock-data";

function Segmented({
  options,
  active,
}: {
  options: string[];
  active: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((o) => (
        <span
          key={o}
          className={`cursor-pointer border-b-2 px-2.5 py-1 text-[10px] ${
            o === active
              ? "border-ink font-semibold text-ink"
              : "border-transparent text-ink-soft"
          }`}
        >
          {o}
        </span>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function BriefPage() {
  const router = useRouter();
  const { loadDemoBrief, startRun } = useAppStore();

  function start() {
    startRun();
    router.push("/app/org-room");
  }
  function demo() {
    loadDemoBrief();
    start();
  }

  return (
    <div>
      <div className="px-14 pt-8 pb-6">
        <h1 className="font-display text-[42px] font-black tracking-tight text-ink mb-1">
          Tell your AI company what to find.
        </h1>
        <p className="font-display text-lg font-light italic text-ink-soft">
          1–2 minutes. Your team starts immediately.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-10 gap-y-7 px-14 pb-8">
        <Field label="Target Market">
          <Segmented options={["Singapore", "Malaysia", "Thailand"]} active="Singapore" />
        </Field>
        <Field label="Platform">
          <span className="border-b-2 border-orange py-2 font-mono text-[11px] font-semibold text-orange">
            Shopee ·
          </span>
        </Field>
        <Field label="Product Direction">
          <input
            defaultValue={DEMO_BRIEF.keywords}
            className="border-b-2 hairline bg-transparent py-2 text-sm text-ink outline-none focus:border-orange"
          />
        </Field>
        <Field label="Budget Range">
          <input
            defaultValue={DEMO_BRIEF.budgetRange}
            className="border-b-2 hairline bg-transparent py-2 text-sm text-ink outline-none focus:border-orange"
          />
        </Field>
        <Field label="Margin Target">
          <Segmented options={["20%", "30%", "50%+"]} active="30%" />
        </Field>
        <Field label="Risk Preference">
          <Segmented options={["Conservative", "Balanced", "High-risk"]} active="Balanced" />
        </Field>
      </div>

      <div className="flex items-center justify-between border-t hairline px-14 py-5">
        <button
          onClick={start}
          className="bg-ink px-6 py-2.5 font-display text-sm font-black text-white"
        >
          Start AI Company Run →
        </button>
        <button onClick={demo} className="font-mono text-[10px] text-ink-faint">
          _ Use demo: <span className="text-orange">Mini desk vacuum in Singapore</span>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: compiles; `/app/brief` renders, "Start" and demo buttons route to `/app/org-room`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Seller Brief page with underline fields and demo shortcut"
```

---

### Task 12: AI Commerce Org Room (`/app/org-room`)

**Files:**
- Create: `src/app/app/org-room/page.tsx`

- [ ] **Step 1: Build the Org Room**

Create `src/app/app/org-room/page.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DEPARTMENTS } from "@/lib/mock-data";
import { StatusText } from "@/components/primitives/status";
import type { DeptStatus } from "@/lib/types";

const ORDER = DEPARTMENTS.map((d) => d.id);

export default function OrgRoomPage() {
  const router = useRouter();
  // Simulate sequential completion: index of the dept currently running.
  const [runningIndex, setRunningIndex] = useState(0);

  useEffect(() => {
    if (runningIndex >= ORDER.length) return;
    const t = setTimeout(() => setRunningIndex((i) => i + 1), 1100);
    return () => clearTimeout(t);
  }, [runningIndex]);

  function statusFor(i: number): DeptStatus {
    if (i < runningIndex) return "complete";
    if (i === runningIndex) return "running";
    return "waiting";
  }

  const allDone = runningIndex >= ORDER.length;
  const completed = DEPARTMENTS.filter((_, i) => statusFor(i) === "complete");

  return (
    <div className="grid min-h-[70vh] grid-cols-[2fr_3fr]">
      {/* Left: department list */}
      <div className="border-r hairline bg-ivory px-8 py-7">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-5">
          AI Commerce Company
        </p>
        {DEPARTMENTS.map((d, i) => (
          <div
            key={d.id}
            className="flex items-baseline gap-3 border-t hairline py-2.5 last:border-b"
          >
            <span className="font-mono text-[10px] text-ink-faint w-5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`font-display text-base font-semibold flex-1 ${
                statusFor(i) === "running" ? "text-orange" : "text-ink"
              }`}
            >
              {d.shortName}
            </span>
            <StatusText status={statusFor(i)} />
          </div>
        ))}
      </div>

      {/* Right: output stream */}
      <div className="bg-surface px-9 py-7">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            Department Output Stream
          </p>
          {allDone && (
            <button
              onClick={() => router.push("/app/board")}
              className="bg-orange px-4 py-2 font-display text-xs font-black text-white"
            >
              View Opportunity Board →
            </button>
          )}
        </div>

        {completed.map((d) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b hairline py-3"
          >
            <p className="font-mono text-[9px] font-semibold uppercase tracking-wide text-orange mb-1">
              {d.department} · Complete
            </p>
            <p className="font-display text-[15px] font-light italic text-ink-soft leading-snug">
              {d.keyFinding}
            </p>
            <p className="font-mono text-[10px] text-ink-faint mt-1">
              {d.outputPreview.map((o) => `${o.label}: ${o.value}`).join(" · ")} · score:{" "}
              {d.score}
            </p>
          </motion.div>
        ))}

        {!allDone && (
          <div className="py-3 opacity-50">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-wide text-ink-faint mb-1">
              {DEPARTMENTS[runningIndex]?.department} · Running…
            </p>
            <p className="font-display text-[15px] font-light italic text-ink-faint">
              Analyzing…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run dev`
Open `http://localhost:3000/app/org-room`. Expected: departments flip waiting→running→complete sequentially; stream blocks fade in; "View Opportunity Board" appears when done. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Org Room with sequential dept status + output stream"
```

---

### Task 13: Opportunity Board (`/app/board`)

**Files:**
- Create: `src/app/app/board/page.tsx`

- [ ] **Step 1: Build the board**

Create `src/app/app/board/page.tsx`:
```tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { OPPORTUNITIES, BOARD_SUMMARY } from "@/lib/mock-data";
import { DecisionChip } from "@/components/primitives/status";

const COLS = "grid grid-cols-[2fr_1fr_1fr_1fr_1fr_90px] items-center gap-0";

export default function BoardPage() {
  const router = useRouter();
  const selectProduct = useAppStore((s) => s.selectProduct);

  function select(id: string) {
    selectProduct(id);
    router.push("/app/studio");
  }

  return (
    <div className="px-14 py-7">
      <h1 className="font-display text-[34px] font-black tracking-tight text-ink mb-1">
        {BOARD_SUMMARY.found} opportunities found.
      </h1>
      <p className="font-mono text-[10px] tracking-wide text-ink-faint mb-6">
        <span className="text-ink">{BOARD_SUMMARY.go} Go</span> ·{" "}
        <span className="text-ink">{BOARD_SUMMARY.watch} Watch</span> · avg margin{" "}
        <span className="text-ink">{BOARD_SUMMARY.avgMargin}</span> ·{" "}
        {BOARD_SUMMARY.riskFlags} risk flag
      </p>

      <div className={`${COLS} pb-2`}>
        {["Product", "Source", "Price", "Margin", "Risk", "Decision"].map((h) => (
          <span
            key={h}
            className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint"
          >
            {h}
          </span>
        ))}
      </div>

      {OPPORTUNITIES.map((o, i) => (
        <motion.button
          key={o.id}
          onClick={() => select(o.id)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`${COLS} group w-full border-t hairline py-3 text-left last:border-b`}
        >
          <span>
            <span className="font-display text-[15px] font-semibold text-ink transition-colors group-hover:text-orange">
              {o.productName}
            </span>
            <span className="block font-display text-[10px] font-light italic text-ink-faint">
              {o.productDirection}
            </span>
          </span>
          <span className="font-mono text-[11px] text-ink-soft">{o.sourcePrice}</span>
          <span className="font-mono text-[11px] text-ink-soft">
            {o.suggestedSellingPrice}
          </span>
          <span
            className={`font-mono text-[11px] ${
              o.decision === "go" ? "text-go" : "text-watch"
            }`}
          >
            {o.netMargin}
          </span>
          <span
            className={`font-mono text-[11px] ${
              o.riskLevel === "Low" ? "text-go" : "text-watch"
            }`}
          >
            {o.riskLevel}
          </span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
          >
            <DecisionChip decision={o.decision} />
          </motion.span>
        </motion.button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run dev`
Open `http://localhost:3000/app/board`. Expected: rows cascade from left, decision chips spring in, clicking a row routes to `/app/studio`. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Opportunity Board table with cascade + decision chips"
```

---

### Task 14: Packaging Studio (`/app/studio`)

**Files:**
- Create: `src/app/app/studio/page.tsx`

- [ ] **Step 1: Build the studio**

Create `src/app/app/studio/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PACKAGING_TABS, PACKAGING_OUTPUT } from "@/lib/mock-data";

function dot(status: string) {
  if (status === "complete") return "bg-go";
  if (status === "running") return "bg-orange";
  return "bg-ink-faint/40";
}

export default function StudioPage() {
  const router = useRouter();
  const [active, setActive] = useState("title");
  const p = PACKAGING_OUTPUT;

  return (
    <div className="grid min-h-[70vh] grid-cols-[200px_1fr]">
      {/* Sidebar tabs */}
      <div className="border-r hairline bg-ivory-deep py-4">
        <p className="px-4 font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-3">
          Mini Desk Vacuum
        </p>
        {PACKAGING_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex w-full items-center gap-2 px-4 py-2 text-[10px] ${
              active === t.id
                ? "border-l-2 border-orange bg-surface font-semibold text-ink"
                : "text-ink-soft"
            }`}
          >
            <span className={`h-[5px] w-[5px] shrink-0 rounded-full ${dot(t.status)}`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="bg-surface px-8 py-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-orange">
              Shopee Title · Generated
            </p>
            <h2 className="font-display text-xl font-semibold leading-tight text-ink">
              {p.localizedShopeeTitle}
            </h2>
            <p className="font-mono text-[9px] text-ink-faint">
              {p.titleCharCount} chars · SEO optimized · Shopee SG compliant
            </p>

            <div className="border-t hairline pt-3.5">
              <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-orange mb-2.5">
                Selling Points
              </p>
              {p.sellingPoints.map((pt, i) => (
                <div key={i} className="flex gap-2.5 items-baseline mb-1.5">
                  <span className="font-mono text-[9px] text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] text-ink-soft leading-snug">{pt}</span>
                </div>
              ))}
            </div>

            <div className="border-t hairline pt-3.5">
              <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-orange mb-2">
                Image Direction
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["Main Image", p.heroImageDirection],
                  ["Lifestyle", p.lifestyleImageDirection],
                  ["Feature", p.featureImageDirection],
                ].map(([label, dir]) => (
                  <div
                    key={label}
                    className="flex aspect-square items-center justify-center rounded-md bg-ivory-deep p-2 text-center"
                  >
                    <span className="font-mono text-[8px] text-ink-faint">
                      {label}
                      <br />
                      {dir}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push("/app/listing")}
              className="mt-2 self-start bg-ink px-5 py-2.5 font-display text-xs font-black text-white"
            >
              Generate Shopee Listing →
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run dev`
Open `http://localhost:3000/app/studio`. Expected: left tabs switch the canvas with a cross-fade; "Generate Shopee Listing" routes to `/app/listing`. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Packaging Studio with tabbed canvas and image slots"
```

---

### Task 15: Shopee Listing Studio (`/app/listing`)

**Files:**
- Create: `src/app/app/listing/page.tsx`

- [ ] **Step 1: Build the listing studio**

Create `src/app/app/listing/page.tsx`:
```tsx
"use client";

import { LISTING } from "@/lib/mock-data";

export default function ListingPage() {
  const l = LISTING;
  return (
    <div>
      <div className="grid min-h-[64vh] grid-cols-2">
        {/* Fields */}
        <div className="border-r hairline px-6 py-5">
          <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-3.5">
            Shopee Listing Fields
          </p>
          {l.fields.map((f) => (
            <div
              key={f.key}
              className="flex items-baseline gap-3 border-b hairline py-1.5"
            >
              <span className="font-mono text-[9px] text-ink-faint w-24 shrink-0">
                {f.key}
              </span>
              <span className="flex-1 text-[11px] leading-snug text-ink">
                {f.value}
              </span>
              <span className="flex gap-2">
                {f.editable && (
                  <span className="cursor-pointer font-mono text-[8px] text-orange">
                    edit
                  </span>
                )}
                <span className="cursor-pointer font-mono text-[8px] text-orange">
                  copy
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="bg-ivory px-5 py-5">
          <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-3">
            Shopee Preview
          </p>
          <div className="mb-2.5 flex h-28 items-center justify-center rounded-md bg-ivory-deep">
            <span className="font-mono text-[8px] text-ink-faint">Main image</span>
          </div>
          <h2 className="font-display text-[15px] font-semibold leading-snug text-ink mb-1">
            {l.preview.title}
          </h2>
          <p className="font-mono text-lg font-semibold text-orange mb-2">
            {l.preview.price}
          </p>
          <div className="flex flex-col gap-1">
            {l.preview.bullets.map((b) => (
              <span key={b} className="flex gap-1.5 items-baseline text-[9px] text-ink-soft">
                <span className="text-orange">·</span>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-3 border-t hairline bg-ivory px-6 py-3">
        <button className="bg-ink px-3.5 py-1.5 font-display text-[10px] font-black text-white">
          Download Launch Pack
        </button>
        <button className="border-b-[1.5px] border-orange pb-px font-display text-[10px] font-black text-orange">
          Copy JSON
        </button>
        <button className="border-b-[1.5px] border-orange pb-px font-display text-[10px] font-black text-orange">
          Export CSV
        </button>
        <button className="font-mono text-[9px] text-ink-faint">_ Mark as Approved</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run dev`
Open `http://localhost:3000/app/listing`. Expected: field rows on the left, Shopee preview on the right, action bar at the bottom, progress bar at 100%. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Shopee Listing Studio with fields, preview, export bar"
```

---

### Task 16: Phase 1 end-to-end check

**Files:** none (verification only)

- [ ] **Step 1: Full build + test**

Run:
```bash
npm run build && npm test
```
Expected: build compiles all routes; all unit tests pass.

- [ ] **Step 2: Manual flow walkthrough**

Run `npm run dev`, then click through:
`/` → "Build my AI commerce team" → `/app/brief` → demo → `/app/org-room` (wait for completion) → "View Opportunity Board" → click Mini Desk Vacuum → `/app/studio` → "Generate Shopee Listing" → `/app/listing`.
Expected: progress bar advances 20→40→60→80→100; page transitions animate; no console errors. Stop dev server.

- [ ] **Step 3: Commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: Phase 1 end-to-end flow polish" --allow-empty
```

---

# PHASE 2 — Remaining Pages

### Task 17: Login / Entry (`/login`)

**Files:**
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: Build the login page**

Create `src/app/login/page.tsx`:
```tsx
"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-2">
      {/* Left brand panel */}
      <div className="flex flex-col justify-between bg-ink px-14 py-12">
        <Link href="/" className="font-display text-2xl font-semibold text-white">
          Sea<span className="italic text-orange">Launch</span> AI
        </Link>
        <div>
          <h1 className="font-display text-[52px] font-black leading-[0.95] tracking-tight text-white">
            Zero-person
            <br />
            company.
            <br />
            <span className="font-light italic text-orange">Endless</span> profit.
          </h1>
          <p className="font-display text-base font-light italic text-white/50 mt-5 max-w-sm">
            Sign in to put your AI commerce company to work on Shopee Singapore.
          </p>
        </div>
        <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
          Shopee · Singapore
        </p>
      </div>

      {/* Right form */}
      <div className="flex flex-col justify-center bg-ivory px-14">
        <h2 className="font-display text-3xl font-black tracking-tight text-ink mb-1">
          Enter the workspace.
        </h2>
        <p className="font-display text-base font-light italic text-ink-soft mb-8">
          Start a run or continue where you left off.
        </p>
        <div className="flex max-w-sm flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
              Email
            </span>
            <input
              type="email"
              placeholder="you@store.com"
              className="border-b-2 hairline bg-transparent py-2 text-sm text-ink outline-none focus:border-orange"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
              Password
            </span>
            <input
              type="password"
              placeholder="••••••••"
              className="border-b-2 hairline bg-transparent py-2 text-sm text-ink outline-none focus:border-orange"
            />
          </label>
          <Link
            href="/app/brief"
            className="mt-2 rounded-full bg-orange px-6 py-3.5 text-center text-sm font-bold text-white"
          >
            Enter workspace →
          </Link>
          <Link
            href="/app/brief"
            className="text-center font-mono text-[10px] text-ink-faint"
          >
            _ Skip and try the demo
          </Link>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: `/login` compiles; both buttons route to `/app/brief`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Login / Entry page with split brand panel"
```

---

### Task 18: Product Signal Upload (`/app/upload`)

**Files:**
- Create: `src/app/app/upload/page.tsx`

- [ ] **Step 1: Build the upload page**

Create `src/app/app/upload/page.tsx`:
```tsx
"use client";

import { useRouter } from "next/navigation";

const INPUT_TYPES = [
  ["Product image", "Product, supplier, or competitor photos"],
  ["Product link", "Shopee or supplier URL"],
  ["Keyword", "Search terms for the product"],
  ["Supplier quote", "Cost and MOQ from a supplier"],
  ["Product specs", "Size, weight, colour, function, contents"],
  ["Existing price", "Any price you already have"],
];

const PARSED = [
  ["Guessed name", "Mini Desk Vacuum Cleaner"],
  ["Guessed category", "Home Appliances › Vacuum Cleaners"],
  ["Visible attributes", "USB rechargeable · compact · white"],
  ["Likely specs", "~0.3 kg · 18 × 8 × 8 cm"],
  ["To confirm", "Battery capacity · suction power · warranty"],
];

export default function UploadPage() {
  const router = useRouter();
  return (
    <div>
      <div className="px-14 pt-8 pb-5">
        <h1 className="font-display text-[34px] font-black tracking-tight text-ink mb-1">
          Give your team more to work with.
        </h1>
        <p className="font-display text-base font-light italic text-ink-soft">
          Optional. Anything you add sharpens the analysis.
        </p>
      </div>

      <div className="grid grid-cols-2">
        {/* Upload */}
        <div className="border-r hairline px-14 py-6">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-4">
            Add signals
          </p>
          <div className="mb-6 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-hairline">
            <span className="font-mono text-[10px] text-ink-faint">
              Drop product images or paste a link
            </span>
          </div>
          {INPUT_TYPES.map(([t, d]) => (
            <div key={t} className="flex items-baseline gap-3 border-t hairline py-2.5 last:border-b">
              <span className="font-display text-sm font-semibold text-ink w-36 shrink-0">
                {t}
              </span>
              <span className="font-display text-[11px] font-light italic text-ink-soft">
                {d}
              </span>
            </div>
          ))}
        </div>

        {/* Parse */}
        <div className="bg-surface px-14 py-6">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-orange mb-4">
            Parsed by AI
          </p>
          {PARSED.map(([k, v]) => (
            <div key={k} className="border-b hairline py-2.5">
              <p className="font-mono text-[9px] text-ink-faint mb-0.5">{k}</p>
              <p className="text-[12px] text-ink">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t hairline px-14 py-5">
        <button
          onClick={() => router.push("/app/org-room")}
          className="bg-ink px-6 py-2.5 font-display text-sm font-black text-white"
        >
          Continue to AI Company →
        </button>
        <button
          onClick={() => router.push("/app/org-room")}
          className="font-mono text-[10px] text-ink-faint"
        >
          _ Skip — I have nothing to add
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: `/app/upload` compiles, left upload column + right parse column render.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Product Signal Upload page with parse panel"
```

---

### Task 19: Department Output Detail (`/app/org-room/[dept]`)

**Files:**
- Create: `src/app/app/org-room/[dept]/page.tsx`
- Modify: `src/app/app/org-room/page.tsx` (link each dept row to its detail page)

- [ ] **Step 1: Build the detail page**

Create `src/app/app/org-room/[dept]/page.tsx`:
```tsx
"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEPARTMENTS } from "@/lib/mock-data";
import { StatusText } from "@/components/primitives/status";

export default function DeptDetailPage({
  params,
}: {
  params: Promise<{ dept: string }>;
}) {
  const { dept } = use(params);
  const d = DEPARTMENTS.find((x) => x.id === dept);
  if (!d) notFound();

  return (
    <div className="grid min-h-[70vh] grid-cols-[1fr_2fr_1fr]">
      {/* Left: dept list */}
      <div className="border-r hairline bg-ivory px-6 py-6">
        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-4">
          Departments
        </p>
        {DEPARTMENTS.map((x) => (
          <Link
            key={x.id}
            href={`/app/org-room/${x.id}`}
            className={`block py-2 font-display text-sm ${
              x.id === d.id ? "font-semibold text-orange" : "text-ink-soft"
            }`}
          >
            {x.shortName}
          </Link>
        ))}
      </div>

      {/* Middle: result */}
      <div className="px-9 py-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-display text-[28px] font-black tracking-tight text-ink">
            {d.department}
          </h1>
          <StatusText status={d.status} />
        </div>
        <p className="font-display text-base font-light italic text-ink-soft mb-6">
          {d.question}
        </p>

        <Section title="Mission">{d.mission}</Section>
        <Section title="Key finding">{d.keyFinding}</Section>
        <Section title="Reasoning">{d.reasoning}</Section>

        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-orange mt-6 mb-2">
          Output fields
        </p>
        {d.outputPreview.map((o) => (
          <div key={o.label} className="flex gap-3 border-b hairline py-1.5">
            <span className="font-mono text-[10px] text-ink-faint w-40 shrink-0">
              {o.label}
            </span>
            <span className="text-[12px] text-ink">{o.value}</span>
          </div>
        ))}
      </div>

      {/* Right: evidence */}
      <div className="border-l hairline bg-surface px-6 py-6">
        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-3">
          Evidence
        </p>
        {d.evidence.map((e, i) => (
          <div key={i} className="flex gap-2 border-b hairline py-2 items-baseline">
            <span className="font-mono text-[9px] text-orange">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-[11px] leading-snug text-ink-soft">{e}</span>
          </div>
        ))}

        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint mt-5 mb-2">
          Confidence
        </p>
        <p className="font-display text-3xl font-black text-ink">{d.score}<span className="text-ink-faint text-lg">/100</span></p>

        {d.warnings.length > 0 && (
          <>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-watch mt-5 mb-2">
              Warnings
            </p>
            {d.warnings.map((w) => (
              <p key={w} className="text-[11px] text-watch leading-snug mb-1">⚠ {w}</p>
            ))}
          </>
        )}

        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint mt-5 mb-2">
          Impact on Committee
        </p>
        <p className="text-[11px] leading-snug text-ink-soft">{d.impactOnCommittee}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-orange mb-1">
        {title}
      </p>
      <p className="text-[13px] leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}
```

- [ ] **Step 2: Link Org Room rows to detail pages**

In `src/app/app/org-room/page.tsx`, the left-column department list currently renders a plain `<div>` per department. Wrap each department's content in a `Link` to its detail page. Replace the left-column `.map(...)` block (the one rendering `DEPARTMENTS.map((d, i) => (<div ...>...`) with:
```tsx
        {DEPARTMENTS.map((d, i) => (
          <Link
            key={d.id}
            href={`/app/org-room/${d.id}`}
            className="flex items-baseline gap-3 border-t hairline py-2.5 last:border-b"
          >
            <span className="font-mono text-[10px] text-ink-faint w-5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`font-display text-base font-semibold flex-1 ${
                statusFor(i) === "running" ? "text-orange" : "text-ink"
              }`}
            >
              {d.shortName}
            </span>
            <StatusText status={statusFor(i)} />
          </Link>
        ))}
```
Add `import Link from "next/link";` at the top of the file.

- [ ] **Step 3: Verify**

Run: `npm run build && npm run dev`
Open `http://localhost:3000/app/org-room/market`. Expected: 3-column detail (list / result / evidence); clicking departments in the Org Room left list opens detail. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Department Output Detail page + Org Room links"
```

---

### Task 20: Committee Review (`/app/committee`)

**Files:**
- Create: `src/app/app/committee/page.tsx`

- [ ] **Step 1: Build the committee page**

Create `src/app/app/committee/page.tsx`:
```tsx
"use client";

import Link from "next/link";
import { DEPARTMENTS } from "@/lib/mock-data";
import { DecisionChip } from "@/components/primitives/status";

const MATRIX = DEPARTMENTS.filter((d) => d.id !== "committee").map((d) => ({
  name: d.department,
  score: d.score,
  finding: d.keyFinding,
  state:
    d.id === "risk" ? "Warning" : d.id === "listing" ? "Ready" : "Positive",
}));

const CONFLICTS = [
  ["High demand + low margin", "Watch — find cheaper sourcing or differentiate"],
  ["High profit + high risk", "Reject or Human Review"],
  ["Low-cost source + long fulfillment", "Watch — change supplier or adjust promise"],
  ["Complete fields + compliance warning", "Human Review — not auto-approved"],
  ["Medium profit + low risk + stable source", "Go"],
];

const WEIGHTS = [
  ["Profit viability", "30%"],
  ["Market demand", "25%"],
  ["Compliance risk", "20%"],
  ["Fulfillment feasibility", "15%"],
  ["Listing readiness", "10%"],
];

export default function CommitteePage() {
  return (
    <div className="px-14 py-7">
      {/* Decision card */}
      <div className="mb-8 flex items-end justify-between border-b hairline pb-6">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-2">
            Committee Decision
          </p>
          <div className="flex items-center gap-4">
            <DecisionChip decision="go" />
            <span className="font-display text-2xl font-black text-ink">
              Confidence 82%
            </span>
          </div>
          <p className="font-display text-base font-light italic text-ink-soft mt-2">
            Recommended next action: select for Packaging Studio.
          </p>
        </div>
        <Link
          href="/app/board"
          className="bg-orange px-5 py-2.5 font-display text-sm font-black text-white"
        >
          View Opportunity Board →
        </Link>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-12">
        {/* Score matrix */}
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-3">
            Department Scores
          </p>
          {MATRIX.map((m) => (
            <div
              key={m.name}
              className="flex items-center gap-4 border-t hairline py-3 last:border-b"
            >
              <span className="font-display text-base font-semibold text-ink w-48 shrink-0">
                {m.name}
              </span>
              <span className="font-display text-2xl font-black text-ink w-14">
                {m.score}
              </span>
              <span
                className={`font-mono text-[10px] font-semibold w-20 ${
                  m.state === "Warning" ? "text-watch" : "text-go"
                }`}
              >
                {m.state}
              </span>
              <span className="font-display text-[12px] font-light italic text-ink-soft flex-1">
                {m.finding}
              </span>
            </div>
          ))}

          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint mt-8 mb-3">
            Conflict resolution
          </p>
          {CONFLICTS.map(([scenario, outcome]) => (
            <div key={scenario} className="flex gap-4 border-t hairline py-2.5 last:border-b">
              <span className="text-[12px] text-ink w-72 shrink-0">{scenario}</span>
              <span className="font-display text-[12px] font-light italic text-ink-soft">
                {outcome}
              </span>
            </div>
          ))}
        </div>

        {/* Weights */}
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-3">
            Recommendation weights
          </p>
          {WEIGHTS.map(([dim, w]) => (
            <div key={dim} className="border-t hairline py-3 last:border-b">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[12px] text-ink">{dim}</span>
                <span className="font-mono text-[12px] font-semibold text-orange">{w}</span>
              </div>
              <div className="h-1 w-full bg-ivory-deep">
                <div className="h-full bg-orange" style={{ width: w }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: `/app/committee` compiles; decision card, score matrix, conflict table, weight bars render.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Committee Review with score matrix, conflicts, weights"
```

---

### Task 21: ROI / Check Dashboard (`/app/dashboard`)

**Files:**
- Create: `src/app/app/dashboard/page.tsx`

- [ ] **Step 1: Build the dashboard**

Create `src/app/app/dashboard/page.tsx`:
```tsx
"use client";

import { CountUp } from "@/components/primitives/count-up";
import { BOARD_SUMMARY } from "@/lib/mock-data";

const METRICS = [
  { value: BOARD_SUMMARY.found, label: "opportunities found" },
  { value: BOARD_SUMMARY.go, label: "Go decisions" },
  { value: 1, label: "launch packs generated" },
  { value: BOARD_SUMMARY.riskFlags, label: "risks blocked" },
  { value: 1, label: "human reviews required" },
  { value: 6, label: "reusable templates" },
];

const PANELS: [string, string[]][] = [
  ["Workflow Summary", [
    "Market · 1.1s · complete",
    "Sourcing · 1.0s · complete",
    "Margin · 1.3s · complete",
    "Risk · 0.9s · complete",
    "Listing · 1.0s · complete",
    "Committee · 0.6s · complete",
  ]],
  ["Packaging Assets", [
    "1 localized Shopee title",
    "3 ranked selling points",
    "3 image prompts",
    "1 bundle + 1 gift strategy",
  ]],
  ["Export History", [
    "launch-pack-mini-desk-vacuum.zip",
    "listing-mini-desk-vacuum.json",
    "listing-mini-desk-vacuum.csv",
  ]],
  ["Reusable Templates", [
    "Desk-cleaning listing template",
    "USB gadget image-prompt set",
    "HDB lifestyle packaging skill",
  ]],
];

export default function DashboardPage() {
  return (
    <div className="px-14 py-7">
      <h1 className="font-display text-[34px] font-black tracking-tight text-ink mb-1">
        What your AI company produced.
      </h1>
      <p className="font-display text-base font-light italic text-ink-soft mb-8">
        One run · Shopee Singapore · Mini Desk Vacuum
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-6 border-y hairline">
        {METRICS.map((m) => (
          <div key={m.label} className="border-r hairline px-4 py-5 last:border-r-0">
            <div className="font-display text-[40px] font-black leading-none text-ink mb-2">
              <CountUp value={m.value} />
            </div>
            <div className="font-mono text-[9px] leading-snug text-ink-faint">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-8 mt-10">
        {PANELS.map(([title, rows]) => (
          <div key={title}>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-orange mb-3">
              {title}
            </p>
            {rows.map((r) => (
              <div key={r} className="border-t hairline py-2 last:border-b">
                <span className="text-[12px] text-ink-soft">{r}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run dev`
Open `http://localhost:3000/app/dashboard`. Expected: 6 metric columns count up; 4 panels list assets/history. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: ROI / Check Dashboard with metrics and asset panels"
```

---

### Task 22: Final verification + README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Full build + test**

Run:
```bash
npm run build && npm test
```
Expected: all 11 page routes compile; all unit tests pass.

- [ ] **Step 2: Write a short README**

Create `README.md`:
```markdown
# SeaLaunch AI — Website

An AI commerce company built for one Shopee seller. Marketing site + product flow.

## Stack
Next.js (App Router, TS) · Tailwind v4 · shadcn/ui · Framer Motion · Zustand · Vitest.

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests (store, flow, mock data)
npm run build    # production build
```

## Routes
- `/` Homepage · `/login` Login
- Flow: `/app/brief` → `/app/org-room` → `/app/board` → `/app/studio` → `/app/listing`
- Also: `/app/upload`, `/app/org-room/[dept]`, `/app/committee`, `/app/dashboard`

Data is mock/static (`src/lib/mock-data.ts`), shaped to match the future backend.
Demo case: Mini Desk Vacuum in Singapore.

See `docs/superpowers/specs/2026-06-06-sealaunch-ai-website-design.md` for the design spec.
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: add README; final Phase 2 verification"
```

---

## Self-Review Notes

- **Spec coverage:** Homepage (T10), Login (T17), Seller Brief (T11), Signal Upload (T18), Org Room (T12), Department Detail (T19), Committee Review (T20), Opportunity Board (T13), Packaging Studio (T14), Listing Studio (T15), ROI Dashboard (T21) — all 11 PRD pages covered. Design system (T3 tokens, T8 primitives), App Shell + Flow architecture (T9), Zustand store (T7), animations (T8 motion + per-page), images as labeled slots (T14/T15) — all covered.
- **Type consistency:** Store methods (`loadDemoBrief`, `startRun`, `selectProduct`, `setStep`, `reset`), `FlowKey`, `progressFor`, `flowKeyForPath`, and all `mock-data` exports are referenced consistently across tasks with matching names and signatures.
- **No placeholders:** every code step contains full, runnable code.
