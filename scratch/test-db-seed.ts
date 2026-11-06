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
