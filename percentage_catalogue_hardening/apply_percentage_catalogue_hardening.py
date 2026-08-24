#!/usr/bin/env python3
"""
Apply the percentage catalogue hardening batch.

Run from the repository root:

    python apply_percentage_catalogue_hardening.py --check
    python apply_percentage_catalogue_hardening.py --apply

What it does:
- patches exact PDF_RENDER answer-space measurements into the remaining
  compound-percentage and reverse-percentage source-question files;
- copies full replacement marking-scheme catalogue files containing
  mark-by-mark evidence, answer-only rules, structured error/follow-through
  rules, common responses, and exact source-layout measurements;
- preserves every other question-catalogue field exactly as it currently is;
- makes a timestamped backup before --apply writes anything.
"""
from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
import shutil
import sys

QUESTION_BLOCKS = {'course-data/source-question-catalog/N5_Maths_2016/Paper2/N5_Maths_2016_P2_Q01.ts': 'answerSpace: {\n    category: "MEDIUM",\n    estimatedLines: 6,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 19,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 816,\n      bottomPx: 1759,\n      heightPx: 943,\n\n      topPt: 195.84,\n      bottomPt: 422.16,\n      heightPt: 226.32,\n\n      heightMm: 79.84,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q1 instruction line to the top of the Q2 question block on physical PDF page 19.",\n  }', 'course-data/source-question-catalog/N5_Maths_2017/Paper2/N5_Maths_2017_P2_Q02.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 7,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 19,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 2024,\n      bottomPx: 3109,\n      heightPx: 1085,\n\n      topPt: 485.76,\n      bottomPt: 746.16,\n      heightPt: 260.4,\n\n      heightMm: 91.86,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q2 rounding instruction to the top of the \'[Turn over]\' marker on physical PDF page 19.",\n  }', 'course-data/source-question-catalog/N5_Maths_2018/Paper2/N5_Maths_2018_P2_Q01.ts': 'answerSpace: {\n    category: "FULL_PAGE",\n    estimatedLines: 15,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 23,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 816,\n      bottomPx: 3228,\n      heightPx: 2412,\n\n      topPt: 195.84,\n      bottomPt: 774.72,\n      heightPt: 578.88,\n\n      heightMm: 204.22,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q1 instruction line to the top of the barcode/footer region on physical PDF page 23. Q1 is the only question on the page, so this is a page-layout outlier rather than a minimum working-space requirement.",\n  }', 'course-data/source-question-catalog/N5_Maths_2019/Paper2/N5_Maths_2019_P2_Q01.ts': 'answerSpace: {\n    category: "MEDIUM",\n    estimatedLines: 6,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 23,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 816,\n      bottomPx: 1768,\n      heightPx: 952,\n\n      topPt: 195.84,\n      bottomPt: 424.32,\n      heightPt: 228.48,\n\n      heightMm: 80.6,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q1 instruction line to the top of the Q2 question block on physical PDF page 23.",\n  }', 'course-data/source-question-catalog/N5_Maths_2021/Paper2/N5_Maths_2021_P2_Q01.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 6,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 18,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 840,\n      bottomPx: 1901,\n      heightPx: 1061,\n\n      topPt: 201.6,\n      bottomPt: 456.24,\n      heightPt: 254.64,\n\n      heightMm: 89.83,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q1 instruction line to the top of the Q2 question block on physical PDF page 18.",\n  }', 'course-data/source-question-catalog/N5_Maths_2022/Paper2/N5_Maths_2022_P2_Q02.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 8,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 16,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 1854,\n      bottomPx: 3228,\n      heightPx: 1374,\n\n      topPt: 444.96,\n      bottomPt: 774.72,\n      heightPt: 329.76,\n\n      heightMm: 116.33,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q2 rounding instruction to the top of the barcode/footer region on physical PDF page 16.",\n  }', 'course-data/source-question-catalog/N5_Maths_2023/Paper2/N5_Maths_2023_P2_Q01.ts': 'answerSpace: {\n    category: "MEDIUM",\n    estimatedLines: 6,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 17,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 852,\n      bottomPx: 1795,\n      heightPx: 943,\n\n      topPt: 204.48,\n      bottomPt: 430.8,\n      heightPt: 226.32,\n\n      heightMm: 79.84,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q1 instruction line to the top of the Q2 question block on physical PDF page 17.",\n  }', 'course-data/source-question-catalog/N5_Maths_2024/Paper2/N5_Maths_2024_P2_Q01.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 6,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 17,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 773,\n      bottomPx: 1834,\n      heightPx: 1061,\n\n      topPt: 185.52,\n      bottomPt: 440.16,\n      heightPt: 254.64,\n\n      heightMm: 89.83,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q1 instruction line to the top of the Q2 question block on physical PDF page 17.",\n  }', 'course-data/source-question-catalog/N5_Maths_2025/Paper2/N5_Maths_2025_P2_Q01.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 9,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 16,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 828,\n      bottomPx: 2362,\n      heightPx: 1534,\n\n      topPt: 198.72,\n      bottomPt: 566.88,\n      heightPt: 368.16,\n\n      heightMm: 129.88,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q1 instruction line to the top of the \'[Turn over]\' marker on physical PDF page 16.",\n  }', 'course-data/source-question-catalog/N5_Maths_2014/Paper1/N5_Maths_2014_P1_Q09.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 7,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 9,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 1758,\n      bottomPx: 2937,\n      heightPx: 1179,\n\n      topPt: 421.92,\n      bottomPt: 704.88,\n      heightPt: 282.96,\n\n      heightMm: 99.82,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q9 instruction line to the top of the \'[Turn over]\' marker on physical PDF page 9.",\n  }', 'course-data/source-question-catalog/N5_Maths_2015/Paper2/N5_Maths_2015_P2_Q08.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 8,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 24,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 1927,\n      bottomPx: 3228,\n      heightPx: 1301,\n\n      topPt: 462.48,\n      bottomPt: 774.72,\n      heightPt: 312.24,\n\n      heightMm: 110.15,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q8 instruction line to the top of the barcode/footer region on physical PDF page 24.",\n  }', 'course-data/source-question-catalog/N5_Maths_2017/Paper2/N5_Maths_2017_P2_Q05.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 6,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 21,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 2129,\n      bottomPx: 3120,\n      heightPx: 991,\n\n      topPt: 510.96,\n      bottomPt: 748.8,\n      heightPt: 237.84,\n\n      heightMm: 83.9,\n    },\n\n    notes:\n      "Remeasured at 300 dpi from the bottom of the final Q5 question line to the top of the \'[Turn over]\' marker on physical PDF page 21. This replaces the previous shifted coordinate pair.",\n  }', 'course-data/source-question-catalog/N5_Maths_2018/Paper2/N5_Maths_2018_P2_Q11.ts': 'answerSpace: {\n    category: "FULL_PAGE",\n    estimatedLines: 12,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 32,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 1180,\n      bottomPx: 3228,\n      heightPx: 2048,\n\n      topPt: 283.2,\n      bottomPt: 774.72,\n      heightPt: 491.52,\n\n      heightMm: 173.4,\n    },\n\n    notes:\n      "Remeasured from the bottom of the final Q11 instruction line to the top of the barcode/footer region on physical PDF page 32. Q11 is the only question on this page, so the large region is a page-layout outlier.",\n  }', 'course-data/source-question-catalog/N5_Maths_2019/Paper2/N5_Maths_2019_P2_Q09.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 8,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 29,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 588,\n      bottomPx: 1935,\n      heightPx: 1347,\n\n      topPt: 141.12,\n      bottomPt: 464.4,\n      heightPt: 323.28,\n\n      heightMm: 114.05,\n    },\n\n    notes:\n      "Remeasured from the bottom of the final Q9 instruction line to the top of the Q10 prompt block on physical PDF page 29. This normalises the previous shifted coordinates.",\n  }', 'course-data/source-question-catalog/N5_Maths_2021/Paper1/N5_Maths_2021_P1_Q12.ts': 'answerSpace: {\n    category: "MEDIUM",\n    estimatedLines: 5,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 10,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 510,\n      bottomPx: 1386,\n      heightPx: 876,\n\n      topPt: 122.4,\n      bottomPt: 332.64,\n      heightPt: 210.24,\n\n      heightMm: 74.17,\n    },\n\n    notes:\n      "Remeasured from the bottom of the final Q12 instruction line to the top of the Q13 prompt block on physical PDF page 10.",\n  }', 'course-data/source-question-catalog/N5_Maths_2022/Paper1/N5_Maths_2022_P1_Q10.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 8,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 9,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 521,\n      bottomPx: 1805,\n      heightPx: 1284,\n\n      topPt: 125.04,\n      bottomPt: 433.2,\n      heightPt: 308.16,\n\n      heightMm: 108.71,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q10 instruction line to the top of the Q11 prompt block on physical PDF page 9.",\n  }', 'course-data/source-question-catalog/N5_Maths_2023/Paper2/N5_Maths_2023_P2_Q06.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 7,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 21,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 521,\n      bottomPx: 1690,\n      heightPx: 1169,\n\n      topPt: 125.04,\n      bottomPt: 405.6,\n      heightPt: 280.56,\n\n      heightMm: 98.98,\n    },\n\n    notes:\n      "Measured from the bottom of the final Q6 instruction line to the top of the Q7 prompt block on physical PDF page 21.",\n  }', 'course-data/source-question-catalog/N5_Maths_2024/Paper2/N5_Maths_2024_P2_Q05.ts': 'answerSpace: {\n    category: "MEDIUM",\n    estimatedLines: 5,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 19,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 1851,\n      bottomPx: 2617,\n      heightPx: 766,\n\n      topPt: 444.24,\n      bottomPt: 628.08,\n      heightPt: 183.84,\n\n      heightMm: 64.85,\n    },\n\n    notes:\n      "Remeasured from the bottom of the final Q5 instruction line to the top of the \'[Turn over]\' marker on physical PDF page 19. The previous height was correct but both coordinates were offset.",\n  }', 'course-data/source-question-catalog/N5_Maths_2025/Paper1/N5_Maths_2025_P1_Q04.ts': 'answerSpace: {\n    category: "LARGE",\n    estimatedLines: 8,\n    measurementMethod: "PDF_RENDER",\n\n    sourceMeasurement: {\n      pdfPageNumber: 4,\n      renderDpi: 300,\n      pageWidthPx: 2481,\n      pageHeightPx: 3508,\n\n      topPx: 1922,\n      bottomPx: 3228,\n      heightPx: 1306,\n\n      topPt: 461.28,\n      bottomPt: 774.72,\n      heightPt: 313.44,\n\n      heightMm: 110.57,\n    },\n\n    notes:\n      "Remeasured from the bottom of the final Q4 instruction line to the top of the barcode/footer region on physical PDF page 4. Q4 is the final question on the page, so part of this area reflects page layout.",\n  }'}

REPLACEMENTS_ROOT = Path(__file__).resolve().parent / "replacements"

REQUIRED_QUESTION_SCHEMA_TOKEN = "pdfPageNumber?:"
REQUIRED_MS_SCHEMA_TOKEN = "sourceLayout?:"


def find_object_end(text: str, open_brace: int) -> int:
    depth = 0
    in_string = False
    quote = ""
    escaped = False

    for i in range(open_brace, len(text)):
        ch = text[i]

        if in_string:
            if escaped:
                escaped = False
                continue
            if ch == "\\":
                escaped = True
                continue
            if ch == quote:
                in_string = False
            continue

        if ch in ("'", '"', "`"):
            in_string = True
            quote = ch
            continue

        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return i

    raise ValueError("Could not find matching closing brace.")


def patch_answer_space(text: str, replacement: str) -> str:
    marker = "answerSpace:"
    marker_index = text.find(marker)
    if marker_index < 0:
        raise ValueError("answerSpace field not found.")

    open_brace = text.find("{", marker_index + len(marker))
    if open_brace < 0:
        raise ValueError("answerSpace opening brace not found.")

    close_brace = find_object_end(text, open_brace)

    # Preserve the indentation used by the answerSpace property itself.
    line_start = text.rfind("\n", 0, marker_index) + 1
    indent = text[line_start:marker_index]
    replacement_indented = replacement.replace("\n", "\n" + indent)

    return text[:marker_index] + replacement_indented + text[close_brace + 1:]


def require_schema(repo: Path) -> None:
    q_schema = repo / "course-data/source-question-catalog/SourceQuestionTypes.ts"
    ms_schema = repo / "course-data/source-marking-scheme-catalog/SourceMarkingSchemeTypes.ts"

    if not q_schema.exists() or REQUIRED_QUESTION_SCHEMA_TOKEN not in q_schema.read_text(encoding="utf-8"):
        raise RuntimeError(
            "SourceQuestionTypes.ts does not contain the new pdfPageNumber field. "
            "Apply the hardened SourceQuestionTypes.ts first."
        )

    if not ms_schema.exists() or REQUIRED_MS_SCHEMA_TOKEN not in ms_schema.read_text(encoding="utf-8"):
        raise RuntimeError(
            "SourceMarkingSchemeTypes.ts does not contain the new sourceLayout field. "
            "Apply the hardened SourceMarkingSchemeTypes.ts first."
        )


def collect_changes(repo: Path):
    changes = []

    for rel, block in QUESTION_BLOCKS.items():
        path = repo / rel
        if not path.exists():
            raise FileNotFoundError(f"Missing question catalogue file: {rel}")

        before = path.read_text(encoding="utf-8")
        after = patch_answer_space(before, block)

        if before != after:
            changes.append(("question", rel, before, after))

    for replacement in sorted(REPLACEMENTS_ROOT.rglob("*.ts")):
        rel = replacement.relative_to(REPLACEMENTS_ROOT).as_posix()
        target = repo / rel
        if not target.exists():
            raise FileNotFoundError(f"Missing marking-scheme catalogue file: {rel}")

        before = target.read_text(encoding="utf-8")
        after = replacement.read_text(encoding="utf-8")

        if before != after:
            changes.append(("marking-scheme", rel, before, after))

    return changes


def apply_changes(repo: Path, changes) -> Path:
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_root = repo / ".percentage_catalogue_hardening_backup" / stamp

    for _, rel, before, after in changes:
        target = repo / rel
        backup = backup_root / rel
        backup.parent.mkdir(parents=True, exist_ok=True)
        backup.write_text(before, encoding="utf-8")
        target.write_text(after, encoding="utf-8")

    return backup_root


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true")
    mode.add_argument("--apply", action="store_true")
    parser.add_argument(
        "--repo",
        default=".",
        help="Repository root. Defaults to the current directory.",
    )
    args = parser.parse_args()

    repo = Path(args.repo).resolve()

    require_schema(repo)
    changes = collect_changes(repo)

    question_count = sum(kind == "question" for kind, *_ in changes)
    ms_count = sum(kind == "marking-scheme" for kind, *_ in changes)

    print(f"Question catalogue files to update: {question_count}")
    print(f"Marking-scheme files to replace: {ms_count}")
    print(f"Total files to change: {len(changes)}")

    for kind, rel, *_ in changes:
        print(f"  [{kind}] {rel}")

    if args.check:
        print("\nCheck complete. No files were written.")
        return 0

    backup_root = apply_changes(repo, changes)
    print(f"\nApplied {len(changes)} changes.")
    print(f"Backup written to: {backup_root}")
    print("\nNext run your normal TypeScript/build checks.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
