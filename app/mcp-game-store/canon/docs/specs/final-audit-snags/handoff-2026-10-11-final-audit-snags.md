# Final audit snags: handoff, 2026-10-11

Brief: "MCP Game Store — snags from the final audit" (pasted in chat; the seven screenshots it names were not attached, so none were used). Standard read: `LatentMagic/monorepo` `specs/governance/standards/ui-design.md` (`main`). The prototype's today: Tuesday 6 October 2026. Ratified points in the brief were followed and not reopened.

## What was built, and where
1. **One Pass end date.** `gsEndedOn(gs)` (`app/gs-data.jsx`) is `sub.endedOn` (set when the Pass ends in the prototype, or by Config) else the 18 September sample. The Account card (`gs-billing.jsx`), the frozen-achievements line (`LbAch`, `gs-library.jsx`), `lbOld`, `gsSessDate` and History's `phVisible` (`gs-history.jsx`) read it. History keeps every play before the end date, this week's Casebook and Delve plays included. Casebook and Delve library lists and Every edition carry this week's play when the Pass ended today. 36,000 Summers Ago's last day is the last day before the end date (`hgOld`).
2. **A new account starts empty.** `gsFresh(gs)` (`user.fresh`). `accountMade` sets it and a signed-in returning player clears it. With it: no marks, `lbNow` null, empty History (its existing empty line), every Library row reads what is ready with no date, never-played cards on the Casebook and Delve (`LbFreshNow`) and 36,000 Summers Ago (`HgNone`) pages, no achievements earned (`lbNoAch`).
3. **What's new and dates** (`gs-home.jsx`, `gs-chats.jsx`): 1.9 dated 1 October 2026; 1.2 reads "Find a game by name, genre or how often it releases."; the Daily Word chat says 6 Oct 2026. "Kind" for a game's label corrected in `qa.jsx`, a state label, two code comments and the CLAUDE.md working picture. Identifiers (`kind:` keys, `GS_KINDS`, route `kind`) left alone. Old handoffs under `docs/` left as history.
4. **Username and sign-up.** The email form asks first name, last name, email, username, password (`gs-auth.jsx`); the names travel through Verify into the account. The delete dialog lists "your name", the data copy has `firstName` and `lastName` (`gs-account.jsx`). A new account's username is locked from sign-up; the date is 30 days after `user.since` (`gsUsernameNext`, `gs-username.jsx`): 5 November. The same name gets "That’s already your username. Enter a different one."
5. **Unfinished sessions** (`gs-history.jsx` `PH_UNF_EDS`, `gs-session.jsx`). A Daily Groups day (#83, 1 October) and a Delve week (14 September) that the seed leaves unplayed become Not finished when Config "Ended unfinished" is on. Session page: edition name, a "Not finished" chip, the date, "The day (or week) ended before you finished. What you played stays in your history.", the moves so far; no result, no figures, no play control. Same status in History rows, Every edition and the library game pages. The needs-Pass line is now "This {room, case, scene} comes with the Pass." with Get the Pass; the free first case's own line ("Every other case comes with the Pass.") is unchanged.
6. **Controls and routes.** Games panel: a Done button in its actions, as Filters. With notifications off here, the Games row is a statement, "Turn on notifications on this device to choose games.", with no count and no chevron. A signed-out visitor on Library, History, Account or a session page (pasted, Back, or the demo bar) gets Sign in, then the page asked for (`GS_GUARDED`, `gsSignInFor`, `signedIn` accepts a route). Checkout and update-card still go to Home as before. An unknown session id or edition shows not-found.
7. **Search.** `gsNorm` drops apostrophes and a comma between digits; used by Discover, the Library, the Filters game picker and the notifications panel. History's word match joins `36,000` the same way. The two quoted-back lines ("No game matches “…”") wrap anywhere.
8. **Housekeeping.** `pass-page-trial-available` and `-used` are now `pass-page-never-subscribed` and `pass-page-subscribed-before`. `authorize-landing` moved to `docs/archive/authorize-landing/`, listed as archive in `playgrounds.json`. The Slept fact now matches how the day ended.

## Already present, left alone
- Cancelling with a failed payment already set the end date on the Account card (`sub.endedOn`); only the rest of the app ignored it.
- The email card's "That’s already your email." existed; the username answer copies it.

## Staged states (`?state=`)
`pass-ended-today`, `library-hunter-pass-ended-today`, `history-pass-ended-today`, `new-account-library`, `new-account-history`, `new-account-casebook-pass`, `session-groups-unfinished`, `session-delve-unfinished`, `history-unfinished`, `sign-in-return-library`, `session-unknown`. Config rows: Account (Has played / New, nothing played), Ended unfinished (None / A day and a week), Pass ended (18 September / Today). QA entry `final-audit-snags` in `app/qa.jsx`.

## Choices I made (open to the owner)
- **Unfinished label:** "Not finished", as a chip under the edition name, the same place a missed edition says "Not played". The sentence names the day or week ending, so it never reads as giving up.
- **Never-played Library:** each row says what is ready ("Today’s word is ready", "Your free case is ready", "This week’s scene is ready"), with no date, since nothing was played.
- **What's new replacement:** "Find a game by name, genre or how often it releases." These are the Library's real controls: search, Genre, Schedule.
- **Same-username answer:** the email card's wording, with "username".
- **Games panel close:** Done, in the panel's action row, as Filters.
- **Long term:** wrapped anywhere where it is quoted back, so the term stays whole and readable.
- **New-account default names:** the seed player is Mona Lasker (invented); a Google or Apple account keeps the seed names, since the provider would supply them.

## Not resolved
- No in-browser check by me; the verifier runs next. The 390px Library widening is fixed on the quoted line. If another element also widens it, that element needs the same fix.
- A new account still sees a product page's own copy unchanged; only the library and History surfaces were in scope.

## Next
Walk the QA entry at 390 and 1280px; then ask whether the change earns a CHANGELOG entry (I think not: these are fixes).
