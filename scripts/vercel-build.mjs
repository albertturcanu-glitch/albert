import AdmZip from "adm-zip";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const zipName = "professional-sleeper-protocol-upload.zip";
const root = process.cwd();

function move(file, target) {
  if (!existsSync(file)) return;
  mkdirSync(join(root, target, ".."), { recursive: true });
  rmSync(target, { force: true, recursive: true });
  renameSync(file, target);
}

if (!existsSync("src/App.jsx")) {
  if (!existsSync(zipName)) {
    throw new Error(`Missing ${zipName}. Upload the project zip or commit the source files.`);
  }

  const zip = new AdmZip(zipName);
  zip.extractAllTo(root, true);

  mkdirSync("src/data", { recursive: true });
  mkdirSync("src/lib", { recursive: true });
  mkdirSync("docs", { recursive: true });

  move("App.jsx", "src/App.jsx");
  move("main.jsx", "src/main.jsx");
  move("styles.css", "src/styles.css");
  move("manualContent.js", "src/data/manualContent.js");
  move("microProtocols.js", "src/data/microProtocols.js");
  move("pillars.js", "src/data/pillars.js");
  move("quizItems.js", "src/data/quizItems.js");
  move("systemMap.js", "src/data/systemMap.js");
  move("theoryContent.js", "src/data/theoryContent.js");
  move("scoring.js", "src/lib/scoring.js");
  move("storage.js", "src/lib/storage.js");

  for (const doc of [
    "7-day-micro-protocols.md",
    "educational-architecture.md",
    "feedback-loops-for-professional-sleeper-protocol.md",
    "product-component-roadmap.md",
    "professional-sleeper-protocol-quiz-bank.md",
    "scoring-and-interpretation-model.md",
    "the-professional-sleeper-protocol-theory.md",
    "user-journey-and-experience-map.md",
    "voice-and-copywriting-system.md",
  ]) {
    move(doc, `docs/${doc}`);
  }
}

const result = spawnSync(process.execPath, ["node_modules/vite/bin/vite.js", "build"], {
  stdio: "inherit",
  shell: false,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
