# Validation: walk sweep, 2026-10-10

Checked the walk-sweep build against its brief (pasted 2026-10-10) and `handoff-2026-10-10-walk-sweep.md`, in a session that did not build it.

### Fixed

Session page, a replay of an earlier puzzle edition (reached from `library-word-streak-broken`, the #211 replay row, demo view free), desktop. "Play again" had no Pass mark, and its prompt started today's word instead of #211. `gsSessEd` didn't recognise replay sessions (they aren't in the edition's record), so it fell back to the current edition. It now matches the session's edition number before falling back. Confirmed: the Pass mark shows and the prompt reads "Start Daily Word #211". File: `app/gs-connect.jsx`.

### Needs the owner's eye

- The Pass page still shows the "What you get" Free / Pass table. `CLAUDE.md` says the Pass page lists nothing and has no free-versus-Pass table, but the brief froze the Pass page copy. Left unchanged.
- The "Your username" step after Google or Apple has no back or exit control. The brief says leaving means no account, so this may be deliberate.

### Could not check

- A true 390×664 phone. The preview fits the phone frame at 380×470, so every phone check ran at that smaller size. The cancel dialog is 524px tall, so its top is clipped at 470. It fits at 664, so it is not reported as a break.
- 320 width.

### Ran and clean

- Console: no errors on load.
- All 14 new states plus `session-casebook`, `username-taken` and the three Pass-ended game pages open from the register. At phone width none has horizontal overflow, an element off the right edge, a button under 24px or an unnamed button.
- Desktop visual pass on each new state. The four Pass-change failures each show their line, and the card stays as it was.
- Flows walked:
  - Pass page (Monthly) → sign up with Google → code → empty username refused → username → checkout keeps Monthly.
  - Back from checkout lands on Discover. "Cancel and return" goes back to the Pass page with Monthly still selected.
  - After signing out, Back lands on home. Not found, signed in → Go home → Discover.
  - On a phone, play dialog → How to connect → Back reopens the dialog on the same prompt.
- Declared rules: tokens, square corners and the dialog kind held on every screen viewed.
