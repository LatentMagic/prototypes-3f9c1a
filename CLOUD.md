# CLOUD.md

Read and applied when this repo runs in a **remote environment** (Claude Code on the web, a routine's cloud fire). Local sessions ignore it.

Browser work uses `pw`, installed by the cloud setup script in business-ops; it handles the proxy certificate and Chromium path. `npm run check` still works as the full walk without it.

## Also

- **Confirm a deploy with `curl`, not the API.** `gh api repos/LatentMagic/prototypes-3f9c1a/pages/builds/latest` is blocked by the proxy (403). Fetch the deployed file and grep for the new symbol, or open the live URL in the browser once the certificate is trusted.
- **Check the branch before believing the tree.** Driven from another checkout, this repo can arrive in detached HEAD with local `main` behind `origin/main`; `git checkout main` then silently drops the last session's work from disk. First: `git checkout main && git merge --ff-only origin/main`, and assert `HEAD` equals `origin/main`.
- **Land the work.** The container is ephemeral. A push to `main` deploys; a branch push deploys nothing, so open a PR when the change wants review. Never end a remote session with work on an unpushed branch.
