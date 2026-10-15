# Shop UI kit

Click-through built only from decided pieces in the hand-off (`guidelines/source/design-system.html`). **Screen layouts are not decided** (rules.md, "Not decided"), so the arrangement here is a neutral composition for previewing components together, not a recreation of a shipped screen.

- `index.html`: shell and routing. Start on All games.
- `Screens.jsx`: `TopBar`, `AllGames`, `GamePage`, `SignIn`.

Flows to try:
- Open a cover → game page. "Add to Claude" swaps to "Added" (label swap, no toast).
- On the game page, "Delete save" (red link) → dialog. It stays a centred window at every width. "Delete save" shows it is working, then the dialog closes.
- "Sign in" in the top bar → sign-in panel. Submit empty to see deferred validation and focus moving to the field.

Copy comes from `voice.md` samples (headline, Weekly Interrogation, Dungeon Quest, word puzzle). The tags "Weekly" and "Locked" are illustrative.
