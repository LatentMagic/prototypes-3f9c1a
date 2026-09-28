# Comment reactions — handoff

## What was built
- `app/talk-reactions.jsx` (new, droppable; loaded before `talk-surface.jsx`). Holds the react button, quick bar, pill, who-reacted sheet/popover and `candReactTurn`.
- `app/talk-surface.jsx` `CandTurn`: every live turn now draws an action line. It carries Reply where Reply already stood, plus `window.CandReactions` when it is loaded. Removed turns are unchanged.
- `app/talk-parts.jsx` `candDeleteTurn`: removing a turn also drops its `reactions`.
- Data: `turn.reactions = [{ who, glyph, at }]`, one per person, in the order they reacted. `who` is a name, `You`, or `Former member.`, and is resolved with `circContributorLabel`.
- Seed (`app/talk-data.jsx`, search `@fixture comment-reactions`): the go.dev pipelines card has gp1 (four people, yours included), gp2 (one) and gp4 (your own comment, two others). jvns.ca has jv0a (a reply with a former member among three) and jv1 (a former member alone).
- CSS: the "Comment reactions" block in `circlists.html`.

## Staged states
- `?state=comment-reactions-counted`
- `?state=comment-reactions-who-sheet` (opens on gp1: You, then Dev K., Ada L., Marcus T.)
- `?state=comment-reactions-former-member` (opens the who view on jv0a)

## Standing constraints
These hold for now: no count below two people, one pill per comment, the five glyphs only, and no notification.

## Presentation calls (not yet ratified)
- **React button.** An outlined face with a plus, 17px, in fg-3, with a 44px target on inset padding. It is always visible. It is an icon, not the word "React", to keep furniture off every reply (the same reasoning as CandTurnMenu's single glyph).
- **Placement.** The order is Reply, then the react button, then the pill, with a 12px gap, and the line wraps. The pill comes after the button so the button never moves when the first reaction lands.
- **Top-level turn with replies.** It gets its own action line under its words, holding the react button and pill only. Reply stays at the group's foot. A reaction belongs to the words; the foot belongs to the group.
- **Quick bar.** It floats 6px above the button and flips below when there is less than about 128px of room to the screen top. It right-aligns when it would overflow. It has five 40×44 cells with 22px glyphs, on a white card with radius-lg and shadow-overlay. Yours is marked with a sunken fill and a 1px accent inset. It opens with a 150ms fade and 4px rise (`element.animate`, reduced-motion safe) and closes instantly. It dismisses on a tap outside, Esc or scroll. Arrow keys move between glyphs, and focus returns to the button.
- **Pill (size ratified 2026-09-28, board option 01).** It is 24px tall with 6px padding, radius-md (not radius-pill, which tokens reserve for badges), with a 1px border. It holds 14px glyphs in 16px boxes, overlapping by 2px, which is looser than the door's −4 per vent's crushing note. It sits 8px after the react button. Board: `docs/specs/comment-reactions/playground/wb-reaction-pill.html`. The count is 12px/600. Yours is marked with an accent border and an accent count; accent is allowed here because this is a selected state. Hovering or opening it gives a sunken fill.
- **Empty to first reaction.** The pill fades in (150ms, 2px rise) beside the button. Nothing else moves.
- **Who reacted.** On a phone it is a sheet on `useSheetMount` with the heading "Reactions" and a close button. On desktop it is a popover under the pill (248px wide, flips like CandTurnMenu). Rows show the glyph, then the name. Your row comes first, is a button, and trails "Remove". Removing the last reaction closes the view and focuses the react button.
- **Hover versus tap.** Tap or click only, on every posture. Hover-open would flicker across a thread, and hover does not exist on touch.

## Unresolved
- The three proposal mocks did not arrive with the brief, so they were not consulted.
- The sheet's slide can't be checked in the agent's own preview (GOTCHA 2). It needs an eyeball in a live browser.
- "Remove" on your row: reviewed on `playground/wb-reaction-remove.html` (2026-09-28). The user kept the trailing word as built.

## Next
Ratify or overturn the calls above. Probe 320px with a counted pill beside Reply on a long name, then check the arrival motion live.
