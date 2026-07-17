#!/usr/bin/env bash
set -o pipefail

# Claude Code PreToolUse hook — intercepts git push and pesters the agent to
# confirm with the user first. A push here deploys to GitHub Pages immediately,
# so this exists to avoid burning deploys on partial work.
# Exit 0 = allow, Exit 2 + stderr = block and feed the message back to the agent.

input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // empty')

# Match `git` and `push` separately — they are NOT adjacent in
# `git -C <path> push`, the form used when this repo is driven from a
# business-ops session, so a literal *"git push"* test silently misses it and
# the gate never fires. Regex in a variable: an inline one with a bracket
# expression breaks the [[ ]] parse.
git_re='(^|[[:space:];&|])git[[:space:]]'
if [[ ! "$command" =~ $git_re ]] || [[ "$command" != *push* ]]; then
  exit 0
fi

if [[ "$command" == *"PUSH_CONFIRMED=1"* ]]; then
  exit 0
fi

cat >&2 <<'EOF'
Hold this push. It deploys to GitHub Pages immediately — ask the user first:
are they happy to push now, or is more work incoming that should land in the
same push? Once they confirm, re-run with the confirmation flag, e.g.:
  PUSH_CONFIRMED=1 git push
EOF
exit 2
