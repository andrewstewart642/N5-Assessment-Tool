#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import sys

HERE = Path(__file__).resolve().parent
MANIFEST = json.loads((HERE / "measurement_manifest.json").read_text(encoding="utf-8"))

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=".")
    args = parser.parse_args()
    repo = Path(args.repo).resolve()

    errors = []

    for row in MANIFEST["questionCataloguePatches"]:
        path = repo / row["path"]
        if not path.exists():
            errors.append(f"missing question file: {row['path']}")
            continue
        text = path.read_text(encoding="utf-8")
        checks = [
            f"pdfPageNumber: {row['page']}",
            f"topPx: {row['top']}",
            f"bottomPx: {row['bottom']}",
            f"heightPx: {row['height']}",
            'measurementMethod: "PDF_RENDER"',
        ]
        for token in checks:
            if token not in text:
                errors.append(f"{row['path']}: missing {token}")

    for row in MANIFEST["markingSchemeReplacements"]:
        path = repo / row["path"]
        if not path.exists():
            errors.append(f"missing marking-scheme file: {row['path']}")
            continue
        text = path.read_text(encoding="utf-8")
        for token in [
            "markEvidence",
            "correctAnswerWithoutWorking",
            "sourceLayout",
            "coreEvidenceBlock",
            "fullQuestionBlock",
        ]:
            if token not in text:
                errors.append(f"{row['path']}: missing {token}")

    if errors:
        print("Percentage catalogue hardening verification FAILED:\n")
        for error in errors:
            print(" -", error)
        return 1

    print(
        "Percentage catalogue hardening verification passed: "
        f"{len(MANIFEST['questionCataloguePatches'])} question files and "
        f"{len(MANIFEST['markingSchemeReplacements'])} marking-scheme files."
    )
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
