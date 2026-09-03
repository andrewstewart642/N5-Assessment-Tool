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

// Stage-5 migration debt only. These files are deliberately kept explicit so
// any new dependency on an old numbered path fails immediately. Remove entries
// as Stage 5B migrates each DeveloperTools consumer to the canonical paths.
const DEPRECATED_IMPORT_ALLOWLIST = new Set([
  "app/DeveloperTools/GeneratorTester/A7AreaPreview.tsx",
  "app/DeveloperTools/GeneratorTester/A7GeneratorTesterPage.tsx",
  "app/DeveloperTools/GeneratorTester/A7SqaGeneratorTesterPage.tsx",
  "app/DeveloperTools/GeneratorTester/A7SqaQuestionPreview.tsx",
  "app/DeveloperTools/GeneratorTester/A8GraphPreview.tsx",
  "app/DeveloperTools/GeneratorTester/GeneratorTestTarget.ts",
  "app/DeveloperTools/GeneratorTester/GeneratorTesterPage.tsx",
]);

// The old numbered trees themselves are temporary compatibility mounts. Their
// internal imports are migration debt, not permission for any external file to
// depend on them. Stage 5B removes these roots once external consumers are gone.
const DEPRECATED_TREE_PREFIXES = [
  "app/Courses/National5Maths/03_QuestionGeneration/",
  "app/Courses/National5Maths/04_AnswerGeneration/",
];

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

const obsoletePaths = [
  "National5MathsConfig.ts",
  "PaperContexts",
  "QuestionAndAnswerGeneration",
];
for (const obsoletePath of obsoletePaths) {
  if (fs.existsSync(path.join(n5Root, obsoletePath))) {
    violations.push(`Obsolete National5Maths compatibility path still exists: ${obsoletePath}`);
  }
}

for (const file of walk(n5Root)) {
  const relativeToN5 = path.relative(n5Root, file).split(path.sep).join("/");
  const layer = relativeToN5.split("/")[0];
  const source = fs.readFileSync(file, "utf8");
  const imports = importSpecifiers(source);

  for (const specifier of imports) {
    if (layer === "01_QuestionCatalog" || layer === "02_AnswerCatalog") {
      for (const forbidden of ["03_SkillCatalog", "04_QuestionGeneration", "05_AnswerGeneration"]) {
        if (containsSegment(specifier, forbidden)) {
          addViolation(file, `${layer} must not import downstream ${forbidden} (${specifier}).`);
        }
      }
    }

    if (layer === "03_SkillCatalog") {
      for (const forbidden of ["04_QuestionGeneration", "05_AnswerGeneration"]) {
        if (containsSegment(specifier, forbidden)) {
          addViolation(file, `03_SkillCatalog must not import generation layer ${forbidden} (${specifier}).`);
        }
      }
    }

    if (layer === "04_QuestionGeneration" || layer === "05_AnswerGeneration") {
      const normalised = specifier.split("\\").join("/");
      if (/01_QuestionCatalog\/(?:20\d{2})\//.test(normalised) || /02_AnswerCatalog\/(?:20\d{2})\//.test(normalised)) {
        addViolation(file, `${layer} must consume SkillCatalog/historical abstractions rather than a raw year file (${specifier}).`);
      }
    }
  }
}

// Deprecated numbered paths are checked across app/, not just the clean N5
// workspace, because DeveloperTools and Legacy adapters are common places for
// stale imports to survive.
for (const file of walk(appRoot)) {
  const fileRel = rel(file);
  const source = fs.readFileSync(file, "utf8");
  for (const specifier of importSpecifiers(source)) {
    const usesOldQuestionGeneration = containsSegment(specifier, "03_QuestionGeneration");
    const usesOldAnswerGeneration = containsSegment(specifier, "04_AnswerGeneration");
    if (!usesOldQuestionGeneration && !usesOldAnswerGeneration) continue;

    if (DEPRECATED_TREE_PREFIXES.some((prefix) => fileRel.startsWith(prefix))) {
      warnings.push(`${fileRel}: internal dependency inside a temporary deprecated generation tree (${specifier}).`);
    } else if (DEPRECATED_IMPORT_ALLOWLIST.has(fileRel)) {
      warnings.push(`${fileRel}: temporary deprecated generation import (${specifier}).`);
    } else {
      addViolation(file, `Deprecated numbered generation path is forbidden (${specifier}). Use 04_QuestionGeneration / 05_AnswerGeneration.`);
    }
  }
}

// Historical visual-evidence contracts may still reference 05_VisualAssets
// while that evidence model is separated from generation/rendering in Stage 5B.
// The exception is deliberately narrow: Question Catalog source evidence and
// the universal Answer Catalog visual-marking contract only. New code uses 06.
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
    const isDeprecatedVisualTree = fileRel.startsWith(
      "app/Courses/National5Maths/05_VisualAssets/",
    );

    if (isHistoricalQuestionCatalog || isHistoricalAnswerVisualContract) {
      warnings.push(`${fileRel}: historical visual-type import still uses 05_VisualAssets.`);
    } else if (isDeprecatedVisualTree) {
      warnings.push(`${fileRel}: internal dependency inside the temporary 05_VisualAssets compatibility tree.`);
    } else {
      addViolation(file, `Deprecated 05_VisualAssets import is forbidden (${specifier}). Use 06_VisualAssets.`);
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
