#!/bin/bash

# Rename screenshot files to sequential step names
# Usage: ./rename-steps.sh [options]
#
# Options:
#   -d, --dir DIR       Directory containing files (default: current directory)
#   -p, --pattern PAT   Glob pattern to match files (default: "Screenshot*.png")
#   -o, --output PREFIX Output prefix (default: "step")
#   -n, --dry-run       Show what would be renamed without doing it
#   -h, --help          Show this help message

set -e

# Defaults
DIR="."
PATTERN="Screenshot*.png"
PREFIX="step"
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -d|--dir)
      DIR="$2"
      shift 2
      ;;
    -p|--pattern)
      PATTERN="$2"
      shift 2
      ;;
    -o|--output)
      PREFIX="$2"
      shift 2
      ;;
    -n|--dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      head -14 "$0" | tail -13
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Find matching files, sorted by name (chronological for timestamps)
cd "$DIR"

# Count files first
count=$(find . -maxdepth 1 -name "$PATTERN" | wc -l | tr -d ' ')

if [[ "$count" -eq 0 ]]; then
  echo "No files matching '$PATTERN' found in $DIR"
  exit 1
fi

echo "Found $count files to rename:"

counter=1
find . -maxdepth 1 -name "$PATTERN" -print0 | sort -z | while IFS= read -r -d '' file; do
  file="${file#./}"  # Remove ./ prefix from find
  ext="${file##*.}"
  newname="${PREFIX}_${counter}.${ext}"

  if [[ "$DRY_RUN" == true ]]; then
    echo "  $file -> $newname"
  else
    mv -- "$file" "$newname"
    echo "  $file -> $newname"
  fi

  ((counter++))
done

if [[ "$DRY_RUN" == true ]]; then
  echo ""
  echo "(dry run - no files were renamed)"
fi
