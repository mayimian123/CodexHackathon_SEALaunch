# SeaLaunch AI — Website Design Spec

**Date:** 2026-06-06
**Status:** Approved design direction, ready for implementation planning
**Scope:** Phase 1 MVP — 6 core pages of the SeaLaunch AI website

---

## 1. Product Summary

**SeaLaunch AI** is an AI commerce company built for one Shopee seller. The core
metaphor is a *company with departments and employees (AI agents)*: it takes the
whole job a Shopee seller would otherwise do alone — finding products, sourcing,
profit math, compliance, listing — and splits it across AI departments that work
on the seller's behalf.

- **Slogan:** *Zero-person company. One AI commerce team. Endless product opportunities.*
- **Platform:** Shopee only. Demo market: Singapore.
- **Language:** English only. No Chinese anywhere in the UI.

**Core business flow (the spine of the whole product):**

```
Seller Brief → AI Commerce Company → Opportunity Board → Packaging Studio → Shopee-ready Launch Pack
```

**Pain → Department mapping** (the reason the company exists, and the narrative
backbone of the homepage):

| Seller's anxiety | Department | Question it answers |
|---|---|---|
| Don't know what to sell | Market Dept | Is there real demand? |
| Don't know where to source | Sourcing Dept | Can we supply it stably and cheaply? |
| Don't know if it profits | Margin Dept | Does it still profit after all fees? |
| Don't know the risks | Risk Dept | Is it safe under Shopee rules? |
| Don't know how to list | Listing Dept | How do we make it a Shopee page? |
| Don't know if it's worth it | Committee | Go / Watch / Reject |
| How to sell it for more | Packaging Studio (post-selection) | How do we package it to sell higher? |

---

## 2. Decisions Locked In

| Decision | Choice |
|---|---|
| **Output format** | Next.js application (not static HTML, not design-only) |
| **Stack** | Next.js + Tailwind + shadcn/ui + Framer Motion |
| **State** | Zustand store living in the `/app` shell |
| **Architecture** | Option B — App Shell + Flow (marketing page at `/`, product flow under `/app/*`) |
| **Scope** | Phase 1 = 6 pages (see §5). Login, Signal Upload, Department Detail, Committee Review, ROI Dashboard deferred to Phase 2 |
| **Visual direction** | "Bold editorial, bigger & money-forward" — derived from exploration Direction D + E, scaled up |
| **Typeface system** | Fraunces (display serif) + IBM Plex Mono (data/labels) + Hanken Grotesk (body) |
| **Language** | English only |
| **Must include** | Animations (Framer Motion) and product images |

---

## 3. Design System

### 3.1 Color

| Role | Value | Notes |
|---|---|---|
| Primary | Shopee Orange `#ee4d2d` | Accent, CTAs, running status, highlights |
| Background | Warm Ivory `#faf6f0` | Default page background |
| Surface | Pure White `#ffffff` | Right-side panels, preview surfaces |
| Money band | Near Black `#111111` | Dark stat band on homepage, primary buttons |
| Text primary | `#111111` | |
| Text secondary | `#888888` | |
| Hairline | `#e8e0d5` / `rgba(0,0,0,0.07)` | Section dividers (no card borders) |
| Go / Success | `#16a34a` | |
| Watch / Warning | `#d97706` | |
| Reject / Error | `#dc2626` | |

Orange is used **sparingly** — one or two orange elements per section. Filled
orange backgrounds are reserved for CTAs and the running status. Green/amber/red
fills appear only on Go/Watch/Reject decisions, not throughout the UI.

### 3.2 Typography

| Font | Role |
|---|---|
| **Fraunces** (display serif, 300 italic + 900) | Hero headlines, section titles, department names, large numbers. The 300-weight italic in orange is the signature accent. |
| **IBM Plex Mono** (400–600) | Labels, status text, data values, dept numbers, platform tags, scores |
| **Hanken Grotesk** (300–700) | Body text, form labels, nav links, descriptions, buttons |

All loaded from Google Fonts. Never use Inter, Roboto, Open Sans, or system fonts.

**Scale & contrast principles:**
- Hero headline ~96px, weight 900, letter-spacing -3px.
- Use weight extremes: 900 display vs 300 italic accent.
- Big size jumps (3x+) between levels, not timid 1.5x steps.
- The "money-forward, not timid" feel comes from large type + real money numbers + the dark stat band — never from cramped, small, evenly-distributed elements.

### 3.3 Status Language

Pure-text status indicators, **no badge boxes**:

| Status | Render |
|---|---|
| Complete | `● COMPLETE` green |
| Running | `◉ RUNNING` orange + pulsing dot |
| Waiting | `○ WAITING` gray |
| Blocked | `✕ BLOCKED` red |
| Human review | `⚠ REVIEW` amber |

Committee decisions render as filled chips: `GO` (green), `WATCH` (amber),
`REJECT` (red) — the only place color fills are used liberally.

### 3.4 Layout Rules

1. **No rectangular card borders.** Sections separated by 1px hairlines or whitespace. Depth comes from typographic weight contrast, not boxes.
2. **Typographic hierarchy as layout.** Huge Fraunces headlines anchor sections; Newsreader-style italic accents create contrast; mono labels float small.
3. **Orange used sparingly.** One or two orange elements per section.
4. **Wide margins, generous padding.** 40–60px horizontal padding desktop; content max-width ~1180px. Warmth comes from space, not decoration.
5. **Department lists = numbered rows + horizontal rules.** Never cards. Each department = one line: number, name, italic question, status text.

### 3.5 Animation System (Framer Motion)

| Animation | Trigger | Spec |
|---|---|---|
| **Page transition** | Every route change in `/app/*` | slide up 20px + fade; 0.4s ease-out |
| **Dept status update** | Org Room, as each dept completes | status text flips WAITING→RUNNING→COMPLETE; stagger 0.8s; pulse dot infinite 1.2s |
| **Hero entrance** | Homepage load | eyebrow → headline line 1 → line 2 → subtext → CTA; stagger 0.12s; y:30→0, fade; 0.6s each |
| **Money band count-up** | Homepage stat band enters viewport | numbers count up from 0 to value; 1.2s ease-out |
| **Opportunity cards** | Opportunity Board load | rows cascade from left, stagger 0.1s; decision chip springs in scale 0→1 |
| **Flow progress bar** | App shell top bar | thin orange line fills left-to-right per completed step; 0.5s spring |
| **Studio canvas** | Packaging Studio tab switch | content cross-fades 0.25s; generated text typewriters in ~20ms/char; images fade + scale 0.96→1 |

---

## 4. Application Architecture

**Option B — App Shell + Flow.**

```
/                     Homepage (marketing, standalone, no app shell)
/app/brief            Seller Brief          progress 20%
/app/org-room         AI Commerce Org Room  progress 40%
/app/board            Opportunity Board     progress 60%
/app/studio           Packaging Studio      progress 80%
/app/listing          Shopee Listing Studio progress 100%
```

- Homepage at `/` is a standalone marketing page.
- Everything under `/app/*` shares a **persistent shell**: a thin top bar with the
  logo, a 5-step indicator (Brief · Company · Board · Studio · Listing), and an
  orange progress bar that fills as the user advances.
- **State** lives in a Zustand store inside the shell, so every page reads the
  seller brief, org-room results, and the selected product without prop drilling.
- Framer Motion `AnimatePresence` handles animated transitions between steps.

### 4.1 Data Model (frontend, mock data for MVP)

The MVP runs on mock/static data shaped to match the eventual backend. Key shapes:

- **SellerBrief**: `target_market`, `target_platform` (fixed "Shopee"), `user_type`, `product_mode`, `category[]`, `user_keywords`, `budget_range`, `expected_margin`, `max_fulfillment_days`, `risk_preference`, `language_preference`.
- **DepartmentResult**: `department`, `agent`, `question`, `status`, `key_finding`, `score`, `evidence[]`, `output_preview` (department-specific fields per PRD §9).
- **Opportunity**: `product_name`, `product_direction`, `source_price`, `suggested_selling_price`, `gross_margin`, `net_profit`, `net_margin`, `available_stock`, `fulfillment_time`, `market_heat`, `risk_level`, `confidence_score`, `decision`, `key_reason`.
- **PackagingOutput**: `localized_shopee_title`, `selling_points[]`, `product_description`, `positioning_angle`, `bundle_strategy`, `gift_strategy`, `image_prompts[]`, image directions, `compliance_notes`, `price_uplift_reasoning`.
- **ShopeeListing**: full Shopee field set (`item_name`, `category_id`, `brand`, `condition`, `description`, `price`, `stock`, `sku`, `variation`, `attributes`, `logistics`, `package_weight`, `package_dimensions`, `images`, `compliance_notes`).

The demo case threaded through all pages is **Mini Desk Vacuum in Singapore**.

### 4.2 Images

Product imagery is required. For the MVP, use placeholder/stock images (e.g.
Unsplash) for product main image, lifestyle scene, and feature shots, with clearly
labeled slots so real generated images can drop in later. Image slots appear in
Packaging Studio (main / lifestyle / feature) and Listing Studio (preview).

---

## 5. Page Specifications

### Page 1 — Homepage (`/`)

Marketing page, standalone. Vertical sections:

1. **Nav** — logo `SeaLaunch AI` (Launch in orange italic), links (Platform, How it works, Pricing), primary pill CTA "Build my team".
2. **Hero** — eyebrow `SHOPEE SINGAPORE · BUILT FOR ONE SELLER`; ~96px Fraunces headline *"Zero-person company. Endless profit."* (Endless in orange italic); italic Fraunces subhead; orange pill CTA + secondary "watch a 90-second launch".
3. **Money stat band** — dark `#111` band, 4 stats with count-up: `5 products validated per run`, `SGD 14.90 avg price (from SGD 3.80 cost)`, `31% net margin after fees`, `11 min brief to launch pack`.
4. **Department flow** — "Six departments. One run." Numbered rows (01–06), each with dept name (Fraunces), italic question, status text. Demonstrates the pain→department story.
5. **Process flow strip** — Seller Brief → AI Commerce Co. → Opportunity Board → Packaging Studio → Shopee-ready Launch Pack.
6. **Footer CTA** — repeat primary CTA.

Animation: staggered hero entrance, money band count-up on scroll.

### Page 2 — Seller Brief (`/app/brief`)

App shell, progress 20%.

- Title "Tell your AI company what to find." + italic subhead "1–2 minutes. Your team starts immediately."
- **Form fields styled as underline inputs (no boxes):** Target Market (Singapore default), Platform (fixed Shopee badge in orange), Seller Type, Product Mode, Category (multi), Keywords, Budget Range, Margin Target (segmented), Fulfillment days, Risk Preference (segmented), Language.
- Primary CTA "Start AI Company Run →"; secondary "Use demo: Mini desk vacuum in Singapore".
- On submit → navigate to Org Room and kick off the (mock) run.

### Page 3 — AI Commerce Org Room (`/app/org-room`)

**The heart of the product.** App shell, progress 40%. Two-column:

- **Left** — AI company department list: numbered rows (Market, Sourcing, Margin, Risk, Listing, Committee) each with live status text. Clicking a department focuses it.
- **Right** — Department Output Stream: as each department completes, its block appears — dept name + status, italic one-sentence key finding, mono data line (key fields + score). The running department shows a dimmed "calculating…" block.
- Departments complete sequentially with staggered status flips and a pulsing running indicator. When all complete, advance affordance to Opportunity Board.

(Evidence Drawer / per-department deep detail is Phase 2 — the MVP shows the stream summary inline.)

### Page 4 — Opportunity Board (`/app/board`)

App shell, progress 60%.

- Header: "5 opportunities found." + meta line (`3 Go · 2 Watch · avg margin 28% · 1 risk flag`).
- **Table layout, no cards.** Columns: Product (name + direction), Source price, Suggested price, Margin, Risk, Decision chip (GO/WATCH).
- Demo rows: Mini Desk Vacuum (Go), Cable Organizer Set (Go), Portable Dehumidifier (Watch), Compact Steamer (Watch).
- Rows cascade in on load; decision chips spring in. Click a row → select that product and enter Packaging Studio.

### Page 5 — Packaging Studio (`/app/studio`)

App shell, progress 80%. Post-selection workspace, two-column:

- **Left sidebar** — tabs, each with a status dot: Product Brief, Shopee Title, Selling Points, Positioning, Bundle Strategy, Gift Strategy, Image Prompts, Main Image, Lifestyle Image, Feature Image, Listing Preview, Compliance Notes.
- **Right canvas** — live-generated content for the active tab: generated Shopee title (with char count + compliance note), ranked selling points, and an image direction row with three labeled image slots (Main / Lifestyle / Feature).
- Animation: tab switch cross-fades the canvas; generated text typewriters in; images fade + scale in.

### Page 6 — Shopee Listing Studio (`/app/listing`)

App shell, progress 100%. Two-column + action bar:

- **Left** — full Shopee field set as `key → value` rows (item_name, price, stock, category, description, pkg_weight, …) with inline edit / copy actions.
- **Right** — Shopee-style live preview: main image slot, title, orange price, bullet selling points.
- **Action bar** — primary "Download Launch Pack"; "Copy JSON"; "Export CSV"; "Mark as Approved".

---

## 6. Out of Scope (Phase 2)

Login / Entry, Product Signal Upload, Department Output Detail, Committee Review
(standalone), ROI / Check Dashboard. The data shapes above are designed so these
slot in later without rework.

---

## 7. Success Criteria

- A visitor lands on `/`, immediately grasps "an AI company that finds and launches profitable Shopee products for one seller," and the page feels bold and money-forward (not timid).
- A user can run the full demo flow `/app/brief → org-room → board → studio → listing` end to end on mock data, with animated transitions throughout.
- The Org Room reads as "a company's departments working," not a generic loading screen.
- Visual system is consistent: Fraunces + IBM Plex Mono + Hanken Grotesk, warm ivory + Shopee orange, no card borders, English only.
- Animations and image slots are present on every page that calls for them.
