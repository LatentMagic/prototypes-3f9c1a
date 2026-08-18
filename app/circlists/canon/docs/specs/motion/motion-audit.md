# Motion pack audit — pulse, spinner, micro

`brand/motion/` now carries the three animated mark treatments (spec: `circlists-motion.md`) alongside the static pack. This audits where each **could** apply in `app/`, and takes a position on each — not just a list of options.

## Loading → spinner (yes — one clean integration point)

Every loading moment in the product already funnels through a single primitive, `Spinner` (`app/primitives.jsx`) — a plain rotating ring, not brand-drawn today. Six live instances, in two groups:

**Inline in a button** (`Button`'s `loading` prop swaps its icon for the ring):
- Add a link — `app/feed.jsx` `AddReveal`, "Adding…"
- Pay — `app/subscriptions.jsx` checkout form, "Processing…"

**Standalone, labelled, full-view:**
- Switching circles — `app/feed.jsx` `FeedLoading`, "Loading this circle…" (driven by `loadingFeed` in `main.jsx`)
- Google sign-in return — `app/auth.jsx` `GoogleReturn`, "Completing sign-in…"
- Leaving to the billing provider — `app/subscriptions.jsx` `ProviderInterstitial`, "Opening this circle's billing…"
- Post-checkout provisioning — `app/subscriptions.jsx` `SettingUp`, "Setting up your circle…"

**Critique:** the two groups don't have the same fit. The standalone group runs 18–22px on cream or dark canvas — close to the spinner asset's own demo sizes (24–56px) — and reads cleanly. The inline-button group runs 14–15px *on the accent-green fill itself*: the new spinner's sage halo and green disc would sit green-on-green, and at 14px the halo/arc/disc/ring stack is finer detail than the mark can resolve. That's a real size-and-contrast ceiling, not an oversight to fix later.

**Recommendation:** swap the brand spinner in for the four standalone/labelled instances; leave the two inline-button spinners as the plain ring. One file to touch (`Spinner` in `primitives.jsx`), gated by size or context. Highest leverage, lowest risk of the three.

## Idle mark → pulse, "within the lockup" (revised — shipped on the rail)

Today's lockup (`Wordmark` in `primitives.jsx`, rendering the shipped `circlists-lockup.svg`) appears in:
- The rail / mobile drawer header — `app/shell.jsx` `RailBody` — persistent, on screen for the whole session, 20px.
- Every auth screen's header — `app/auth.jsx` `AuthFrame` — sign in, sign up, verify code, recovery — 22px, one component covers all four.
- Two standalone calm pages — `app/spaces.jsx` `CalmPage` (invalid invite, circle full) — 21px.
- Two interstitials that already carry a spinner — `GoogleReturn`, `SettingUp` — 22px.

**Note — this verdict was reversed after discussion with the user, then implemented. Reasoning below is the final call; see `docs/HANDOFF-brand-motion.md` for what shipped.**

- **The rail turned out to be the better home, not the worse one.** "Quiet by default" rules target spectacle/entrance/hover, not idle/ambient motion — pulse is a new category the motion pack explicitly adds, and applying the old default against it is circular. The spec's own framing ("an idle breath reads as the mark *at rest*") describes steady-state, session-long presence — that's the rail, not a screen you pass through once. Tempo backs it up: 3s/cycle ≈ 20 breaths/min, a resting rate, not a notification-pulse rate (those are sub-1s). The rail mark also sits in its own column, outside the feed's foveal path — genuinely peripheral, not fighting the reading task.
- **Auth/sign-up turned out to be the riskier home, not the safe one.** The problem isn't dwell time, it's proximity to an active input plus novelty: a breathing mark next to a field someone's typing into risks being misread as system feedback, and it's a one-time encounter under mild task stress — no repetition for it to recede into "calm ambient."
- **Empty states are still ruled out** by the design system itself (no icon larger than title height) — unaffected by the reversal above.

**Shipped:** the rail composes the mark (animating) + the wordmark image live (`PulseLockup` in `app/brand-motion.jsx`), replacing the flattened static lockup. `AuthFrame` still renders the plain static lockup, untouched. **`CalmPage` was never decided** — closer to the rail's "nothing to type" condition than to sign-up's, but left as-is; a genuine open question, not a ruling.

## Live signal → micro (no strong home — and worth knowing why)

Micro's premise is an ambient "this is live" signal. Two of the product's own rules push back on that directly, not just stylistically:

1. **The product deliberately carries no presence or activity signals** — no read receipts, no "seen by," no online indicators. A live-pulsing dot is the visual grammar of exactly that category, even unlabelled.
2. **Icons alone are reserved for unambiguous actions; anything communicating state needs a text label.** Micro is a bare dot — it can't say what's live on its own, and labelling it starts to look like a status chip, which this system always builds as icon + label on a neutral surface, never a coloured dot.

**Candidates checked and ruled out:**
- Unread/new-item badges — don't exist in the product, correctly (would be read-receipt-adjacent).
- Favicon — the right pixel size (16–32px), but most browsers don't animate CSS inside an SVG favicon, and even if they did, a perpetually pulsing tab all day is the FOMO-bait pattern the brand explicitly avoids.
- The Swell reaction pad's centre dot — visually similar (small circle, halo) but a different, already-settled interaction (an unselected-state affordance). Forcing micro on doesn't help it.
- Invite-link-copied confirmation — no clipboard-copy pattern exists to attach it to.

**One real, low-stakes fit:** the floating **Config launcher** (`app/config.jsx`) already has a flat 7px accent-green dot next to its label, and its own copy says "Prototype controls — not part of the product." Swapping that flat dot for `circlists-micro.svg` is correctly sized, low-risk, and self-referential — the tool announcing it's live, on a surface that explicitly isn't the product.

**Recommendation:** ship micro there, and nowhere else for now. If a genuinely justified real-time moment turns up later (a labelled "reconnecting…" state once there's a real sync layer, say), reconsider then — not before.

## Summary

- **Spinner** — swap in for the four standalone loading views; keep the plain ring inline on accent buttons.
- **Pulse** — shipped on the rail (`PulseLockup`), reversed from this doc's original "auth only" call after discussion. `CalmPage` still open; empty states and the two spinner-interstitials stay ruled out.
- **Micro** — shipped on the funding page eyebrow (between the label and the circle name) — the one real-product home the audit found. The Config-launcher swap is still just a recommendation, not yet done.
