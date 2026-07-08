# LatentPulse Alpha — Design Prototype

Point-in-time export of the LatentPulse Alpha design prototype. Implementation reference for the alpha UI. Not evergreen — does not track later design changes.

**Run:** serve over HTTP, then open in a browser. Do **not** double-click the HTML — see why below.

```bash
cd specs/projects/latent-pulse/prototype
python3 -m http.server 8000
```

Open <http://localhost:8000/latentpulse.html>. Ctrl-C to stop the server.

**Why a server is needed:** the page compiles its `.jsx` files in-browser via Babel-standalone, which fetches each one over `XMLHttpRequest`. Opening the file directly gives it the `file://` origin (`null`), and browsers block cross-origin requests from `file://` — every `.jsx` fetch fails with a CORS error and nothing renders. Serving over `http://` gives the page a real origin, so the fetches succeed.

| | |
|---|---|
| Version | v0.2.1 |
| Retrieved | 2026-06-11 |
| Source | [Claude Design](https://claude.ai/design/p/60ada0b1-f594-41de-9939-f565c117f043) |
| Ticket | LM-239 |

## Compare a rendered surface against this prototype

Validation compares a real LP surface side by side with this prototype (`lm-playbook:06-validate`, design-review lens). Serve both, drive with the Playwright CLI (`lm-tooling:playwright-cli`).

Serve the app in **fake** auth + billing mode so the API accepts the fake session and checkout auto-completes:

```bash
export LP_DATABASE_URL="$(grep -m1 '^LP_DATABASE_URL=' .env.local | cut -d= -f2-)"
export LP_AUTH_MODE=fake LP_BILLING_MODE=fake
npx nx run latent-pulse-web:serve   # web :4300, api :9230
```

**Why the env vars:** `.env.local` defaults the API to `LP_AUTH_MODE=clerk` / `LP_BILLING_MODE=paddle`. The dev web bundle is always fake, so the UI renders authenticated — but the API reads `process.env` and returns **401 on `/api/spaces`**, stalling the feed flow on `/spaces/fund`, unless the API is also fake.

Reach a populated feed: `/spaces/create` → fill **Space name** → Continue → **Fund this space** (auto-completes) → FAB **Add a link**. Card host selector is `lp-feed-card`. Run standalone Playwright scripts from the **repo root** so `@playwright/test` resolves.

**Why committed:** Claude Design artifacts aren't shareable outside the owner's account (no team/enterprise plan yet). Committed so a second engineer can reference it. Remove in a future cleanup once sharing is available.
