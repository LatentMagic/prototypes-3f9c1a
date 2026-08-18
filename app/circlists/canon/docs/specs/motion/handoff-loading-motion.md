# Handoff — loading states + motion tuning

## Status: LANDED. Spinner fixed, loading model corrected to two states, pulse + spin tuned and confirmed. Updated micro (ring reveal) landed.

This session supersedes parts of `docs/HANDOFF-brand-motion.md` — read that one for the still-valid decisions it lists (rail uses `PulseLockup` not the bare mark; pulse lives on the rail not auth; the two inline-button spinners stay the plain ring). Its spinner *specifics* (32px, captions, four separate loading views, slate billing bg) are now out of date — this doc is the current truth for those.

## What landed this session

**The spinner bug (the real one).** The moving sage arc was drawn on top of a full sage halo disc of the *same* colour, so the rotation/growth was invisible — it read as a static green dot with a messy band around it ("rubbish wrapped around it"). Fix: removed the static disc (`BrandSpinner` in `app/brand-motion.jsx`). Now the bare sage arc sweeps visibly against the surface; the accent-green core + white ring hold at centre. Reduced-motion still fills the arc to a full sage ring. The `@keyframes` were structurally correct all along — nothing was wrong with the timing; the motion was simply camouflaged.

**Loading model corrected to TWO states (was mis-modelled as four).** The user's call, and it's right: auth-return / provisioning / billing-handoff are different *flows* but one *loading state*. There is now exactly:
- **In-shell feed load** — `FeedLoading` (`app/feed.jsx`). Spinner within the rail + top bar + tabs. Genuinely distinct because of that context.
- **App-level full-screen load** — `AppLoading` (`app/primitives.jsx`), a single component. `GoogleReturn` (`app/auth.jsx`), `SettingUp` + `ProviderInterstitial` (`app/subscriptions.jsx`) all delegate to it — they keep their own timers/routes but render the same loading treatment. Do NOT re-split these into per-flow spinners.

Both states: **100px**, caption-less, brand mark centred on the app canvas. Accessibility is a `role="status"` region + `aria-label` (the label is announced, never shown) — the visible "Entering this circle…" / "Completing sign-in…" copy is gone by user request; no a11y requirement forces visible text. The provider **slate `#0f172a` was removed from loading** — it's the provider-boundary theme and belongs only to the actual Checkout / ManageFunding screens (you're still inside Circlists while it loads).

**Two live motion controls (Tweaks → Brand motion), both confirmed:**
- **Pulse depth** — `--circ-pulse-amp`. Confirmed **7.5% → amp 1.075** (spec's 1.065 read too shallow to be visible).
- **Spin speed** — `--circ-spin-speed`, a multiplier on the spec tempo (1 = spec). Confirmed **1.4×** → rotor ~1.37s, arc-breathe scales with it (spec's 1.917s/2.5s read too slow to signal loading on a quick load).

Wiring: `app/circ-tweaks.jsx` (sliders + defaults), `app/main.jsx` (`useEffect` → sets the two CSS vars), `circlists.html` (`:root { --circ-pulse-amp: 1.075; --circ-spin-speed: 1.4; }` + the `calc()`-driven keyframes/durations). The pulse scale keyframes and both spinner durations read the vars live, so the sliders update motion in place.

**Config → "Loading states" lane** (in `app/config.jsx`): two held scenarios so each state can be vetted at rest — "Feed — in a circle (in-shell)" and "App — full screen". Held via a `holdLoading` flag in `app/main.jsx` that no-ops the interstitials' auto-advance `onDone`; an effect auto-clears it the instant the route leaves an interstitial, so real auth/billing/checkout flows never stick.

## Feed back to the motion-spec agent (confirmed values)
These are set in the app but the spec (`brand/motion/circlists-motion.md`) is the source of truth — it carries pending margin notes on each. Fold in on the next sync:
- Pulse **Depth**: amp 1.065 → **1.075** (+7.5%).
- Spinner **Tempo**: **× 1.4** (rotor 1.917s → ~1.37s; arc-breathe scales with it).
- Spinner construction: **no static sage disc** behind the arc; the halo is the sweeping arc alone (reduced-motion = full ring). Size **100px** in both loading states.

## Micro — LANDED (ring reveal)

The user replaced the breathing micro with a **ring reveal**. New behaviour: the core (disc + white ring) holds dead still; a soft sage light-band sweeps across the halo (clipped to r22.5), painting a ring of sage into view over the first **64%** of a **3.8s** cycle (`cubic-bezier(0.45, 0, 0.15, 1)`), then rests off-frame — a sweep of light, not a breath, because a scale won't read at ~10px.
- **`MicroDot`** (`app/brand-motion.jsx`) — rebuilt: `defs` (per-instance clip + sage gradient via `React.useId`), a `circ-micro-halo-static` sage disc, the swept `circ-micro-reveal` rect, then the static core. Keyframe `circ-micro-reveal` (`translateX 0→86` over 0–64%, hold to 100%) in `circlists.html`. Under reduced motion the sweep hides and the static disc shows → full resting mark (mirrors the spinner's static-halo fallback). Reference geometry in `brand/motion/circlists-micro.svg` (geometry only, no embedded animation — user hand-edited; don't "fix").
- **Placement unchanged:** only the funding-page eyebrow (`FundingPage`, `app/subscriptions.jsx`, `size={8}`), between the eyebrow label and the circle name, both new/returning branches. Per `docs/MOTION-AUDIT.md`, that's the one real-product spot that survived — micro's "live signal" premise is in tension with the product's no-presence / no-read-receipts rule (and its icon-needs-a-label rule) almost everywhere else it was considered.
- No Tweak added — the new micro has no tone/amplitude axis to expose (the reveal is a fixed sweep).

## Open threads
- **Config launcher dot → `MicroDot` swap** (`app/config.jsx`, the flat 7px accent dot) — audit's other recommended micro spot, low-stakes/prototype-chrome-only, still not done. Reasonable to fold into the micro task.
- **`CalmPage` pulse call** (`app/spaces.jsx`, invalid invite / circle full) — genuinely undecided, from the prior handoff.
- **No `CHANGELOG.md` entry** — this session is refinement/consolidation of the already-landed brand-motion work, not a new shape-level step, so per the changelog rules nothing was added. Flag if you think the two-state loading consolidation deserves one.

## Reference
- `brand/motion/circlists-motion.md` — motion spec (source of truth for tempo/amplitude/curve/size), with the pending feed-back notes.
- `docs/MOTION-AUDIT.md` — where each treatment may apply.
- `docs/HANDOFF-brand-motion.md` — prior session; still-valid decisions, stale spinner specifics.
