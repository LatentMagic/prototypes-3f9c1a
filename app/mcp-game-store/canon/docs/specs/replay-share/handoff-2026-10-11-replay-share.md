# Replay share — handoff, 2026-10-11

Status: built, not ratified. Two asked-for changes, plus one fix the owner will review (3).

## 1. A replay can be shared

Places that withheld Share from a replay, all corrected:
- `app/gs-session.jsx` `GsSessionRecord`: the button row read `text && !s.again`. A finished replay now gets Replay + Share, same place as a first play.
- `app/gs-casebook.jsx` `CbCase`: `share` was `!c.live && !c.replayed`. A Casebook replay page now has Share.
- `app/gs-session.jsx` header comment ("never shared") and `gs-casebook.jsx` comment ("a replay record, Replay only") rewritten.

Checked, nothing to change: History rows (no Share), library game pages (their Share is the current edition's first play), sample chats (`gs-chats.jsx`, no share). The 36,000 Summers Ago link-only rule keeps `!s.again`; that game has no replays.

Copy: there was no line on the session page saying a replay earns nothing. The one that exists is History's "A replay doesn't change your streak or your record." It never mentioned sharing, so it stays as is. (`docs/specs/history/` had already removed "…or the result you share".) No streak, achievement or record logic was touched.

**Replay mark:** `gsReplayMark` (gs-session.jsx) puts `🔁 Replay` at the end of the share text's first line, two spaces after the result, e.g. `Daily Word #212  2/6  🔁 Replay`. Why: the first line is the one people read in a chat, and the share texts already use one emoji per figure (💡 🎲 🔎 🚪). The word matches the Replay button and History's Replay filter. No share text names an edition with the game's word (they use `#212` or the room/case title), so no edition word was needed. The link line is untouched and still goes to the product page. A first play's text is unchanged.

## 2. A session page lists no other sessions

- Removed the Replays section from `GsSessionRecord` and from `CbCase`.
- Deleted `PhReplays`, `phReplays`, `phEdReplays` from `app/gs-history.jsx` (no other users).
- A replay's page had no link back to the first play, so there was nothing to remove.
- History's replay filter and rows are untouched.

## 3. Two "Replay"s on a replay page

A replay page showed a "Replay" chip and a "Replay" button. The chip is the standard replay mark (History rows, filter), so the button changes.

**Decision (ratified by the owner, 2026-10-11):** the play button reads **Play** until an edition is finished once, and **Play again** after, on first plays and replays alike. Never played and in progress already read Play.
- `gs-session.jsx` `GsSessionRecord` and `gs-casebook.jsx` `CbCase`: "Replay" → "Play again".
- The Replay chip stays. (A first attempt removed it and put "Replayed" on the date; reverted.)
- Product and library pages have no Replay button; nothing to change there.

## Aids
- State `session-replay` (Daily Word #212, 21:15 replay). QA entry `replay-share`.

## Also fixed
- Back links ("← History", "← {game}") did nothing in the preview: `history.back()` was swallowed with no popstate. `gs.back` (`app/main.jsx`) now steps the stack itself if nothing moved after 120ms. Owner confirmed it works, 2026-10-11. Added to `GOTCHA.md` as entry 14 (2026-10-11); shared file, carry back to the kit.

## Left alone
- `rp-fig` CSS, if any, is now unused; not deleted.
- CHANGELOG: no entry proposed (iterative).
