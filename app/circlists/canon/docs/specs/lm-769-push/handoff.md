---
date: '2026-09-22'
ticket: 'lm-769-push'
topic: 'push-notifications'
status: 'built, awaiting review'
type: 'feature'
---

# Handoff: LM-769 — push notifications for the installed app

## What landed, and where

Two droppable modules and four edits. Deleting either module removes its
surfaces with no other edit; the register entries then simply stop rendering.

- **`app/push.jsx`** — `CircPushAsk` (the in-app line), `CircPushSetting` (the
  Account card, four states), `CircPermissionAsk` (the simulated device
  dialog), `CircSwitch` (the on/off control; the app had no switch primitive —
  the only one in the tree lived in the discourse candidate, and a droppable
  module may not be depended on by `primitives.jsx`).
- **`app/push-preview.jsx`** — `CircDevicePreview`, the staged device view.
- **`app/main.jsx`** — the `push` object (`perm` / `on` / `ask` / `channel`),
  persisted with the app-state blob; `permAsk` and `devicePreview` as ephemeral
  flags; `pushWantOn` / `pushAnswer` / `pushSetOn` / `pushDismissAsk`; the ask
  rendered in the feed column; the dialog above every app overlay; the preview
  as a top-level branch beside the states index.
- **`app/spaces.jsx`** — `AccountSettings` takes `push` / `onPushChange` and
  renders `PushRow` in both the password and the SSO branch.
- **`app/states.jsx`** — `stagePushAsk`, `stagePushSetting`,
  `stageDevicePreview`, six register entries, and a push reset in `reseed`
  (push is persisted, so without it an answered permission leaks into the state
  built to show the unanswered one).
- **`circlists.html`** — two script tags; CSS for `.circ-pushask*` and
  `.circ-osdialog*`.

## The addresses

| id | what it opens |
|---|---|
| `push-ask` | the ask, on Backend Pod's Active list |
| `push-setting-on` | Account — notifications on |
| `push-setting-off` | Account — notifications off |
| `push-setting-refused` | Account — refused at the device |
| `push-setting-safari-tab` | Account — an iPhone Safari tab |
| `push-device-preview` | the device preview |

Reach them from the launcher's States half, or `?state=<id>` outside the design
tool.

## What I chose, and why

**The ask's copy, form and position.** One line — *"Know when new links land in
your circles."* — with **Turn on notifications** beside it. "Your circles",
plural, because the ask speaks for all of them and not the one on screen. The
button label names exactly what pressing it does, because pressing it is what
raises the device dialog; a softer label ("Sure", "Enable") would make the OS
alert arrive unannounced.

Its form is a **band in the feed column**, above the cards, in the column's own
rhythm — sunken ground, the lighter hairline, the 8px radius, so it reads as a
notice and never as a link card. **Not a toast**: a toast has to be positioned
against the viewport, which forces a per-posture fork, and this app does not
make one.

**Its row/stack switch is a container query on the band itself** — the
mechanism `.circ-invite-card` and `.circ-dormant` already use. One element holds
at 320px, inside the phone frame, on mobile web and in the desktop feed column,
with nothing branching on `isMobile`. Under 520px of column it stacks: line,
then the controls. Over it, line left, controls right.

It sits **under the New pill** in DOM order because the pill owns the column's
first-child slot (its negative margin cancels the feed's top padding).

**Dismissable, and it does not return.** The Account setting is the permanent
home for this, so a dismiss loses nothing — and a line that can only be answered
is a demand, which this product does not make. The control is a tertiary
**Dismiss** rather than an × : an × in a band inside the feed reads as a card
action, and "Not now" would promise a return that never comes.

**The Account row.** A card titled **Notifications** with the supporting line
*"Know when new links land in any of your circles."* and a switch.
**First on the page.** The rest of Account is identity and security — email,
password, then the one terminal act — and that reads as a single escalating
block; a device preference dropped into the middle of it is an interruption.
It is also the only row here a member visits casually, so it goes where a
casual visit lands. Same slot in the password and SSO branches.

**Refused.** The switch is replaced by a statement: *"Notifications are off in
your device settings. Turn them on for Circlists there, and they arrive here."*
A statement, not a disabled switch — the app genuinely cannot change this, and a
dead control that says so only by being grey is what
`specs/governance/standards/ui-design.md` rules out.

**iPhone Safari tab.** Same treatment, different fact: *"Notifications reach the
Home Screen app only. Add Circlists to your Home Screen, and they arrive
there."* `channel` is **staged, never sniffed** — this prototype has no real user
agent to read, and a guess would make a statement the device disagrees with.

**The device preview: both frames, iPhone.** Lock screen and Home Screen side by
side, wrapping to a column on a narrow canvas. They answer different questions —
the lock screen is *what arrives*, the Home Screen is *what is left behind once
the moment has passed* — and one without the other leaves half the design
unseen. A notification list was dropped: it shows the same two banners in a
duller frame.

## Not built, and why

- **No `CHANGELOG.md` entry.** The shape of the product did change, so one is
  owed — but the choices below are unratified, and the changelog is not where a
  decision gets settled. Write it once the review lands.
- The device preview carries a third frame: **Android**, using
  `brand/assets/notification-badge.svg` as supplied (alpha silhouette, never
  the full-colour icon, never recoloured). It reads dark there because Android
  keeps only the alpha channel and tints it dark on a light shade.

## Open

1. **Everything under "What I chose" is a proposal.** Nothing has been ratified.
2. **Desktop firing frequency** — still explicitly deferred, untouched.
3. **Whether the app icon carries a badge count on desktop** — never discussed.
4. `docs/specs/pwa-notifications/` was folded into this folder on 2026-09-22 —
   one subject, one ticket. Its standing placement objection (root vs
   `docs/specs/`) is still unresolved.
