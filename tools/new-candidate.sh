#!/usr/bin/env bash
# Copy canon to app/circlists/<slug>/ as a candidate rail node, then print its
# index.html entry. Edit the copy; canon stays untouched. Delete both once ratified.
set -euo pipefail
usage='usage: tools/new-candidate.sh <slug> ["Version name"] ["ticket"]'
case "${1:-}" in ''|-h|--help) echo "$usage" >&2; exit 1 ;; esac
slug="$1"; version="${2:-$slug}"; ticket="${3:-—}"
[[ "$slug" =~ ^[a-z0-9][a-z0-9-]*$ ]] || { echo "slug must be lowercase letters, digits, hyphens" >&2; exit 1; }
root="$(cd "$(dirname "$0")/.." && pwd)"
src="$root/app/circlists/canon"; dst="$root/app/circlists/$slug"
[ -e "$dst" ] && { echo "exists: $dst" >&2; exit 1; }
mkdir -p "$dst"
rsync -a --exclude docs --exclude skills --exclude 'playgrounds.*' "$src/" "$dst/"
# Own page title, and its own localStorage key so it never shares canon's state.
awk -v slug="$slug" '
  /<title>Circlists<\/title>/ { print "<title>Circlists — " slug " candidate</title>"; next }
  /<script src="https:\/\/unpkg.com\/react@/ && !k { print "<script>window.CIRC_STATE_KEY = \"circ_" slug "_state_v1\";</script>"; k=1 }
  { print }
' "$src/circlists.html" > "$dst/circlists.html"
cat <<EOF
Copied canon to $dst. Add after the canon node in index.html (APPS.circlists.prototypes):
        {
          slug: '$slug',
          version: '$version',
          ticket: '$ticket',
          html: 'circlists.html',
          kind: 'candidate',
          desc: '<one line>'
        }
EOF
