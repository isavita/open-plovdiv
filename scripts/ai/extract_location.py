#!/usr/bin/env python3
"""Draft location extractor placeholder for future AI-assisted workflows."""

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

    json.dump(
        {
            "project_id": project.get("id"),
            "ai_assisted": False,
            "human_reviewed": False,
            "location": project.get("location"),
        },
        sys.stdout,
        ensure_ascii=False,
        indent=2,
    )
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
