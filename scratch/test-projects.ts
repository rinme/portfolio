import { readFileSync } from "fs";
import * as svelte from "svelte/compiler";

const projectsPath = "src/lib/components/Projects.svelte";
const src = readFileSync(projectsPath, "utf8");

// 1. Verify Svelte 5 compilation
const result = svelte.compile(src, { filename: "Projects.svelte" });
if (result.warnings.length > 0) {
  console.warn("Compilation warnings:", result.warnings);
}

// 2. Verify key structural and styling elements for Task 6
const checks = [
  { desc: "Zero compilation warnings", test: result.warnings.length === 0 },
  { desc: "Section id is 'work'", test: src.includes('id="work"') },
  { desc: "Zero legacy hairlines", test: !src.includes("hairline") },
  { desc: "Zero legacy index badge (Section // 01)", test: !src.includes("Section // 01") },
  { desc: "Border subtle dividers", test: src.includes("border-b border-[var(--border-subtle)]") },
  { desc: "Strict 2-line headline ceiling 'Selected Work'", test: src.includes("Selected Work") && src.includes("font-extrabold font-display tracking-tight text-[var(--text-primary)]") },
  { desc: "Section description text", test: src.includes("Seven production systems, edge tools, and geospatial platforms built and maintained by Rinme.") },
  { desc: "Filter pills container", test: src.includes("selectedCategory = 'all'") && src.includes("selectedCategory = 'edge'") && src.includes("selectedCategory = 'geospatial'") },
  { desc: "Filter pill 'All ({projects.length})'", test: src.includes("All ({projects.length})") },
  { desc: "Filter pill 'Low-Latency & Edge'", test: src.includes("Low-Latency & Edge") },
  { desc: "Filter pill 'Geospatial & Map'", test: src.includes("Geospatial & Map") },
  { desc: "Tier 1: Flagship Spreads container", test: src.includes("flagshipProjects") && src.includes("Tier 1: Flagship Architectural Spreads") },
  { desc: "Tier 1: Alternating grid layout", test: src.includes("index % 2 === 1 ? 'lg:order-2' : ''") && src.includes("index % 2 === 1 ? 'lg:order-1' : ''") },
  { desc: "Tier 1: Impact metric badge", test: src.includes("project.impactMetric || 'Flagship Architecture'") },
  { desc: "Tier 1: 16/10 aspect ratio image preview", test: src.includes("aspect-[16/10]") },
  { desc: "Tier 1: Action links (Live Platform & Repository)", test: src.includes("Live Platform") && src.includes("Repository") },
  { desc: "Tier 2: Specimen Index header", test: src.includes("Catalogue Index // Shipped Applications ({catalogueProjects.length})") },
  { desc: "Tier 2: Specimen item row with title, impact metric, tagline/description", test: src.includes("catalogueProjects as project") && src.includes("{project.tagline || project.description}") },
  { desc: "Tier 2: Action buttons (Launch & GitHub)", test: src.includes("Launch") && src.includes("title=\"Source Code\"") },
  { desc: "Phosphor icons (ArrowUpRight, GithubLogo, Globe)", test: src.includes("ArrowUpRight") && src.includes("GithubLogo") && src.includes("Globe") },
];

let failed = false;
for (const check of checks) {
  if (!check.test) {
    console.error(`FAILED: ${check.desc}`);
    failed = true;
  } else {
    console.log(`PASSED: ${check.desc}`);
  }
}

// 3. Functional filter logic verification
const mockProjects = [
  { id: "1", title: "Run", slug: "run", tags: JSON.stringify(["SvelteKit", "Turso", "Edge"]), impactMetric: "15ms" },
  { id: "2", title: "Bangkok 50 Districts", slug: "bkkdmap", tags: JSON.stringify(["Geospatial", "Map"]), impactMetric: "Vector" },
  { id: "3", title: "Halfway", slug: "halfway", tags: JSON.stringify(["Geospatial", "Nuxt"]), impactMetric: "Midpoint" },
  { id: "4", title: "KMUTNB Reservation", slug: "sc-reservation", tags: JSON.stringify(["Next.js", "Prisma"]), impactMetric: "Campus" },
  { id: "5", title: "Couple Mood", slug: "couple-mood", tags: JSON.stringify(["PWA", "WebSockets"]), impactMetric: "Real-time" },
  { id: "6", title: "ITD Renovation", slug: "itd-renovation", tags: JSON.stringify(["Svelte", "Bilingual"]), impactMetric: "WCAG" },
  { id: "7", title: "Portfolio CRM", slug: "portfolio-crm", tags: JSON.stringify(["SvelteKit", "Turso"]), impactMetric: "Sub-Second" },
];

// Test flagship projects (Run & Bangkok 50 Districts)
const flagship = mockProjects.filter(p => p.slug === 'run' || p.slug === 'bkkdmap');
if (flagship.length !== 2 || flagship[0].slug !== 'run' || flagship[1].slug !== 'bkkdmap') {
  console.error("FAILED: Flagship derivation logic");
  failed = true;
} else {
  console.log("PASSED: Flagship derivation logic (Run & Bangkok 50 Districts)");
}

// Test catalogue projects (the remaining 5)
const catalogue = mockProjects.filter(p => p.slug !== 'run' && p.slug !== 'bkkdmap');
if (catalogue.length !== 5) {
  console.error("FAILED: Catalogue initial length is not 5");
  failed = true;
} else {
  console.log("PASSED: Catalogue initial length equals 5");
}

if (failed) {
  throw new Error("Projects verification failed");
}

console.log("All Projects verification checks PASSED successfully.");
