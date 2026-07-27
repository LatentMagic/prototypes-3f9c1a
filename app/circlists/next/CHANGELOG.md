# Changelog

Major milestones only — not a granular log. Newest first. History is not backfilled
exhaustively; entries capture the shape of each significant step, not every change.

## Create → Fund — one wizard shell, and desktop stops pretending to be a modal — 2026-07-27
- Both steps now render through a **single shell** (`app/wizard.jsx`) that owns the
  page ground, the chrome row, and one content column shared by every step and
  every posture. The two screens are identical by construction rather than by
  coincidence; column width is set in one place and cannot be set per step.
- **Desktop is a page, not a dialog.** The floating card is gone — it read as a
  modal over a route that has nothing behind it. Desktop is now the mobile screen,
  wider: page background, chrome at the page corners, column centred horizontally.
- **Steps are top-aligned, never vertically centred.** Centring positions a block
  by its middle, so the taller step displaced its own heading; anchoring content a
  fixed distance below the chrome removes the cause. Leftover space collects at the
  bottom of the shorter step, which is accepted rather than compensated for.

## Upsell doors — a way out of a free membership, on surfaces that already exist — 2026-07-27
- Three **passive doors** to starting your own circle, each a line of copy on a
  surface the app already renders: the feed's empty state (Active and Read), the
  non-champion crown line on circle settings, and the champion's cap-full panel.
  Nothing is detected, triggered, timed, or dismissible — the doors are simply
  always there.
- **Circles, never seats.** Each offers *another circle*, never a bigger plan or
  more members, and no price appears near any of them. The cap-full door in
  particular refuses to read as a workaround for the cap.
- Doors are **text links, never buttons** — a shared `.circ-doorlink`: accent
  green, underlined at a light tint, deepening to full accent on hover and focus.
  The resting underline is required, not decorative: accent against tertiary text
  is 1.07:1, so colour alone cannot distinguish an inline link (WCAG 1.4.1), and
  hover does not exist on touch.

## App posture IA — home is the root, the bar belongs to the circle — 2026-07-27
- The app posture gains a **home screen** at account level: the circles list, each
  with a reason to look at it, plus New circle. Account hangs off the avatar in
  the top bar, not off a nav slot. Entering a circle pushes a full-screen layer
  over it.
- The **bottom bar is no longer global** — it renders only inside a circle, and
  carries three circle-local slots: **Home · Add · Settings**. Because the bar
  cannot be seen from outside a circle, the bar *is* the circle scope, which is
  what the earlier five-slot bar could not express. Reading loses its slot (it was
  a tab for the screen you were already on); the feed's Active/Read tabs are
  unchanged.
- **Containers settled:** a bottom sheet is for Add only; circle entry, circle
  settings and Account are full pages that slide in from the right. The
  circle-switcher and account sheets are removed — circles are listed on home, so
  there is one way to switch.
- Documentation split out: **`ARCHITECTURE.md`** (three postures, one shared core;
  the `inShell()` swap; droppable modules; the payments guard) and **`MOBILE.md`**
  (the app posture's own IA, containers, motion, and how to maintain it alongside
  the web prototype). Web postures are frozen and unchanged.
- **Caveat.** This was a large, largely one-shot rework of the app posture,
  QA'd by hand rather than exhaustively. It is a prototype sketch, not a settled
  build — expect regressions to surface, and treat `MOBILE.md`'s status note as
  binding when judging what is decided versus what is merely present.

## App platform posture — a third presentation, one shared core — 2026-07-24
- Adds a third presentation **posture** alongside desktop and mobile web: **app**,
  how Circlists reads as a native mobile app. Not a fork — same routes, state,
  data, tokens, and copy. `main.jsx` routes every in-shell surface through
  `inShell()`, which swaps only the persistent chrome (`app/app-shell.jsx`'s
  `AppShellNative`) and inherits every shared surface unchanged, so future
  shared-surface changes land in the app posture with no app-side edit.
- App chrome is **thumb-first and bottom-anchored**: bottom navigation
  (Reading · Circles · Add · Account) replaces the rail/drawer; circle switching
  and account access become bottom **sheets**; Add is an accent bar action, not a
  floating button (no FAB); the top bar carries status + circle settings only.
- **Web-only payments**: in app mode every path to the funding/checkout wizard
  (create, re-fund, manage) lands on a calm finish-on-web handoff — the circle is
  named in-app, no checkout/price/provider reachable. A `Mobile payments: On`
  toggle runs the real wizard in the app posture instead.
- Config gains **Platform (Web / App)** and **Mobile payments (Off / On)**. Web
  posture is frozen — unchanged in look and behaviour.

## Add from anywhere, confirmed on the FAB — biz-83 — 2026-07-24
- The add-link **FAB now renders on the Read tab too**, not just Active — same
  bottom-right placement and add flow. Adding from Read leaves the tab and scroll
  position untouched; the new card lands on Active unseen.
- Because that add happens off-screen from Read, the **FAB itself confirms it**:
  a successful submit resolves the glyph `✕ → tick → plus` — the checkmark
  **draws itself on** (stroke reveal), holds, then settles back to the plus.
  Cancel resolves `✕ → plus` with no tick.
- Quiet register throughout: the FAB stays **accent green** — colour never
  carries status — and the tick is a small confirmation beat, not a celebration.

## Adding a link is async — the card arrives pending — 2026-07-24
- Metadata extraction no longer blocks the add: the add sheet/popover dismisses
  immediately and the card lands in the feed in a **pending** state. Progress
  lives on the card, not in the dialog.
- Pending card shows the **URL as a stand-in title** with quiet **skeleton**
  placeholders for the source line and image (a soft shimmer, never a spinner or
  broken glyph). It reads as *arriving*, not empty.
- Metadata **fills the card in place** on resolve — the image slot is held, so
  there's no reflow or position jump — settling to one of three terminal states:
  title · source · image, title · source (text-only), or the URL-as-title floor.

## Feed cards carry extracted metadata — 2026-07-24
- A feed card is no longer a bare URL: it now leads with the extracted **title**
  as its headline, a **source** line (publication, or the bare domain when
  nothing better is known), and a right-hand **preview image**. Attribution and
  the Swell door/actions move into a footer below.
- Layout is *List dense — foot, edge-matched*: image locked on the right, the
  trailing action's optical edge pulled onto the image's edge so tick/delete
  read as aligned to the media. Open affordance narrows to **title + image only**.
- Fallbacks never fabricate: no preview → a calm source-keyed tint block; no
  favicon → nothing; failed extraction → the URL becomes the headline (mono).
  Seed items gain title/source/image (`SEED_META`); state key bumped to `v5`.

## Champion role — consolidated to one place on the members surface — 2026-07-22
- The champion role no longer appears in three overlapping spots on the settings
  surface. The header line drops "· Championed by X" (the roster's **Champion**
  badge already carries it), and the non-champion's two-line "Only the champion
  can invite / manage funding" card collapses to a single quiet crown line: *The
  Champion manages this circle's membership and funding.*
- One statement of the role instead of a card, a header clause, and a badge —
  the term stops being restated in copy that read as a restriction.

## Swell reaction mechanism — keyboard + screen-reader access (AA) — 2026-07-14
- The reaction moment and the Read-tab roster/disc reach WCAG 2.1 AA: the drag-pad
  is now painted over always-present accessible controls — a glyph **radiogroup**
  and a three-rung **depth slider** (*a little / moderately / deeply*) — so
  keyboard/AT users operate the same reaction with no mode switch.
- Depth is spoken, not numeric, across all data: reactions read *"name, glyph,
  depth"*, skips read *"name, read, no reaction"*.
- Both dialogs gain focus-in + a focus trap; the timed reveal is muted for AT
  (`aria-hidden` — the door is its accessible home), and commit fires a polite
  status announce naming what was saved.

## Automatic link-scheme resolution on add — 2026-07-14
- Adding a link no longer requires a typed scheme: a bare domain or path is
  accepted and the scheme is filled locally — missing → `https`, explicit
  `http://` respected as typed, not upgraded. No outbound request. Non-http(s)
  schemes and reachability stay out of scope.
- The Add-link placeholder moves from `https://` to a bare-domain example
  (`example.com/article`) so the field demonstrates that the scheme is optional
  rather than prompting for it.

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
