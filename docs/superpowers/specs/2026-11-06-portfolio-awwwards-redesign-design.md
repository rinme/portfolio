# Awwwards-Standard Portfolio Redesign — Design Specification

**Subject:** Rinme (`https://me.rinme.me`)  
**Role:** Self-Taught Full-Stack Engineer  
**Date:** 2026-11-06  
**Status:** Approved by User  
**Art Direction Direction:** `name-as-monument` (with Editorial Pastel Pink Accent)  

---

## 1. Executive Summary & Goals

The objective is to redesign Rinme's personal portfolio from its previous generic Swiss-grid layout into an authentic, award-caliber (Awwwards Sites of the Day standard) digital experience.

### Key Goals:
1. **Authentic Persona & Inventory:** Replace sample data with Rinme's verified personal data, 7 shipped projects, 5+ years self-taught narrative, Bangkok origin, and real contact/social links.
2. **Monumental Typographic Art Direction:** Implement the `name-as-monument` design pattern featuring an oversized, single-line display wordmark ("RINME") spanning 94–98% of the viewport width with tight tracking and optical kerning, juxtaposed with the laconic `"yo"` headline and high-contrast editorial text.
3. **The "One Live Thing":** An interactive, real-time client-side **Live Edge Latency Probe** directly embedded in the hero, proving Rinme's mastery of low-latency systems and edge engineering upon first render.
4. **Editorial Pastel Pink Accent:** Infuse a sophisticated Japanese sakura / architectural pastel pink (`#F48BA9` daylight / `#FFAEC8` obsidian) against high-contrast carbon ink and warm daylight paper.
5. **Anti-Slop Craft Discipline:** Ban hairline grid patterns, 01/02 numbering tags, pill-shaped eyebrow labels, and card-in-card containers. Ensure all headings fit within a strict 2-line maximum across desktop, tablet, and mobile.
6. **Preserve Full-Stack Integration:** Keep the SvelteKit 2 (Svelte 5 runes) architecture, Bun runtime, Tailwind CSS v4 styling, and Drizzle ORM / SQLite Mini-CRM backend with live inquiry ingestion intact.

---

## 2. Subject Inventory & Authentic Profile

| Field | Value |
|---|---|
| **Display Name** | Rinme |
| **Role Title** | Self-Taught Full-Stack Engineer |
| **Headline** | yo |
| **Location** | Bangkok, TH |
| **Availability Status** | Open for full-stack commission |
| **Contact Email** | `rin@rinme.me` |
| **X / Twitter** | `https://x.com/rinmeskt` |
| **GitHub** | `https://github.com/rinme` |
| **Bio Narrative** | I've been learning to code on my own since I was a child, therefore my coding experience will be 5+ years. Now, I'm still learning to program, focusing on low-latency and full-stack web application development. |
| **Avatar** | Verified personal base64 JPEG photo with high-contrast grayscale filter and hover color bloom. |

### The 7 Verified Shipped Projects:
1. **Run** — High-performance, edge-first link management, delivery security & analytics platform.  
   *Tech:* SvelteKit 2 Runes, Vercel Edge, Turso (LibSQL), Upstash Redis, Tinybird.  
   *Links:* `https://github.com/rinme/run` · `https://run.rinme.me`
2. **Bangkok 50 Districts Tracker** — Mobile-first interactive explorer across all 50 official districts (*Khet*) of Bangkok.  
   *Tech:* Full-stack Web App, High-Precision Map Canvas, TypeScript.  
   *Links:* `https://github.com/rinme/bkkdmap` · `https://bkk.rinme.me/`
3. **Halfway** — Fairness-weighted venue & branch ranking map for two people to meet midway.  
   *Tech:* Nuxt, Vue, TypeScript, Geospatial Distance Optimization.  
   *Links:* `https://github.com/rinme/HalfWay` · `https://hw.rinme.me/`
4. **KMUTNB Student Council Reservation** — Meeting room booking system & official council contact channels.  
   *Tech:* Next.js, Prisma, Full-Stack Database Engine.  
   *Links:* `https://github.com/SC-KMUTNB/reservation` · `https://kmutnb.link/sc-reservation`
5. **Mood Sender** — Real-time private couple room PWA for gentle emotional presence.  
   *Tech:* Progressive Web App, WebSockets, Real-time Sync.  
   *Links:* `https://github.com/rinme/CoupleMood` · `https://cm.rinme.me/`
6. **ITD Website Renovation** — Modern bilingual rebuild of the ITD KMUTNB university portal.  
   *Tech:* Responsive Frontend, Bilingual Content Architecture, Accessibility.  
   *Links:* `https://github.com/rinme/itdre` · `https://itd.rinme.me/`
7. **Portfolio & Mini-CRM** — Full-stack personal platform with live lead ingestion.  
   *Tech:* SvelteKit 2 Runes, Bun, Tailwind CSS v4, Drizzle ORM, Turso / LibSQL.  
   *Links:* `https://github.com/rinme/portfolio` · `https://me.rinme.me/`

---

## 3. Visual System & Typography Tokens

### Typography Hierarchy:
- **Monument Wordmark:** `Space Grotesk` (Weight: 800), `clamp(4.5rem, 16vw, 15rem)`, line-height: `0.85`, tracking: `-0.055em`, optical kerning enabled. Anchored across viewport width without line break.
- **Section Headings:** `Space Grotesk` (Weight: 700), 32px–44px, line-height: `1.05`, tracking: `-0.03em`. Strict rule: 2 lines maximum at 1440px, 768px, and 390px widths.
- **Body & Standfirst Paragraphs:** `Plus Jakarta Sans` (Weight: 400/500), 16px–18px, line-height: `1.55`. Rendered in full-ink color.
- **Monospace Telemetry & Code:** `JetBrains Mono` strictly reserved for real code blocks, edge response timings (`14ms`), and HTTP status codes.

### Color Palette Tokens (Dual-Theme):
```css
/* Daylight Paper (Light Mode) */
:root {
  --bg-canvas: #fafaf9;
  --text-primary: #111215;
  --text-secondary: #4b525d;
  --text-tertiary: #7e8794;
  --surface-card: #ffffff;
  --surface-muted: #f2f3f5;
  --border-subtle: #e5e7eb;
  --border-strong: #111215;
  
  /* Editorial Pastel Pink */
  --accent: #f48ba9;
  --accent-hover: #e07292;
  --accent-subtle: rgba(244, 139, 169, 0.12);
  --accent-solid-text: #ffffff;
}

/* Obsidian Carbon (Dark Mode) */
:root.dark {
  --bg-canvas: #0b0c0e;
  --text-primary: #f4f5f7;
  --text-secondary: #9da3b0;
  --text-tertiary: #636b79;
  --surface-card: #121418;
  --surface-muted: #181b20;
  --border-subtle: #22262e;
  --border-strong: #f4f5f7;
  
  /* Luminous Pastel Pink */
  --accent: #ffaec8;
  --accent-hover: #ff94b4;
  --accent-subtle: rgba(255, 174, 200, 0.15);
  --accent-solid-text: #111215;
}
```

---

## 4. Component Architecture & Structural Layout

### 4.1 Header & Minimalist Navigation (`Navbar.svelte`)
- Zero glassmorphism/blurry pill bars.
- Left: Wordmark `RINME` with live status tag (pulsing pastel-pink dot + *"Open for full-stack commission"*).
- Center: Quiet navigation anchors (`#work`, `#capabilities`, `#career`, `#contact`).
- Right: Direct social icon buttons (X, GitHub), daylight/dark theme toggle, and primary CTA *"Initiate Inquiry"* (smooth pastel-pink fill on hover).

### 4.2 Hero Section (`Hero.svelte`)
- **Upper Asymmetric Narrative:**
  - Left: Headline **"yo"** set in 72px–88px bold display type.
  - Right: Authoritative standfirst bio:
    > *"Self-taught full-stack engineer based in Bangkok, TH. Coding since childhood with 5+ years of shipping. Focusing on low-latency web platforms, edge tools, and bespoke user experiences."*
- **Monument Baseline:**
  - Massive wordmark **RINME** spanning 94–98% of the viewport width.
  - Integrated personal profile photo (base64 verified image) with grayscale contrast filter blooming into full color on hover.
  - Location and channel tags: `Bangkok, TH (UTC+7)` · `X: @rinmeskt` · `GitHub: @rinme` · `rin@rinme.me`.
- **The "One Live Thing" — Embedded Live Edge Latency Probe:**
  - Embedded client-side component measuring browser-to-edge round-trip latency to regional clusters:
    - 🇹🇭 Bangkok (Local Node)
    - 🇸🇬 Singapore (Edge POP)
    - 🇯🇵 Tokyo (Regional Cluster)
  - Interactive "Re-ping Clusters" button with micro-motion.
  - Built with native Svelte 5 runes (`$state`, `$derived`), non-blocking, zero dependencies.

### 4.3 Work & Projects Section (`Projects.svelte`)
- Replaces generic 3-card grid with an **Editorial Specimen Spread**:
- **Discipline Filter Bar:** `All (7)` · `Edge & Low-Latency` · `Geospatial & Web Apps` · `Institutional`.
- **Tier 1: Flagship Architectural Spotlights:**
  - **Run:** Full-width split spread. Large project screenshot, sub-15ms edge routing callout, tech badges, live link (`run.rinme.me`), and GitHub repository.
  - **Bangkok 50 Districts Tracker:** Geospatial discovery map specimen, landmark tracking architecture, live link (`bkk.rinme.me`), and repository.
- **Tier 2: The High-Density Specimen Index:**
  - Dedicated entries for **Halfway**, **KMUTNB Reservation**, **Mood Sender**, **ITD Renovation**, and **Portfolio & Mini-CRM**.
  - High typographical contrast, one-line problem-and-solution statement, live URLs, and hover expansion revealing project preview stills framed in subtle pastel-pink highlights.

### 4.4 Capabilities Matrix (`Capabilities.svelte`)
- Organized into 4 clear technical groups:
  1. **Frontend & Interfaces:** TypeScript, JavaScript, Svelte, Nuxt, Vue, Astro, Flutter, HTML.
  2. **Systems & Backend:** Rust, Java, Python, C#, C++, PHP.
  3. **Storage, Edge & DevOps:** Docker, Shell, LibSQL / Turso, Upstash Redis, Tinybird, Vercel Edge.
  4. **Protocols & Tools:** Luau, Dart, Prisma, Drizzle ORM, WebSockets.
- Zero fake percentage bars or progress dials.
- Core languages (TypeScript, Svelte, Rust, Python, Docker) carry a discrete pastel-pink indicator pip.

### 4.5 Origin & Career Timeline (`Experience.svelte`)
- Origin marker: `Self-Taught Full-Stack Engineer` at `github.com/rinme` (2021 — Present).
- Narrative highlighting childhood coding roots, 2021 first GitHub commit, and 5+ years of autonomous shipping across edge systems and full-stack applications.
- Clean typographic rhythm with no arbitrary bullet icons.

### 4.6 Contact & Mini-CRM Leads Pipeline (`ContactForm.svelte`)
- Large direct contact headline with copyable mailto link: `rin@rinme.me`.
- Live Contact Form:
  - Fields: *Your Name*, *Your Email*, *Inquiry Type* (Full-Stack Commission, Edge Architecture, Technical Consultation), and *Message*.
  - Submits to `/api/contact`, inserting directly into the Drizzle SQLite database table `leads` with status `NEW`.
  - Visible in real-time in `/admin` pipeline.
  - Submit button with smooth pastel-pink active state.

### 4.7 Designed Footer Close (`Footer.svelte`)
- Returns the name **RINME** at full width in subtle low-contrast outline/muted scale.
- Location stamp: `Bangkok, Thailand (UTC+7)`.
- Link to Admin Control Plane (`/admin`).

---

## 5. Seed Data & Database Sync (`src/lib/db/seed.ts`)

Update `src/lib/db/seed.ts` so all 7 projects, Rinme's real bio, avatar, skills, and social channels are the default database state:
- Profile: Name `Rinme`, Role `Self-Taught Full-Stack Engineer`, Headline `yo`, Location `Bangkok, TH`, Availability `Open for full-stack commission.`, Email `rin@rinme.me`.
- Socials: Active channels for X/Twitter (`@rinmeskt`) and GitHub (`rinme`).
- Projects: 7 full projects with verified URLs, slugs, tags, and descriptions.
- Skills: 18 verified skills grouped across 4 disciplines.

---

## 6. Verification & Quality Gates

1. **Gate Verification via `inspect.mjs`:**
   - Execute `CHROME_PATH=/usr/bin/brave node scripts/inspect.mjs` at 1440px, 768px, and 390px viewports.
   - Requirement: **0 FAILs**.
   - Verify equal margins, no blank gaps > 0.5 viewport, two-line headline rule respected.
2. **Build & Type Check:**
   - `bun run check` (svelte-check) passes with 0 errors.
   - `bun run build` succeeds cleanly.
3. **Interactive Testing:**
   - Test Live Edge Latency Probe trigger.
   - Test daylight/obsidian theme toggle.
   - Test contact form submission end-to-end to `/api/contact` and verify appearance in `/admin`.
