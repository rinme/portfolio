import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import {
  initialProfile,
  initialSocialLinks,
  initialProjects,
  initialExperiences,
  initialSkills,
  initialTestimonials,
} from "./seed";

const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

export const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });

let isInitialized = false;

export async function ensureDatabaseInitialized() {
  if (isInitialized) return;

  // Create tables if they do not exist
  await client.execute(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      headline TEXT NOT NULL,
      location TEXT NOT NULL,
      availability_status TEXT NOT NULL,
      bio TEXT NOT NULL,
      avatar_url TEXT NOT NULL,
      resume_url TEXT,
      email TEXT NOT NULL,
      github_url TEXT,
      updated_at INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS social_links (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      impact_metric TEXT,
      tags TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      display_order INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      repo_url TEXT,
      live_url TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      company_url TEXT,
      location TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      description TEXT NOT NULL,
      highlights TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      level TEXT NOT NULL DEFAULT 'Proficient',
      is_highlighted INTEGER NOT NULL DEFAULT 0,
      display_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      author TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      content TEXT NOT NULL,
      avatar_url TEXT,
      display_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      budget TEXT,
      status TEXT NOT NULL DEFAULT 'NEW',
      internal_notes TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  // Check if profile exists; if not, seed initial data
  const existingProfile = await db.select().from(schema.profile).limit(1);
  if (existingProfile.length === 0) {
    await db.insert(schema.profile).values(initialProfile);

    for (const item of initialSocialLinks) {
      await db.insert(schema.socialLinks).values(item);
    }
    for (const item of initialProjects) {
      await db.insert(schema.projects).values(item);
    }
    for (const item of initialExperiences) {
      await db.insert(schema.experiences).values(item);
    }
    for (const item of initialSkills) {
      await db.insert(schema.skills).values(item);
    }
    for (const item of initialTestimonials) {
      await db.insert(schema.testimonials).values(item);
    }
  }

  isInitialized = true;
}
