# CLOUD.md

Read and applied when this repo runs in a **remote environment** (Claude Code on the web, a routine's cloud fire). Local sessions ignore it.

- **The Playwright CLI is not installed here**, and the `lm-tooling:playwright-cli` skill does not load. `playwright-core` and a Chromium are: `/opt/pw-browsers/chromium-*/chrome-linux/chrome`.
- **Chromium cannot reach the CDN or the published site; `curl` can.** The agent proxy's CA is not trusted by the browser, so unpkg, Google Fonts and `latentmagic.github.io` fail with `ERR_CONNECTION_RESET` while `curl` gets 200. A prototype opened in a bare browser here renders blank, and a live URL can never be verified in a browser even when the deploy is real.
- **The check here is `npm run check`** (`npm install` first): it caches the three unpkg runtime files with `curl` once, then drives Chromium through every registered state with the CDN served from that cache. Read its screenshots in `.playwright-mcp/check/`. Fonts render as fallbacks.
- **Confirm a deploy with `curl`, not the API.** `gh api repos/LatentMagic/prototypes-3f9c1a/pages/builds/latest` is blocked by the proxy (403). Fetch the deployed file and grep for the new symbol: `curl -sfL https://latentmagic.github.io/prototypes-3f9c1a/app/circlists/canon/app/<module>.jsx | grep <symbol>`.
- **Check the branch before believing the tree.** Driven from another checkout, this repo can arrive in detached HEAD with local `main` behind `origin/main`; `git checkout main` then silently drops the last session's work from disk. First: `git checkout main && git merge --ff-only origin/main`, and assert `HEAD` equals `origin/main`.
- **Land the work.** The container is ephemeral. A push to `main` deploys; a branch push deploys nothing, so open a PR when the change wants review. Never end a remote session with work on an unpushed branch.
