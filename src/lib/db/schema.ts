import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  headline: text("headline").notNull(),
  location: text("location").notNull(),
  availabilityStatus: text("availability_status").notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  resumeUrl: text("resume_url"),
  email: text("email").notNull(),
  githubUrl: text("github_url"),
  updatedAt: integer("updated_at").notNull(),
});

export const socialLinks = sqliteTable("social_links", {
  id: text("id").primaryKey(),
  platform: text("platform").notNull(), // e.g., 'GitHub', 'LinkedIn', 'Instagram', 'Facebook', 'X / Twitter', 'Discord', 'YouTube', etc.
  url: text("url").notNull(),
  icon: text("icon").notNull(), // 'github' | 'linkedin' | 'instagram' | 'facebook' | 'twitter' | 'discord' | 'youtube' | 'link'
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  impactMetric: text("impact_metric"), // e.g., "Reduced p99 latency by 68%"
  tags: text("tags").notNull(), // JSON array of strings
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  imageUrl: text("image_url"),
  repoUrl: text("repo_url"),
  liveUrl: text("live_url"),
  createdAt: integer("created_at").notNull(),
});

export const experiences = sqliteTable("experiences", {
  id: text("id").primaryKey(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  companyUrl: text("company_url"),
  location: text("location").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(), // "Present" or e.g. "2024"
  description: text("description").notNull(),
  highlights: text("highlights").notNull(), // JSON array of strings
  displayOrder: integer("display_order").notNull().default(0),
});

export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'Systems & Backend', 'Frontend & UI', 'Storage & Databases', 'DevOps & Infra', 'Tools & Protocols'
  level: text("level").notNull().default("Proficient"), // 'Expert', 'Proficient', 'Familiar'
  isHighlighted: integer("is_highlighted", { mode: "boolean" }).notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
});

export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  content: text("content").notNull(),
  avatarUrl: text("avatar_url"),
  displayOrder: integer("display_order").notNull().default(0),
});

export const inquiries = sqliteTable("inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  budget: text("budget"),
  status: text("status").notNull().default("NEW"), // 'NEW' | 'IN_REVIEW' | 'CONTACTED' | 'CLOSED' | 'ARCHIVED'
  internalNotes: text("internal_notes"),
  createdAt: integer("created_at").notNull(),
});

export type Profile = typeof profile.$inferSelect;
export type InsertProfile = typeof profile.$inferInsert;

export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = typeof socialLinks.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;
