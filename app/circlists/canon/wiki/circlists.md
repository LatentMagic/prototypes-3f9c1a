---
type: Entity
title: "Circlists"
resource: https://app.circlists.com
description: "Circlists (formerly LatentPulse, formerly SCL) — shared multiplayer reading queue; stack, spec pointers, naming history, delivery epic #245."
tags: ["product", "go-to-market", "billing", "auth", "brand"]
timestamp: 2026-07-22T00:00:00Z
---

# Circlists — Product Memory

Specs (source of truth): [`specs/projects/circlists/`](https://github.com/LatentMagic/monorepo/tree/main/specs/projects/circlists) — `prd.md`, `hld.md`, `glossary.md`, `ui.md`.

## What it is

Shared multiplayer reading queue. Atomic unit = a URL. Core loop: drop a link → it appears in everyone's feed → each person reads it externally → marks it read in their own state. A communal library with individual read-state.

Formerly **Shared Content List (SCL)**; renamed 2026-04-18 (full naming history below).

**Status — Alpha, building on `main`.** Ships as one release; no incremental delivery until Alpha lands. Core loop complete end-to-end — create + fund a circle, add links, full link lifecycle (read · mark-read · clear) — per-circle billing live on Paddle. Current build: subscription lifecycle (funded ↔ dormant). Live delivery state tracked in epic [#245](https://github.com/LatentMagic/monorepo/issues/245) (stories CIRC-001–018), not mirrored here.

## Who it's for

Small trusted circles — a few people who already share links and want one calm shared place for them. Communal by nature, small by design: the whole circle, one price.

## How it's sold

**Per-circle billing — flat £3/circle/month**, via Paddle (Merchant of Record; handles VAT/tax/chargebacks). One champion funds a circle; everyone they invite reads free.

**Hard cap: 10 members per circle** (champion + 9). The cost-to-serve driver is members × articles × per-user read-state writes — not headcount — so the cap is the coarse safety rail. Deliberately a business-ops concern, not a product-spec rule. Marketed as "up to 10 — the whole circle, one price," with higher caps as a later paid elevation.

## Auth & subscriptions

All auth **in-app** on Clerk's headless SDK — no hosted account portal. Hosted Paddle portal scoped to cancel + update-card only. Decisions and surfaces: `hld.md`.

**Champion — de facto admin of the circle.** Funding the circle confers admin-level control of its *container*: membership (invite + remove members) and identity (rename the circle). Content actions — add, mark-read, delete — stay peer and identical for every member. This is a billing relationship, not a formal permission tier: the champion is the circle's *de facto* admin. A formal admin role — managing members and billing on others' behalf — is a deferred future direction (enterprise / team plans), out of v1. Governance boundary: `hld.md` Decision-27.

## Scope — deliberately out

Personal/single-player space, read-by avatars, digest card, non-URL items, automatic metadata extraction — all cut (research-backed). Delete is **everyone-delete** (a moderation action), not per-user dismissal. Rationale and full scope: `prd.md` (monorepo).

## Design

Brand — palette, type, mark, wordmark — is the Circlists brand: [circlists-brand.md](brand/circlists-brand.md). Realised on Zard UI primitives, WCAG 2.2 AA, 320px responsive baseline; full surface spec in `ui.md` (monorepo). Prototype: hosted console at https://latentmagic.github.io/prototypes-3f9c1a/ — this app's prototype versions, carrying the Circlists brand.

**Emotional intent** — felt target: Confident release (giving), Quiet cohesion (receiving), Composed relief (clearing). Calm is the floor; anxiety, performance, FOMO avoided by design. Source: `prd.md` Emotional intent section.

## Naming

**Name — Circlists (locked 2026-07-07).** Company: **Harness Intent**. Both `.com`s secured — `circlists.com` (product), `harnessintent.com` (company). The naming decision — candidates, criteria, `.com` clearance — is recorded in [BIZ-7](https://github.com/LatentMagic/business-ops/issues/7).

**History.** Shared Content List (SCL) → **LatentPulse** (2026-04-18) → **Circlists** (2026-07-07). Workspace folder `shared-content-list` → `latentpulse` → `circlists`; references to the old folders/names in archived docs are historically accurate and left as-is.

## Go-to-market

**Goal: 10 paying champions** (~£30/mo) — 10 living circles, won one at a time. The bet: *win one lovable circle at a time, by hand, and let lovability do the recruiting.* The binding constraint is converting + activating the **champion** (the hard, paying side), not awareness — the first activations are the leverage, and the 10-cap + word-of-mouth compound a few into more.

Sequenced across two phases — **alpha** (friends & family, warm outreach) → **v1** (cold, community, public launch). Channels on a value × effort axis: personal outreach (the spine) · community participation (Reddit richest) · launch directories · stretch levers later. Full plan: [circlists-marketing-strategy-first-10.md](circlists-marketing-strategy-first-10.md).

The **homepage** carries the "why" — a conversion surface, not discovery; Astro SSG in `LatentMagic/public-sites`. [circlists-homepage.md](circlists-homepage.md).

## Domain & trademark

`circlists.com` is **secured** and live. Two surfaces run on it: the app at **[app.circlists.com](https://app.circlists.com)** (sign-in required) and the homepage at **[circlists.com](https://circlists.com)** — see [circlists-homepage.md](circlists-homepage.md). Both are deployed and reachable, pre-launch. Contact address **support@circlists.com** (routed via Cloudflare; receive-only). Trademark filing (UK IPO + USPTO, classes 9+42) is still to be actioned — an open item now the name is locked.

## Mobile (future)

Mobile planned on **NativeScript** to share the Angular web codebase; built after the web app reaches maturity.

## Key references

- Positioning / market why: [circlists-positioning.md](circlists-positioning.md)
- Brand / design language: [circlists-brand.md](brand/circlists-brand.md)
- Auth layer: [clerk.md](../third-party/clerk.md)
- Billing layer: [paddle.md](../third-party/paddle.md)
- Homepage: [circlists-homepage.md](circlists-homepage.md)
- Copy voice: [circlists-copy-voice.md](circlists-copy-voice.md)
- Monorepo specs: [`specs/projects/circlists/`](https://github.com/LatentMagic/monorepo/tree/main/specs/projects/circlists)

# Citations

1. [Circlists specs — `specs/projects/circlists/`](https://github.com/LatentMagic/monorepo/tree/main/specs/projects/circlists)
2. [Delivery epic #245](https://github.com/LatentMagic/monorepo/issues/245)
3. [BIZ-7 — company + product naming decision](https://github.com/LatentMagic/business-ops/issues/7)
