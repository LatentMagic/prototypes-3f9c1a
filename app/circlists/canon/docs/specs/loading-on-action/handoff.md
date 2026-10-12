# Handoff: loading on action (Kit update, 8 Oct 2026)

## What changed
- `CLAUDE.md`: the kit paragraph above "## Always", and the rule block after the overlay block under Designing. Both verbatim; nothing else touched.
- `app/primitives.jsx`: `useAct()` + `CIRC_ACT_MS` (600ms), exported on `window`. `act(fn)` turns `busy` on, runs `fn` after the wait, ignores a second press, and cancels on unmount (closing a dialog mid-flight changes nothing).
- Every corrected control passes `busy` to `Button loading`. Full list: `audit.md`.
- `CandWrite`'s in-field Send swaps its arrow for the small spinner and goes inert; this covers new turns, replies and edits in one place.

## Choices and why
- **One treatment for every control**: `Button`'s own `loading` state. It already shipped on Get a link and every per-person-pricing act, so this is the consistent affordance (ui-design.md). The two non-`Button` controls follow their own house: the Send arrow (spinner in the glyph's place) and the provider's Save card (spinner beside the label, as the provider's Pay does).
- **600ms**: the shipped `PPP_FLIGHT_MS`. Long enough to read, short of the ~1s flow limit, and past the hold-once-shown beat. Pay keeps its 1400ms (provider page).
- **Validation answers at once**; only a press that passes it is staged. Server answers (wrong code, refused link, failed report/block/take-over) now arrive after the wait.
- **Delete's two reaches**: the pressed reach loads; the other goes inert so a second reach can't be pressed mid-flight.

## Unresolved
- **Instant actions** (Mark as done → Swell Done/Skip, Save, Watching, reactions, notifications switch, Unblock, Sign out, Resend code) are left instant pending the owner's ruling. See audit, "Not corrected".
- **Conflict carried forward**: the design-system guide says the spinner never sits in a button. The build now does this everywhere. Needs a ruling upstream (ui.md / DS audit).
- `report-block.jsx`'s old "No sending indicator" decision is superseded by the rule.
- Old ratified "no setting-up wait" on Create a circle still holds: there is no setting-up page, only the button's own 600ms.

## Next
1. Get the instant-actions ruling; if they come in, wrap each in `useAct` the same way.
2. Check at 320px and desktop that no loading button changes width (label stays, so it shouldn't).
3. Ask whether this earns a `CHANGELOG.md` entry.
