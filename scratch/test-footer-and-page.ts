import * as svelte from "svelte/compiler";
import fs from "fs";

// 1. Svelte 5 compilation of Footer.svelte
const footerSrc = fs.readFileSync("src/lib/components/Footer.svelte", "utf8");
const footerResult = svelte.compile(footerSrc, { filename: "Footer.svelte" });
if (footerResult.warnings.length > 0) {
  console.error("FAIL: Footer compiler warnings present", footerResult.warnings);
  process.exit(1);
}
console.log("PASSED: Footer.svelte compiles with zero warnings");

// 2. Svelte 5 compilation of +page.svelte
const pageSrc = fs.readFileSync("src/routes/+page.svelte", "utf8");
const pageResult = svelte.compile(pageSrc, { filename: "+page.svelte" });
if (pageResult.warnings.length > 0) {
  console.error("FAIL: +page.svelte compiler warnings present", pageResult.warnings);
  process.exit(1);
}
console.log("PASSED: +page.svelte compiles with zero warnings");

// 3. Footer structural requirements
const footerChecks = [
  { desc: "Zero legacy hairlines in Footer", test: !footerSrc.includes("hairline") },
  { desc: "Monument wordmark class (.monument-text)", test: footerSrc.includes("monument-text") },
  { desc: "Monument responsive sizing text-[12vw] sm:text-[14vw]", test: footerSrc.includes("text-[12vw] sm:text-[14vw]") },
  { desc: "Profile name displayed in monument close", test: footerSrc.includes("{profile.name}") },
  { desc: "Bangkok location stamp", test: footerSrc.includes("Bangkok, Thailand • UTC+7") },
  { desc: "Engineering portfolio label", test: footerSrc.includes("Engineering portfolio") },
  { desc: "Active socials loop with SocialIcon and ArrowUpRight", test: footerSrc.includes("{#each activeSocials as social}") && footerSrc.includes("<SocialIcon") && footerSrc.includes("<ArrowUpRight") },
  { desc: "Clean /admin control plane link", test: footerSrc.includes('href="/admin"') && footerSrc.includes("Control Plane") },
  { desc: "Current year and tech stack statement", test: footerSrc.includes("new Date().getFullYear()") && footerSrc.includes("SvelteKit 2, Bun, Tailwind CSS v4, and LibSQL") },
];

for (const check of footerChecks) {
  if (!check.test) {
    console.error(`FAILED: ${check.desc}`);
    process.exit(1);
  }
  console.log(`PASSED: ${check.desc}`);
}

// 4. Page layout structural requirements
const pageChecks = [
  { desc: "Page imports Navbar, Hero, Projects, Capabilities, Experience, ContactForm, Footer", test: (
    pageSrc.includes("import Navbar from '#lib/components/Navbar.svelte';") &&
    pageSrc.includes("import Hero from '#lib/components/Hero.svelte';") &&
    pageSrc.includes("import Projects from '#lib/components/Projects.svelte';") &&
    pageSrc.includes("import Capabilities from '#lib/components/Capabilities.svelte';") &&
    pageSrc.includes("import Experience from '#lib/components/Experience.svelte';") &&
    pageSrc.includes("import ContactForm from '#lib/components/ContactForm.svelte';") &&
    pageSrc.includes("import Footer from '#lib/components/Footer.svelte';")
  )},
  { desc: "Zero empty Testimonials imported or rendered", test: !pageSrc.includes("Testimonials") },
  { desc: "Semantic section order: Projects -> Capabilities -> Experience -> ContactForm", test: (
    pageSrc.indexOf("<Projects") < pageSrc.indexOf("<Capabilities") &&
    pageSrc.indexOf("<Capabilities") < pageSrc.indexOf("<Experience") &&
    pageSrc.indexOf("<Experience") < pageSrc.indexOf("<ContactForm")
  )},
  { desc: "Document title template for Rinme", test: pageSrc.includes("data.profile ? `${data.profile.name} — ${data.profile.role}` : 'Rinme — Self-Taught Full-Stack Engineer'") },
  { desc: "Meta description for Rinme", test: pageSrc.includes('content="Self-taught full-stack engineer in Bangkok, TH focusing on low-latency web applications and edge tools."') },
  { desc: "Navbar fallback props for Rinme and availability status", test: pageSrc.includes("name={data.profile?.name || 'Rinme'}") && pageSrc.includes("data.profile?.availabilityStatus || 'Open for full-stack commission.'") },
  { desc: "ContactForm fallback email rin@rinme.me", test: pageSrc.includes("email={data.profile?.email || 'rin@rinme.me'}") },
];

for (const check of pageChecks) {
  if (!check.test) {
    console.error(`FAILED: ${check.desc}`);
    process.exit(1);
  }
  console.log(`PASSED: ${check.desc}`);
}

console.log("\nAll Footer and Page Layout verification checks PASSED successfully!");
