# Handoff: decisions of 11 October

Built 2026-10-11 against the delta message "MCP Game Store — decisions of 11 October". QA entry: `iffy-decisions` in `app/qa.jsx`.

## What was built, and where

1. **Play box** (`app/gs-game.jsx`, `GsPlayBox`). Casebook and Delve show `box.button` ("Play the first case" / "Play the first scene") to everyone without the Pass, and "Play" to a Pass holder. `gs.play(g.name)` is unchanged, so the prompt is the same plain prompt for all. Signed in, the small line drops its first sentence; the sentence after it stays.
2. **Edition on the session page** (`app/gs-session.jsx`, `app/gs-history.jsx`). New `edLabel(e)`: the game's name, then `#n` where the edition has no name, or ` · title` where it has one. The played page's line above the result now reads `edLabel` (falls back to the game name for games without editions). The empty page's heading is `edLabel` too; its separate game-name line went, since the heading now carries the name.
3. **Sign-up** (`app/gs-username.jsx`, `app/gs-auth.jsx`, `app/main.jsx`). One hint line under the username field on the sign-up form and on Your username (`GS_USERNAME_HINT`). Google or Apple sign-up goes from the provider's return straight to Your username: `GsReturning` no longer routes `mode: 'signup'` to `verify`, and the `new-provider` branch of `GsVerify` is gone. Sign-in on a new device (Config "Device" = New) still gets "Verify this device".
4. **Password reset** (`app/gs-auth.jsx`, `GsRecover`). The code screen has "Resend code" with the same spinner and "A fresh code is on its way." line as `GsVerify`. New state `reset-password-code` (`route.step`, `route.email` stage it).
5. **One Share pop-up** (`GsSharePopup` in `app/gs-session.jsx`). The session page and `LbShare` (`app/gs-library.jsx`) both open it. Titles "Share this result" / "Share this game", the share text card and Copy. The `note` lines are removed from `LbShare`'s callers and from the four `PZ` configs.
6. **Page names**: see below.
7. **Comments**: see below.
8. **Trial**: see below.

States and QA: `qa.jsx` "Usernames" note now says Google or Apple has no code step; the `states.jsx` Sign in note says a Google or Apple sign-up never meets a code.

## Yours-to-decide choices

- **Item 2, the form.** I didn't add a chip. The line above the result (`mcp-t-card`) already named the game, so it now names the edition in the History row's words ("Daily Word #212", "Escape · The Locked Study"). It adds no element, reads the same as the row the player tapped, and keeps the result as the H1. A chip would sit beside the result tags and read as a status.
- **Item 3, the username line.** "Use 3 to 16 letters, numbers or underscores, starting with a letter. You can change it once every 30 days." It is placed as the TextField's own hint under the field, so a failed save replaces it with the specific error and the page doesn't grow.
- **Item 5, the posture.** It is a **panel**. A Share pop-up is neither one question or short edit (dialog) nor a list of commands (menu), so by ui-design.md it is a panel: a bottom sheet under 640px. **This differs from the session page before:** it passed `posture` without `kind="panel"`, so `DS.Popup` ignored the posture and showed a centred dialog at every width. The library version was already a panel.
- **Item 6, which sentences link.** None. No player-visible sentence sends the player to history, library or discover; each one only says something is kept there. See the list.

## Found already present

- Code screen titles: email sign-up is "Verify your email", a returning player on a new device gets "Verify this device" (`GsVerify`). The only wrong route was Google or Apple sign-up, fixed in item 3.
- Trial: every stated length is 14 days (`GS_TRIAL_DAYS = 14`, the Pass page, checkout, home "Try it free for 14 days", Config). Nothing changed.
- The Play box button label existed in `box.button`, unused.

## Item 6: sentences

Changed to lowercase (mentions, no link):
- `gs-account.jsx` delete confirm: "…results, history, streaks and achievements."
- `gs-billing.jsx` Pass ends: "your results, your history and the achievements…"
- `gs-billing.jsx` free account line: "your results and history are kept."
- `gs-session.jsx` empty page, closed edition: "This one stays in your history."

Left alone:
- Already lowercase: "It stays in your history." (product page steps), "Your results and history stay on [Platform]." (connect), "your play history" (delete account).
- Labels: top-bar items, page H1s (History, Library, Discover), the back link "History", "What's new" headings ("Everything you missed, in History", "History view"), Config group titles.
- `gs-home.jsx` What's new 1.6: "History lists every day…" The word opens the sentence, so it keeps its capital.
- Story text ("the locked library" in chats and Casebook seed).
- Aids: `states.jsx` labels, `qa.jsx` notes, code comments, routes and keys. Changelog and old handoffs are history and were not touched.

## Item 7: comments corrected

- `gs-history.jsx` above `edName`: now states the rule and adds `edLabel`.
- `gs-history.jsx` above the History row (`rpRow`): says the title is `edLabel`, or `edName` in a one-game list.
- `gs-auth.jsx` file head flow, `GsVerify` ctx note, `GsReturning`; `gs-username.jsx` field and `GsUsername` notes; `main.jsx` above `accountMade`: Google or Apple sign-up has no code.

## Needs the owner's eye

- **Every edition rows in History follow the rule. Ratified by the owner, 2026-10-11: keep.** `edName` used to give "#12 · The Locked Study"; it now gives the name only for a named edition. The Every edition list reads "Escape · The Locked Study" (in a one-game list, "The Locked Study"), as the Played rows already did. The owner's reason: a name is what tells the player which edition it is, and a number is only there when there is no name; reverting would write the same edition two ways on one page. Search by number still works (`phHay` indexes `n`).
- The empty page's heading changed shape (the separate game-name line went). This extends the owner's ruling, as the message asked.
- `LbCopyBtn` in `gs-library.jsx` is now unused; the `.lb-share-text` styles in `index.html` too. Left in place; remove when convenient.

## Next

Walk the `iffy-decisions` QA steps at 320px and desktop, especially Share as a sheet on a phone. Then delete that QA entry once signed off.
