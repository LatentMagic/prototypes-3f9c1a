#!/usr/bin/env bash
# Scaffold a Circlists candidate as its own rail node: a full copy of canon.
# Usage: tools/new-candidate.sh <slug> ["Version name"] ["ticket"]
#   Copies app/circlists/canon/ (minus docs/ and skills/) to app/circlists/<slug>/,
#   gives its circlists.html a title and its own persisted-state key, and prints the
#   index.html node block to paste after canon in APPS.circlists.prototypes.
# Modify the copy directly; canon is never touched and nothing hooks into it.
# Refuses to overwrite an existing folder. Delete the folder and node once ratified.
set -euo pipefail
slug="${1:?usage: tools/new-candidate.sh <slug> [\"Version name\"] [\"ticket\"]}"
version="${2:-$slug}"; ticket="${3:-—}"
root="$(cd "$(dirname "$0")/.." && pwd)"
src="$root/app/circlists/canon"; dst="$root/app/circlists/$slug"
[ -e "$dst" ] && { echo "exists: $dst" >&2; exit 1; }
mkdir -p "$dst"
rsync -a --exclude docs --exclude skills "$src/" "$dst/"
awk -v slug="$slug" '
  /<title>Circlists<\/title>/ { print "<title>Circlists — " slug " candidate</title>"; next }
  /<script src="https:\/\/unpkg.com\/react@/ && !k { print "<script>window.CIRC_STATE_KEY = \"circ_" slug "_state_v1\";</script>"; k=1 }
  { print }
' "$src/circlists.html" > "$dst/circlists.html"
echo "copied canon -> $dst"
cat <<EOF

Add after the canon node in index.html (APPS.circlists.prototypes):
        {
          slug: '$slug',
          version: '$version',
          ticket: '$ticket',
          html: 'circlists.html',
          kind: 'candidate',
          desc: '<what this node is, one line>'
        }
EOF
