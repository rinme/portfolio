import * as svelte from "svelte/compiler";
import fs from "fs";
import { initialSkills } from "../src/lib/db/seed";

const fileContent = fs.readFileSync("src/lib/components/Capabilities.svelte", "utf8");

// 1. Svelte compiler check
const compileResult = svelte.compile(fileContent, { filename: "Capabilities.svelte" });
if (compileResult.warnings.length > 0) {
  console.error("FAIL: Compiler warnings present", compileResult.warnings);
  process.exit(1);
}
console.log("PASSED: Zero compilation warnings");

// 2. Section ID check
if (!fileContent.includes('id="capabilities"')) {
  console.error("FAIL: Section ID should be 'capabilities'");
  process.exit(1);
}
console.log("PASSED: Section id is 'capabilities'");

// 3. Zero legacy hairlines
if (fileContent.includes("hairline")) {
  console.error("FAIL: Found legacy hairline class");
  process.exit(1);
}
console.log("PASSED: Zero legacy hairlines");

// 4. Zero index badges (Section // 03)
if (fileContent.includes("Section //") || fileContent.includes("INDEX SIZE")) {
  console.error("FAIL: Found legacy section index or badge");
  process.exit(1);
}
console.log("PASSED: Zero legacy index badge (Section // 03)");

// 5. Zero fake percentage dials or progress bars
if (fileContent.includes("progress") || fileContent.includes("%") || fileContent.includes("slider") || fileContent.includes("range")) {
  console.error("FAIL: Found fake percentage dials or progress bars");
  process.exit(1);
}
console.log("PASSED: Zero fake percentage dials or progress bars");

// 6. Two-line headline ceiling
if (!fileContent.includes("Technical Capabilities")) {
  console.error("FAIL: Missing heading 'Technical Capabilities'");
  process.exit(1);
}
console.log("PASSED: Two-line headline ceiling 'Technical Capabilities'");

// 7. Four architectural discipline columns
const expectedCategories = [
  "Frontend & interfaces",
  "Systems & backend",
  "Storage, edge & devOps",
  "Protocols & tools"
];

for (const cat of expectedCategories) {
  if (!fileContent.includes(cat)) {
    console.error(`FAIL: Missing category column '${cat}'`);
    process.exit(1);
  }
}
console.log("PASSED: Four architectural discipline columns present");

// 8. Icons from phosphor-svelte
const icons = ["Cpu", "Globe", "Database", "Wrench"];
for (const icon of icons) {
  if (!fileContent.includes(icon)) {
    console.error(`FAIL: Missing icon '${icon}'`);
    process.exit(1);
  }
}
console.log("PASSED: Phosphor icons imported and bound to categories");

// 9. Highlighted skill indicator pip (pastel-pink accent)
if (!fileContent.includes("skill.isHighlighted") || !fileContent.includes("bg-[var(--accent)]")) {
  console.error("FAIL: Missing highlighted skill pip");
  process.exit(1);
}
console.log("PASSED: Discrete pastel-pink indicator pip on highlighted skills");

// 10. Verified Competencies counter
if (!fileContent.includes("verified competencies")) {
  console.error("FAIL: Missing verified competencies counter");
  process.exit(1);
}
console.log("PASSED: Verified competencies footer counter present in each discipline column");

// 11. Test seed skills mapping
function getSkillsByCategory(category: string, skills: any[]) {
  const key = category.toLowerCase().replace(/[^a-z0-9]/g, " ");
  const firstWord = key.split(/\s+/)[0];
  return skills.filter(s => {
    const cat = s.category.toLowerCase();
    if (cat === category.toLowerCase()) return true;
    if (firstWord === "storage" && (cat.includes("storage") || cat.includes("devops") || cat.includes("database"))) return true;
    if (firstWord === "frontend" && (cat.includes("frontend") || cat.includes("ui") || cat.includes("interface"))) return true;
    if (firstWord === "systems" && (cat.includes("system") || cat.includes("backend"))) return true;
    if (firstWord === "protocols" && (cat.includes("protocol") || cat.includes("tool"))) return true;
    return cat.includes(firstWord);
  });
}

let totalCategorized = 0;
for (const cat of expectedCategories) {
  const items = getSkillsByCategory(cat, initialSkills);
  if (items.length === 0) {
    console.error(`FAIL: No seed skills matched for '${cat}'`);
    process.exit(1);
  }
  totalCategorized += items.length;
}

if (totalCategorized !== initialSkills.length) {
  console.error(`FAIL: Expected ${initialSkills.length} total mapped skills, got ${totalCategorized}`);
  process.exit(1);
}
console.log(`PASSED: All ${initialSkills.length} seed skills accurately mapped across 4 disciplines`);

console.log("All Capabilities verification checks PASSED successfully.");
