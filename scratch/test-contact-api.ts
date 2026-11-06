import { db } from "#lib/db";
import * as schema from "#lib/db/schema";
import { submitContactInquiry } from "#lib/server/actions";
import { readFileSync } from "fs";
import * as svelte from "svelte/compiler";

async function verify() {
  console.log("--- 1. Verification of direct leads table insertion ---");
  const testEmail = `test-${Date.now()}@example.dev`;
  await db.insert(schema.leads).values({
    name: "Alex Test Client",
    email: testEmail,
    company: "Acme Edge Systems",
    budget: "$5k - $10k",
    message: "Inquiring about full-stack commission for edge telemetry platform.",
    status: "NEW",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  const [lead] = await db.select().from(schema.leads).where(schema.eq(schema.leads.email, testEmail));
  if (!lead) throw new Error("Contact submission lead failed to insert");
  console.log("Contact lead verification PASSED. ID:", lead.id);

  console.log("\n--- 2. Verification of submitContactInquiry action ---");
  const actionEmail = `inq-${Date.now()}@domain.org`;
  const result = await submitContactInquiry({
    name: "Maya Lin",
    email: actionEmail,
    company: "Edge Architecture & Low-Latency Systems",
    subject: "Edge Architecture & Low-Latency Systems",
    message: "Seeking low-latency telemetry edge cluster design.",
    budget: "Commission",
  });

  if (!result.success) throw new Error("submitContactInquiry failed");
  const [inquiry] = await db.select().from(schema.inquiries).where(schema.eq(schema.inquiries.email, actionEmail));
  if (!inquiry || inquiry.status !== "NEW") throw new Error("Inquiry CRM intake failed");
  console.log("submitContactInquiry PASSED. Inq ID:", inquiry.id, "Status:", inquiry.status);

  console.log("\n--- 3. Verification of ContactForm.svelte compilation & structure ---");
  const formPath = "src/lib/components/ContactForm.svelte";
  const src = readFileSync(formPath, "utf8");

  const compileResult = svelte.compile(src, { filename: "ContactForm.svelte" });
  if (compileResult.warnings.length > 0) {
    console.warn("Compilation warnings:", compileResult.warnings);
  }

  const checks = [
    { desc: "Zero compilation warnings", test: compileResult.warnings.length === 0 },
    { desc: "Section id is 'contact'", test: src.includes('id="contact"') },
    { desc: "Zero legacy hairlines", test: !src.includes("hairline") },
    { desc: "Zero legacy index badge (Section //)", test: !src.includes("Section //") },
    { desc: "Prominent direct email", test: src.includes('href="mailto:{email}"') && src.includes("{email}") },
    { desc: "Pastel-pink submit button & states", test: src.includes("bg-[var(--accent)]") && src.includes("Transmitting Ingest...") && src.includes("Send Commission Brief") },
    { desc: "Feedback toasts (success & error)", test: src.includes("Inquiry received") && src.includes("errorMessage") },
    { desc: "Inquiry type options", test: src.includes("Full-Stack Web Application") && src.includes("Edge Architecture & Low-Latency Systems") && src.includes("Geospatial / Interactive Map Tool") },
    { desc: "Submits to /api/contact", test: src.includes("fetch('/api/contact'") },
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

  if (failed) process.exit(1);
  console.log("\nAll ContactForm and Mini-CRM Ingestion verifications PASSED!");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
