---
date: '2026-09-22'
ticket: 'LM-769'
topic: 'the-ask-integrated'
status: 'in-review'
type: 'build'
---

# Handoff: LM-769 — the banner landed in the app

## Current Focus

The ask is now the **banner**, in the shipped build. One thing is put to the
user and unanswered: he said the card should use the words **"for this device"**;
the ratified prompt says **"on this device"**, verbatim. The build carries
"on this device" (the ratified wording) in the card's TITLE. If he meant "for",
it is a one-word edit in `app/push.jsx`.

Not ratified, not done: the `CHANGELOG.md` entry (the feature has none yet —
ask before writing it), archiving the two rigs, Notifications first on Account,
the preview's three frames, desktop firing frequency, the badge count.

## Task(s)

Done this session — the round-two rig's option 3 ratified and integrated:

- **The banner is the ask.** `PgaBanner` landed into `app/push.jsx` as
  `CircPushAsk`: the JS bleed measurement, the slide-down arrival, the deferred
  unmount, the sunken ground, full content row. The rig's CSS moved into
  `circlists.html` under `.circ-pushask*` / `.circ-pushask-slot*`.
- **The post-dismiss pop is fixed** (see Learnings).
- **Copy**: the banner and the Account card both read *"Get notified when new
  links land in your circles."* The offer is *"Set up notifications"*.
- **✕ hides, and it comes back**: 3 days after the first ✕, 7 after the second,
  then every 30 — and never once the device dialog has been raised.
- **The Account card**: "on this device" in the title, a one-line refused
  statement, and the iOS browser-tab statement verbatim.
- **The register** entry for the iOS case is relabelled; a new entry stages the
  ✕'s return.

## Critical References

- `docs/specs/lm-769-push/handoff-2026-09-22_the-ask-round-two.md` — the rig,
  the five forms, and what each rejection was actually about. Its Learnings on
  the banner (bleed on the slot, measure against the column, leave with motion)
  are now facts about the shipped build.
- `docs/specs/lm-769-push/handoff-2026-09-22_push-notifications.md` — the reset.
  The four objections it records are still the mistakes available to make.
- `docs/specs/lm-769-push/handoff.md` — the original build write-up.
- `CLAUDE.md` — ratification, and the ~150-word chat reply.

## Recent changes

- **`app/push.jsx`** — `CircPushAsk` rebuilt as the banner (slot + strip, the
  `useLayoutEffect` measurement against the column's parent, `leaving` flag
  deferring `onDismiss` by 400ms). `CircPushSetting`: new description, title
  reads "Notifications on this device" **only where the switch is present**, new
  one-line refused statement, verbatim Home Screen statement, `text-wrap:
  balance` on the body.
- **`circlists.html`** — `.circ-pushask*` replaced: slot, four keyframes,
  strip, ×. The 16/24px horizontal padding steps at 760px.
- **`app/main.jsx`** — `push` gains `snoozes` / `snoozeAt`; `PUSH_SNOOZE_DAYS =
  [3, 7, 30]`; `pushDismissAsk` counts a dismissal instead of ending the ask;
  `pushSnoozeOver()` joins `pushAskVisible`. `ask: 'gone'` now means one thing
  only — the device dialog has been raised.
- **`app/config.jsx`** — a **Notifications** section, after Liveliness: Delivery
  (`channel`), Device permission (`perm`), In Circlists (`on`, shown only when
  allowed), and the ask's two rows — Showing / Hidden plus a Dismissals stepper
  — shown only while the ask is reachable (unasked, deliverable). One writer
  (`stageAsk`) owns the count and the phase together so they cannot drift, and
  the wait is read from `window.pushWaitDays`, so the aid can never disagree
  with the rule the app runs. Guarded on `push && window.CircPushSetting`:
  dropping `app/push.jsx` drops the section. `push` / `onPushStage` are new
  props, passed from main.jsx like `live` / `liveActions`.
- **`app/push.jsx`** also publishes the schedule: `PUSH_SNOOZE_DAYS` and
  `pushWaitDays(n)`. The feature owns its own rule; main.jsx and the aid read it
  off `window` with a fallback, since the file is droppable.
- **`app/states.jsx`** — `stagePushAsk(patch)`; every stager writes the two new
  fields so no snooze leaks between states; `push-ask-back` added;
  `push-setting-safari-tab` relabelled **"Account — an iOS browser tab"** (its
  address is unchanged, per the prompt).

### Addresses

`circlists.html?state=<id>`, or the launcher → States.

| id | what it shows |
| --- | --- |
| `push-ask` | the banner, first showing |
| `push-ask-back` | the banner back after one dismiss (4 days on a 3-day wait) |
| `push-setting-on` / `push-setting-off` | the card with its switch |
| `push-setting-refused` | the one-line refused statement |
| `push-setting-safari-tab` | the iOS browser-tab statement |
| `push-no-channel` | a browser that cannot deliver — no card, no ask |
| `push-device-preview` | the device preview (untouched) |

## What was chosen, and why

**"On this device" sits in the card's TITLE** — "Notifications on this device".
The switch's scope is what the title names, so it is read once on the way in,
before the control is reached. Beside the toggle it would be a second text run
competing with the fixed description for the same row as a 44px control, and at
a phone width that row wraps badly. It appears **only where the switch does**:
with no control on the page there is no scope to qualify, so the two statement
states wear the plain title.

**The refused statement**: *"Allow notifications for Circlists in your device
settings."* Act-led, one line at every width the app has, and it names the one
place that can change the fact. Ratified 2026-09-22 after three rounds: the
outcome half of the prompt's original line (*"and they arrive here"*) is **cut
by the user's own word** — the card is the notifications card, so where they
arrive needs no saying, and the "there… here" pair pointed at two places the
sentence never named.

**The no-overhang rule**, and where it cannot hold. Every touched block is
`text-wrap: balance`, so a block that must wrap wraps into comparable lines
rather than shedding a word. Measured:
- The banner's line is **one line at ≥ 640px of content row** (desktop, and the
  wide app canvas). Below that it is two balanced lines; at the 402px phone
  frame it is two lines of roughly 38 and 30 characters. It cannot be one line
  on a phone — 70 characters plus a 44px × will not fit 326px at 13.5px — and
  per the prompt that is reported rather than reworded.
- The refused statement is **one line at every width**, phone included.
- The Home Screen statement is 92 characters: **two lines on desktop, three on
  a phone**, balanced. One line is not available at any width the app has.

**Showing the ✕'s return without waiting days**: a register entry,
`push-ask-back`, that stages `snoozes: 1` with `snoozeAt` back-dated four days.
The schedule reads that state and no other, so the staged state **is** the real
one — no demo mode, no fast-forward control, nothing extra in the product. A
second and third dismiss can be staged the same way from the console if ever
needed; two entries for one mechanism did not earn their place.

## Learnings

**`text-wrap: balance` needs a definite width to behave.** The card's text
column was a shrink-to-fit flex item (default `flex: 0 1 auto`), and Chrome
balances such an item against its own intrinsic width — it binary-searches a
narrower width and settled on three short even lines in a card with room for
one. `flex: 1` on the column fixes it: with the available width definite,
balance only evens a wrap that actually happens. Any block given `balance` in
this app must sit in a definite-width box.

**A collapsing slot must animate its MARGIN with its height.** This was the
"pops after closure" bug. The slot carries a negative top margin that cancels
the feed's own top padding so the banner sits flush under the tabs. Collapsing
only the height leaves that margin in place, so the feed rests 16px (28px on
desktop) high until the unmount removes it — and then drops, a frame after the
motion has finished. Both keyframes now animate `height` **and** `margin-top`
as a pair, so the feed makes one move and lands exactly where the unmount will
leave it. `animation-fill-mode: both` is what holds it there for the gap
between the animation ending and React unmounting.

**`ask: 'gone'` now means one thing.** It was doing two jobs — "dismissed" and
"answered" — and the 3/7/30 schedule made them different facts. Dismissal is a
count and a timestamp; `gone` is the dialog having been raised. Anything reading
`push.ask` should read it as *answered*, never as *dismissed*.

**The visibility check is not a timer.** `pushSnoozeOver()` is evaluated per
render, so a banner whose wait expires while the app sits open reappears on the
next render rather than on the stroke of the third day. Correct for a prototype;
worth knowing before anyone tests the schedule live.

## Artifacts

- `app/push.jsx`, `app/main.jsx`, `app/states.jsx`, `circlists.html`
- `docs/specs/lm-769-push/playground-ask-v2/` — the rig that produced the
  banner. Still listed in `playgrounds.json`; its option 3 is now the product,
  so it is evidence, not a menu.
- `docs/specs/lm-769-push/playground/` — the first rig; the record of what was
  rejected.

## Action Items & Next Steps

1. ~~"on this device" vs "for this device"~~ — settled: **on**.
2. ~~The `CHANGELOG.md` entry~~ — written 2026-09-22 ("Circlists can notify you
   when links land"), four shape-level bullets. Written once; do not amend it as
   the feature iterates.
3. Archiving both rigs — queued, needs his word.
4. The rest of the unratified set, one at a time: Notifications first on
   Account, the preview's three frames, desktop firing frequency, the badge
   count.

## Other Notes

**The third channel** (added after the first pass): `channel: 'unsupported'` —
a browser that cannot deliver at all, such as one opened inside another app.
Notifications are not mentioned anywhere: no ask, and the Account card
withdraws completely rather than making a statement about a capability the
member cannot reach. `pushCardShown(push)` in `app/push.jsx` is the single
predicate; `PushRow` in `app/spaces.jsx` reads it so the card's spacer goes
with the card. Staged from Config → Delivery → In-app, or `?state=push-no-channel`.
The thing to check there is what is ABSENT from the page.

- **Known and left alone:** the New pill's negative margin pulls it 12px closer
  to whatever sits above it on desktop. Pre-existing; the pill's own question.
- `uploads/` — sweep unreferenced drops at session end per `CLAUDE.md`. Never
  touch `uploads/card-previews/` or `uploads/card-favicons/`.
