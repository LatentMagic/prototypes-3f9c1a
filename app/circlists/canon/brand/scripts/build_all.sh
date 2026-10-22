#!/bin/sh
# Rebuild everything from a clean assets/. Uses the wiki's existing venv (install nothing into it).
# check_pack.py is run separately (it reads the prototype's tokens.css).
# "Clean" means every generated file is removed; the hand-written .md files in assets/ stay, and so do the
# hand-authored animated SVGs in assets/motion/ (build_motion.py checks them; it does not write them).
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
PY="${PY:-$HERE/../../../../../.venv/bin/python}"
cd "$HERE"
find "$HERE/../assets" -type f ! -name '*.md' ! -path '*/assets/motion/*' -delete
"$PY" build_mark.py
"$PY" wordmark-outline.py
"$PY" build_lockup.py
"$PY" build_rasters.py
"$PY" build_motion.py
"$PY" build_board.py
