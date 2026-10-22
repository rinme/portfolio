import { db, ensureDatabaseInitialized } from "../db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

interface GithubRepo {
  name: string;
  language: string | null;
  topics?: string[];
  description?: string | null;
  stargazers_count: number;
  size: number;
  pushed_at: string;
  fork: boolean;
}

interface ClassifiedSkill {
  id: string;
  name: string;
  category: string;
  level: 'Expert' | 'Proficient' | 'Familiar';
  isHighlighted: boolean;
  displayOrder: number;
  repoCount: number;
}

const CATEGORY_MAP: Record<string, string> = {
  // Systems & Backend
  Rust: "Systems & Backend",
  Python: "Systems & Backend",
  Go: "Systems & Backend",
  Java: "Systems & Backend",
  "C++": "Systems & Backend",
  "C#": "Systems & Backend",
  C: "Systems & Backend",
  PHP: "Systems & Backend",
  Ruby: "Systems & Backend",
  Kotlin: "Systems & Backend",
  Zig: "Systems & Backend",
  "Node.js": "Systems & Backend",

  // Frontend & UI
  TypeScript: "Frontend & UI",
  JavaScript: "Frontend & UI",
  Svelte: "Frontend & UI",
  Vue: "Frontend & UI",
  React: "Frontend & UI",
  HTML: "Frontend & UI",
  CSS: "Frontend & UI",
  Astro: "Frontend & UI",
  Flutter: "Frontend & UI",
  Nuxt: "Frontend & UI",
  "Tailwind CSS": "Frontend & UI",

  // Storage & Databases
  PostgreSQL: "Storage & Databases",
  SQLite: "Storage & Databases",
  Redis: "Storage & Databases",
  Turso: "Storage & Databases",
  LibSQL: "Storage & Databases",
  MongoDB: "Storage & Databases",
  MySQL: "Storage & Databases",

  // DevOps & Infra
  Shell: "DevOps & Infra",
  Bash: "DevOps & Infra",
  Docker: "DevOps & Infra",
  Linux: "DevOps & Infra",
  "GitHub Actions": "DevOps & Infra",
  Kubernetes: "DevOps & Infra",

  // Tools & Protocols
  Dart: "Tools & Protocols",
  Luau: "Tools & Protocols",
  Git: "Tools & Protocols",
  REST: "Tools & Protocols",
  WebSockets: "Tools & Protocols",
  Vite: "Tools & Protocols",
  Bun: "Tools & Protocols"
};

export async function fetchAndClassifyGithubSkills(username: string): Promise<ClassifiedSkill[]> {
  const cleanUsername = username.trim().replace(/^@/, "");
  if (!cleanUsername) throw new Error("GitHub username is required");

  const headers: Record<string, string> = {
    "User-Agent": "Portfolio-App",
    Accept: "application/vnd.github.v3+json"
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=pushed`,
    { headers }
  );

  if (!res.ok) {
    throw new Error(`GitHub API returned status ${res.status}: ${res.statusText}`);
  }

  const repos: GithubRepo[] = await res.json();
  if (!Array.isArray(repos)) {
    throw new Error("Invalid response format from GitHub");
  }

  const languageStats: Record<string, { count: number; totalSize: number; latestPush: number }> = {};
  const topicStats: Record<string, number> = {};

  for (const repo of repos) {
    // Tally primary language
    if (repo.language) {
      const lang = repo.language;
      const stats = languageStats[lang] || { count: 0, totalSize: 0, latestPush: 0 };
      stats.count += 1;
      stats.totalSize += repo.size || 0;
      const pushTime = new Date(repo.pushed_at).getTime();
      if (pushTime > stats.latestPush) stats.latestPush = pushTime;
      languageStats[lang] = stats;
    }

    // Tally topics
    if (repo.topics && Array.isArray(repo.topics)) {
      for (const t of repo.topics) {
        const topicNorm = t.toLowerCase();
        topicStats[topicNorm] = (topicStats[topicNorm] || 0) + 1;
      }
    }

    // Check description keywords for specialized frameworks
    const desc = (repo.description || "").toLowerCase();
    if (desc.includes("flutter")) topicStats["flutter"] = (topicStats["flutter"] || 0) + 1;
    if (desc.includes("nuxt")) topicStats["nuxt"] = (topicStats["nuxt"] || 0) + 1;
    if (desc.includes("docker")) topicStats["docker"] = (topicStats["docker"] || 0) + 1;
    if (desc.includes("sqlite")) topicStats["sqlite"] = (topicStats["sqlite"] || 0) + 1;
    if (desc.includes("postgres")) topicStats["postgresql"] = (topicStats["postgresql"] || 0) + 1;
    if (desc.includes("tailwind")) topicStats["tailwind css"] = (topicStats["tailwind css"] || 0) + 1;
    if (desc.includes("redis")) topicStats["redis"] = (topicStats["redis"] || 0) + 1;
  }

  // Synthesize skills list
  const results: ClassifiedSkill[] = [];
  const registeredNames = new Set<string>();

  // 1. Process Languages
  for (const [lang, stats] of Object.entries(languageStats)) {
    const category = CATEGORY_MAP[lang] || "Systems & Backend";
    let level: 'Expert' | 'Proficient' | 'Familiar' = 'Familiar';
    if (stats.count >= 4) {
      level = 'Expert';
    } else if (stats.count >= 2) {
      level = 'Proficient';
    }

    const isHighlighted = stats.count >= 3 || ['Rust', 'TypeScript', 'Python', 'Svelte', 'Go'].includes(lang);

    results.push({
      id: `sk-gh-${lang.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: lang,
      category,
      level,
      isHighlighted,
      displayOrder: 0,
      repoCount: stats.count
    });
    registeredNames.add(lang.toLowerCase());
  }

  // 2. Process recognized topics
  const TOPIC_PRESETS: Record<string, { name: string; category: string; defaultLevel: 'Expert' | 'Proficient' | 'Familiar' }> = {
    flutter: { name: "Flutter", category: "Frontend & UI", defaultLevel: "Proficient" },
    nuxt: { name: "Nuxt", category: "Frontend & UI", defaultLevel: "Proficient" },
    nuxtjs: { name: "Nuxt", category: "Frontend & UI", defaultLevel: "Proficient" },
    docker: { name: "Docker", category: "DevOps & Infra", defaultLevel: "Proficient" },
    sqlite: { name: "SQLite", category: "Storage & Databases", defaultLevel: "Proficient" },
    postgresql: { name: "PostgreSQL", category: "Storage & Databases", defaultLevel: "Proficient" },
    redis: { name: "Redis", category: "Storage & Databases", defaultLevel: "Proficient" },
    "tailwind css": { name: "Tailwind CSS", category: "Frontend & UI", defaultLevel: "Expert" }
  };

  for (const [topic, count] of Object.entries(topicStats)) {
    const preset = TOPIC_PRESETS[topic];
    if (preset && !registeredNames.has(preset.name.toLowerCase())) {
      results.push({
        id: `sk-gh-${preset.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: preset.name,
        category: preset.category,
        level: count >= 3 ? 'Expert' : preset.defaultLevel,
        isHighlighted: count >= 2,
        displayOrder: 0,
        repoCount: count
      });
      registeredNames.add(preset.name.toLowerCase());
    }
  }

  // Sort by count descending, then by name
  results.sort((a, b) => b.repoCount - a.repoCount || a.name.localeCompare(b.name));

  // Assign clean display order
  results.forEach((skill, index) => {
    skill.displayOrder = index + 1;
  });

  return results;
}

export async function syncGithubCapabilities(username: string) {
  await ensureDatabaseInitialized();
  const classifiedSkills = await fetchAndClassifyGithubSkills(username);

  if (classifiedSkills.length === 0) {
    throw new Error("No language or technology activity found for user");
  }

  // Clear existing skills and insert fresh GitHub-analyzed matrix
  await db.delete(schema.skills);

  for (const item of classifiedSkills) {
    await db.insert(schema.skills).values({
      id: item.id,
      name: item.name,
      category: item.category,
      level: item.level,
      isHighlighted: item.isHighlighted,
      displayOrder: item.displayOrder
    });
  }

  return {
    success: true,
    count: classifiedSkills.length,
    username,
    skills: classifiedSkills
  };
}
