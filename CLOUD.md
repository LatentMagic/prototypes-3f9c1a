# CLOUD.md

Read and applied when this repo runs in a **remote environment** (Claude Code on the web, a routine's cloud fire). Local sessions ignore it.

## First: let the browser trust the proxy

Every https request from the sandbox goes through an agent proxy. `curl` trusts its certificate; Chromium does not (it reads the NSS store, not the system CA file), so a bare browser fails every page with `ERR_CERT_AUTHORITY_INVALID` — the CDN, Google Fonts and the published console alike. One import per session fixes it:

```
which certutil >/dev/null || apt-get install -y -q libnss3-tools
mkdir -p ~/.pki/nssdb && [ -f ~/.pki/nssdb/cert9.db ] || certutil -d sql:$HOME/.pki/nssdb -N --empty-password
awk '/-----BEGIN CERTIFICATE-----/{n++} n==1' /root/.ccr/ca-bundle.crt > /tmp/proxy-ca.pem
certutil -d sql:$HOME/.pki/nssdb -A -n agentproxy -t "C,," -i /tmp/proxy-ca.pem
```

After that the browser reaches unpkg, the fonts and `latentmagic.github.io`, so a prototype renders exactly as it does locally and a live URL can be verified, not only curled.

## Then: the Playwright CLI, as in a local session

`playwright-cli` is not installed here and the `lm-tooling:playwright-cli` skill does not load. `npx -y @playwright/cli` runs it. It expects Google Chrome, which is absent; point it at the bundled Chromium once, from the directory you run it in:

```
mkdir -p .playwright && printf '%s' '{ "browser": { "browserName": "chromium", "launchOptions": { "executablePath": "'"$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -n1)"'", "args": ["--no-sandbox"] } } }' > .playwright/cli.config.json
```

Then `npx -y @playwright/cli open <url>`, `screenshot`, `snapshot`, `close`, per the skill. `npm run check` still works as the full walk and needs neither step, since it caches the runtime itself.

## Also

- **Confirm a deploy with `curl`, not the API.** `gh api repos/LatentMagic/prototypes-3f9c1a/pages/builds/latest` is blocked by the proxy (403). Fetch the deployed file and grep for the new symbol, or open the live URL in the browser once the certificate is trusted.
- **Check the branch before believing the tree.** Driven from another checkout, this repo can arrive in detached HEAD with local `main` behind `origin/main`; `git checkout main` then silently drops the last session's work from disk. First: `git checkout main && git merge --ff-only origin/main`, and assert `HEAD` equals `origin/main`.
- **Land the work.** The container is ephemeral. A push to `main` deploys; a branch push deploys nothing, so open a PR when the change wants review. Never end a remote session with work on an unpushed branch.
