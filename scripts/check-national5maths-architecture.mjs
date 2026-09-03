import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const n5Root = path.join(repoRoot, "app", "Courses", "National5Maths");
const appRoot = path.join(repoRoot, "app");

const CANONICAL_LAYERS = [
  "01_QuestionCatalog",
  "02_AnswerCatalog",
  "03_SkillCatalog",
  "04_QuestionGeneration",
  "05_AnswerGeneration",
  "06_VisualAssets",
];

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const violations = [];
const warnings = [];

const rel = (filePath) => path.relative(repoRoot, filePath).split(path.sep).join("/");

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") return [];
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return SOURCE_EXTENSIONS.has(path.extname(entry.name)) ? [fullPath] : [];
  });
}

function importSpecifiers(source) {
  const imports = [];
  const pattern = /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*)["']([^"']+)["']/g;
  for (const match of source.matchAll(pattern)) imports.push(match[1]);
  return imports;
}

function containsSegment(specifier, segment) {
  return specifier.split("\\").join("/").includes(segment);
}

function addViolation(file, message) {
  violations.push(`${rel(file)}: ${message}`);
}

for (const layer of CANONICAL_LAYERS) {
  if (!fs.existsSync(path.join(n5Root, layer))) {
    violations.push(`Missing canonical National5Maths layer: ${layer}`);
  }
}

if (!fs.existsSync(path.join(n5Root, "CatalogVisualEvidenceTypes.ts"))) {
  violations.push("Missing shared historical visual-evidence contract: CatalogVisualEvidenceTypes.ts");
}

const obsoletePaths = [
  "03_QuestionGeneration",
  "04_AnswerGeneration",
  "National5MathsConfig.ts",
  "PaperContexts",
  "QuestionAndAnswerGeneration",
];
for (const obsoletePath of obsoletePaths) {
  if (fs.existsSync(path.join(n5Root, obsoletePath))) {
    violations.push(`Obsolete National5Maths compatibility path still exists: ${obsoletePath}`);
  }
}

// 05_VisualAssets is no longer an implementation layer. Until the 2014 pilot
// imports are rewritten, it may contain exactly one forwarding source file and
// nothing else. This prevents a compatibility address becoming a second owner.
const deprecatedVisualRoot = path.join(n5Root, "05_VisualAssets");
if (fs.existsSync(deprecatedVisualRoot)) {
  const files = walk(deprecatedVisualRoot).map((file) => path.relative(deprecatedVisualRoot, file).split(path.sep).join("/"));
  const unexpected = files.filter((file) => file !== "VisualCatalogTypes.ts");
  if (unexpected.length > 0) {
    violations.push(`05_VisualAssets may contain only the temporary VisualCatalogTypes.ts forwarder; found ${unexpected.join(", ")}.`);
  }
  const bridge = path.join(deprecatedVisualRoot, "VisualCatalogTypes.ts");
  if (!fs.existsSync(bridge)) {
    violations.push("05_VisualAssets exists without its temporary VisualCatalogTypes.ts forwarder.");
  } else {
    const bridgeSource = fs.readFileSync(bridge, "utf8");
    if (!bridgeSource.includes("../CatalogVisualEvidenceTypes")) {
      violations.push("05_VisualAssets/VisualCatalogTypes.ts must forward only to the shared CatalogVisualEvidenceTypes contract.");
    }
  }
}

for (const file of walk(n5Root)) {
  const relativeToN5 = path.relative(n5Root, file).split(path.sep).join("/");
  const layer = relativeToN5.split("/")[0];
  const source = fs.readFileSync(file, "utf8");
  const imports = importSpecifiers(source);

  for (const specifier of imports) {
    if (layer === "01_QuestionCatalog" || layer === "02_AnswerCatalog") {
      for (const forbidden of ["03_SkillCatalog", "04_QuestionGeneration", "05_AnswerGeneration", "06_VisualAssets"]) {
        if (containsSegment(specifier, forbidden)) {
          addViolation(file, `${layer} must not import downstream ${forbidden} (${specifier}).`);
        }
      }
    }

    if (layer === "03_SkillCatalog") {
      for (const forbidden of ["04_QuestionGeneration", "05_AnswerGeneration", "06_VisualAssets"]) {
        if (containsSegment(specifier, forbidden)) {
          addViolation(file, `03_SkillCatalog must not import generation/rendering layer ${forbidden} (${specifier}).`);
        }
      }
    }

    if (layer === "04_QuestionGeneration" || layer === "05_AnswerGeneration" || layer === "06_VisualAssets") {
      const normalised = specifier.split("\\").join("/");
      if (/01_QuestionCatalog\/(?:20\d{2})\//.test(normalised) || /02_AnswerCatalog\/(?:20\d{2})\//.test(normalised)) {
        addViolation(file, `${layer} must consume SkillCatalog/shared abstractions rather than a raw historical year file (${specifier}).`);
      }
    }
  }
}

// Deprecated numbered generation addresses are forbidden everywhere in app/.
for (const file of walk(appRoot)) {
  const source = fs.readFileSync(file, "utf8");
  for (const specifier of importSpecifiers(source)) {
    const usesOldQuestionGeneration = containsSegment(specifier, "03_QuestionGeneration");
    const usesOldAnswerGeneration = containsSegment(specifier, "04_AnswerGeneration");
    if (!usesOldQuestionGeneration && !usesOldAnswerGeneration) continue;

    addViolation(
      file,
      `Deprecated numbered generation path is forbidden (${specifier}). Use 04_QuestionGeneration / 05_AnswerGeneration.`,
    );
  }
}

// The 2014 pilot and the two universal catalogue contracts still name the old
// 05_VisualAssets address. That address is now only a one-file forwarder to the
// shared historical visual contract. No new consumer is permitted.
for (const file of walk(appRoot)) {
  const fileRel = rel(file);
  const source = fs.readFileSync(file, "utf8");
  for (const specifier of importSpecifiers(source)) {
    if (!containsSegment(specifier, "05_VisualAssets")) continue;

    const isHistoricalQuestionCatalog = fileRel.startsWith(
      "app/Courses/National5Maths/01_QuestionCatalog/",
    );
    const isHistoricalAnswerVisualContract =
      fileRel === "app/Courses/National5Maths/02_AnswerCatalog/AnswerCatalogTypes.ts";
    const isCompatibilityForwarder =
      fileRel === "app/Courses/National5Maths/05_VisualAssets/VisualCatalogTypes.ts";

    if (isHistoricalQuestionCatalog || isHistoricalAnswerVisualContract) {
      warnings.push(`${fileRel}: legacy 05_VisualAssets import forwards to CatalogVisualEvidenceTypes; migrate this import when the historical file is next touched.`);
    } else if (!isCompatibilityForwarder) {
      addViolation(file, `Deprecated 05_VisualAssets import is forbidden (${specifier}). Historical evidence uses CatalogVisualEvidenceTypes; generated visuals use 06_VisualAssets.`);
    }
  }
}

if (warnings.length > 0) {
  console.warn("National5Maths architecture migration warnings:");
  for (const warning of warnings) console.warn(`  - ${warning}`);
}

if (violations.length > 0) {
  console.error("National5Maths architecture check failed:");
  for (const violation of violations) console.error(`  - ${violation}`);
  process.exit(1);
}

console.log(`National5Maths architecture check passed (${CANONICAL_LAYERS.length} canonical layers).`);
