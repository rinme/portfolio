import type { Metadata } from "next";
import { verifyAdminSession } from "@/lib/auth";
import { db, ensureDatabaseInitialized } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { asc, desc } from "drizzle-orm";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CRM & CMS Control Plane — Admin",
  description: "Portfolio CMS and leads pipeline",
};

export default async function AdminPage() {
  await ensureDatabaseInitialized();
  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return <AdminLogin />;
  }

  // Fetch all CMS & CRM data
  const [profile] = await db.select().from(schema.profile).limit(1);
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

  return (
    <AdminDashboard
      initialProfile={profile}
      initialSocials={socials}
      initialProjects={projects}
      initialExperiences={experiences}
      initialSkills={skills}
      initialTestimonials={testimonials}
      initialInquiries={inquiries}
    />
  );
}
