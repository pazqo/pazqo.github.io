#!/usr/bin/env python3
"""Copy missing sudokupad-* files from ~/Downloads to public/solves."""

import os
import shutil
from pathlib import Path

DOWNLOADS_DIR = Path.home() / "Downloads"
SOLVES_DIR = Path(__file__).parent.parent / "public" / "solves"

def main():
    # Ensure solves directory exists
    SOLVES_DIR.mkdir(parents=True, exist_ok=True)

    # Get existing files in solves
    existing = set(f.name for f in SOLVES_DIR.iterdir() if f.is_file())
    print(f"Found {len(existing)} existing files in {SOLVES_DIR}")

    # Find sudokupad files in Downloads, ignoring duplicate downloads like "(1)"
    downloads_files = [
        f for f in DOWNLOADS_DIR.glob("sudokupad-*")
        if "(1)" not in f.name
    ]
    print(f"Found {len(downloads_files)} sudokupad-* files in {DOWNLOADS_DIR}")

    # Copy missing files
    copied = 0
    for src in downloads_files:
        if src.name not in existing:
            dst = SOLVES_DIR / src.name
            shutil.copy2(src, dst)
            print(f"  Copied: {src.name}")
            copied += 1

    print(f"\nDone! Copied {copied} new files.")

if __name__ == "__main__":
    main()
