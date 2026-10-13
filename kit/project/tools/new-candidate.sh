#!/usr/bin/env bash
# Scaffold a candidate build: copy the root index.html into the ticket's
# candidate/ folder (own <base>, own storage key, an overlay script tag before
# app/main.jsx) and write a stub bridge file. The shared app/ is not copied.
# Edit the copy and the overlays; the root index.html stays untouched.
# To throw the candidate away, archive the folder and switch its launcher entry off
# (skills/candidate-build/SKILL.md); nothing is deleted.
set -euo pipefail
usage='usage: tools/new-candidate.sh <ticket> ["Name"]'
case "${1:-}" in ''|-h|--help) echo "$usage" >&2; exit 1 ;; esac
ticket="$1"; name="${2:-$ticket}"
[[ "$ticket" =~ ^[a-z0-9][a-z0-9-]*$ ]] || { echo "ticket must be lowercase letters, digits, hyphens" >&2; exit 1; }
root="$(cd "$(dirname "$0")/.." && pwd)"
dir="$root/docs/specs/$ticket/candidate"
[ -e "$dir" ] && { echo "exists: $dir" >&2; exit 1; }
mkdir -p "$dir"
bridge="docs/specs/$ticket/candidate/cand-$ticket-bridge.jsx"
cat > "$dir/cand-$ticket-bridge.jsx" <<JSX
// Candidate build for $ticket: the one handle app/main.jsx reads (skills/candidate-build).
// Loads after the app/ files it re-publishes over and before app/main.jsx.
// bind(api) is called each render with the app's state and setters; Screen, if set,
// is rendered in place of the app's screen. Nothing here is accepted.
Object.assign(window, {
  KitCandidate: {
    bind(api) { window.KitCandidateApi = api; },
    // Screen: ({ api }) => <CandidateScreen api={api} />,
  },
});
JSX
awk -v t="$ticket" -v n="$name" -v b="$bridge" '
  /<title>/ { print "<title>" n " (candidate)</title>"; next }
  /<head>/ && !h { print; print "<base href=\"../../../../\" />"; h=1; next }
  /<script src="https:\/\/unpkg.com\/react@/ && !k { print "<script>window.KIT_STATE_KEY = \"kit_" t "_candidate\";</script>"; k=1 }
  /src="app\/main.jsx"/ && !m { print "<script type=\"text/babel\" src=\"" b "\"></script>"; m=1 }
  { print }
' "$root/index.html" > "$dir/index.html"
cat <<EOF
Wrote $dir (index.html and cand-$ticket-bridge.jsx).
Add to the ticket's entries in playgrounds.json:
  { "kind": "candidate", "name": "$name", "path": "docs/specs/$ticket/candidate/index.html", "note": "<one line>" }
EOF
