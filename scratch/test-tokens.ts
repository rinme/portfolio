import { readFileSync } from "fs";

const css = readFileSync("src/app.css", "utf8");
if (!css.includes("#b8336a")) throw new Error("Light mode WCAG AA accent token missing");
if (!css.includes("#ffaec8")) throw new Error("Dark mode pastel pink token missing");
if (css.includes(".swiss-grid")) throw new Error("Legacy swiss-grid pattern not removed");
console.log("Tokens verification PASSED");
