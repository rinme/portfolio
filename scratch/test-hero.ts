import { readFileSync } from "fs";
import * as svelte from "svelte/compiler";

const heroPath = "src/lib/components/Hero.svelte";
const src = readFileSync(heroPath, "utf8");

// 1. Verify Svelte 5 compilation
const result = svelte.compile(src, { filename: "Hero.svelte" });
if (result.warnings.length > 0) {
  console.warn("Compilation warnings:", result.warnings);
}

// 2. Verify key elements requested in Task 5 specification
const checks = [
  { desc: "Zero compilation warnings", test: result.warnings.length === 0 },
  { desc: "Monument wordmark class (.monument-text)", test: src.includes("monument-text") },
  { desc: "Viewport width responsive typography (text-[15vw] sm:text-[17vw])", test: src.includes("text-[15vw] sm:text-[17vw]") },
  { desc: "Monument wordmark display of profile.name", test: src.includes("{profile.name}") },
  { desc: "Headline with fallback yo", test: src.includes("profile.headline || 'yo'") },
  { desc: "LatencyProbe import and embedding", test: src.includes("import LatencyProbe from './LatencyProbe.svelte';") && src.includes("<LatencyProbe />") },
  { desc: "Avatar with grayscale-to-color bloom on hover", test: src.includes("grayscale contrast-125 hover:grayscale-0 transition-all duration-300") },
  { desc: "Standfirst narrative bio", test: src.includes("{profile.bio}") },
  { desc: "Email link with mailto", test: src.includes('href="mailto:{profile.email}"') },
  { desc: "Active socials loop with SocialIcon", test: src.includes("{#each activeSocials as social}") && src.includes("<SocialIcon") },
  { desc: "Zero hairlines", test: !src.includes("hairline") },
  { desc: "Zero legacy index badge (Index //)", test: !src.includes("Index //") },
  { desc: "Border subtle divider (border-b border-[var(--border-subtle)])", test: src.includes("border-b border-[var(--border-subtle)]") },
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

if (failed) {
  throw new Error("Hero verification failed");
}

console.log("All Hero verification checks PASSED successfully.");
