#!/usr/bin/env python3
"""Placeholder for future budget source downloads.

The first version is intentionally manual-first. When official files are added,
this script should download originals into data/raw without overwriting reviewed
curated records.
"""

from __future__ import annotations

import pathlib


def main() -> int:
    pathlib.Path("data/raw").mkdir(parents=True, exist_ok=True)
    print("No remote download is configured for the MVP.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
