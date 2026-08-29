---
date: '2026-08-28'
ticket: 'A3'
topic: 'invite-link'
status: 'merged'
type: 'implementation'
---

# Handoff: invite-link — the champion sends the invitation themselves (merged)

## Current Focus

**Merged into the main build, 2026-08-28, on the owner's word.** What landed:

- `app/invite-link.jsx` — the card, publishing `window.InviteForm` (renamed off the
  candidate naming; classes are `circ-invite-*`).
- `circlists.html` — the card's CSS block, retitled for the feature, and the module loaded
  after `app/spaces.jsx` and before `app/main.jsx`.
- `app/spaces.jsx` — the old email-invite card is **gone**. `MembersSurface` reads
  `window.InviteForm` per render and renders nothing if the module is absent; `onInvite` is
  no longer consumed (getting a link does not add a member) and `InviteForm` is off the
  file's `window` exports.
- `CHANGELOG.md` — one entry, *The champion sends the invitation themselves*. **Wording is
  the owner's to change.**
- `playgrounds.json` — the candidate row is `"on": false` with the merge date. The swap rig
  stays on: it is the record of the ratified decision.
- The candidate entry and its `cand-a3-*` files stay exactly where they are, unchanged.

**Still open, needing the owner's word:**

1. ~~`app/spaces.jsx:751` — the empty-home support line said an invitation "will arrive by
   email".~~ **Fixed 2026-08-28**, on the owner's word: *"Waiting on an invite? The circle's
   champion sends you a link that brings you straight in."* Reachable at
   `circlists.html?state=no-circles`. Wording is the owner's to change; no CHANGELOG entry —
   it is copy inside the step the entry already names.
2. **The homepage demo does not carry the feature** (`HOMEPAGE-DEMO.md`): its entry lists its
   own modules, so `app/invite-link.jsx` is absent and the members surface is unreachable
   behind the gate anyway. Carrying it across is three moves — module, styles, demo seed —
   plus a `window.CIRC_STATE_KEY` bump. A separate decision.

## The shape, as merged

**One decision is ratified: the shape.** The card has no ask/answer swap. The owner played
four treatments of that moment as the app (`playground/circlists-a3-transition.html`) and
ratified **04, No moment**, 2026-08-28. Two passes since then corrected what 04 got wrong
without bringing the swap back — see **Seventh pass** first; it supersedes the derivation
described in the fifth and sixth. The rest of the candidate is still unratified, and the
merge into `app/` has NOT been agreed — see Action Items.

One pre-existing defect outside the delta still needs the owner's word before anyone
touches it: the `NoSpaceHome` support line says an invitation "will arrive by email"
(`app/spaces.jsx:751`), which this delta makes untrue. **Not changed.**

**Seventh pass — the press is the moment, and the box is the control:**

- **Deriving the link as the address was typed is retired.** It could not be rescued:
  `a@b.co` is a valid address and so is `a@b.company.com`, so no check can tell a finished
  address from a plausible prefix — the debounce fired on half-typed domains. Only the
  person typing knows. Industry-wide, every product that binds an invite to an address
  commits on a press; the ones without a press (Figma, Notion, Slack link-sharing) have no
  address to finish. **Get a link is back**, and it is the one place the address is
  validated (the blur check went with the derivation).
- **There is no Copy button: the link box IS the copy control.** A second filled control
  competing with Get a link is what made the card busy. So the box is a real `<button>` and
  takes a control's shape — bordered, copy glyph on the right, house secondary hover and
  press, focus ring, full 44px target. Anything that acts as a button reads as a button.
  `user-select: all` is gone with it; hand-selection stays as the clipboard-failure fallback.
- **Get a link demotes to secondary once its link is on screen**, so the card holds exactly
  one filled control at any time and never two. Before the press the green is the act; after
  it, the act is copying and the box carries it. Editing the address empties the box and
  re-promotes the button.
- **The owner's proposal was half-taken, with the reasoning on the record:** the button was
  NOT moved inside the field. With Copy gone there is only one button on the card, so the
  two-greens problem is already solved — and the card's whole act should not shrink to an
  unlabelled 34px glyph. The app's in-field send (`cand-infield`) is a secondary gesture on a
  writing box; this is not that.
- **What stands from the sixth pass:** the box's three states (*empty* / *working* / *ready*)
  and the readiness signal — the app's `.circ-glow` arrival wash, keyed on the link so it
  fires for every new address, with Copy live in the same instant and the live region saying
  *Link ready.* Only the trigger changed, from a timer to the press. Focus follows the link
  when it lands.

**Fifth pass — the swap, removed (ratified):**

- **Why it came up.** Passes three and four aligned the two faces into one shape, and that
  parity is what made the change between them feel wrong: the input appeared to mutate into
  a URL and the button to relabel itself, with the geometry shifting underneath. Smoothing
  it was not the answer.
- **The rig.** Four treatments, each the real app, switched from a strip at the foot of the
  page: **01 Grows** (the ask stays, the link opens beneath it), **02 One frame** (parity
  finished — nothing may move, so the URL truncates), **03 Settles** (the same two faces on
  the app's own arrival motion), **04 No moment** (no event to swap on).
- **What 04 is.** The link is DERIVED from the address as it is typed — which is literally
  what the token is, a pure function — so the card has one state and one shape for its whole
  life, and the link's box is present from the start but **empty**: the shape of the answer
  is there, and nothing of value is shown until the link is real (not even the domain — a
  URL-shaped stem implies part of the link already exists, and nothing does). Nothing appears
  from nowhere; there is nothing to animate.
- **When it is ready, and how you know** (sixth pass, 2026-08-28 — this was the hole in the
  ratified shape, and it was mine: removing the press removed the moment, and an empty box
  that silently fills with a URL tells nobody anything). The box now has **three** states:
  *empty* (no complete address — the slot at its resting height, nothing of value in it),
  *working* (the address parses; the link is being signed — the app's own spinner in the
  icon's slot), *ready* (the link is there, the box plays `.circ-glow` — the app's arrival
  wash, the same signal a card that just landed plays — Copy goes live in the same instant,
  and the live region says *Link ready.*). The wash is keyed on the link, so it fires for
  every new address, not only the first.
- **The beat is not decoration.** The token is signed server-side, so the real card makes one
  idempotent request per valid address — nothing created, nothing stored, the invite existing
  only when the recipient opens the link. Locally the token is instant, so without that beat
  (`CAND_A3_SIGN_MS`, 480ms) there is no perceptible moment of readiness at all.
- **What it retires.** *Get a link* (Copy is the only primary and the card's one act) and
  *Invite someone else* (there is no face to come back from; changing the address changes
  the link — the same gesture without a control). Both were calls listed for review below;
  neither exists now.
- **Validation moved to blur.** Nothing to press means nothing to validate on press, so the
  address is checked on blur and on Enter. A live check nags from the first keystroke; no
  check leaves a typo silently dim. The already-a-member refusal is recognised as it is
  typed and outranks the blur message. Both messages stay verbatim from the shipped card.
- **The risk to watch.** A link that exists before you asked for one could read as "the app
  has already sent something". The helper (*Send it to them yourself*) and the *Their link*
  label carry that weight; nothing else does.
- **The rig stays** as the record, and its own landing does not depend on a link carrying
  `?state=`: it wraps `circResolveState` so it opens on the card. Without that, a query that
  arrives mangled resolves to `unresolved`, which lands the reader on the states index — a
  full-page catalogue that reads as an unrelated screen. Worth knowing for any nested entry
  that wants a fixed landing.

**Third pass, after the second review (all in `cand-a3-invite.jsx`):**

- **The helper belongs to the ask and now goes with it.** It survived the face swap, so
  the answer face carried *"Enter their email address and copy the link"* over work already
  done — two prose paragraphs around one link. Answer face is now heading → link → one
  binding sentence → control.
- **The funding fact is out of the field's hint.** The hint slot *is* the error slot: a
  typo'd address replaced *"They join free"* with the validation message, so the card's one
  fact about money was destroyed by a typo. It rides the helper instead, keeping the half
  that is about the guest — *"Send it to them yourself — they join free."* Who pays is the
  funding card, immediately below.
- **Invite someone else is a control, not a doorlink.** The surface's doorlinks (*Start
  another circle any time*, *champion your own*) all **go somewhere**; this one clears the
  link on screen. Same appearance, opposite consequence. It is a house **secondary** box,
  size `sm` — not `tertiary`, which is borderless and reads as bold label text, the same
  missing affordance the doorlink had.

- **One button rule across both faces.** Copy link was full-width on a narrow card while\n  Get a link stayed a small right-aligned button \u2014 two treatments for the same step in one\n  card. The card's **primary action** is now full-width while the card is narrow and\n  right-aligned once it is wide, on both faces (same container query, `.cand-a3-ask`).\n  *Invite someone else* is exempt: it is secondary and the way back, so it stays\n  auto-width and left-aligned at every width.\n\n- **One shape for both faces (fourth pass).** At desktop width face 1 stacked (field, then\n  button beneath) while face 2 went inline (box, Copy beside it) \u2014 two layouts for the same\n  label/box/action pattern in one card. Both are now **inline**: a label, then a row of\n  full-width box + primary action beside it. The label is rendered by the card rather than\n  by the house `Field`, so the row holds only input and button and their tops align; an\n  inline error grows downward under the input without dragging the button with it. The\n  `Field`'s own bottom margin is zeroed \u2014 inline style, hence the one `!important` in the\n  candidate CSS block. Below 400px the row stacks and the button goes full-width, on both\n  faces. *Invite someone else* is exempt: secondary, and the way back.\n- **\"Link\" was in the card four times** \u2014 *Get a link*, *Link for\u2026*, the URL, *Copy link*.\n  The box is visibly a URL, in mono, behind a link icon, so the label is now just the\n  address and the button is just **Copy**. Two remain (*Get a link*, and \"copy the link\"\n  in the helper).\n\n**Second pass, after the first review (all in `cand-a3-invite.jsx`):**

- The funding fact — *"Everyone you invite joins free — you fund the circle for all of
  them"* — read as a bookend footnote under the whole card. It is now the email field's
  **hint**: *"They join free. You fund the circle for everyone in it."*
- *"Signing up with it brings them into Backend Pod"* was wrong for anyone who already has
  an account. Now: *"It only works for that address, and it takes them straight into
  Backend Pod."*
- **Invite someone else** was a tertiary button at the foot of the card. It is now inside
  that same sentence — *"…straight into Backend Pod. Invite someone else any time."* — the
  surface's own door construction, rhyming with *Start another circle any time* in the
  circle-full panel. The card ends at the link.

## Task(s)

Delivered the A3 delta as a **candidate build**, per `skills/candidate-build/SKILL.md`:
one shared `app/`, a second entry, and an overlay set that re-publishes one name.

The delta, as built: the champion enters the friend's email address, the card hands back a
link bound to that address, and the champion copies it and sends it themselves. The app
mails nothing and offers no control that would. Nothing is remembered: no invited list, no
pending row, no delivery state, no revoke, no resend.

**How to reach it:** open `docs/specs/a3-invite-link/circlists-a3.html` → gear
(**Circle settings**, top right) → **Members** → scroll to **Invite a member**. Works
identically in the app posture (Config → Platform → Mobile).

## Critical References

- `skills/candidate-build/SKILL.md` — invariants 2, 3, 5, 6, 7 all bear on this build.
- `CLAUDE.md` — nested-entry rule (`<base href="../../../" />`, root-relative paths), the
  ratification rule, the launcher-manifest rule.
- `app/spaces.jsx` — the surface this delta lives on; the one `app/` file opened.

## Recent changes

**Opened in `app/` (additive, behaviour-identical):** `app/spaces.jsx`.
The champion invite card's JSX and its four pieces of state were lifted out of
`MembersSurface` into a new `InviteForm` component (`app/spaces.jsx:217`), published on
`window` (`:760`), and rendered through `const Invite = window.InviteForm || InviteForm`
(`:269`, used at `:387`). Same markup, same copy, same autofocus, same submit — absent an
overlay the main app is byte-for-byte what it was. The **circle-full panel stays in
`MembersSurface`**, deliberately: an override replaces the card, never that panel.
This is invariant 3, not a copy: `MembersSurface` is ~200 lines of roster, kebab, rename
and funding that a candidate must not photocopy to change one card.

**Candidate files** (`docs/specs/a3-invite-link/`):

- `cand-a3-invite.jsx` — re-publishes `window.InviteForm` as the redesigned card.
- `cand-a3-seed.jsx` — wraps `window.CircSeed.seedSpaces` to drop Backend Pod under the
  member cap (see Learnings). A fixture, not part of the feature.
- `circlists-a3.html` — the entry. Duplicates `circlists.html`'s head (the one accepted
  duplication) plus `<base href="../../../" />`, its own state key
  (`circ_a3_state_v2`), and a clearly-marked candidate CSS block at the end of the style.
  Overlays load after every `app/` file they extend and before `app/main.jsx`.

**Also in `app/` (owner-requested, 2026-08-28):** `app/seed-data.jsx:192` — **TEST -
Backend Pod** dropped from eleven members to nine, so the champion's invite card is
reachable from a normal circle in the main build. Owen D. and Freya S. remain in that
circle's reaction fixtures as former members.

**Launcher:** `playgrounds.json` — A3 added as the first ticket, one `candidate` entry.

## Learnings

- **The shipped seed hides the shipped invite card.** `app/seed-data.jsx:55` gives Backend
  Pod **eleven** members against a cap of ten, and Backend Pod is the only circle You
  champion — so the members surface opens on "This circle is full" and the invite card is
  unreachable **in the main build too**. `cand-a3-seed.jsx` drops the two trailing members
  (Owen D., Freya S. — neither appears in Backend Pod's reaction fixtures) to put the
  circle at 9 of 10. Deliberately **not** fixed in `app/`: that is the owner's call.
- **A candidate's state key needs bumping like the demo's does.** The seed extension only
  affects a *fresh* state; a restored one is still over the cap. Key is at `v2` for that
  reason.
- **Minting a link no longer touches the roster.** The shipped card called
  `onInvite(email)`, which added the member on the spot (`app/main.jsx:443`,
  `inviteEmail`). A row appearing the moment you get a link *is* a delivery confirmation,
  which this delta removes — so `onInvite` is left unwired. Someone appears in the roster
  when they join, and joining happens outside the app. The cap state is still one address
  away in the states register (`full-space-manage`).
- **The link is a pure function of address + circle** (`candA3Token`), so the same address
  always mints the same link. That is what makes "just do it again" a real recovery route
  — and why the card says nothing about the link not being kept (see calls below).
- **Do not use a readonly `<input>` for a copyable link.** At phone width the URL clips
  with no ellipsis (inputs ignore `text-overflow` reliably). It is a `<span>` with
  `word-break: break-all` and `user-select: all`; the copy fallback selects its text range
  with `document.execCommand`.
- **`navigator.clipboard` fails under synthetic clicks** in the design tool, so probing
  always lands on the manual-copy line. That is not evidence the copy is broken — judge it
  with a real click. (Candidate for `GOTCHA.md`; **needs the owner's approval** before
  being added, per `CLAUDE.md`.)

## Artifacts

- `docs/specs/a3-invite-link/circlists-a3.html` — the candidate entry.
- `docs/specs/a3-invite-link/cand-a3-invite.jsx` — the redesigned card.
- `docs/specs/a3-invite-link/cand-a3-seed.jsx` — reachability fixture.
- `app/spaces.jsx` — `InviteForm` extracted and published.
- `app/seed-data.jsx` — TEST - Backend Pod at nine members.
- `docs/specs/a3-invite-link/playground/circlists-a3-transition.html` — the swap: four
  treatments, played as the app. The record of the ratified decision.
- `docs/specs/a3-invite-link/playground/pg-a3-transition.jsx` — the four, the dispatcher,
  and the strip.
- `playgrounds.json` — A3 row.
- `docs/specs/a3-invite-link/README.md` — folder index.

## Action Items & Next Steps

1. **Review the calls that were mine** (each reversible in `cand-a3-invite.jsx`). The first
   two are **retired by the fifth pass** — there is no second face, so nothing is kept and
   nothing comes back:
   - ~~After a copy the card keeps the link.~~ Moot: the link is derived, so it is simply
     there for as long as the address is.
   - ~~Going again is a secondary button under the link.~~ Moot: no control; edit the
     address.
   - **The funding fact is half of the ask face's helper** ("… they join free."). The other
     half — *you fund the circle for everyone in it* — is **cut**: the funding card sits
     directly beneath, and the hint slot it used to occupy belongs to validation.
   - **The card says nothing about the link not being kept.** Naming an absence invites
     the anxiety it describes. The deterministic token makes it harmless: re-enter the
     address, get the same link.
   - **Copy alone; no platform share sheet.** A share sheet exists on phones and not on
     desktop, which makes one card two shapes across the three postures; and the point of
     the change is the champion's own words, which a hand-off to another app does not
     carry. This is the call most worth reopening.
2. **Rule on `app/spaces.jsx:751`** — the empty-home support line ("Waiting on an invite?
   It'll arrive by email…"). Untrue once this lands, outside this delta's scope, untouched.
3. **Backend Pod is still seeded at eleven against a cap of ten**, so the invite card is
   unreachable there in the main build. Owner's call, 2026-08-28: fix **TEST - Backend
   Pod** instead (now nine — `app/seed-data.jsx:192`) and leave Backend Pod alone. The
   candidate keeps its own `cand-a3-seed.jsx` workaround because it opens on Backend Pod.
4. On ratification: merge per `skills/candidate-build/SKILL.md` → *Merging a whole
   candidate*. `cand-a3-invite.jsx` becomes an `app/` module, the CSS block moves into
   `circlists.html`, the entry and its `cand-*` files stay as the record, the launcher row
   flips to `"on": false`, and **one** `CHANGELOG.md` entry is drafted for the owner to
   ratify. `cand-a3-seed.jsx` does **not** merge — it exists only because of item 3.
5. **The homepage demo is a separate decision** (`HOMEPAGE-DEMO.md`). Not touched. If the
   feature is ever carried there, the demo seed and `window.CIRC_STATE_KEY` in
   `demo/demo-overlay.jsx` are two changes, not one.

## Other Notes

- **Nothing here is ratified.** No `CHANGELOG.md` entry, no decision recorded as settled.
- Untouched, as required: the roster and its crown, member count and cap, rename, the
  per-row overflow menu and Remove, the member's own Leave, the funding card, the
  non-champion line, the support line, the unchampioned window, and the circle-full panel
  with its door line. The card is still champion-only.
- Validation is as it stands: an invalid address errors inline; an address already a member
  is refused with the existing message. Both messages are verbatim from the shipped card.
- The preview warns that ~30 base-relative files are "not found". Known false positive for
  a nested entry; the page loads.
