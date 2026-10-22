# Swiss Editorial Portfolio & Mini-CRM

A production-grade, full-stack personal portfolio and back-office CRM rebuilt with **SvelteKit (Svelte 5 runes)**, **Bun**, **Tailwind CSS v4**, and **Drizzle ORM** with **LibSQL / Turso**.

### Key Architectural Highlights:
- **Swiss Editorial Aesthetic**: Stark high-contrast typography (`Space Grotesk`, `Plus Jakarta Sans`, `JetBrains Mono`), asymmetric grids, precision hairline borders, and international vermilion accents. No generic AI card-glow slop.
- **Dual-Theme Support**: Daylight paper canvas (`#fbfbfb`) with carbon ink (`#121316`) and rich obsidian night mode (`#0a0a0c`).
- **Svelte 5 Runes & Zero Overhead**: Pure reactive components, native Svelte transitions, and instant page transitions.
- **Dynamic CMS & Mini-CRM**: Live back-office control plane for Profile, Projects, Experience, Capabilities, Endorsements, and Connected Socials.
- **Active Social Visibility Rule**: Connected channels only appear on the public site when their Active Tag is toggled ON.
- **CRM Leads Pipeline**: Public contact inquiries automatically ingest into an admin leads pipeline with status progression (`NEW`, `IN_REVIEW`, `CONTACTED`, `CLOSED`, `ARCHIVED`) and internal CRM notes.

---

## Getting Started with Bun

### 1. Install Dependencies
```bash
bun install
```

### 2. Run the Development Server
```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Admin Control Plane & CRM

- **URL**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Default Master Password**: `admin123` (override via `ADMIN_PASSWORD` environment variable)

### Features in the Control Plane
1. **CRM Leads Pipeline**: Real-time master-detail dossier tracker for inquiries submitted through the contact form. Change lead stages and write internal notes.
2. **Social Channels**: Add profile links for Instagram, Facebook, LinkedIn, GitHub, X/Twitter, etc. Toggle the **Active Tag switch** to instantly show or hide them from the public site.
3. **Profile & Bio**: Live edit your headline, role, bio, location, avatar image URL/file upload, and availability status.
4. **Projects**: Full CRUD for case studies with slug, impact metric callouts, tech tags, repo/live links, and screenshots.
5. **Experience Timeline**: Manage career roles, dates, company links, and achievement bullet points.
6. **Capabilities Matrix**: Add and group skills across Languages, Frontend, Storage, and DevOps with proficiency badges.
7. **Testimonials**: Manage client and colleague endorsements (formatted with 3-line max quote discipline).
