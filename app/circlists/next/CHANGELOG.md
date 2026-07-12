# Changelog

Major milestones only — not a granular log. Newest first. History is not backfilled
exhaustively; entries capture the shape of each significant step, not every change.

## Brand motion system — 2026-07-12
- The static mark gains three animated treatments, driven by the motion pack in
  `brand/motion/` (`app/brand-motion.jsx`): **pulse** (idle breathing mark on the
  rail), **spinner** (rotating/growing sage arc, the loading state — replaces the
  plain CSS ring at 100px in both loading views), and **micro** (a ~10px live-signal
  dot — a sage light-band sweeps the halo while the core holds still).
- Placement is deliberately narrow: pulse on the rail lockup, spinner on the two
  full-state loads, micro only on the funding-page eyebrow. All three freeze to the
  static mark under `prefers-reduced-motion`.
- Pulse depth and spin speed are exposed as live Tweaks (Brand motion).

## Scenarios launcher reworked into a Config modal — 2026-07-12
- The floating launcher (`app/config.jsx`, was `app/scenarios.jsx`) now opens a
  centered modal instead of an anchored popover: a "Review settings" section
  (viewport auto/desktop/mobile, preview gate on/off, reset seed data) sits above
  the same grouped scenario list, reflowing into responsive columns.
- Groundwork for adding more review controls over time without the list outgrowing
  a popover.

## Delete-only demo derivation + preview gate — 2026-07-10
- The prototype is re-architected so a stripped homepage demo can be derived by
  **deleting whole files only**, never editing a survivor: the Scenarios launcher
  moves to its own file, tweak defaults are baked into the app, and `main.jsx` mounts
  each dev aid / flow only when its module is present — so dropping auth, subscriptions,
  scenarios, or tweaks removes it cleanly.
- New **preview gate** (`app/gate.jsx`): New circle and the account control open a
  "sign up to continue" overlay instead of dead-ending. Off by default; lit locally by
  a Scenarios toggle or in the export by `window.CIRC_FORCE_GATE`.

## Brand pack adopted as source of truth — 2026-07-08
- The formal Circlists brand pack lands in `brand/` as the single source of truth,
  retiring the vibe-coded brand doc (`docs/BRANDING.md` deleted; its references repointed).
- Mark redrawn to spec — opaque **sage `#8BBFAD`** halo, green disc, thin white
  separator ring; the in-app lockup and wordmark now render the pack's shipped SVG
  assets directly, and the favicon is the pack mark.

## Support contact in settings — 2026-07-08
- Support email (`support@circlists.com`) now surfaced as a quiet mailto link at the
  foot of both Account settings and circle settings. Reads the shared `OPERATOR_EMAIL`
  constant, which also drives the dormant-circle contact links.

## Pricing: £3 introductory rate — 2026-07-08
- Circle funding drops from **£9 to £3 a month**, carried across every surface from
  the single `PRICE_PER_SPACE` constant.
- New **"introductory rate"** framing on the new-circle funding page — a light signal
  the price may rise later, not a locked-in discount. Label only; not repeated on
  re-fund, checkout, or billing surfaces.
- Funding-page price block realigned to the front-page treatment (green figure, mono
  unit line); feature checklist replaced by a single value sentence.

## Loop closure: The Swell reaction mechanism — 2026-07-07
- The mark-as-read confirmation modal is replaced by **The Swell**: when you
  finish a link you leave the circle a reaction — a glyph and how hard it landed —
  and later anyone can re-open how the whole circle responded. Reading closes a
  loop instead of just filing the item away.
- Communal reactions, individual read-state: the reaction record lives on the
  Read-tab card for everyone; leaving one still only marks the item read in your
  own queue.
- Introduced rough by design, to be tuned over time.

## Rebrand: LatentPulse → Circlists — 2026-07-07
- Product renamed from **LatentPulse** to **Circlists**. The old name is retired.
- New brand mark: concentric circle (soft green halo → white ring → solid green disc),
  replacing the "LP" box. Wordmark set in Inter Bold with a green tittle on the "i".
- Group terminology changed in all user-facing copy: **"space" → "circle"** (Circles rail,
  New circle, Circle settings, funding, empty/dormant states, dialogs). Internal code
  identifiers (`space`, `spaceName`) unchanged.
- Favicon updated to the new mark; entry file is now `circlists.html`.
- Accent green `#047857` and the rest of the visual system carried over unchanged.

## Champion self-serve + account email
- Champion can manage their own circle without support: **remove members** and **rename
  the circle** inline from the members surface.
- **Change email** available to all users, verified by a code sent to the new address
  before the switch takes effect.

## Prototype introduced
- First interactive click-through of the core product: communal reading queue for small
  trusted groups, superposed state (shared library, individual read-state).
- Auth, feed (add / mark-as-read / delete), members, funding, and dormant-circle flows,
  wired as real scenarios. Iterated on the Pulse Modernist direction throughout.
