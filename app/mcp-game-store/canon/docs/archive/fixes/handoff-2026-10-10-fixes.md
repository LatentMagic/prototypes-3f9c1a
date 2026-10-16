# Handoff: fixes, 10 October 2026

The brief's eight items, built in `app/`. Nothing here is ratified beyond what the brief ratified; every "chose" below is a proposal awaiting the owner.

## Where it lives

| Item | Files |
|---|---|
| 1 Back links, History memory, dead rows | `main.jsx` (`route.prev`, `gs.keep`, `gs.back`), `gs-library.jsx` (`LbBackTo`), `gs-session.jsx`, `gs-casebook.jsx`, `gs-history.jsx`, `gs-delve-library.jsx`, `gs-puzzles-library.jsx` |
| 2 Search, Replay | `gs-history.jsx` (`phMatch`), `gs-connect.jsx` (`gsSessEd`) |
| 3 Auth routes, legal links | `gs-auth.jsx`, `main.jsx` (`signedIn(how, next)`, footer on not-found) |
| 4 Pass card, switch and delete dialogs | `gs-billing.jsx`, `gs-account.jsx`, `states.jsx` |
| 5 Focus and announcements | `gs-site.jsx` (focus trap, `gsAnnounce`), `main.jsx` (live region `#gs-announce`), `gs-billing.jsx`, `gs-library.jsx` (`lbCopy`), `gs-discover.jsx` |
| 6 Library row, Share | `gs-discover.jsx`, `gs-session.jsx`, `gs-delve-library.jsx` |
| 7 Wording | `gs-puzzles-library.jsx`, `gs-history.jsx`, `gs-library.jsx`, `gs-home.jsx`, `gs-site.jsx`, `gs-hunter-library.jsx`, `gs-discover.jsx`, `gs-billing.jsx`, `gs-parts.jsx` |
| 8 Card rows, aids, rigs | `gs-site.jsx` (`GsCardRow`), `gs-home.jsx`, `gs-discover.jsx`, `index.html` (`.gs-feats`, `.gs-rowhead`, `.gs-rownav`), `qa.jsx`, `states.jsx`, `playgrounds.json`, `docs/archive/` |

## Staged states

- New: `?state=pass-card-failed-pending-switch`: payment failed, with a switch to yearly pending. Staged as `setView('pass')` then `setSub({ status: 'failed', pending: 'yearly' })`. Config cannot reach it because its Subscription row clears `pending`.
- New QA entry `fixes` in `app/qa.jsx` lists the states to walk. Delete it once signed off.
- Relabelled: `not-connected` now reads "Play opens the play pop-up, with How to connect".

## Choices made under "Yours to decide"

1. **Back link with no earlier page.** It goes to the game's library game page, as it did before. That page is the one place every session belongs to, and a pasted link cannot know where the sender was. A session opened from anywhere other than History or the library game page also goes there. The previous page travels as `route.prev`; staged states set none.
2. **History search.** Every word typed must start a word of the row, as written on screen, including the game's name. A number must match a whole number, so "84" finds #84 and not #184: a number typed is a specific edition, and a partial match padded the list. Apostrophes are ignored on both sides, so `widow's` finds "The Widow’s Lantern". A query with a month in it keeps the old substring match, so which day a date matches is unchanged. The empty-result hint now reads "Try a name, a number or a date."
3. **Back from "Verify your email".** Email and username come back. The password is cleared. A password shouldn't be held in navigation state, and typing it again confirms it. The arrow and the browser's Back both work.
4. **Focus after an action removes its control.** Focus moves to the control that undoes the action. Cancel goes to Resume subscription. Resume goes to Cancel subscription. A switch goes to Keep monthly. Undo goes to Switch to yearly. A trial switch goes to Switch to monthly. Cancelling a failed Pass goes to Get the Pass again. Copy prompt keeps focus on the Copy button. Clear and Show every game (Discover and Library) move it to the search field.
5. **Daily Mystery result word.** "Solved". The record, the share text and Daily Word already used it. The cause was sample data (`PZ.mystery` and the hand-seeded replays), which is where it was fixed. The achievement names "Case closed" and "Closed with no hints…" are names, not results, and were left.
6. **Streak unit.** It becomes singular when the count is 1: "1 week in a row", "1 day in a row".
7. **What's new.** Both entries were rewritten, not dropped:
   - 1.6 is now "Everything you missed, in History": "History lists every day and week a game has released, played or missed, and opens each one."
   - 1.4 is now "Manage your username, email, password, card and Pass from one place."
8. **Daily Mystery empty line.** It now reads "Your cases appear here once you have played one." Word, Groups and Escape follow their card headings the same way ("Your words…", "Your groups…", "Your rooms…").
9. **"Edition" replacements.**
   - A heading for one game uses the game's plural: History reads "All groups", "All cases", "All rooms", "All scenes". This matches the "All…" link that opens it.
   - The List switch reads "All" across games, and "All cases" (and so on) for one game.
   - "Playing earlier editions comes with the Pass." becomes "Playing earlier words / groups / cases / rooms comes with the Pass."
   - Lines spanning games:
     - "every game and every edition" becomes "every game in full" (home, the Pass card, the Discover Pass band).
     - The Pass table row "The first edition of select games" becomes "The start of select games".
     - "No editions match that." and "Loading editions" become "Nothing matches that." and "Loading".
   - "Play earlier editions", the Replay chip and Replays are unchanged.
10. **Card rows.** They do both. When the cards fit, they share the row. When they don't, each card is 220px and Previous and Next buttons sit beside the row's heading. The buttons show only when the row overflows. One at the end hides, and focus passes to the other. At 1280, Discover's four cards now fit, and Home's seven scroll with the buttons. Phone widths keep the old card width.
11. **Delete dialog.**
    - The body reads "This deletes your username, email, results, History, streaks and achievements. It can’t be undone."
    - The Pass line depends on the kind of account:
      - Free account: no line.
      - Trial: "Your Pass is cancelled and you’re never charged."
      - Active or ending: "Your Pass is cancelled. No more payments are taken, and nothing is refunded."
      - Payment failed: "Your Pass ends straight away."

## Other decisions in the build

- **Lapsed 36,000 Summers Ago Library row.** It reads "Only with the Pass", as the free row does. It keeps its last-played sort rank.
- **Switch dialog.** It adds "Nothing is paid now." In the trial, the after side reads "From today", with "Nothing is paid now. Your first payment is still on {date}, at the {plan} price."
- **36,000 Summers Ago Share.** The pop-up is titled "Share this game" and holds the product page link only.
- **Sign-in from the Pass page.** It returns to the Pass page through every sign-in route: email, Google, Apple, and verify this device. The "Create an account" link on sign-in was left as it was.
- **Legal links.** On the code screens, the username step and password reset, they are the same line sign-in carries. Every auth frame now carries it. Not-found carries the site footer.
- **Focus trap.** It is site-wide in `gs-site.jsx` and applies to whichever system `Popup` is open on top. The prototype's own aids (`kit-*`) are left out.

## Already present

- Back from the library game page to the session page and the case page already worked, and still does.
- Daily Groups #87 and #84 Replay already named their own edition.
- Escape, or "Keep subscription", already returned focus to "Cancel subscription".
- A confirmed switch already left focus on "Keep monthly", because React reuses the same button.
- 36,000 Summers Ago rows on its library game page already opened their session pages.

## Rigs

- Archived to `docs/archive/editions/` and `docs/archive/plays-and-editions/` (moved whole). `playgrounds.json` lists both as `"state": "archive"`.
- `docs/specs/connect-and-prompts/playground/` stays active. Its `app/gs-editions.jsx` tag is removed, and `pg-connect.jsx` carries an `edGo` stand-in so its Editions links still go somewhere (the product page). Nothing it shows changed.

## Not done, and next

- `app/README.md` "Known limits" still says the dialogs do not contain focus. That refers to the kit's own Config dialogs, which this work did not touch.
- The Replay check for earlier scenes covered the lookup for every Delve scene (`dvSid`) and its replays. It was not walked scene by scene in the live view.
- Next: walk the `fixes` QA entry at 320, phone and desktop. Then take the "Yours to decide" choices to the owner for ratification. A proposed `GOTCHA.md` entry: `lbCopy`'s hidden textarea dropped focus to `body`, so any helper that focuses a temporary element must hand focus back.
