import { readFileSync } from "fs";
import * as svelte from "svelte/compiler";

const navbarPath = "src/lib/components/Navbar.svelte";
const src = readFileSync(navbarPath, "utf8");

// 1. Verify Svelte 5 compilation
const result = svelte.compile(src, { filename: "Navbar.svelte" });
if (result.warnings.length > 0) {
  console.warn("Compilation warnings:", result.warnings);
}

// 2. Verify key elements requested in Task 4 specification
const checks = [
  { desc: "Default name Rinme", test: src.includes("name = 'Rinme'") },
  { desc: "Availability status beacon", test: src.includes("Open for full-stack commission.") },
  { desc: "Pulsing accent beacon", test: src.includes("animate-pulse") && src.includes("bg-[var(--accent)]") },
  { desc: "Direct anchor #work", test: src.includes('href="#work"') },
  { desc: "Direct anchor #capabilities", test: src.includes('href="#capabilities"') },
  { desc: "Direct anchor #origin", test: src.includes('href="#origin"') },
  { desc: "Direct anchor #contact", test: src.includes('href="#contact"') },
  { desc: "Initiate Commission button", test: src.includes("Initiate Commission") },
  { desc: "Theme toggle button", test: src.includes("theme.toggle()") },
  { desc: "Zero hairlines", test: !src.includes("hairline") },
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
  throw new Error("Navbar verification failed");
}

console.log("All Navbar verification checks PASSED successfully.");
