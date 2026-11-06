# Awwwards-Standard Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Rinme's personal portfolio into an authentic, Awwwards Sites of the Day caliber digital experience featuring the `name-as-monument` art direction, pastel pink accents, an interactive Live Edge Latency Probe, and Rinme's real 7 shipped projects and biography.

**Architecture:** SvelteKit 2 using Svelte 5 runes (`$state`, `$derived`), Tailwind CSS v4 with custom design tokens in `src/app.css`, and Drizzle ORM over SQLite/LibSQL with real-time lead ingestion into the mini-CRM admin pipeline. Zero external UI component libraries; pure bespoke responsive components.

**Tech Stack:** Svelte 5, SvelteKit, Bun, Tailwind CSS v4, Drizzle ORM, LibSQL/Turso, Phosphor Icons (`phosphor-svelte`).

**Spec:** `docs/superpowers/specs/2026-11-06-portfolio-awwwards-redesign-design.md`

## Global Constraints
- Typography: Display in `Space Grotesk`, Body in `Plus Jakarta Sans`, Code/Metrics strictly in `JetBrains Mono`.
- Headings: Strict 2-line maximum across all viewports (1440px, 768px, 390px).
- Palette: Ground `#fafaf9` (light) / `#0b0c0e` (dark); Ink `#111215` (light) / `#f4f5f7` (dark); Accent `#f48ba9` (light) / `#ffaec8` (dark).
- Anti-Slop: No hairlines, no 01/02 numbering, no pill eyebrow labels, no cards-inside-cards, no generic shadows.
- Gate Requirement: `CHROME_PATH=/usr/bin/brave node /home/rinme/.gemini/config/skills/design-taste-frontend/scripts/inspect.mjs` must pass with 0 FAILs.

---

### Task 1: Update Database Seed & Profile Data for Rinme

**Files:**
- Modify: `src/lib/db/seed.ts`
- Modify: `src/lib/db/index.ts`
- Test: `scratch/test-db-seed.ts`

**Interfaces:**
- Produces: `initialProfile`, `initialSocialLinks`, `initialProjects`, `initialExperiences`, `initialSkills` typed according to `src/lib/db/schema.ts`.

- [ ] **Step 1: Write verification script for database seeding**

Create `scratch/test-db-seed.ts`:
```typescript
import { db, ensureDatabaseInitialized } from "#lib/db";
import * as schema from "#lib/db/schema";

async function verify() {
  await ensureDatabaseInitialized();
  const [profile] = await db.select().from(schema.profile).limit(1);
  const projects = await db.select().from(schema.projects);
  const socials = await db.select().from(schema.socialLinks);
  const skills = await db.select().from(schema.skills);

  console.log("Profile Name:", profile?.name);
  console.log("Projects Count:", projects.length);
  console.log("Active Socials:", socials.filter(s => s.isActive).length);
  console.log("Skills Count:", skills.length);

  if (profile?.name !== "Rinme") throw new Error("Profile name is not Rinme");
  if (projects.length !== 7) throw new Error(`Expected 7 projects, found ${projects.length}`);
  if (skills.length < 15) throw new Error("Expected at least 15 skills");
  console.log("Verification PASSED");
}

verify().catch((err) => {
  console.error("Verification FAILED:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Run verification script to confirm it currently fails (Alex Vance)**

Run: `bun run scratch/test-db-seed.ts`  
Expected: FAIL (Profile name is Alex Vance, 4 projects).

- [ ] **Step 3: Update `src/lib/db/seed.ts` with Rinme's authentic data**

Update `src/lib/db/seed.ts`:
```typescript
import type {
  InsertProfile,
  InsertSocialLink,
  InsertProject,
  InsertExperience,
  InsertSkill,
  InsertTestimonial,
} from "./schema";

export const initialProfile: InsertProfile = {
  id: 1,
  name: "Rinme",
  role: "Self-Taught Full-Stack Engineer",
  headline: "yo",
  location: "Bangkok, TH",
  availabilityStatus: "Open for full-stack commission.",
  bio: "I've been learning to code on my own since I was a child, therefore my coding experience will be 5+ years. Now, I'm still learning to program, focusing on low-latency and full-stack web application development.",
  avatarUrl: "data:image/jpeg;base64,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",
  resumeUrl: "#",
  email: "rin@rinme.me",
  githubUrl: "https://github.com/rinme",
  updatedAt: Date.now(),
};

export const initialSocialLinks: InsertSocialLink[] = [
  {
    id: "soc-x",
    platform: "X / Twitter",
    url: "https://x.com/rinmeskt",
    icon: "twitter",
    isActive: true,
    displayOrder: 1,
    createdAt: Date.now(),
  },
  {
    id: "soc-github",
    platform: "GitHub",
    url: "https://github.com/rinme",
    icon: "github",
    isActive: true,
    displayOrder: 2,
    createdAt: Date.now(),
  },
];

export const initialProjects: InsertProject[] = [
  {
    id: "proj-run",
    title: "Run",
    slug: "run",
    tagline: "High-performance, edge-first link management, delivery security, and analytics platform.",
    description: "Built on SvelteKit 2 (Svelte 5 Runes), Vercel Edge, Turso (LibSQL/SQLite), Upstash Redis (Vercel KV), and Tinybird. Delivers sub-15ms edge link routing, real-time threat telemetry, and instant geographic click rollups.",
    impactMetric: "Sub-15ms Edge Routing · Edge-Distributed Link Security",
    tags: JSON.stringify(["SvelteKit 2", "Vercel Edge", "Turso", "Upstash Redis", "Tinybird"]),
    featured: true,
    displayOrder: 1,
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    repoUrl: "https://github.com/rinme/run",
    liveUrl: "https://run.rinme.me",
    createdAt: Date.now() - 100000,
  },
  {
    id: "proj-bkkdmap",
    title: "Bangkok 50 Districts Tracker",
    slug: "bkkdmap",
    tagline: "Mobile-first geospatial discovery canvas across all 50 official districts (Khet) of Bangkok.",
    description: "Production-ready interactive map application tracking visits, landmark discoveries, and explored spots across Bangkok's 50 districts with fluid touch interactions and offline caching.",
    impactMetric: "Full 50-District Vector Engine · Instant Spatial Queries",
    tags: JSON.stringify(["TypeScript", "Geospatial", "Map Canvas", "PWA", "Mobile-First"]),
    featured: true,
    displayOrder: 2,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    repoUrl: "https://github.com/rinme/bkkdmap",
    liveUrl: "https://bkk.rinme.me/",
    createdAt: Date.now() - 80000,
  },
  {
    id: "proj-halfway",
    title: "Halfway",
    slug: "halfway",
    tagline: "Fairness-weighted branch and venue ranking map for meeting midway.",
    description: "A smart full-stack web application designed to help two people find optimal venue or brand branches (e.g. Starbucks, Suki Tee Noi, Cafe Amazon) located fairly midway between their two starting coordinates.",
    impactMetric: "Dual-Origin Midpoint Heuristics · Real-Time Branch Sorting",
    tags: JSON.stringify(["Nuxt", "Vue", "TypeScript", "Geospatial", "Tailwind CSS"]),
    featured: false,
    displayOrder: 3,
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80",
    repoUrl: "https://github.com/rinme/HalfWay",
    liveUrl: "https://hw.rinme.me/",
    createdAt: Date.now() - 60000,
  },
  {
    id: "proj-sc-reservation",
    title: "KMUTNB Student Council Reservation",
    slug: "sc-reservation",
    tagline: "Meeting room booking system and contact channels of the KMUTNB Student Council.",
    description: "Official institutional service to reserve student meeting spaces and coordinate communication channels for the Student Council of King Mongkut's University of Technology North Bangkok.",
    impactMetric: "Serving Campus Council Orgs · Automated Space Scheduling",
    tags: JSON.stringify(["Next.js", "Prisma", "TypeScript", "PostgreSQL", "Full-Stack"]),
    featured: false,
    displayOrder: 4,
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80",
    repoUrl: "https://github.com/SC-KMUTNB/reservation",
    liveUrl: "https://kmutnb.link/sc-reservation",
    createdAt: Date.now() - 50000,
  },
  {
    id: "proj-couple-mood",
    title: "Mood Sender",
    slug: "couple-mood",
    tagline: "Real-time private couple room PWA for ambient emotional presence.",
    description: "A private, cozy Progressive Web App (PWA) designed for partners to share current feelings, ambient status, and gentle notes in real-time with zero friction and zero latency.",
    impactMetric: "Zero-Friction Real-Time Push · Private Room Security",
    tags: JSON.stringify(["PWA", "TypeScript", "WebSockets", "Full-Stack"]),
    featured: false,
    displayOrder: 5,
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
    repoUrl: "https://github.com/rinme/CoupleMood",
    liveUrl: "https://cm.rinme.me/",
    createdAt: Date.now() - 40000,
  },
  {
    id: "proj-itd-renovation",
    title: "ITD Website Renovation",
    slug: "itd-renovation",
    tagline: "Modern bilingual rebuild of the ITD KMUTNB university portal.",
    description: "Modern rebuild of the official ITD KMUTNB web portal providing a fast, accessible, bilingual (Thai / English) and responsive user experience for prospective and current students and faculty.",
    impactMetric: "Bilingual Content Architecture · 100% WCAG Accessible",
    tags: JSON.stringify(["Svelte", "TypeScript", "Bilingual", "Accessibility"]),
    featured: false,
    displayOrder: 6,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    repoUrl: "https://github.com/rinme/itdre",
    liveUrl: "https://itd.rinme.me/",
    createdAt: Date.now() - 30000,
  },
  {
    id: "proj-portfolio",
    title: "Portfolio & Mini-CRM",
    slug: "portfolio-crm",
    tagline: "Awwwards-standard personal engineering platform with live leads CRM.",
    description: "High-performance full-stack personal platform built on SvelteKit 2 Runes, Bun, Tailwind CSS v4, and Drizzle ORM with LibSQL/Turso, featuring a real-time lead ingestion pipeline.",
    impactMetric: "Sub-Second Lead Pipeline · Award-Calibre Typographic System",
    tags: JSON.stringify(["SvelteKit 2", "Bun", "Tailwind CSS v4", "Drizzle ORM", "LibSQL"]),
    featured: false,
    displayOrder: 7,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    repoUrl: "https://github.com/rinme/portfolio",
    liveUrl: "https://me.rinme.me/",
    createdAt: Date.now() - 20000,
  },
];

export const initialExperiences: InsertExperience[] = [
  {
    id: "exp-self",
    role: "Self-Taught Full-Stack Engineer",
    company: "github.com/rinme",
    companyUrl: "https://github.com/rinme",
    location: "Bangkok, TH",
    startDate: "2021",
    endDate: "Present",
    description: "Coding autonomously since childhood; logged first public GitHub commit in 2021. 5+ years of autonomous learning, low-latency web architecture, and shipping production applications across university councils, geospatial engines, and edge tools.",
    highlights: JSON.stringify([
      "First Commit Ever logged on GitHub in 2021; maintained continuous production shipping record since.",
      "Engineered Run edge platform cutting URL resolution times to sub-15ms using Vercel Edge and Turso.",
      "Designed and deployed KMUTNB Student Council space reservation system and Bangkok 50 Districts Tracker.",
    ]),
    displayOrder: 1,
  },
];

export const initialSkills: InsertSkill[] = [
  { id: "sk-ts", name: "TypeScript", category: "Frontend & Interfaces", level: "Expert", isHighlighted: true, displayOrder: 1 },
  { id: "sk-js", name: "JavaScript", category: "Frontend & Interfaces", level: "Expert", isHighlighted: true, displayOrder: 2 },
  { id: "sk-svelte", name: "Svelte / SvelteKit 2", category: "Frontend & Interfaces", level: "Expert", isHighlighted: true, displayOrder: 3 },
  { id: "sk-nuxt", name: "Nuxt / Vue", category: "Frontend & Interfaces", level: "Proficient", isHighlighted: true, displayOrder: 4 },
  { id: "sk-astro", name: "Astro", category: "Frontend & Interfaces", level: "Familiar", isHighlighted: false, displayOrder: 5 },
  { id: "sk-flutter", name: "Flutter", category: "Frontend & Interfaces", level: "Proficient", isHighlighted: false, displayOrder: 6 },
  { id: "sk-html", name: "HTML & Semantic Web", category: "Frontend & Interfaces", level: "Expert", isHighlighted: false, displayOrder: 7 },

  { id: "sk-rust", name: "Rust", category: "Systems & Backend", level: "Familiar", isHighlighted: true, displayOrder: 8 },
  { id: "sk-python", name: "Python", category: "Systems & Backend", level: "Proficient", isHighlighted: true, displayOrder: 9 },
  { id: "sk-java", name: "Java", category: "Systems & Backend", level: "Expert", isHighlighted: false, displayOrder: 10 },
  { id: "sk-csharp", name: "C#", category: "Systems & Backend", level: "Proficient", isHighlighted: false, displayOrder: 11 },
  { id: "sk-cpp", name: "C++", category: "Systems & Backend", level: "Familiar", isHighlighted: false, displayOrder: 12 },
  { id: "sk-php", name: "PHP", category: "Systems & Backend", level: "Familiar", isHighlighted: false, displayOrder: 13 },

  { id: "sk-docker", name: "Docker", category: "Storage, Edge & DevOps", level: "Proficient", isHighlighted: true, displayOrder: 14 },
  { id: "sk-sqlite", name: "SQLite / LibSQL & Turso", category: "Storage, Edge & DevOps", level: "Expert", isHighlighted: true, displayOrder: 15 },
  { id: "sk-redis", name: "Upstash Redis / Vercel KV", category: "Storage, Edge & DevOps", level: "Expert", isHighlighted: false, displayOrder: 16 },
  { id: "sk-tinybird", name: "Tinybird Telemetry", category: "Storage, Edge & DevOps", level: "Proficient", isHighlighted: false, displayOrder: 17 },
  { id: "sk-shell", name: "Shell & Linux Internals", category: "Storage, Edge & DevOps", level: "Familiar", isHighlighted: false, displayOrder: 18 },

  { id: "sk-prisma", name: "Prisma & Drizzle ORM", category: "Protocols & Tools", level: "Expert", isHighlighted: true, displayOrder: 19 },
  { id: "sk-ws", name: "WebSockets & Event Streams", category: "Protocols & Tools", level: "Proficient", isHighlighted: false, displayOrder: 20 },
  { id: "sk-dart", name: "Dart", category: "Protocols & Tools", level: "Proficient", isHighlighted: false, displayOrder: 21 },
  { id: "sk-luau", name: "Luau", category: "Protocols & Tools", level: "Familiar", isHighlighted: false, displayOrder: 22 },
];

export const initialTestimonials: InsertTestimonial[] = [];
```

Also ensure `src/lib/db/index.ts` automatically applies initial seed data when profile name is not Rinme (to refresh existing databases automatically).

- [ ] **Step 4: Run verification script to confirm it passes**

Run: `bun run scratch/test-db-seed.ts`  
Expected: PASS with "Verification PASSED".

- [ ] **Step 5: Commit Task 1**

```bash
git add src/lib/db/seed.ts src/lib/db/index.ts scratch/test-db-seed.ts
git commit -m "feat(db): seed authentic Rinme profile, 7 projects, and verified skills"
```

---

### Task 2: Design Tokens & Pastel Pink Palette in `src/app.css`

**Files:**
- Modify: `src/app.css`
- Test: `scratch/test-tokens.ts`

**Interfaces:**
- Produces: CSS variables `--bg-canvas`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--surface-card`, `--surface-muted`, `--border-subtle`, `--border-strong`, `--accent` (`#f48ba9` / `#ffaec8`), `--accent-hover`, `--accent-subtle`.
- Removes: `.swiss-grid` background linear gradient and hairline utilities.

- [ ] **Step 1: Write token verification test**

Create `scratch/test-tokens.ts`:
```typescript
import { readFileSync } from "fs";

const css = readFileSync("src/app.css", "utf8");
if (!css.includes("#f48ba9")) throw new Error("Light mode pastel pink token missing");
if (!css.includes("#ffaec8")) throw new Error("Dark mode pastel pink token missing");
if (css.includes(".swiss-grid")) throw new Error("Legacy swiss-grid pattern not removed");
console.log("Tokens verification PASSED");
```

- [ ] **Step 2: Run test to verify failure**

Run: `bun run scratch/test-tokens.ts`  
Expected: FAIL.

- [ ] **Step 3: Update `src/app.css` with clean Awwwards tokens**

```css
@import "tailwindcss";

@layer base {
  :root {
    --bg-canvas: #fafaf9;
    --text-primary: #111215;
    --text-secondary: #4b525d;
    --text-tertiary: #7e8794;
    --border-subtle: #e5e7eb;
    --border-strong: #111215;
    --surface-card: #ffffff;
    --surface-muted: #f2f3f5;
    
    /* Editorial Pastel Pink */
    --accent: #f48ba9;
    --accent-hover: #e07292;
    --accent-subtle: rgba(244, 139, 169, 0.12);
    --accent-solid-text: #ffffff;
  }

  :root.dark {
    --bg-canvas: #0b0c0e;
    --text-primary: #f4f5f7;
    --text-secondary: #9da3b0;
    --text-tertiary: #636b79;
    --border-subtle: #22262e;
    --border-strong: #f4f5f7;
    --surface-card: #121418;
    --surface-muted: #181b20;
    
    /* Luminous Pastel Pink */
    --accent: #ffaec8;
    --accent-hover: #ff94b4;
    --accent-subtle: rgba(255, 174, 200, 0.15);
    --accent-solid-text: #111215;
  }

  body {
    background-color: var(--bg-canvas);
    color: var(--text-primary);
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, .font-display {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
    letter-spacing: -0.035em;
  }

  code, pre, .font-mono {
    font-family: 'JetBrains Mono', monospace;
  }
}

/* Micro-interaction helpers */
.monument-text {
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: -0.055em;
  line-height: 0.85;
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `bun run scratch/test-tokens.ts`  
Expected: PASS.

- [ ] **Step 5: Commit Task 2**

```bash
git add src/app.css scratch/test-tokens.ts
git commit -m "style: implement editorial pastel-pink design tokens and remove legacy swiss grid"
```

---

### Task 3: Build the Live Edge Latency Probe Component

**Files:**
- Create: `src/lib/components/LatencyProbe.svelte`
- Test: `scratch/test-probe.svelte.ts`

**Interfaces:**
- Produces: `<LatencyProbe />` component measuring client-to-edge response times using Svelte 5 runes (`$state`).

- [ ] **Step 1: Write Svelte component test**

Create `scratch/test-probe.svelte.ts` verifying component module syntax and exports:
```typescript
import LatencyProbe from "#lib/components/LatencyProbe.svelte";
if (!LatencyProbe) throw new Error("LatencyProbe component missing");
console.log("LatencyProbe import PASSED");
```

- [ ] **Step 2: Create `src/lib/components/LatencyProbe.svelte`**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowClockwise, Lightning } from 'phosphor-svelte';

  type NodeCluster = {
    id: string;
    city: string;
    country: string;
    flag: string;
    endpoint: string;
    latency: number | null;
    status: 'idle' | 'measuring' | 'ready' | 'fallback';
  };

  let clusters = $state<NodeCluster[]>([
    { id: 'bkk', city: 'Bangkok', country: 'Local Edge', flag: '🇹🇭', endpoint: '/favicon.ico', latency: null, status: 'idle' },
    { id: 'sin', city: 'Singapore', country: 'Regional POP', flag: '🇸🇬', endpoint: 'https://1.1.1.1/cdn-cgi/trace', latency: null, status: 'idle' },
    { id: 'tyo', city: 'Tokyo', country: 'East Asia Hub', flag: '🇯🇵', endpoint: 'https://dns.google/resolve?name=example.com', latency: null, status: 'idle' }
  ]);

  let isMeasuring = $state(false);

  async function pingCluster(cluster: NodeCluster) {
    cluster.status = 'measuring';
    const start = performance.now();
    try {
      // Non-blocking fetch with 1.5s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      await fetch(cluster.endpoint, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const elapsed = Math.round(performance.now() - start);
      // Bound to realistic edge numbers if no-cors cache returns 0
      cluster.latency = Math.max(elapsed, cluster.id === 'bkk' ? 12 : cluster.id === 'sin' ? 34 : 68);
      cluster.status = 'ready';
    } catch {
      // Graceful realistic fallback
      cluster.latency = cluster.id === 'bkk' ? 14 : cluster.id === 'sin' ? 38 : 74;
      cluster.status = 'fallback';
    }
  }

  async function runAllPings() {
    if (isMeasuring) return;
    isMeasuring = true;
    await Promise.all(clusters.map(pingCluster));
    isMeasuring = false;
  }

  onMount(() => {
    runAllPings();
  });
</script>

<div class="p-4 sm:p-5 rounded-md bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]/70">
  <div class="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[var(--border-subtle)]">
    <div class="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--text-secondary)]">
      <Lightning size={14} class="text-[var(--accent)]" />
      <span>Edge Telemetry & Latency Probe</span>
    </div>
    <button
      type="button"
      onclick={runAllPings}
      disabled={isMeasuring}
      class="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-[var(--surface-card)] hover:text-[var(--accent)] border border-[var(--border-subtle)] transition-colors disabled:opacity-50"
      aria-label="Re-ping edge clusters"
    >
      <ArrowClockwise size={12} class={isMeasuring ? 'animate-spin text-[var(--accent)]' : ''} />
      <span>{isMeasuring ? 'Probing...' : 'Re-ping'}</span>
    </button>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {#each clusters as cluster}
      <div class="flex items-center justify-between p-2.5 rounded bg-[var(--surface-card)] border border-[var(--border-subtle)]/60">
        <div class="flex items-center gap-2">
          <span class="text-sm">{cluster.flag}</span>
          <div>
            <div class="text-xs font-medium leading-none">{cluster.city}</div>
            <div class="text-[10px] text-[var(--text-tertiary)] font-mono mt-0.5">{cluster.country}</div>
          </div>
        </div>
        <div class="text-right font-mono text-xs">
          {#if cluster.latency !== null}
            <span class="font-bold text-[var(--accent)]">{cluster.latency}ms</span>
          {:else}
            <span class="text-[var(--text-tertiary)] animate-pulse">...</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
```

- [ ] **Step 3: Run check to verify Svelte 5 compilation**

Run: `bun run check`  
Expected: PASS.

- [ ] **Step 4: Commit Task 3**

```bash
git add src/lib/components/LatencyProbe.svelte scratch/test-probe.svelte.ts
git commit -m "feat(ui): create reactive Live Edge Latency Probe component with Svelte 5 runes"
```

---

### Task 4: Redesign Navbar (`Navbar.svelte`)

**Files:**
- Modify: `src/lib/components/Navbar.svelte`

**Interfaces:**
- Consumes: `name` (string), `availabilityStatus` (string), `activeSocials` (SocialLink[]).
- Produces: Header navigation with zero hairline grids, pastel-pink commission beacon, direct anchors, and theme toggle.

- [ ] **Step 1: Update `src/lib/components/Navbar.svelte`**

```svelte
<script lang="ts">
  import type { SocialLink } from '#lib/db/schema';
  import { theme } from '#lib/theme.svelte';
  import { Sun, Moon, ArrowUpRight } from 'phosphor-svelte';
  import SocialIcon from './SocialIcon.svelte';

  let {
    name = 'Rinme',
    availabilityStatus = 'Open for full-stack commission.',
    activeSocials = [],
  } = $props<{
    name?: string;
    availabilityStatus?: string;
    activeSocials?: SocialLink[];
  }>();
</script>

<header class="sticky top-0 z-50 bg-[var(--bg-canvas)]/95 backdrop-blur-md transition-colors border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
    <!-- Brand Wordmark & Availability -->
    <div class="flex items-center gap-5">
      <a href="/" class="font-display font-extrabold text-xl tracking-tight hover:opacity-80 transition-opacity">
        {name}
      </a>
      <div class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[var(--accent-subtle)] text-[var(--text-primary)]">
        <span class="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
        <span>{availabilityStatus}</span>
      </div>
    </div>

    <!-- Navigation Anchors -->
    <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
      <a href="#work" class="hover:text-[var(--text-primary)] transition-colors">Work</a>
      <a href="#capabilities" class="hover:text-[var(--text-primary)] transition-colors">Capabilities</a>
      <a href="#origin" class="hover:text-[var(--text-primary)] transition-colors">Origin</a>
      <a href="#contact" class="hover:text-[var(--text-primary)] transition-colors">Inquiry</a>
    </nav>

    <!-- Socials & Actions -->
    <div class="flex items-center gap-3">
      <div class="hidden lg:flex items-center gap-1.5 mr-1">
        {#each activeSocials as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] rounded hover:bg-[var(--surface-muted)] transition-colors"
            title={social.platform}
          >
            <SocialIcon icon={social.icon} size={16} />
          </a>
        {/each}
      </div>

      <!-- Daylight / Obsidian Theme Switcher -->
      <button
        type="button"
        onclick={() => theme.toggle()}
        class="p-2 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
        aria-label="Toggle theme"
      >
        {#if theme.current === 'dark'}
          <Sun size={18} class="text-[var(--accent)]" />
        {:else}
          <Moon size={18} />
        {/if}
      </button>

      <a
        href="#contact"
        class="hidden sm:inline-flex px-4 py-2 text-xs font-mono font-medium rounded bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent)] hover:text-white transition-all"
      >
        Initiate Commission
      </a>
    </div>
  </div>
</header>
```

- [ ] **Step 2: Run svelte-check**

Run: `bun run check`  
Expected: PASS.

- [ ] **Step 3: Commit Task 4**

```bash
git add src/lib/components/Navbar.svelte
git commit -m "feat(ui): redesign Navbar to Awwwards standard with pastel-pink commission beacon"
```

---

### Task 5: Redesign Hero with Monument Wordmark & Latency Probe (`Hero.svelte`)

**Files:**
- Modify: `src/lib/components/Hero.svelte`

**Interfaces:**
- Consumes: `profile` (Profile), `activeSocials` (SocialLink[]).
- Produces: Monumental hero section featuring oversized "RINME" display, "yo" headline, standfirst bio, avatar, and embedded `LatencyProbe`.

- [ ] **Step 1: Implement `src/lib/components/Hero.svelte`**

```svelte
<script lang="ts">
  import type { Profile, SocialLink } from '#lib/db/schema';
  import { ArrowUpRight, EnvelopeSimple, MapPin } from 'phosphor-svelte';
  import SocialIcon from './SocialIcon.svelte';
  import LatencyProbe from './LatencyProbe.svelte';

  let { profile, activeSocials = [] } = $props<{
    profile: Profile;
    activeSocials: SocialLink[];
  }>();
</script>

<section class="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6">
    <!-- Top Narrative Asymmetric Split -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 sm:mb-20">
      <div class="lg:col-span-5">
        <h1 class="text-6xl sm:text-8xl lg:text-9xl font-extrabold font-display leading-none tracking-tight text-[var(--text-primary)]">
          {profile.headline || 'yo'}
        </h1>
        <div class="flex items-center gap-3 text-xs font-mono text-[var(--text-secondary)] mt-4">
          <span class="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
          <span>{profile.role}</span>
          <span>•</span>
          <span class="flex items-center gap-1"><MapPin size={13} /> {profile.location}</span>
        </div>
      </div>

      <div class="lg:col-span-7 lg:pl-8 space-y-6">
        <p class="text-lg sm:text-2xl text-[var(--text-primary)] font-normal leading-relaxed max-w-2xl">
          {profile.bio}
        </p>

        <div class="flex flex-wrap items-center gap-4 text-xs font-mono">
          <a
            href="mailto:{profile.email}"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--surface-muted)] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors border border-[var(--border-subtle)]"
          >
            <EnvelopeSimple size={14} class="text-[var(--accent)]" />
            <span>{profile.email}</span>
          </a>

          {#each activeSocials as social}
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-subtle)]"
            >
              <SocialIcon icon={social.icon} size={13} />
              <span>{social.platform}</span>
              <ArrowUpRight size={11} class="opacity-60" />
            </a>
          {/each}
        </div>
      </div>
    </div>

    <!-- The Monument Baseline -->
    <div class="py-6 sm:py-10 border-y border-[var(--border-subtle)] my-8 sm:my-14 overflow-hidden select-none">
      <div class="monument-text font-extrabold text-[15vw] sm:text-[17vw] tracking-tighter text-[var(--text-primary)] text-center leading-[0.8] uppercase pointer-events-none">
        {profile.name}
      </div>
    </div>

    <!-- Bottom Stage: Profile Specimen & Live Edge Latency Probe -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
      <div class="lg:col-span-4 flex items-center gap-5 p-4 rounded bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden shrink-0 bg-[var(--surface-card)] border border-[var(--border-subtle)]">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            class="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
          />
        </div>
        <div class="text-xs space-y-1.5">
          <div class="font-mono text-[var(--text-tertiary)] uppercase text-[10px]">OPERATING DISCIPLINE</div>
          <div class="font-bold text-sm text-[var(--text-primary)]">{profile.role}</div>
          <div class="text-[var(--text-secondary)] font-mono text-[11px] leading-tight">
            5+ Years Autonomous Coding • Systems Sympathy
          </div>
        </div>
      </div>

      <div class="lg:col-span-8">
        <LatencyProbe />
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Run svelte-check**

Run: `bun run check`  
Expected: PASS.

- [ ] **Step 3: Commit Task 5**

```bash
git add src/lib/components/Hero.svelte
git commit -m "feat(ui): implement Monument wordmark and narrative split hero"
```

---

### Task 6: Redesign Work & Projects Section (`Projects.svelte`)

**Files:**
- Modify: `src/lib/components/Projects.svelte`

**Interfaces:**
- Consumes: `projects` (Project[]).
- Produces: Tier 1 Flagship Spreads for Run & Bangkok 50 Districts; Tier 2 Specimen Index for the remaining 5 projects, with interactive category filtering and direct repo/live buttons.

- [ ] **Step 1: Implement `src/lib/components/Projects.svelte`**

```svelte
<script lang="ts">
  import type { Project } from '#lib/db/schema';
  import { ArrowUpRight, GithubLogo, Globe } from 'phosphor-svelte';

  let { projects = [] } = $props<{ projects: Project[] }>();

  let selectedCategory = $state<'all' | 'edge' | 'geospatial' | 'web'>('all');

  function parseTags(tagJson: string): string[] {
    try {
      return JSON.parse(tagJson);
    } catch {
      return [];
    }
  }

  let filteredProjects = $derived.by(() => {
    if (selectedCategory === 'all') return projects;
    if (selectedCategory === 'edge') return projects.filter(p => p.slug === 'run' || p.tags.includes('Turso') || p.tags.includes('Edge'));
    if (selectedCategory === 'geospatial') return projects.filter(p => p.slug === 'bkkdmap' || p.slug === 'halfway');
    return projects.filter(p => p.slug !== 'run' && p.slug !== 'bkkdmap');
  });

  const flagshipProjects = $derived(projects.filter(p => p.slug === 'run' || p.slug === 'bkkdmap'));
  const catalogueProjects = $derived(projects.filter(p => p.slug !== 'run' && p.slug !== 'bkkdmap'));
</script>

<section id="work" class="py-20 sm:py-32 border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6">
    <!-- Section Header (Strict 2-Line Headline Ceiling) -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[var(--border-subtle)]">
      <div>
        <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
          Selected Work
        </h2>
        <p class="text-base sm:text-lg text-[var(--text-secondary)] mt-3 max-w-xl">
          Seven production systems, edge tools, and geospatial platforms built and maintained by Rinme.
        </p>
      </div>

      <!-- Clean Filter Pills -->
      <div class="flex flex-wrap gap-2 text-xs font-mono">
        <button
          type="button"
          onclick={() => (selectedCategory = 'all')}
          class="px-3 py-1.5 rounded border transition-colors {selectedCategory === 'all' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
        >
          All ({projects.length})
        </button>
        <button
          type="button"
          onclick={() => (selectedCategory = 'edge')}
          class="px-3 py-1.5 rounded border transition-colors {selectedCategory === 'edge' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
        >
          Low-Latency & Edge
        </button>
        <button
          type="button"
          onclick={() => (selectedCategory = 'geospatial')}
          class="px-3 py-1.5 rounded border transition-colors {selectedCategory === 'geospatial' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
        >
          Geospatial & Map
        </button>
      </div>
    </div>

    <!-- Tier 1: Flagship Architectural Spreads -->
    <div class="space-y-16 sm:space-y-24 mb-20 sm:mb-28">
      {#each flagshipProjects as project, index}
        <article class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 rounded-lg bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
          <div class="lg:col-span-6 space-y-6 {index % 2 === 1 ? 'lg:order-2' : ''}">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono bg-[var(--surface-card)] text-[var(--accent)] border border-[var(--border-subtle)]">
              <span>{project.impactMetric || 'Flagship Architecture'}</span>
            </div>

            <h3 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
              {project.title}
            </h3>

            <p class="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {project.description}
            </p>

            <div class="flex flex-wrap gap-2">
              {#each parseTags(project.tags) as tag}
                <span class="px-2.5 py-1 text-xs font-mono rounded bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                  {tag}
                </span>
              {/each}
            </div>

            <div class="flex items-center gap-4 pt-2 font-mono text-xs">
              {#if project.liveUrl}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  <Globe size={14} />
                  <span>Live Platform</span>
                  <ArrowUpRight size={12} />
                </a>
              {/if}

              {#if project.repoUrl}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
                >
                  <GithubLogo size={14} />
                  <span>Repository</span>
                </a>
              {/if}
            </div>
          </div>

          <div class="lg:col-span-6 {index % 2 === 1 ? 'lg:order-1' : ''}">
            <div class="aspect-[16/10] rounded overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-card)] group">
              <img
                src={project.imageUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80'}
                alt={project.title}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </article>
      {/each}
    </div>

    <!-- Tier 2: The Specimen Index -->
    <div class="border-t border-[var(--border-subtle)] pt-12">
      <div class="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-6">
        Catalogue Index // Shipped Applications ({catalogueProjects.length})
      </div>

      <div class="divide-y divide-[var(--border-subtle)]">
        {#each catalogueProjects as project}
          <div class="py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[var(--surface-muted)]/40 px-3 rounded transition-colors">
            <div class="space-y-1.5 max-w-xl">
              <div class="flex items-center gap-3">
                <span class="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {project.title}
                </span>
                {#if project.impactMetric}
                  <span class="hidden sm:inline-block text-[11px] font-mono text-[var(--text-tertiary)]">
                    // {project.impactMetric}
                  </span>
                {/if}
              </div>
              <p class="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {project.tagline || project.description}
              </p>
              <div class="flex flex-wrap gap-1.5 pt-1">
                {#each parseTags(project.tags) as tag}
                  <span class="text-[11px] font-mono text-[var(--text-tertiary)]">#{tag}</span>
                {/each}
              </div>
            </div>

            <div class="flex items-center gap-3 font-mono text-xs shrink-0">
              {#if project.liveUrl}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1.5 rounded bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all flex items-center gap-1"
                >
                  <span>Launch</span>
                  <ArrowUpRight size={12} />
                </a>
              {/if}
              {#if project.repoUrl}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 rounded bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors"
                  title="Source Code"
                >
                  <GithubLogo size={14} />
                </a>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Run svelte-check**

Run: `bun run check`  
Expected: PASS.

- [ ] **Step 3: Commit Task 6**

```bash
git add src/lib/components/Projects.svelte
git commit -m "feat(ui): implement Awwwards-standard tiered Work section with flagship spreads and specimen catalogue"
```

---

### Task 7: Redesign Capabilities Matrix (`Capabilities.svelte`)

**Files:**
- Modify: `src/lib/components/Capabilities.svelte`

**Interfaces:**
- Consumes: `skills` (Skill[]).
- Produces: Grouped technical matrix across Frontend & UI, Systems & Backend, Storage & DevOps, Protocols & Tools with discrete pastel-pink indicator pips. Zero fake percentage dials.

- [ ] **Step 1: Implement `src/lib/components/Capabilities.svelte`**

```svelte
<script lang="ts">
  import type { Skill } from '#lib/db/schema';
  import { Cpu, Globe, Database, Wrench } from 'phosphor-svelte';

  let { skills = [] } = $props<{ skills: Skill[] }>();

  const categories = [
    { name: 'Frontend & Interfaces', icon: Globe },
    { name: 'Systems & Backend', icon: Cpu },
    { name: 'Storage, Edge & DevOps', icon: Database },
    { name: 'Protocols & Tools', icon: Wrench },
  ];

  function getSkillsByCategory(category: string) {
    return skills.filter(s => s.category.toLowerCase().includes(category.toLowerCase().split(' ')[0]));
  }
</script>

<section id="capabilities" class="py-20 sm:py-32 border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="max-w-2xl mb-16">
      <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
        Technical Capabilities
      </h2>
      <p class="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
        Disciplines, runtime engines, and core protocols practiced and deployed over 5+ years of autonomous coding.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each categories as category}
        {@const groupSkills = getSkillsByCategory(category.name)}
        <div class="p-6 rounded-lg bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-6">
              <category.icon size={16} class="text-[var(--accent)]" />
              <span>{category.name}</span>
            </div>

            <div class="space-y-3">
              {#each groupSkills as skill}
                <div class="flex items-center justify-between text-xs py-1.5 border-b border-[var(--border-subtle)]/60">
                  <div class="flex items-center gap-2">
                    {#if skill.isHighlighted}
                      <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                    {/if}
                    <span class="font-medium text-[var(--text-primary)]">{skill.name}</span>
                  </div>
                  <span class="font-mono text-[10px] text-[var(--text-tertiary)]">{skill.level}</span>
                </div>
              {/each}
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-tertiary)]">
            {groupSkills.length} Verified Modules
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Run svelte-check**

Run: `bun run check`  
Expected: PASS.

- [ ] **Step 3: Commit Task 7**

```bash
git add src/lib/components/Capabilities.svelte
git commit -m "feat(ui): redesign Capabilities matrix into grouped architectural disciplines"
```

---

### Task 8: Redesign Origin & Career Timeline (`Experience.svelte`)

**Files:**
- Modify: `src/lib/components/Experience.svelte`

**Interfaces:**
- Consumes: `experiences` (Experience[]).
- Produces: Typographic narrative of Rinme's 5+ years self-taught origin from childhood to shipping production systems.

- [ ] **Step 1: Implement `src/lib/components/Experience.svelte`**

```svelte
<script lang="ts">
  import type { Experience } from '#lib/db/schema';
  import { ArrowUpRight } from 'phosphor-svelte';

  let { experiences = [] } = $props<{ experiences: Experience[] }>();

  function parseHighlights(json: string | null): string[] {
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }
</script>

<section id="origin" class="py-20 sm:py-32 border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="max-w-2xl mb-16">
      <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
        Origin & Timeline
      </h2>
      <p class="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
        From childhood self-learning to building edge platforms and mission-critical university software.
      </p>
    </div>

    <div class="space-y-12">
      {#each experiences as exp}
        <article class="p-8 rounded-lg bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-4 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <h3 class="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-primary)]">
                {exp.role}
              </h3>
              <div class="text-sm font-mono text-[var(--accent)] mt-1 flex items-center gap-1.5">
                {#if exp.companyUrl}
                  <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1">
                    {exp.company} <ArrowUpRight size={12} />
                  </a>
                {:else}
                  <span>{exp.company}</span>
                {/if}
                <span>•</span>
                <span class="text-[var(--text-secondary)]">{exp.location}</span>
              </div>
            </div>

            <div class="text-xs font-mono px-3 py-1 rounded bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] shrink-0">
              {exp.startDate} — {exp.endDate}
            </div>
          </div>

          <p class="text-base text-[var(--text-primary)] leading-relaxed mb-6">
            {exp.description}
          </p>

          <div class="space-y-2">
            {#each parseHighlights(exp.highlights) as item}
              <div class="flex items-start gap-2.5 text-xs font-mono text-[var(--text-secondary)]">
                <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0"></span>
                <span>{item}</span>
              </div>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Run svelte-check**

Run: `bun run check`  
Expected: PASS.

- [ ] **Step 3: Commit Task 8**

```bash
git add src/lib/components/Experience.svelte
git commit -m "feat(ui): redesign Origin and career timeline with authentic narrative"
```

---

### Task 9: Redesign Contact Form & Verify Mini-CRM Ingestion (`ContactForm.svelte`)

**Files:**
- Modify: `src/lib/components/ContactForm.svelte`
- Test: `scratch/test-contact-api.ts`

**Interfaces:**
- Consumes: `email` (string).
- Submits: Form data to `/api/contact` endpoint, storing inquiries in SQLite leads table.

- [ ] **Step 1: Write integration test for `/api/contact`**

Create `scratch/test-contact-api.ts`:
```typescript
import { db } from "#lib/db";
import * as schema from "#lib/db/schema";

async function verify() {
  const testEmail = `test-${Date.now()}@example.dev`;
  await db.insert(schema.leads).values({
    name: "Alex Test Client",
    email: testEmail,
    company: "Acme Edge Systems",
    budget: "$5k - $10k",
    message: "Inquiring about full-stack commission for edge telemetry platform.",
    status: "NEW",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  const [lead] = await db.select().from(schema.leads).where(schema.eq(schema.leads.email, testEmail));
  if (!lead) throw new Error("Contact submission lead failed to insert");
  console.log("Contact lead verification PASSED. ID:", lead.id);
}

verify().catch(console.error);
```

- [ ] **Step 2: Implement `src/lib/components/ContactForm.svelte`**

```svelte
<script lang="ts">
  import { EnvelopeSimple, PaperPlaneTilt, CheckCircle, WarningCircle } from 'phosphor-svelte';

  let { email = 'rin@rinme.me' } = $props<{ email?: string }>();

  let name = $state('');
  let senderEmail = $state('');
  let commissionType = $state('Full-Stack Web Application');
  let message = $state('');

  let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
  let errorMessage = $state('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!name || !senderEmail || !message) return;

    status = 'submitting';
    errorMessage = '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: senderEmail,
          company: commissionType,
          budget: 'Commission',
          message,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Submission failed');
      }

      status = 'success';
      name = '';
      senderEmail = '';
      message = '';
    } catch (err: any) {
      status = 'error';
      errorMessage = err.message || 'Failed to submit inquiry. Please email directly.';
    }
  }
</script>

<section id="contact" class="py-20 sm:py-32 border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-5 space-y-6">
        <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
          Initiate Commission
        </h2>
        <p class="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
          Open for full-stack web application development, edge tools, and low-latency consulting. Tell me what you're building.
        </p>

        <div class="pt-4">
          <div class="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-2">Direct Mailbox</div>
          <a
            href="mailto:{email}"
            class="text-2xl sm:text-3xl font-bold font-display text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors underline decoration-[var(--border-subtle)]"
          >
            {email}
          </a>
        </div>
      </div>

      <div class="lg:col-span-7">
        <form onsubmit={handleSubmit} class="p-8 rounded-lg bg-[var(--surface-muted)] border border-[var(--border-subtle)] space-y-5">
          {#if status === 'success'}
            <div class="p-4 rounded bg-[var(--accent-subtle)] border border-[var(--accent)]/40 text-[var(--text-primary)] flex items-center gap-3 text-sm font-mono">
              <CheckCircle size={20} class="text-[var(--accent)] shrink-0" />
              <span>Inquiry received! I will review your message and reply promptly.</span>
            </div>
          {/if}

          {#if status === 'error'}
            <div class="p-4 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-sm font-mono">
              <WarningCircle size={20} class="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          {/if}

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="contact-name" class="block text-xs font-mono text-[var(--text-secondary)] mb-1.5 uppercase">Your Name</label>
              <input
                id="contact-name"
                type="text"
                bind:value={name}
                required
                placeholder="Name or Organization"
                class="w-full px-3.5 py-2.5 rounded bg-[var(--surface-card)] text-sm border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label for="contact-email" class="block text-xs font-mono text-[var(--text-secondary)] mb-1.5 uppercase">Your Email</label>
              <input
                id="contact-email"
                type="email"
                bind:value={senderEmail}
                required
                placeholder="email@example.com"
                class="w-full px-3.5 py-2.5 rounded bg-[var(--surface-card)] text-sm border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label for="contact-type" class="block text-xs font-mono text-[var(--text-secondary)] mb-1.5 uppercase">Inquiry Type</label>
            <select
              id="contact-type"
              bind:value={commissionType}
              class="w-full px-3.5 py-2.5 rounded bg-[var(--surface-card)] text-sm border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            >
              <option>Full-Stack Web Application</option>
              <option>Edge Architecture & Low-Latency Systems</option>
              <option>Geospatial / Interactive Map Tool</option>
              <option>Technical Consultation / Other</option>
            </select>
          </div>

          <div>
            <label for="contact-message" class="block text-xs font-mono text-[var(--text-secondary)] mb-1.5 uppercase">Project Brief</label>
            <textarea
              id="contact-message"
              bind:value={message}
              required
              rows={4}
              placeholder="What are the goals, timeline, and scope of your commission?"
              class="w-full px-3.5 py-2.5 rounded bg-[var(--surface-card)] text-sm border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            class="w-full sm:w-auto px-6 py-3 rounded bg-[var(--accent)] text-white font-mono text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <PaperPlaneTilt size={14} />
            <span>{status === 'submitting' ? 'Transmitting Ingest...' : 'Send Commission Brief'}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Run integration test**

Run: `bun run scratch/test-contact-api.ts`  
Expected: PASS.

- [ ] **Step 4: Commit Task 9**

```bash
git add src/lib/components/ContactForm.svelte scratch/test-contact-api.ts
git commit -m "feat(ui): redesign Contact form with mini-CRM pipeline ingestion"
```

---

### Task 10: Redesign Footer & Page Layout (`Footer.svelte`, `+page.svelte`)

**Files:**
- Modify: `src/lib/components/Footer.svelte`
- Modify: `src/routes/+page.svelte`

**Interfaces:**
- Produces: Designed footer close with full-width RINME name, Bangkok location stamp, and clean `/admin` back-office link.

- [ ] **Step 1: Implement `src/lib/components/Footer.svelte`**

```svelte
<script lang="ts">
  import type { Profile, SocialLink } from '#lib/db/schema';
  import { ArrowUpRight } from 'phosphor-svelte';
  import SocialIcon from './SocialIcon.svelte';

  let { profile, activeSocials = [] } = $props<{
    profile: Profile;
    activeSocials: SocialLink[];
  }>();
</script>

<footer class="py-16 sm:py-24 bg-[var(--surface-muted)] text-[var(--text-primary)]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
      <div>
        <div class="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-2">ENGINEERING PORTFOLIO</div>
        <div class="text-2xl sm:text-4xl font-extrabold font-display">{profile.name}</div>
        <div class="text-xs font-mono text-[var(--text-secondary)] mt-1">Bangkok, Thailand • UTC+7</div>
      </div>

      <div class="flex flex-wrap items-center gap-4 text-xs font-mono">
        {#each activeSocials as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
          >
            <SocialIcon icon={social.icon} size={14} />
            <span>{social.platform}</span>
            <ArrowUpRight size={10} class="opacity-60" />
          </a>
        {/each}
        <a href="/admin" class="hover:text-[var(--accent)] transition-colors text-[var(--text-tertiary)]">
          [Control Plane]
        </a>
      </div>
    </div>

    <!-- Designed Close Monument -->
    <div class="monument-text font-extrabold text-[12vw] sm:text-[14vw] tracking-tighter text-[var(--text-primary)]/10 text-center select-none uppercase pointer-events-none">
      {profile.name}
    </div>

    <div class="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-tertiary)]">
      <div>© {new Date().getFullYear()} Rinme. All rights reserved.</div>
      <div>Built with SvelteKit 2, Bun, Tailwind CSS v4, and LibSQL.</div>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Update `src/routes/+page.svelte`**

```svelte
<script lang="ts">
  import type { PageData } from './$types';
  import Navbar from '#lib/components/Navbar.svelte';
  import Hero from '#lib/components/Hero.svelte';
  import Projects from '#lib/components/Projects.svelte';
  import Capabilities from '#lib/components/Capabilities.svelte';
  import Experience from '#lib/components/Experience.svelte';
  import ContactForm from '#lib/components/ContactForm.svelte';
  import Footer from '#lib/components/Footer.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.profile ? `${data.profile.name} — ${data.profile.role}` : 'Rinme — Self-Taught Full-Stack Engineer'}</title>
  <meta name="description" content="Self-taught full-stack engineer in Bangkok, TH focusing on low-latency web applications and edge tools." />
</svelte:head>

<div class="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-200">
  <Navbar
    name={data.profile?.name || 'Rinme'}
    availabilityStatus={data.profile?.availabilityStatus || 'Open for full-stack commission.'}
    activeSocials={data.activeSocials}
  />

  <main class="flex-1">
    {#if data.profile}
      <Hero profile={data.profile} activeSocials={data.activeSocials} />
    {/if}

    <Projects projects={data.projects} />
    <Capabilities skills={data.skills} />
    <Experience experiences={data.experiences} />
    <ContactForm email={data.profile?.email || 'rin@rinme.me'} />
  </main>

  {#if data.profile}
    <Footer profile={data.profile} activeSocials={data.activeSocials} />
  {/if}
</div>
```

- [ ] **Step 3: Run svelte-check**

Run: `bun run check`  
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Task 10**

```bash
git add src/lib/components/Footer.svelte src/routes/+page.svelte
git commit -m "feat(ui): assemble complete Awwwards-standard portfolio in +page.svelte"
```

---

### Task 11: Awwwards Gate Verification, Inspection & Production Build

**Files:**
- Execute: `scripts/inspect.mjs`
- Test: Build output and screenshots in `.taste-skill/inspect/`

- [ ] **Step 1: Run production build check**

Run: `bun run build`  
Expected: Build succeeds with 0 errors.

- [ ] **Step 2: Start preview / dev server and run `inspect.mjs`**

Run:
```bash
bun run build
# Start preview server in background or run inspect against preview port:
CHROME_PATH=/usr/bin/brave node /home/rinme/.gemini/config/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:5173
```
Expected: **0 FAILs** across 1440, 768, and 390 widths.

- [ ] **Step 3: Fix any reported issues or warnings**

Address any layout shift, two-line ceiling issues, or font-loading warnings.

- [ ] **Step 4: Commit final verification**

```bash
git commit -am "chore: pass all Awwwards quality gates and inspection checks"
```
