---
type: Entity
title: "Circlists Homepage"
resource: https://circlists.com
description: "Circlists homepage (which serves as the marketing site) — Astro SSG in LatentMagic/public-sites; live at circlists.com via Cloudflare Workers CD, pre-launch."
tags: ["product", "go-to-market", "brand"]
timestamp: 2026-07-22T00:00:00Z
---

# Circlists Homepage

Product page (the app itself): [circlists.md](circlists.md). Specs (source of truth): [`specs/projects/circlists/`](https://github.com/LatentMagic/public-sites/tree/main/specs/projects/circlists) — `intent.md`. Stack: built on [astro.md](../third-party/astro.md).

## What it is

The Circlists **homepage** (which serves as the marketing site) — a single-page (+ `/privacy`) static site that converts arriving visitors into email captures or `hello@` contact. A **conversion surface, not a discovery surface**; communicates the per-space model pre-launch, with no live charging. First app in the `public-sites` repo.

Lives at `LatentMagic/public-sites`, `apps/circlists/`.

## Stack

**Astro** static SSG, TypeScript. Deployed to **Cloudflare Workers** via wrangler, on a CD job that fires when CI passes on `main`. TDD-non-negotiable harness (Vitest unit + Playwright e2e), inherited from the `public-sites` repo floor — minus the monorepo's top-level governance.

## Status

**Live at [circlists.com](https://circlists.com) — deployed, not yet publicly launched.** The site carries a "Coming soon" marker pre-launch. Full Astro app merged via [public-sites#2](https://github.com/LatentMagic/public-sites/pull/2) (2026-06-15): single-card product carousel of the core loop, email capture, squad archetypes, £9/space pricing block, wordmark header, `hello@` mailto, `/privacy`. CI green at merge (ci · unit · e2e). Merged with conscious UI debt — iterating on `main` from here. On-page SEO floor merged ([#8](https://github.com/LatentMagic/public-sites/pull/8) + og:url guard [#12](https://github.com/LatentMagic/public-sites/pull/12)).

## Blockers & next

- **Public launch** — the one remaining gate. DNS is wired, CD is live and the site is reachable; a "Coming soon" posture holds until launch.
- **Next:** Cloudflare Web Analytics; live Rich Results / GSC validation, now deployable.

## Brand & GTM

The site carries the [Circlists brand](brand/circlists-brand.md) — lockup in the header and footer, emerald accent, cream ground. Contact address **support@circlists.com**. `circlists.com` is secured; trademark still to file — see [circlists.md](circlists.md) Domain & trademark.

# Citations

1. [Circlists marketing specs — `specs/projects/circlists/`](https://github.com/LatentMagic/public-sites/tree/main/specs/projects/circlists)
2. [public-sites#2 — full Astro app merge](https://github.com/LatentMagic/public-sites/pull/2)
3. [public-sites#8 — on-page SEO floor](https://github.com/LatentMagic/public-sites/pull/8)
4. [public-sites#12 — og:url guard](https://github.com/LatentMagic/public-sites/pull/12)
5. [public-sites#14 — email-capture embed](https://github.com/LatentMagic/public-sites/pull/14)
6. [Monorepo #164 — email-capture endpoint](https://github.com/LatentMagic/monorepo/issues/164)
7. [Monorepo #289 — rebrand rework](https://github.com/LatentMagic/monorepo/issues/289)
