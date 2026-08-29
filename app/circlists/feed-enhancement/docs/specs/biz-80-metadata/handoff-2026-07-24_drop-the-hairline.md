---
date: '2026-07-24'
ticket: 'BIZ-80'
topic: 'drop-the-hairline'
status: 'landed'
type: 'design+implementation'
---

# Handoff: dropping the permanent hairline from the card footer actions

## Current Focus / Outcome

The permanent 1px vertical hairline that sat between the two footer actions
(primary + delete) on both feed tabs has been **removed** — from the knock-up
AND from the real app. **The user is happy; this is landed, not in-progress.**

The separation between the two adjacent icon buttons is now carried entirely by
the **inset hover state layer** (each `.circ-cardaction-icon::before` is `inset:
5px`), so when a button is hovered its fill floats a few px in from the button
edge and a real gap opens at the seam. At rest the footer is clean — two glyphs
(tick/arrows + trash) with whitespace, no drawn divider.

## Why this changed (the red-team)

The hairline was introduced in the *previous* session to solve a specific
problem: the two 44px buttons kissed at **gap 0** (required so the pair spans
exactly the 62px image band — see prior handoff), so their hover fills merged
into one blob with no separation. The hairline was the seam.

Then the hover fill was reworked to an **inset state layer** (Material/HIG
icon-button pattern) — `inset: 5px` on the `::before`. That already creates a
visible gap between the two hover pills. So the hairline became **redundant with
the gap the inset already provides**, and it was the one element in an otherwise
borderless-until-touched footer that was *always drawn*. The user asked for a
red-team of with/without; the recommendation was **without** (redundant with the
inset gap; contradicts the calm-at-rest language; the two distinct glyphs
already read as two actions). User agreed: "drop it."

## What landed this session

- **`app/feed.jsx`** (the real app, `circlists.html`): removed the
  `<span aria-hidden ... width:1 ... >` hairline from the footer action cluster.
  Now: primary (`SwellDoor` on Read / tick button on Active) directly followed
  by the delete button, still inside `display:flex; gap:0; marginRight:-13`.
  The comment block above the cluster was updated to explain the inset gap
  carries separation (no drawn hairline).
- **`Permanent hairline - edge-aligned actions.html`** (the knock-up / geometry
  reference): removed the `Hairline` component and its two render sites, on both
  the Active (tick+delete) and Read (door+delete) sample cards.

**Everything else geometric is unchanged and still holds:** `gap: 0`,
`marginRight: -13`, delete's glyph edge locked to the image's right edge, the
tick/arrows sharing the same slot, and the emoji huddle growing leftward as the
sole element allowed to break the image band. Removing a 1px element shifts the
pair's centre by ~0.5px — cosmetically nil; the user confirmed happy without
re-measuring.

## Do NOT re-add the hairline

The file is still *named* `Permanent hairline - edge-aligned actions.html` — the
name is now historical, the hairline is gone by design. Don't "restore" it
thinking the name implies it should be there. If a future session wants
at-rest structure in the footer, that's a fresh taste call to raise with the
user — not a regression to fix.

## Pending (unchanged, not touched here)
- **Loading-state revision** still expected from the user — `FeedLoading` /
  `loadingFeed` are not settled.
- Prior-handoff cleanup still open: confirm-then-retire the container-query
  "Added by" adaptivity (`.circ-attrib-pre` + `@container`); delete the two
  **TEST-** seed spaces before any demo build.

## Critical References
- `docs/specs/biz-80-metadata/handoff-2026-07-24_swell-door-in-enriched-card.md`
  — the prior handoff; explains the gap-0 / image-band geometry the hairline
  used to seam, and why the door arrows share the tick slot.
- `Permanent hairline - edge-aligned actions.html` — the knock-up (hairline now
  removed; geometry otherwise the source of truth).
- `swell.css` — the inset hover state-layer language (`::before { inset }`) that
  now carries the separation; its top comment already describes the intent.
- `CLAUDE.md` — brand + voice (borderless/calm-at-rest is the language the
  hairline was fighting).

## Learnings
- **A separator earns its keep only against the problem it solves.** The
  hairline was correct against *kissing hover blobs at gap 0*; once the hover
  fill went inset (its own gap), the line was solving a problem that no longer
  existed. Re-evaluate fixes when the thing they patched changes.
- **In a borderless-until-touched system, an always-drawn element is a smell.**
  It was the loudest, most permanent mark in a footer whose whole language is
  quiet-at-rest, state-on-hover.

## Action Items & Next Steps
1. (Done) Hairline removed from `app/feed.jsx` and the knock-up. User happy.
2. Await the loading-state spec before touching `FeedLoading`.
3. Confirm-then-retire the container-query "Added by" adaptivity (carried over).
4. Delete the two **TEST-** seed spaces (`seed-data.jsx`) before a demo build.

## Artifacts
- `app/feed.jsx`, `circlists.html` — the real app, hairline removed (both tabs).
- `Permanent hairline - edge-aligned actions.html` — knock-up, hairline removed.

## Appendix — the raw session transcript (user-provided, verbatim)

The user pasted the preceding session's chat. Preserved here for tone/context —
it shows the frustration that preceded this clean landing, and the exact
requirement history (gap-between-buttons is a UX must; evenness relative to the
other button matters, exact px does not).

> Circlists | App Prototype
>
> Please onboard to the latest handoff. We're just trying to get our work in
> place underneath the image. I'm looking at this Permanent hairline file.
> Two things:
> 1. Can we please now remove this image band because it's impossible for me to
>    actually vet the quality of these cards?
> 2. In making the door icon actually in the right place, the previous agent
>    actually said it seems to have disconnected it from the emoji list and
>    actually extended the space between the emoji list and the button. Now they
>    no longer look like one conjoined button. The intention was that we get this
>    alignment that we now see with both emojis around the edges of the image,
>    but the emojis are meant to be extending from the door icon. They're way too
>    far away at this stage.
> I must say this has been probably the most annoying agentic experience I've
> ever had. It's probably because I'm not communicating well enough, but agents
> are really struggling with understanding this process and my requirements.
>
> [Agent] Both fixed. The tinted "image band" overlay is gone so the cards read
> cleanly, and the emoji huddle now hugs the door arrows as one conjoined button
> (heart sits ~6px from the arrows instead of ~16px), while delete stays locked
> to the image's right edge.
>
> [User] omg I LOVE IT! Ive got one issue. That issue is that the hover for both
> basically overlaps, or they just reach that hairline. I think that is a
> problem. It looks a bit of a weird UX. ... I just wonder whether we could
> spread the buttons just a touch, centering in on the hairline, just so that we
> are able to have a touch of gap. ... as long as things are even.
>
> [Agent] (proposed grow-cluster-leftward, keep delete pinned — WRONG READ)
>
> [User] Whoa, we don't seem to be aligned. ... There is a fundamental problem,
> my friend, and that problem is that those two buttons have no gap. UX standards
> mean they must have a gap. ... I'm wondering why you have ignored my explicit
> instructions.
>
> [Agent] (corrected: gap between the buttons is the requirement, centered on
> the hairline, evenness preserved — not the image edge)
>
> [User] Again, as long as it's even relative to the other button how much gap do
> I want? I don't care. It just needs to have some gap, doesn't it, obviously?
>
> [This session] Resolved cleanly: the gap requirement is now met by the inset
> hover state layer (each button's fill floats in from its edge), and on that
> basis the always-drawn hairline was redundant — so it was dropped from both the
> knock-up and the real app. User: "i am happy!"
