# Handoff — LM-666, deleting a link for yourself or for everyone

**2026-08-18 · candidate build, nothing ratified.**

Entry: `circlists-lm666.html` (own state key `circ_lm666_state_v1`).
Overlays: `cand-lm666-viewer.jsx`, `-dialog.jsx`, `-states.jsx`, `-main.jsx` (this folder).

## Demo path

Launcher → States half → group **Deleting a link** (each is also an address,
`?state=<id>`):

| State | What it shows |
|---|---|
| `delete-as-contributor` | your own link, circle you don't champion → two rows |
| `delete-as-champion` | someone else's link, your circle → two rows |
| `delete-as-member` | someone else's link, not your circle → one row, no disabled row |
| `delete-quiet-arrival` | Book Club holds one unread arrival you deleted for yourself → no dot, no pill, no waterline place |

Take *Delete for me* on either tab, then refresh, leave and re-enter the circle:
the link stays gone for you, whole for everyone else, and your reaction on it
still stands for the circle. *Delete for everyone* runs the shipped delete.

## What was opened in `app/`

Two additive hooks in `app/main.jsx`, both read off `window` per render — absent
⇒ shipped behaviour byte for byte:

1. `window.CircViewerSpaces(spaces, user)` — the viewer's own view of the
   circles, applied where the app *renders* (`listSpaces`, `space`). Mutations
   still run against raw state. One hook covers both tabs, the New pill, the
   waterline, the empty state, the rail dot and the home rows, so a hidden link
   cannot leak through one surface while being gone from another.
2. `<ConfirmDialog item={confirm.item} …>` — the dialog needs to know which link
   it is about. The shipped primitive ignores the prop.

Nothing else in `app/` changed. The card footer is untouched.

## Calls I made (aim here)

- **Form settled by playground** (`pg-lm666-dialogs`, ten shapes, now torn down):
  shape **2b — stacked, no default**.
- **Centred dialog, not a bottom sheet.** Every confirm here is a centred dialog,
  and the app posture reserves the sheet for Add alone (`MOBILE.md`). A sheet
  would split the confirm pattern three ways to buy nothing.
- **No default act — the load-bearing call.** Windows, macOS and GNOME all hold
  that the default button must be the safest option when the act is destructive:
  never the one that performs it, and where no button is fit to be default, none
  is set. So neither reach is filled — both are the house
  *destructive-secondary* (outlined, danger in the label), Cancel is the plain
  secondary beneath them and holds the focus, so Return dismisses. Nothing in the
  panel is ranked; the words carry the difference in reach.
- **House buttons, not boxed rows with subtext.** The panel is the house confirm
  with its one primary replaced by a stack of the app's own full-width buttons.
  Its cost, stated: a plain button carries no supporting line, so the two reaches
  are told apart by their labels and the one body line.
- **Order: for me, then for everyone** — escalating reach, and the act a
  non-holder sees sits in the same place either way.
- **One shape for both cases.** The one-act panel is the same panel with the
  second button absent, and the body line changes from the choice ("Choose how
  far this goes.") to the consequence — which is the house confirm exactly, with
  the ratified label on the button.
- **Dismissal keeps the word Cancel, not an X.** Two shapes tested the X; the app
  reserves the X for surfaces you return from (the Add sheet, the Swell door),
  never for a decision, and the safe way out should be the most obvious control
  in the panel.
- **Supporting copy (mine).** *Delete for me* — "It goes from your list. Everyone
  else keeps it." *Delete for everyone* — "It goes from the whole circle, for
  good." Each states the reach first, then what remains, so the pair differ on
  the one axis being chosen on. The old single-outcome `delete` copy retires.
- **Staging sits in the States register, not Config's controls** — that is where
  staging moved to, and it gives each role an address a ticket can link to.
- **Focus.** Cancel takes initial focus (a destructive row must not be one Enter
  away); dismissing returns focus to the bin; taking a choice moves focus to the
  feed, since the bin left with the card. Tab cycles inside the panel.

## Open, not decided

- The bin's accessible name is still the shipped "Delete this link" — it does not
  name *which* link. Fixing it means editing `FeedCard`'s label in `app/`, which
  is shipped copy, so I left it.
- `hiddenForMe` lives on the space object, so it persists with everything else and
  a rejoin reseeds it away. If delete-for-me ever needs to survive a rejoin, that
  grain has to move.
