import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { db, ensureDatabaseInitialized } from "#lib/db";
import * as schema from "#lib/db/schema";
import { asc, desc } from "drizzle-orm";
import {
  DEFAULT_ADMIN_PASSWORD,
  createAdminSession,
  destroyAdminSession,
} from "#lib/server/auth";

export const load: PageServerLoad = async ({ locals }) => {
  await ensureDatabaseInitialized();

  if (!locals.isAdmin) {
    return {
      authenticated: false,
    };
  }

  const [profileData] = await db.select().from(schema.profile).limit(1);

  const socials = await db
    .select()
    .from(schema.socialLinks)
    .orderBy(asc(schema.socialLinks.displayOrder));

  const projects = await db
    .select()
    .from(schema.projects)
    .orderBy(desc(schema.projects.featured), asc(schema.projects.displayOrder));

  const experiences = await db
    .select()
    .from(schema.experiences)
    .orderBy(asc(schema.experiences.displayOrder));

  const skills = await db
    .select()
    .from(schema.skills)
    .orderBy(desc(schema.skills.isHighlighted), asc(schema.skills.displayOrder));

  const testimonials = await db
    .select()
    .from(schema.testimonials)
    .orderBy(asc(schema.testimonials.displayOrder));

  const inquiries = await db
    .select()
    .from(schema.inquiries)
    .orderBy(desc(schema.inquiries.createdAt));

  return {
    authenticated: true,
    profile: profileData,
    socialLinks: socials,
    projects,
    experiences,
    skills,
    testimonials,
    inquiries,
  };
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const password = formData.get("password") as string;

    if (password === DEFAULT_ADMIN_PASSWORD) {
      await createAdminSession(cookies);
      return { success: true };
    }

    return fail(400, { error: "Invalid master admin password" });
  },

  logout: async ({ cookies }) => {
    destroyAdminSession(cookies);
    throw redirect(303, "/admin");
  },
};
