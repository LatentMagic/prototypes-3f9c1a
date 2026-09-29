# Handoff — Returns bar, option E (names mean writers)

## Built
- `app/talk-return.jsx`: `candBarLine` names repliers only; empty for a reaction-only row, which renders its title alone. Rows are a fixed 60px, content centred. Head: repliers only, verb "replied" only, no second line when only reactions moved. New `candBarGlyphs` rolls up up to three distinct glyphs across rows; `CandRxStack` sits at the head's right before the chevron. Canon's stack styling unchanged.
- `CandRxStack` is announced as "Reactions to you." instead of a list of glyph names (rows and head).
- `app/home-returns.jsx`: see below.
- `app/talk-data.jsx`: gp4's reactions are Lena P. and Priya N. (neither replied since the mark). `app/main.jsx` state key → `circ_state_v15`.

## Staged states
- `?state=returns-bar-reactions` — bar open: jvns.ca (words), FormerMember (one reaction), ACM (three), go.dev pipelines (both; Ada named, Lena/Priya glyphs only).
- `?state=returns-bar-reactions-only` (new, registered) — every card with fresh replies quietened; bar left closed so the head shows the count line and stack, no second line.

## Yours to decide — chosen
- Home preview: metadata line keeps the circle; names (repliers) follow the dot only when there are any. A reaction-only row reads "Backend Pod" alone, so every row keeps one height; glyphs stay at the right before the chevron. Chosen because the circle line is always present and keeps rows equal without centring tricks.
- Phone head: kept one name + "and others". No conflict — it now draws from repliers only.

## Unresolved
- The attached image (returns-bar-option-e.png) did not arrive; built from the text.
- Phone width not checked on screen.

## Next
- Look at both states at 320px and in app posture.
