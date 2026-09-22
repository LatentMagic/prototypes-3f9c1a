# LM-769 · Push notifications

Was `docs/specs/pwa-notifications/` — folded in here on 2026-09-22 when the
ticket arrived, per `CLAUDE.md` ("rename when one exists"). One subject, one
folder, one launcher ticket.

## Scope

Push notifications for the installed app: what arrives on the device, the in-app
ask that turns them on, the Account setting, and the staged device preview. One
notification per circle, one live at a time, title only.

## What's here

- `handoff.md` — the LM-769 build; read first.
- `handoff-2026-09-22_pwa-notification-banner.md` — the earlier banner session.
- `handoff-2026-09-22_push-notifications.md` — the reset on the ask's form.
- `handoff-2026-09-22_the-ask-round-two.md` — the current state; read last.
- `prompt-android-notification-badge.md` — the prompt that produced
  `brand/assets/notification-badge.svg` (delivered 2026-09-22).
- `playground/pg-the-ask.html` — the ask, four forms. The record of what has
  been rejected, not a menu.
- `playground-ask-v2/pg-the-ask-v2.html` — the ask, round two: five forms, of
  which the banner is the live direction.
- `playground/wb-notification-banner.html` — the reference board. Faithful renders
  of the banner on iOS 17, Android 14, macOS Notification Centre and Chrome's own
  notification, at real pixel sizes; the icon study including the Android badge
  derivation; the three body-line options; and the rules the banner has to keep.

## Why a reference board rather than a rig

The operating system draws the banner. There is no app surface to mount, nothing
to click through, and nothing the app's components can supply — so the whiteboard
shape applies: static frames, on the grounds the banner actually appears over.
It is listed in `playgrounds.json` like any rig, which is what makes it findable
later.

## The real surface (checked 2026-09-22)

`showNotification(title, options)` takes `actions`, `badge`, `body`, `data`,
`dir`, `icon`, `image`, `lang`, `navigate`, `renotify`, `requireInteraction`,
`silent`, `tag`, `timestamp`, `vibrate`. Nothing about appearance.

Safari 16.4+ (iOS **and** macOS) renders only title, body, tag and data, and uses
the installed web app icon — the `icon` we pass is discarded; `image`, `badge`
and `actions` are absent. Chromium honours all four, max two actions.

So: **two strings, one tap target, one tag rule.** Assets are Chromium-only
enhancement.

## Settled

- **No body line.** Title only — "New links in Tea Club" and nothing under it.
- **The offer's words** — "Set up notifications" (it opens the device dialog).
- **The banner's ground** — sunken, not the accent tint.

## Open

- **The ask's form** — five options in `playground-ask-v2/`, unratified. The
  banner (3) is the live direction; its pace is the open question.
- **What the × means** — the user has called it a *temporary* dismiss, which
  contradicts the earlier rule that it never returns. Detail owed.
- Desktop firing frequency — deliberately out of scope.
- Whether the app icon carries a badge count — untouched, not assumed.
