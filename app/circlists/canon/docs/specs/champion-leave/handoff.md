# Handoff: a champion can leave a circle

Status: built into canon, proposed (not deployed). Every choice under "Yours to decide" is a draft for the owner to judge. Nothing here is recorded as ratified.

## What was built, and where
- **Champion's own row** (`app/spaces.jsx`, MembersSurface): the "…" menu now shows on the champion's own row, holding only "Leave this circle" (destructive treatment, same as every member). The crown stays beside the name. No other control added; no Delete, no hand-on.
- **Confirms** (`app/feed.jsx`, `circLeaveCopy` + ConfirmDialog): the existing Leave confirm, title "Leave this circle?", "Leave" / "Cancel". Copy is chosen from the circle, so every road to Leave agrees (Members surface, dormant screen).
  - Champion, circle with others: see below.
  - Sole member (champion or not): "You're the only one in this circle, so leaving ends it — everything in it is deleted after 30 days." Verbatim, with the app's curly apostrophe.
  - Anyone else: unchanged.
- **Sheet at phone width** (`ConfirmDialog` `sheet` prop from `isSheetPosture`, `.circ-sheet-up` in `circlists.html`): the Leave confirm is a bottom sheet on a phone, a centred modal on desktop. Same content. Only the Leave kind changed; other confirms stay modals.
- **Dormant screen, champion left** (`app/pricing-circle.jsx`, and the shipped fallback in `app/subscriptions.jsx`): body line "Its champion has left. Everything in it is still here." when `space.dormantReason === 'champion-left'`. Take over and Leave are untouched.
- **Removed**: the champion's foot line on Members ("You champion this circle, so you can't leave it…"), and its dead hook `PppChampionFoot` / `ChampionFoot` in `pricing-circle.jsx` and `pricing-main.jsx`.
- **Crown** nudged up 1.5px so it centres on the name (`spaces.jsx`).

## Staged addresses (`?state=`, same at phone and desktop; width is set by Viewport in Config)
- `members-champion-sole`: Members as a champion who is the circle's only member.
- `dormant-champion-left`: dormant screen as a remaining member, champion left (`dormantReason: 'champion-left'`, `champion: null`).
- Reached by clicking, not staged: the champion confirm with others (`members-champion` → your row's "…" → Leave this circle).
- QA entry `champion-leave` in `app/qa.jsx`: `members-champion`, `members-champion-sole`, `dormant-champion-left`, with the click for the confirm in its note.

## Yours to decide: what I chose
1. **Champion confirm copy.** Title "Leave this circle?". Body: "Leaving puts this circle to sleep for the {N} others in it. Nothing in it is lost, and any of them can take it over. Nobody is told, so tell them first." N=1: "…for the one other member in it. Nothing in it is lost, and they can take it over. Nobody is told, so tell them first." Kept the draft, with "Nothing is lost" → "Nothing in it is lost" unchanged from the draft; no steering line (does not fit without crowding).
2. **Foot line on Members.** Removed entirely. The menu and the confirm carry the consequence; a replacement would say it twice.
3. **Dormant line.** The draft, as given.
4. **Champion's row.** The crown already rides the name, so the trailing slot is free for the "…" menu, 44px target intact. No change to the crown beyond centring.
5. **Dormant reason.** A `dormantReason` flag on the circle, set only by the staged state. Because it is its own register entry (clicked to), I added no Config control.

## Not built / unresolved
- Leaving drops the circle from the leaver's rail, as every Leave does, so the prototype never shows the circle sleeping for others as a click-through. The sleeping state is only visible at `dormant-champion-left`.
- The sole-member confirm is staged only for a champion (`members-champion-sole`); a non-champion sole member cannot arise in the seed.
- Not yet checked by me at every width; the verifier pass covers phone and desktop.

## Next
Owner judges the five items above. Then CHANGELOG entry (ask first).

## Corrections, 5 Oct (three, from the owner's delta)
1. **Leave confirm is a centred modal at every width.** The sheet was wrong: the UI spec makes confirmation dialogs one pattern at every breakpoint. Removed `ConfirmDialog`'s `sheet` prop and `asSheet` branch (`app/feed.jsx`), the `sheet={isSheetPosture}` pass (`app/main.jsx`), and `.circ-sheet-up` with its keyframes (`circlists.html`; nothing else used it). All five confirms are the same modal again. The "Sheet at phone width" bullet above is superseded.
2. **A lapsed champion can leave their sleeping circle.** `ppp-lapsed-circle` (`app/pricing-circle.jsx`) now shows "Leave this circle" for the champion too, same place and treatment as every member. `circLeaveCopy` already picks the right body: the circle is not funded, so never the "puts this circle to sleep" copy; the member confirm, or the sole-member body if they are alone. Leaving drops the circle from the leaver's list, as every Leave does; for the members who remain it has no champion, so it reads "Its champion has left."
3. **"Its champion has left." is derived, not stored.** It shows when a sleeping circle has no champion (`!space.champion`, in `pricing-circle.jsx` and the shipped fallback in `subscriptions.jsx`). The `dormantReason` flag is gone (`stageDormant` in `app/states.jsx`). Taking the circle over sets a champion, so the line ends; if that champion's subscription later ends, the circle reads "Its champion's subscription has ended."
- New staged state `dormant-champion-left-retaken`: the circle after Priya took it over and her subscription ended. It is the same data as `dormant-circle` on purpose, since no residue of the earlier leave remains.
- QA entry `champion-leave` gains `ppp-lapsed-circle` and `dormant-champion-left-retaken`, and its note now asks for a modal at both widths.
