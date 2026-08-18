# LM-652 — Discourse

What shape an exchange takes in Circlists, from a contributor's attached thought to a reader's
response, without the app becoming a chat tool. All discourse work lives in this folder.

**Where it is now — the candidate build.** The delta prompts landed and were built as
`circlists-lm652.html` at the project root: the same `app/*` files, then the `cand-lm652-*.jsx`
overlay set (this folder) re-publishing only what the delta changes. Its own persisted-state key
(`circ_lm652_state_v1`); teardown = delete the entry + the cand files. The additive hooks it needed
in `app/` (main.jsx candidate hooks, swell-reactions internals export + reveal override) leave the
main app pixel-identical. First-build receipt:
[`handoff-2026-08-14_candidate-first-build.md`](handoff-2026-08-14_candidate-first-build.md).

**Nothing in this ticket is ratified.** The working requirements below are the current read of the
build and the conversation around it, offered for ratification. Everything about the playground
rounds that preceded the candidate build is in the [historic appendix](#historic-appendix).

---

# Working requirements (2026-08-17)

Synthesised from the candidate build's code (all `cand-lm652-*.jsx` read in full) and the handoffs.
**Not exhaustive, and a proposal — not a record of settled intent.**

Status markers: **[R]** ratified in words · **[W]** working decision / built but unratified ·
**[O]** open — needs a decision before spec.

## 1 · Add

**Intent.** One popover, two faces: a quiet link face you commit from, and a second face that
is nothing but room to write the optional thought (direction 2, "The other side").

Requirements & ACs:
- **[R]** One form, two faces, sliding horizontally; height follows the active face fluidly;
  both transitions drop under `prefers-reduced-motion`.
- **[R]** Link slot: link glyph at the head of a white row with the standard border. The slot
  itself carries validation (destructive border + alert message). No clipboard reading.
- **[R]** Thought is optional, said only by the writing face's placeholder:
  *"Say why you're sharing it, or leave it blank."* The link face stays quiet — no second
  "optional" anywhere.
- **[R]** Way off the writing face: **two named acts at its foot** — Discard quietly on the
  left, Add as the primary on the right (whiteboard 3, option 2, picked 2026-08-18). The head
  arrow is gone; Add commits the whole contribution from this face, and a URL that fails
  validation returns to the link slot carrying the error. Supersedes the earlier arrow-only
  ratification, which this whiteboard existed to reopen. **[O]** Two calls made in the build and
  not put to anyone: Add committing from here at all, and Discard clearing the words outright.
- **[R]** Returned state: thought clamped to two lines; the fade is drawn the moment a second
  line exists (one rule, not an overflow test); edit glyph vertically centred at every height.
  Accepted cost: an exactly-two-line thought gets its second line's foot veiled.
- **[R]** Escape steps back to the link face before it closes the popover; focus follows the
  face; the inactive face is `inert`.
- **[R]** The writing face's head row — the link's domain — is drawn only when the slot holds a
  link; empty, the room takes the space rather than reserving a blank.
- **[W]** Thought cap 500 characters; counter "n left" appears under 60 remaining.
- **[W]** URL validated on Add: inline error "That doesn't look like a valid URL. Check it and
  try again."; a schemeless URL gets https:// prefixed.
- **[W]** Turning Mark as read off collapses the Swell AND clears any placed glyph — not-read
  and here-is-my-reaction cannot both be true.
- **[W]** No reveal fires on add — nobody else has reacted to a card just added.
- **[W]** Adding a link enrols the contributor in the conversation (`watching: true`, seen-mark
  stamped) — AC: the contributor never has to opt in to their own conversation.
- **[O]** Whether reacting, replying or reading ALSO enrols is a wider rule — unruled (the
  code says so itself).
- **[W]** A reaction placed here is a blind reaction (`atAdd`): it joins the roster and rides
  no turn.
- **[O]** The Swell's framing inside the popover — candidate keeps "How did it land?" +
  caption; the whiteboard uses a single caption. Never answered.
- **[O]** Popover heading — currently "Add a link"; voice doc says don't name the mechanism.
  Parked, not rejected.
- **[O]** Auto-populate the slot from the clipboard. Parked, not rejected.

## 2 · Active

**Intent.** The contributor's thought arrives with the card as a named person speaking —
tucked under the link card, never a caption, never a pull-quote.

Requirements & ACs:
- **[W]** The stack: thought as a warm-paper band (`#F2F1EB` on `#DEDCD3` — not tokens yet)
  under the link card, card in front overlapping.
- **[R]** **Every card carrying a thought opens** (ratified 2026-08-18) — the band draws its
  mark and behaves as an opening control whether the thought is one line or twenty. The old
  band-honesty rule (a thought that fits is read on an inert band) is **retired**. A card with
  no thought still has no band and does not open.
- **[R]** The open thought is shown **whole** — no cap, no Read more.
- **[R]** The swap is real motion: one tree, both cards always mounted, moving past each other
  (400ms, reduced-motion guarded). The open card's sliver is the real link card, and pressable.
- **[W]** The band's tell is the **Lines** mark — three ragged lines, constant: it says more is
  held back, never how much. "Held" is measured, never guessed from a character count. The
  open face closes with an **X** ("Back to the link") — deliberately not the tell mirrored,
  since the tell is not a direction.
- **[R]** Open face, "name leads": full-width hairline under the title; avatar 26 + name
  600 14px **black** + time; thought 12.5px/1.85 in secondary ink; favicon + domain move to
  the card's foot; Mark as read + Delete share the foot row (feed only — the surface's head
  card already carries them). Register pixel-identical on card and conversation surface.
- **[R]** Own thought carries `⋯` (Edit / Delete) — on the open face after the time, **one
  arrangement for every thought, short or long** (2026-08-18: the band's own menu goes with the
  retired honesty rule; the band is now only an opening control). Edit marks "· edited" (open face only). Delete is immediate, unconfirmed
  (consistent with the delete grammar); the stack closes to a plain link card, no tombstone.
- **[W]** The band draws on Active only (on Read the way in is the surface).
- **[O]** The domain's position on the CLOSED card (foot placement was ratified for the open
  card only).

## 3 · Reveal

**Intent.** The mark-read reveal shows how the circle reacted and hands over to the
conversation — it should introduce the conversation on the way there. **This is the one
delta item never delivered.**

Requirements & ACs:
- **[W]** The reveal is static and held until dismissed (no auto-fade timer); ✕ top right
  stays; the shipped reaction review renders unchanged.
- **[W]** Primary button: "Go to the conversation" / "Start the conversation" when nothing
  has been said.
- **[O] — outstanding, top of the list.** Introduce up to three opening turns at the reveal.
  Constraints from two rejections: must hold three excerpts without overspilling the viewport;
  any resize must be fluid, not a jump; ✕ and the primary button stay. Options must be
  ratified before building — it has been got wrong twice.

## 4 · Returns surface (the banner)

**Intent.** The circle tells you conversations you're in have moved — a strip at the head of
the feed, because the feed has no fixed shape and the top bar does.

Requirements & ACs:
- **[W]** W4: strip at the head of both Active and Read, standing on whichever tab you're on,
  the touch made explicit by name — "{X}, {Y} and others spoke on cards you are watching" — no
  digit anywhere; expands in place to a list (card title + who spoke); each row opens that
  card's conversation surface. Shown only when a watched card carries words newer than its
  seen-mark.
- **[W]** Copy: collapsed "See what they said", expanded "Pick one to open its conversation"
  (rewritten from v12 because the destination is the surface, not the card). Part of the
  unratified Part B set.
- **[W]** Chevron target uses the house radius-md control shape, not a circle.
- **[R]** The banner clears for a card once the member has visited its conversation; the
  seen-mark is stamped on **leaving** the surface (any exit from the route; not tab close), so
  it also serves as the arrival mark's waterline.
- Accepted costs, standing: it scrolls away; it appears at the head of both tabs.
- **[O]** Whether the banner's rows should carry the sage margin tab too. Not yet raised.

## 5 · Read

**Intent.** On Read, the way into discourse is one always-present icon to a full surface; the
card itself stays quiet.

Requirements & ACs:
- **[W]** The emoji door-analytics button is **replaced** by the way-through icon, always
  present on a Read card — the only way in. The icon is deliberately NOT a speech bubble: it
  is the Swell's disc with three marks held inside it, because the surface it opens is the
  conversation AND the reaction record. Roster and door analytics live on the surface.
- **[R]** The mark **inverts** — the disc fills and its marks reverse out — where the card is
  watched AND carries words landed after the member's own mark. Filled in **ink**
  (`--color-fg-2`), never accent: unseen words are status, and the accent is reserved for
  primary actions and active states. Not a count, not a badge — the same mark, filled.
  (Whiteboard 1, option 1, ratified 2026-08-18.)
- **[R + W]** The fold is a **signal only, never a control**: drawn on Read cards that are
  being watched, not pressable. (As a control it failed both the contrast and target floors —
  measured, recorded.)
- **[W]** Reveal-on-read holds: nothing another member attached is visible until you have read
  the item; a contributor's own unread card has no way into its conversation ("you can only
  read from Read"). Noted as a standing answer, not solved.
- **[O]** A card can be watched and unread at once — after add-enrolment that is every
  contributor immediately. The shelf shows nothing for that case; no second mark was invented.

## 6 · Conversation surface

**Intent.** One full surface — reached and left the way circle settings is — holding the
card, its thought, the roster, and the turns. Not a chat tool: no per-turn read state, no
counts, no who-read-it.

Requirements & ACs — the head:
- **[R]** The head card is the **real shelf card** (mounted at Active anatomy), with the
  thought tucked under it exactly as on Active (C5 option 3: the thought belongs to the card,
  not the thread). No separate intro slab.
- **[R]** No Open control — the title is the link's affordance, as in the feed.
- **[R]** The shipped roster door and review modal belong on the surface's card; no tick or
  delete on the tucked card here (the head card carries them).
- **[R]** The card's page is titled **`Overview`** in the top bar (ratified 2026-08-18) — the
  slot names where you are, and the page carries the card, the thought, the roster and the
  reaction analytics, not only the conversation. The thread's own `the conversation` eyebrow is
  unchanged.
- **[R]** Thread head row: eyebrow + hairline + the watching control at the row's end —
  folded-page glyph, secondary ink off / accent on. Pressing it teaches what the fold means.
- **[R]** Watching copy: "Watch this conversation" / "Stop watching this conversation",
  tooltip and aria-label alike.

Requirements & ACs — the turns:
- **[R]** No reaction glyph rides any turn — the reaction belongs to the room, read in the
  roster.
- **[W]** Turn anatomy: avatar 26, name 600 13.5px black, body 14.5px primary ink; "· edited"
  after the time; deleted → tombstone "{name} removed what they said." / "You removed what
  you said." — the row stays so replies beneath are not orphaned.
- **[R]** Own turns carry an always-drawn `⋯` (Edit / Delete) after the time — no hover
  mechanic. Panel opens down-and-right, flips at the viewport edge; AA-audited. Delete is
  immediate.
- **[R]** Reply groups: replies run one level deep, never deeper (Reply lives only on
  top-level turns); one rail per group; furniture recedes with depth (avatar 22, name 12.5
  secondary, time 11) but **body stays 14.5px**; the first two replies are always visible, the
  tail past two collapses behind "More replies" / "Hide the rest" — no counts; an opened tail
  stays open for the visit. **The fold only ever holds turns already seen** (ratified
  2026-08-18): a group whose held-back tail carries anything unseen is already open when the
  member arrives, so nothing wearing a tab is hidden behind an unmarked control. From there the
  group is the member's — "Hide the rest" is always available on an open group (2026-08-18: the
  delta's "withheld until seen" rule is **overturned** — it removed the member's control of
  their own page, with no way to settle a group without leaving the surface).
- **[R]** Reply sits at the group's foot and withdraws while a tail is held back (you don't
  answer what you haven't read); the surface's own composer at the foot is always open, so
  there is never a state with no way to speak.
- **[R]** New words are marked by the **margin tab** (sage, 3×22, radius 2) standing in the
  turn row's own flow — always in the geometry, so a turn never moves when it colours.
  Replaced the full-turn wash.
- **[W]** The mark's rules: read against the visit's frozen waterline; a group whose hidden
  tail holds unseen words starts open; replies mark individually; own turns and tombstones
  never mark; a turn arriving mid-visit marks immediately; the conversation is marked seen
  wholesale on leaving — no per-turn ledger.
- **[R]** Compose: the warm-paper borderless field everywhere words are written. **Committing
  happens inside the field** — one arrow on the field's own edge, drawn at rest and inked once
  there are words, on the house `radius-md` shape, never a circle (whiteboard 2, option 2,
  picked 2026-08-18). **There is no Cancel anywhere**: you take words back by clearing them,
  which is the one rule for every box in the product. **[O]** Consequently Reply toggles —
  pressing it again withdraws the box, since Cancel was the only other way out. Built, not
  put to anyone. "n left" under 60; 500 characters to a turn. Plain text: line breaks kept, a
  leading dash renders a bullet, nothing else parsed. Foot placeholder "Add to the
  conversation"; reply placeholder "Reply to {name}". Empty case (no thought, no turns):
  "Nothing has been said yet."
- **[W]** No Add on this surface (FAB reverted). In-app it is a shell-chrome / governance
  call, not a candidate detail.

Open on the surface:
- **[O]** **The watching vocabulary** — "watching" is probably the wrong word. Flagged since
  2026-08-14, never resolved; now in visible copy.
- **[O]** **Part B copy set** — Add popover words, return
  banner, roster eyebrow. Oldest open item; six handoffs.
- **[O]** `tab`-passthrough: an unread card on the surface shows Mark as read + Delete and no
  roster door. Consistent with reveal-on-read, signed off by nobody.
- **[O]** Footer centring: single-action footer centres Delete; should it apply to the
  two-action footer too?

## 7 · Cross-cutting (the bits that sit under all six)

- **[R]** Laws honoured everywhere: reveal-on-read · communal library, individual read-state ·
  no unread badges, no tallies, no counts · sharing before reading is a valid register, never
  punished · calm is the floor.
- **[W]** At the foot of YOUR OWN card's **conversation surface** (not the feed card), one
  quiet line once **both** counts are met (ratified 2026-08-18): `CAND_OWN_MIN` (3) replies from
  people other than you, **and** `CAND_OWN_MINE` (1) reply written by you. Both count turns, not
  people; deleted turns excluded; neither has to come first. Then: champion of
  **any** circle → "You might have fun with another circle."; otherwise "You might enjoy
  having a circle of your own." An ordinary inline link, never a button.
- **[W]** Data shape: `thought {by, text, at, edited?}`; turn `{id, by, text, at, replyTo?,
  edited?, deleted?}` — a deleted turn keeps its row as a tombstone, a deleted thought is
  removed outright; `watching`; `talkSeenAt` — entry receipt AND visit waterline, stamped on
  LEAVING the surface; absent/falsy = no baseline, so a first visit marks nothing; a one-shot
  migration normalises unusable marks to the newest words. `atAdd` on blind reactions.
  **[O]** When a reaction given at mark-read should ride a turn, and what happens when a
  member reacts but never speaks.
- **[W]** Warm paper `#F2F1EB` / `#DEDCD3` is used in three places (band, open face, compose)
  and is **not a token**. Promote before spec.
- **[O]** Sub-44px note: the fold needs no target now (signal only), but record that any
  future corner control fails the floor by geometry.

---

### Self-check performed

Verified against the file record before writing: the reveal file still renders disc + button
only (§3's outstanding item is real); the fold's demotion (reply-density handoff) supersedes
the fold-as-control round; the margin tab (readiness handoff) supersedes the wash; "no glyph
on any turn" supersedes the first build's blind-reaction-rides-first-turn; C5 option 3
supersedes the intro slab; `CAND_OWN_MIN` is 3 (QA round D3), the first build's 4 is stale.
Not covered here because they are rig questions, not product intent: C2–C4 (reported
unreadable, never reproduced).

### Code review performed (second pass)

All eight `cand-lm652-*.jsx` files read in full. Corrections against the handoff-only draft:
the open face closes with an **X**, not a mirrored travel glyph; the band's tell is the
**Lines** mark; the way-through icon is the Swell's disc, not a speech bubble; the item-7 line
sits at the foot of the conversation surface, not on the feed card, with its copy verbatim in
code; the banner line is "…spoke on cards you are watching"; the surface's empty case reads
"Nothing has been said yet." Additions the handoffs never carried: URL validation and its
error copy, mark-as-read-off clearing a placed glyph, no reveal on add, replies capped at one
level with the first two always visible, the unruled wider enrolment rule, and the seen-mark
migration.

---

# Historic appendix

Kept as record. None of it is live; the candidate build supersedes all of it.

## The playground rounds

All playground entries are in [`archive/`](archive/) — `pg-discourse-v10.html` (modules
`pg-d10-*.jsx`; it also loads v9's shared machinery), `pg-discourse-v9.html`,
`pg-return-v12.html`, `pg-thought-stack.html`, `pg-thought-v11.html`, and the four whiteboards
(`pg-wb-*`, `pg-whiteboard-thought-on-card.html`). Superseded rigs v7–v8 and the early v1–v4 work
are there too. **They no longer run from the archive** — a playground entry needs to sit at the
project root for `app/`, `tokens.css` and `brand/` to resolve, so to open one again, move it back
to the root. The five standalone bundles alongside them (`*-standalone.html`, v9/v10/r12/
thought-stack/thought-v11) do run from anywhere.

Lineage of the working decisions above, for anyone tracing where a shape came from: the thought
stack is `pg-thought-stack.html` (`pg-st-stack.jsx`); the return strip is W4 from
`pg-return-v12.html` (`pg-r12-return.jsx`, `W12Strip`), chosen over the top-bar routes W1/W2/W5
and the ten control forms in `pg-wb-control-forms.html`; the Swell-in-the-add-popover idea is
credited to `pg-discourse-v10.html` option **C4 · "It arrives with your mark on it"**
(`pg-d10-contribute.jsx:205`, `C4Add`) as inspiration only, never as a model of the execution. The
add surface's own round is in [`../add-surface/`](../add-surface/).

## Handoffs

| File | For |
|---|---|
| [`handoff-2026-08-17_conversation-surface-readiness.md`](handoff-2026-08-17_conversation-surface-readiness.md) | The margin tab replacing the arrival wash, and the seen-mark's rules. |
| [`handoff-2026-08-17_reply-density-and-the-fold.md`](handoff-2026-08-17_reply-density-and-the-fold.md) | Reply-group density, the collapsing tail, and the fold demoted to a signal. |
| [`handoff-2026-08-17_readiness-walk-delta.md`](handoff-2026-08-17_readiness-walk-delta.md) | The readiness-walk delta: champion-of-any-circle, `⋯` on your own thought, Reply at the group's foot. |
| [`handoff-2026-08-17_turn-menu-and-tucked-card-spacing.md`](handoff-2026-08-17_turn-menu-and-tucked-card-spacing.md) | The own-turn menu's popover and the tucked card's spacing on the surface. Records the C5 pick and the reverted FAB. |
| [`handoff-2026-08-17_the-open-card.md`](handoff-2026-08-17_the-open-card.md) | The open card's motion and register. |
| [`handoff-2026-08-17_thought-as-somebodys-words.md`](handoff-2026-08-17_thought-as-somebodys-words.md) | "Name leads" — the thought as a named person speaking. |
| [`handoff-2026-08-17_conversation-surface.md`](handoff-2026-08-17_conversation-surface.md) | The conversation surface audit: head card as the shelf card, roster door restored, glyphs off the turns. Carries the **ratified problem** C5 exists to answer. |
| [`handoff-2026-08-16-qa-round.md`](handoff-2026-08-16-qa-round.md) | The QA round. |
| [`handoff-2026-08-14_candidate-first-build.md`](handoff-2026-08-14_candidate-first-build.md) | The candidate build's shape and teardown. |
| [`handoff-2026-08-14-return-button-and-prebuild-decisions.md`](handoff-2026-08-14-return-button-and-prebuild-decisions.md) | The pre-build working decisions, and why. |
| [`handoff-2026-08-12-discourse-v8-return.md`](handoff-2026-08-12-discourse-v8-return.md) | The v8 return round. |
| [`handoff-2026-08-12-discourse-v8-playground.md`](handoff-2026-08-12-discourse-v8-playground.md) | Carries the **verbatim v8 prompt**. |
| [`handoff-2026-08-11-discourse-v7-processing.md`](handoff-2026-08-11-discourse-v7-processing.md) | The v7 review and the four ratified laws. |
| [`postmortem-2026-08-03-discourse.md`](postmortem-2026-08-03-discourse.md) | Why v2 and v3 died. Still binding. |
| [`PROMPT.md`](PROMPT.md) | The original round-one brief. |

## Round one, as written

`discourse-playground.html` (+ `pg-disc-*.jsx`) explored the loop as eight rail entries: the
reaction-only baseline (00) and seven directions — passing notes, marginalia, the Table, guided
statements, inside the door, the Echo, the question — each answering every lever, each stating its
relation to the Swell (04/05/06 merge into the reaction moment; 01/02/03/07 are sequential). v2 and
v3 were rejected for folding those directions into one mechanism; v4 kept them as directions,
widened to ten. Full round-one text is in the postmortem and `PROMPT.md`.
