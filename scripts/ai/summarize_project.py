#!/usr/bin/env python3
"""Create a draft project summary placeholder.

This MVP intentionally does not call an AI provider. Add provider-specific logic
only after summaries can be stored as draft fields and reviewed by a human.
"""

from __future__ import annotations

import argparse
import json
import sys


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="Path to a project JSON object")
    args = parser.parse_args()

    with open(args.input, "r", encoding="utf-8") as handle:
        project = json.load(handle)

    draft = {
        "project_id": project.get("id"),
        "ai_assisted": False,
        "human_reviewed": False,
        "draft_summary_bg": project.get("summary_bg", ""),
    }
    json.dump(draft, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
