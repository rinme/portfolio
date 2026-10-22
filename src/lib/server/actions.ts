import { db, ensureDatabaseInitialized } from "#lib/db";
import * as schema from "#lib/db/schema";
import { eq } from "drizzle-orm";

// Public Contact Form -> Inquiries pipeline
export async function submitContactInquiry(formData: {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  budget?: string;
}) {
  await ensureDatabaseInitialized();

  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  const id = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  await db.insert(schema.inquiries).values({
    id,
    name: formData.name.trim(),
    email: formData.email.trim(),
    company: formData.company?.trim() || null,
    subject: formData.subject.trim(),
    message: formData.message.trim(),
    budget: formData.budget || null,
    status: "NEW",
    internalNotes: null,
    createdAt: Date.now(),
  });

  return { success: true };
}

// Profile Actions
export async function updateProfileAction(data: Partial<schema.InsertProfile>) {
  await ensureDatabaseInitialized();
  await db
    .update(schema.profile)
    .set({
      ...data,
      updatedAt: Date.now(),
    })
    .where(eq(schema.profile.id, 1));

  return { success: true };
}

// Social Links Actions
export async function addSocialLinkAction(data: {
  platform: string;
  url: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
}) {
  await ensureDatabaseInitialized();
  const id = `soc-${Date.now()}`;
  await db.insert(schema.socialLinks).values({
    id,
    platform: data.platform,
    url: data.url,
    icon: data.icon || "link",
    isActive: data.isActive,
    displayOrder: data.displayOrder || 0,
    createdAt: Date.now(),
  });

  return { success: true, id };
}

export async function toggleSocialLinkActiveAction(id: string, isActive: boolean) {
  await ensureDatabaseInitialized();
  await db
    .update(schema.socialLinks)
    .set({ isActive })
    .where(eq(schema.socialLinks.id, id));

  return { success: true };
}

export async function updateSocialLinkAction(
  id: string,
  data: Partial<schema.InsertSocialLink>
) {
  await ensureDatabaseInitialized();
  await db
    .update(schema.socialLinks)
    .set(data)
    .where(eq(schema.socialLinks.id, id));

  return { success: true };
}

export async function deleteSocialLinkAction(id: string) {
  await ensureDatabaseInitialized();
  await db.delete(schema.socialLinks).where(eq(schema.socialLinks.id, id));

  return { success: true };
}

// Project Actions
export async function saveProjectAction(data: {
  id?: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  impactMetric?: string;
  tags: string[];
  featured: boolean;
  displayOrder: number;
  imageUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
}) {
  await ensureDatabaseInitialized();
  const id = data.id || `proj-${Date.now()}`;
  const values = {
    title: data.title,
    slug: data.slug,
    tagline: data.tagline,
    description: data.description,
    impactMetric: data.impactMetric || null,
    tags: JSON.stringify(data.tags),
    featured: data.featured,
    displayOrder: data.displayOrder,
    imageUrl: data.imageUrl || null,
    repoUrl: data.repoUrl || null,
    liveUrl: data.liveUrl || null,
    createdAt: Date.now(),
  };

  if (data.id) {
    await db.update(schema.projects).set(values).where(eq(schema.projects.id, data.id));
  } else {
    await db.insert(schema.projects).values({ id, ...values });
  }

  return { success: true, id };
}

export async function deleteProjectAction(id: string) {
  await ensureDatabaseInitialized();
  await db.delete(schema.projects).where(eq(schema.projects.id, id));

  return { success: true };
}

// Experience Actions
export async function saveExperienceAction(data: {
  id?: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  displayOrder: number;
}) {
  await ensureDatabaseInitialized();
  const id = data.id || `exp-${Date.now()}`;
  const values = {
    role: data.role,
    company: data.company,
    companyUrl: data.companyUrl || null,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate,
    description: data.description,
    highlights: JSON.stringify(data.highlights),
    displayOrder: data.displayOrder,
  };

  if (data.id) {
    await db.update(schema.experiences).set(values).where(eq(schema.experiences.id, data.id));
  } else {
    await db.insert(schema.experiences).values({ id, ...values });
  }

  return { success: true, id };
}

export async function deleteExperienceAction(id: string) {
  await ensureDatabaseInitialized();
  await db.delete(schema.experiences).where(eq(schema.experiences.id, id));

  return { success: true };
}

// Skills Actions
export async function saveSkillAction(data: {
  id?: string;
  name: string;
  category: string;
  level: string;
  isHighlighted: boolean;
  displayOrder: number;
}) {
  await ensureDatabaseInitialized();
  const id = data.id || `sk-${Date.now()}`;
  const values = {
    name: data.name,
    category: data.category,
    level: data.level,
    isHighlighted: data.isHighlighted,
    displayOrder: data.displayOrder,
  };

  if (data.id) {
    await db.update(schema.skills).set(values).where(eq(schema.skills.id, data.id));
  } else {
    await db.insert(schema.skills).values({ id, ...values });
  }

  return { success: true, id };
}

export async function deleteSkillAction(id: string) {
  await ensureDatabaseInitialized();
  await db.delete(schema.skills).where(eq(schema.skills.id, id));

  return { success: true };
}

// Testimonials Actions
export async function saveTestimonialAction(data: {
  id?: string;
  author: string;
  role: string;
  company: string;
  content: string;
  avatarUrl?: string;
  displayOrder: number;
}) {
  await ensureDatabaseInitialized();
  const id = data.id || `test-${Date.now()}`;
  const values = {
    author: data.author,
    role: data.role,
    company: data.company,
    content: data.content,
    avatarUrl: data.avatarUrl || null,
    displayOrder: data.displayOrder,
  };

  if (data.id) {
    await db.update(schema.testimonials).set(values).where(eq(schema.testimonials.id, data.id));
  } else {
    await db.insert(schema.testimonials).values({ id, ...values });
  }

  return { success: true, id };
}

export async function deleteTestimonialAction(id: string) {
  await ensureDatabaseInitialized();
  await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));

  return { success: true };
}

// Inquiries / Leads Pipeline Actions
export async function updateInquiryStatusAction(
  id: string,
  status: string,
  internalNotes?: string
) {
  await ensureDatabaseInitialized();
  await db
    .update(schema.inquiries)
    .set({
      status,
      ...(internalNotes !== undefined ? { internalNotes } : {}),
    })
    .where(eq(schema.inquiries.id, id));

  return { success: true };
}

export async function deleteInquiryAction(id: string) {
  await ensureDatabaseInitialized();
  await db.delete(schema.inquiries).where(eq(schema.inquiries.id, id));

  return { success: true };
}

export type ReorderableEntity =
  | "projects"
  | "experiences"
  | "skills"
  | "testimonials"
  | "socialLinks";

export async function reorderItemsAction(
  entity: ReorderableEntity,
  orderedIds: string[]
) {
  await ensureDatabaseInitialized();

  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i];
    const order = i + 1;
    switch (entity) {
      case "projects":
        await db
          .update(schema.projects)
          .set({ displayOrder: order })
          .where(eq(schema.projects.id, id));
        break;
      case "experiences":
        await db
          .update(schema.experiences)
          .set({ displayOrder: order })
          .where(eq(schema.experiences.id, id));
        break;
      case "skills":
        await db
          .update(schema.skills)
          .set({ displayOrder: order })
          .where(eq(schema.skills.id, id));
        break;
      case "testimonials":
        await db
          .update(schema.testimonials)
          .set({ displayOrder: order })
          .where(eq(schema.testimonials.id, id));
        break;
      case "socialLinks":
        await db
          .update(schema.socialLinks)
          .set({ displayOrder: order })
          .where(eq(schema.socialLinks.id, id));
        break;
    }
  }

  return { success: true };
}
