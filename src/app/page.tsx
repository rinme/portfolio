import type { Metadata } from "next";
import { db, ensureDatabaseInitialized } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { asc, desc } from "drizzle-orm";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { ExperienceSection } from "@/components/Experience";
import { CapabilitiesSection } from "@/components/Capabilities";
import { TestimonialsSection } from "@/components/Testimonials";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  await ensureDatabaseInitialized();
  const [profileData] = await db.select().from(schema.profile).limit(1);

  if (!profileData) {
    return {
      title: "Portfolio",
      description: "Personal Engineering Portfolio",
    };
  }

  return {
    title: `${profileData.name} — ${profileData.role}`,
    description: profileData.headline || profileData.bio,
  };
}

export default async function HomePage() {
  await ensureDatabaseInitialized();

  // Fetch all entities
  const [profileData] = await db.select().from(schema.profile).limit(1);
  const allSocials = await db
    .select()
    .from(schema.socialLinks)
    .orderBy(asc(schema.socialLinks.displayOrder));
  const projectsData = await db
    .select()
    .from(schema.projects)
    .orderBy(asc(schema.projects.displayOrder));
  const experiencesData = await db
    .select()
    .from(schema.experiences)
    .orderBy(asc(schema.experiences.displayOrder));
  const skillsData = await db
    .select()
    .from(schema.skills)
    .orderBy(asc(schema.skills.displayOrder));
  const testimonialsData = await db
    .select()
    .from(schema.testimonials)
    .orderBy(asc(schema.testimonials.displayOrder));

  // User requirement: social links only show up when active tag is ON!
  const activeSocials = allSocials.filter((s) => s.isActive);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col selection:bg-rose-500/30 selection:text-white">
      <Navbar
        name={profileData?.name || "Portfolio"}
        availabilityStatus={profileData?.availabilityStatus || "Available"}
        activeSocials={activeSocials}
      />

      <main className="flex-1">
        {profileData && <Hero profile={profileData} activeSocials={activeSocials} />}
        <Projects projects={projectsData} />
        <ExperienceSection experiences={experiencesData} />
        <CapabilitiesSection skills={skillsData} />
        <TestimonialsSection testimonials={testimonialsData} />
        <ContactForm email={profileData?.email || "contact@example.dev"} />
      </main>

      {profileData && <Footer profile={profileData} activeSocials={activeSocials} />}
    </div>
  );
}
