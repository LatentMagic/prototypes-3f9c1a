#!/usr/bin/env bash
set -o pipefail

# Claude Code PreToolUse hook — intercepts git push and pesters the agent to
# confirm with the user first. A push here deploys to GitHub Pages immediately,
# so this exists to avoid burning deploys on partial work.
# Exit 0 = allow, Exit 2 + stderr = block and feed the message back to the agent.

input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // empty')

if [[ "$command" != *"git push"* ]]; then
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
