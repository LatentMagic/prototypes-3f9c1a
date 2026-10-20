# Handoff: push notifications, 2026-10-11

Push only. Notifications belong to the platform. Reference: Circlists as deployed (`app/push.jsx` and the push section of `app/main.jsx` in the Circlists project).

## Already present

Nothing. No notification code, card, banner, state or Config row existed.

## What was built, and where

- `app/gs-push.jsx` (new, droppable; loaded after `gs-account.jsx`). Holds the banner (`GsPushAsk`), the card (`GsNotifCard`), the switch (`GsSwitch`), the simulated browser permission dialog and the turn-on wait (`GsPushHost`), the defaults and the snooze schedule. If you delete the file and its script tag, every trace of notifications goes.
- `app/main.jsx`: holds `push` (per device, persisted under `localStorage` key `gs_push_v1`), `setPush` on `gs` and in `buildStates`, reset on Reset, mounts `GsPushHost`.
- `app/gs-account.jsx`: the card after `GsPassCard`.
- `app/gs-discover.jsx` (Discover and Library) and `app/gs-history.jsx`: the banner, a strip above `<main>`, under the top bar.
- `index.html`: the script tag and the `gs-pushask`, `gs-nt`, `gs-sw` and `gs-osperm` styles.
- `app/gs-config.jsx`: a Notifications group with Permission on this device (Undecided, Allowed, Blocked, iPhone tab, Unsupported), Banner (Showing, Dismissed), Turning on (Works, Fails), a hint with the wait remaining, and "Move on N days".
- `app/states.jsx`: the Notifications group (below). `app/qa.jsx`: the `notifications` entry, at the top.

## Staged states

`?state=` plus: `notifications-undecided`, `notifications-on`, `notifications-off`, `notifications-turn-on-fails`, `notifications-blocked`, `notifications-ios-tab`, `notifications-unsupported`, `push-banner-discover`, `push-banner-library`, `push-banner-history`, `push-permission-dialog`, `push-banner-dismissed`, `push-banner-back`.

## Behaviour as built

- Card copy and layout are the ratified text, verbatim. Daily Word, Casebook and Delve are mock "played" games.
- The all switch is on only when permission is allowed and the player turned it on. While it is off, the other switches are disabled.
- All switch from undecided: raises the browser dialog, even after the banner was dismissed. From allowed: turns on with no dialog. Turning on shows a spinner beside the switch for about a second, then on, or one red line, "Notifications didn’t turn on. Try again." Off stops notices on this device only.
- Browser dialog: Allow → allowed, then the turn-on wait. Block → blocked card. Close or Escape → still undecided. The banner never returns in any of these cases.
- Blocked: "Allow notifications for [Platform] in your device settings." iPhone tab: "To get notifications, add [Platform] to your Home Screen first. Tap Share, then Add to Home Screen." No switches in either. Unsupported: no card.
- Banner: signed in, permission undecided, deliverable device, dialog never raised, not waiting out a ×. × hides it on all three pages; back after 3 days, then 7, then every 30.

## Yours to decide: what I chose (all placeholders until ratified)

- **Defaults.** All switch: off until the browser allows, then on, because the player has just asked for it. New games: on, because hearing about new games is the main reason to opt in. Each game: on from its first play, because the brief says playing is following. Delve is off in the mock as a player's own choice, as the ratified layout shows.
- **Banner wording:** "Hear when a new game or edition is out, or your streak is about to end. Choose which games in Account." Link: "Turn on notifications". "Account" is plain text, so the banner has one action, as Circlists does.
- **Banner form and placement:** a full-width quiet strip (card fill, line under) directly under the top bar, above the page heading, the same on all three pages. The × is a 44px icon button at the right edge. After × or the dialog, focus moves to the page heading.
- **Device-state wording:** as quoted above.
- **Browser dialog:** drawn as a browser prompt (system font, light, top left), not in the design system, because it is the browser speaking.

## Ratified in this session (user, 2026-10-11)

- Card hierarchy (user, 2026-10-11, replacing option A the same day): "New games" is bold, like every heading. Game names stay regular.
- "Notifications on this device" is 17px (the design system's disclosure-title size), the largest line under the card title (user, 2026-10-11).
- Banner text grows with the width: 14px on a phone, up to 16px from about 1100px, where the sentence fits on one line.

## Unresolved

1. **Card position.** The ratified statement is "directly after the Pass card"; the acceptance criteria say "sits second". Username is first on Account, so after the Pass card is third. Built as third (the statement wins). Needs the owner's word.
2. **iPhone tab in Config.** The brief lists four permission values. I added the iPhone tab as a fifth option on the same row, because item 3 calls for it.
3. **Waits on the switches.** Only the all switch's turn-on shows a wait. New games and the game switches change at once. The CLAUDE.md wait rule may want a wait on each. Needs a ruling.
4. **Disabled switches** go against the design system's "prefer a plain statement to a disabled control". The brief ratifies them, so they stay. Flagging the conflict.
5. **The switch** is new. The design system has none, so it is built here, square, in the system's tokens. It is a candidate for the system.

## What I'd do next

Get rulings on 1 and 3, then the defaults. Then propose the switch to the design system and delete the QA entry once this is signed off.
