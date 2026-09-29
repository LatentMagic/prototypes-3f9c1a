#!/usr/bin/env bash
# Scaffold a Circlists candidate build entry from canon's circlists.html.
# Usage: tools/new-candidate.sh <ticket-folder> [overlay.jsx ...]
#   <ticket-folder> = docs/specs/<name> under app/circlists/canon (created if absent)
#   overlays        = cand-*.jsx filenames in that folder, loaded in the order given,
#                     after every app/ module and just before app/main.jsx.
# Writes docs/specs/<name>/circlists-<name>.html per canon's candidate-build skill:
# <base href="../../../">, its own persisted-state key, overlays before main.jsx.
# Refuses to overwrite an existing entry. The entry copies canon's <head> by design
# (the one accepted duplication); re-run into a new file, never over a hand-edited one.
set -euo pipefail
name="${1:?usage: tools/new-candidate.sh <ticket-folder> [overlay.jsx ...]}"; shift
canon="$(cd "$(dirname "$0")/.." && pwd)/app/circlists/canon"
dir="$canon/docs/specs/$name"; out="$dir/circlists-$name.html"
[ -e "$out" ] && { echo "exists: $out" >&2; exit 1; }
mkdir -p "$dir"
tags=""
for f in "$@"; do tags+="<script type=\"text/babel\" src=\"docs/specs/$name/$f\"></script>\n"; done
awk -v name="$name" -v tags="$tags" '
  /<meta name="viewport"/ { print; print "<base href=\"../../../\" />"; next }
  /<title>/ { print "<title>Circlists — " name " candidate</title>"; next }
  /<script src="https:\/\/unpkg.com\/react@/ && !k { print "<script>window.CIRC_STATE_KEY = \"circ_" name "_state_v1\";</script>"; k=1 }
  /src="app\/main.jsx"/ { printf "%s", tags }
  { print }
' "$canon/circlists.html" | sed 's/\\n/\n/g' > "$out"
echo "$out"
