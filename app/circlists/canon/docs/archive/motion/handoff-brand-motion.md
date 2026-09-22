# Handoff — brand motion pack (pulse / spinner / micro)

## Status: LANDED. All three treatments shipped and verified.

## What happened this session
New animated brand assets arrived in `uploads/motion/` (pulse, spinner, micro — spec in `circlists-motion.md`). Copied into `brand/motion/` as a sibling to the static pack, the same way `brand/` itself is a manual wiki sync (see `brand/README.md`). Audited where each could apply (`docs/MOTION-AUDIT.md`), debated the pulse placement call with the user — reversed mid-conversation, audit doc updated to match — then implemented all three.

## Where things live
- **`brand/motion/`** — the source spec (`circlists-motion.md`) + demo board (`circlists-motion.html`) + the three standalone `.svg` files. **These `.svg` files carry no embedded CSS animation** — they're geometry/reference only (user hand-edited them down to that; not a bug, don't "fix" it). The real, working animations live separately, below.
- **`app/brand-motion.jsx`** — the implementation. Exports:
  - `PulseMark` — bare animated mark (halo breathes + brightens, 3s cycle).
  - `PulseLockup` — mark + wordmark composed live (see "rail," below).
  - `BrandSpinner` — the loading treatment (rotor rotation + arc growth, two overlapping cycles).
  - `MicroDot` — small live-signal dot (halo + core both breathe, 1.4s cycle).
- **`circlists.html`** — the `@keyframes` + `.circ-pulse-*` / `.circ-spinner-*` / `.circ-micro-*` classes, plus one shared `prefers-reduced-motion` override that freezes all three to their resting geometry (the spinner's arc goes fully solid, per spec — not just frozen mid-arc). Loaded right after `app/primitives.jsx` in the script order.

## Key decisions (so you don't relitigate them)

**Rail → `PulseLockup`, not the bare mark.** First pass wrongly dropped the wordmark text (over-read "the mark + pulse" as "mark only" — corrected once flagged). The shipped `circlists-lockup.svg` is one flattened image, which is *why* the mark couldn't animate on its own. `PulseLockup` reconstructs the same geometry live — mark height 1.5× cap-height, gap 0.4× cap-height, mark centred on the wordmark's cap-midpoint, per `brand/circlists-brand.md` §4 — using the real viewBox/baseline numbers pulled from `circlists-wordmark.svg` itself, not eyeballed. Pass it the same `size` the old `Wordmark` call used (20) and the geometry auto-matches; no hardcoded pixel offsets to maintain.

**Pulse lives on the rail, not the auth screens.** The original audit said the opposite (auth safe, rail too persistent). Reversed after the user pushed back: "quiet by default" targets spectacle/entrance/hover, not idle ambient motion, which is the category pulse exists to add; the spec's own "mark at rest" framing describes session-long presence (the rail), not a one-time screen. Auth/sign-up turned out to be the riskier spot — a breathing mark next to an active input risks reading as false system feedback, with no repetition for it to settle into "ambient." `docs/MOTION-AUDIT.md`'s pulse section has the full reasoning and is updated to match what shipped. **`CalmPage` (`app/spaces.jsx` — invalid invite / circle full) was never decided** — closer to the rail's "nothing to type" condition than to sign-up's, flagged but not implemented either way.

**Spinner: all 4 standalone "loading pages" → one `BrandSpinner`, same size (32px), no exceptions.** Feed/circle-switch (`FeedLoading`), Google sign-in return (`GoogleReturn`), provider handoff (`ProviderInterstitial`), circle provisioning (`SettingUp`). Dropped the separate static `Wordmark` that used to sit above the spinner on two of these (`GoogleReturn`, `SettingUp`) — redundant once the spinner itself is the animated brand mark. The word "loading" is gone everywhere (`FeedLoading`'s copy became "Entering this circle…").

**The 2 inline-button spinners (Add, Pay) were deliberately left alone** — still the plain CSS ring (`Spinner` in `app/primitives.jsx`, unchanged). Brand spinner at 14–15px sitting on the button's own accent-green fill is a real contrast/legibility ceiling (sage halo + green disc on a green button), not an oversight. Flagged explicitly to the user; no pushback.

**Micro → the funding page eyebrow only.** Sits between the eyebrow label ("New circle" / "Returning champion") and the circle name, both branches, in `FundingPage` (`app/subscriptions.jsx`). This is the only real-product placement that survived the audit — micro's "live signal" premise is in tension with the product's own no-presence/no-read-receipts rule, and its icon-needs-a-label rule, almost everywhere else it was considered. **Not yet implemented: swapping the Config launcher's flat 7px accent dot (`app/config.jsx`) for `MicroDot`** — the audit's other recommended spot (low-stakes, prototype-chrome-only, not shipped product). Worth doing if it comes up again.

## Open threads for next time
- Config launcher dot → `MicroDot` swap (above) — small, not done.
- `CalmPage` pulse call — genuinely undecided, not just deprioritized.
- No `CHANGELOG.md` entry added for this work. Reads like a shape-level step (a new brand-motion system landed, three concrete integrations) worth one per the project's changelog rules — not added, wasn't asked for this session.

## Reference
- `docs/MOTION-AUDIT.md` — the full audit, updated to match what actually shipped.
- `brand/motion/circlists-motion.md` — the motion spec (tempo / amplitude / curve values). If an asset's motion ever seems off, this is the source of truth, not the comments in `app/brand-motion.jsx`.
