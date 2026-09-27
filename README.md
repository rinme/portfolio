# High-Performance Portfolio & Mini-CRM

A production-grade, full-stack personal portfolio and back-office CRM built with **Next.js 15 (App Router, React Server Components)**, **Bun**, **Tailwind CSS v4**, and **Drizzle ORM** with **LibSQL / Turso**.

### Key Architectural Highlights:
- **Dark-Tech / Linear Aesthetic**: Deep Carbon/Zinc base (`#09090b`), high-contrast Neon Rose/Pink accent (`#f43f5e`), and crisp typography with `Geist` + `Geist Mono`.
- **Zero Static Client Overhead**: Public pages rendered via React Server Components (RSC) for microsecond loads.
- **Dynamic CMS & Mini-CRM**: No hardcoded text. Edit Profile, Projects, Experience, Skills, Testimonials, and Social Links directly in the back-office.
- **Dynamic Social Visibility**: Social platforms (Instagram, Facebook, LinkedIn, GitHub, X, Discord, YouTube, Custom) can be added via `/admin` and **only appear on the public site when their `Active Tag` is toggled ON**.
- **CRM Leads Pipeline**: Public contact inquiries automatically ingest into an admin leads pipeline with status progression (`NEW`, `IN_REVIEW`, `CONTACTED`, `CLOSED`, `ARCHIVED`) and internal notes.

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Admin Back-Office & CRM

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Master Password**: `admin123` (override via `ADMIN_PASSWORD` environment variable)

### Features in the Admin Control Plane
1. **CRM Leads Pipeline**: Real-time tracker for inquiries submitted through the contact form. Change lead stages and write internal notes.
2. **Social Channels**: Add profile links for Instagram, Facebook, LinkedIn, GitHub, X/Twitter, etc. Toggle the **Active Tag switch** to instantly show or hide them from the public site.
3. **Profile & Bio**: Live edit your headline, role, bio, location, avatar image URL/file upload, and availability status.
4. **Projects**: Full CRUD for case studies with slug, impact metric callouts (e.g. *"Reduced p99 latency by 68%"*), tech tags, repo/live links, and screenshots.
5. **Experience Timeline**: Manage career roles, dates, company links, and achievement bullet points.
6. **Capabilities Matrix**: Add and group skills across Languages, Frontend, Storage, and DevOps with proficiency badges.
7. **Testimonials**: Manage client and colleague endorsements (formatted with 3-line max quote discipline).

---

## Vercel & Turso Deployment

The app is architected with a hybrid LibSQL database driver:
- **Local Development**: Runs out of the box using an embedded SQLite file (`file:local.db`).
- **Production on Vercel**: Connects to Turso serverless SQLite for globally replicated edge speed with persistent data.

### Environment Variables for Vercel
```env
# Optional: Turso Serverless Database (for Vercel persistence)
TURSO_DATABASE_URL="libsql://your-db-name.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"

# Admin Authentication
ADMIN_PASSWORD="your_secure_master_password"
SESSION_SECRET="your_random_jwt_secret_key"

# Optional: Vercel Blob (for image uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```
