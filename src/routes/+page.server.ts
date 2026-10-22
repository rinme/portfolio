import type { PageServerLoad } from "./$types";
import { db, ensureDatabaseInitialized } from "#lib/db";
import * as schema from "#lib/db/schema";
import { asc, desc } from "drizzle-orm";

export const load: PageServerLoad = async () => {
  await ensureDatabaseInitialized();

  const [profileData] = await db.select().from(schema.profile).limit(1);

  const allSocials = await db
    .select()
    .from(schema.socialLinks)
    .orderBy(asc(schema.socialLinks.displayOrder));

  const projectsData = await db
    .select()
    .from(schema.projects)
    .orderBy(desc(schema.projects.featured), asc(schema.projects.displayOrder));

  const experiencesData = await db
    .select()
    .from(schema.experiences)
    .orderBy(asc(schema.experiences.displayOrder));

  const skillsData = await db
    .select()
    .from(schema.skills)
    .orderBy(desc(schema.skills.isHighlighted), asc(schema.skills.displayOrder));

  const testimonialsData = await db
    .select()
    .from(schema.testimonials)
    .orderBy(asc(schema.testimonials.displayOrder));

  const activeSocials = allSocials.filter((s) => s.isActive);

  return {
    profile: profileData,
    activeSocials,
    projects: projectsData,
    experiences: experiencesData,
    skills: skillsData,
    testimonials: testimonialsData,
  };
};
