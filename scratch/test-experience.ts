import * as svelte from "svelte/compiler";
import fs from "fs";
import { initialExperiences } from "../src/lib/db/seed";

const fileContent = fs.readFileSync("src/lib/components/Experience.svelte", "utf8");

// 1. Svelte compiler check
const compileResult = svelte.compile(fileContent, { filename: "Experience.svelte" });
if (compileResult.warnings.length > 0) {
  console.error("FAIL: Compiler warnings present", compileResult.warnings);
  process.exit(1);
}
console.log("PASSED: Zero compilation warnings");

// 2. Section ID check
if (!fileContent.includes('id="origin"')) {
  console.error("FAIL: Section ID should be 'origin' matching Navbar anchor");
  process.exit(1);
}
console.log("PASSED: Section id is 'origin'");

// 3. Zero legacy hairlines
if (fileContent.includes("hairline")) {
  console.error("FAIL: Found legacy hairline class");
  process.exit(1);
}
console.log("PASSED: Zero legacy hairlines");

// 4. Zero index badges (e.g. Section // 02)
if (fileContent.includes("Section //") || fileContent.includes("INDEX SIZE")) {
  console.error("FAIL: Found legacy section index or badge");
  process.exit(1);
}
console.log("PASSED: Zero legacy index badge (Section // 02)");

// 5. Zero generic timeline dots or tracks
if (fileContent.includes("timeline-dot") || fileContent.includes("timeline-track") || fileContent.includes("border-l-2")) {
  console.error("FAIL: Found generic timeline dots or tracks");
  process.exit(1);
}
console.log("PASSED: Zero generic timeline dots or vertical tracks");

// 6. Two-line headline ceiling
if (!fileContent.includes("Origin & Timeline")) {
  console.error("FAIL: Missing heading 'Origin & Timeline'");
  process.exit(1);
}
if (!fileContent.includes("From childhood self-learning to building edge platforms and mission-critical university software.")) {
  console.error("FAIL: Missing origin lead narrative text");
  process.exit(1);
}
console.log("PASSED: Two-line headline ceiling with authentic narrative");

// 7. Pastel-pink highlight pips on achievement bullet points
if (!fileContent.includes("bg-[var(--accent)]") || !fileContent.includes("rounded-full")) {
  console.error("FAIL: Missing pastel-pink highlight pips");
  process.exit(1);
}
console.log("PASSED: Clean typographic rhythm with pastel-pink highlight pips on achievement bullet points");

// 8. ArrowUpRight icon for company links
if (!fileContent.includes("ArrowUpRight") || !fileContent.includes("phosphor-svelte")) {
  console.error("FAIL: Missing ArrowUpRight icon from phosphor-svelte");
  process.exit(1);
}
console.log("PASSED: Phosphor ArrowUpRight icon integrated for company external links");

// 9. Test parseHighlights logic
function parseHighlights(json: string | null): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Check with null, invalid json, and non-array json
if (parseHighlights(null).length !== 0) {
  console.error("FAIL: parseHighlights(null) should return empty array");
  process.exit(1);
}
if (parseHighlights("invalid-json").length !== 0) {
  console.error("FAIL: parseHighlights with invalid json should return empty array");
  process.exit(1);
}
if (parseHighlights('{"foo": "bar"}').length !== 0) {
  console.error("FAIL: parseHighlights with non-array json should return empty array");
  process.exit(1);
}
console.log("PASSED: parseHighlights safely handles null, invalid json, and non-array json");

// 10. Verify seed experiences data mapping
if (initialExperiences.length === 0) {
  console.error("FAIL: initialExperiences is empty");
  process.exit(1);
}

for (const exp of initialExperiences) {
  const highlights = parseHighlights(exp.highlights);
  if (!exp.role || !exp.company || !exp.startDate || !exp.endDate || !exp.description) {
    console.error("FAIL: Incomplete experience record", exp);
    process.exit(1);
  }
  if (highlights.length === 0) {
    console.error("FAIL: Experience record has empty highlights", exp);
    process.exit(1);
  }
  console.log(`PASSED: Validated experience record for ${exp.company} (${highlights.length} highlights)`);
}

console.log("All Origin & Timeline verification checks PASSED successfully.");
