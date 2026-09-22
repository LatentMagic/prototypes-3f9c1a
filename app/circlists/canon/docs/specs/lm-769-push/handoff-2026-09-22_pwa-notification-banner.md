---
date: '2026-09-22'
topic: 'pwa-notification-banner'
status: 'in-progress'
type: 'exploration'
---

# Handoff: PWA notification banner — the design surface, cut to what is real

## Current Focus

Two things are live. **(1) The permission ask** — the user has a line,
"Circlists would like to send you notifications. Turn them on," and asked where
it goes. My recommendation, **not ratified**: the permanent switch in Account
settings (it is a device-and-browser permission, not per-circle), the ask itself
as a band at the top of a circle's Active list, once, in the slot the returns bar
already uses. Nothing built for it. **(2) A standing objection to placement** —
the user has twice asked whether the board should sit at the project root. It is
in `docs/specs/` per `CLAUDE.md` (root is the product or a candidate build; the
launcher is how a reference is reached). Answered, not accepted. If they say move
it, move it and record the rule change in `CLAUDE.md`.

Background only: the badge asset, which is handed off as a prompt for their own
agent to build in the wiki brand pack.

## Task(s)

Done:

- Established, from MDN and the action-support matrix rather than recall, what a
  web-push notification actually lets us specify (see Learnings — this corrected
  a first draft that overstated iOS).
- Built the reference board, then corrected it, then cut it hard.
- **Ratified: the banner is the title alone.** No `body`, no `actions`, no
  counts. The user's words: "You were given the string."
- Wrote the prompt for the Chromium badge asset, for their agent to run against
  the wiki brand pack.

Not done: the permission ask, the app-side surfaces, firing frequency on desktop.

## Critical References

- `CLAUDE.md` — the ratification rule (nothing is decided without the user
  saying so in words) and the chat-reply length rule. Both were breached
  repeatedly this session; see Learnings.
- `brand/circlists-brand.md` §2 — the mark's geometry and the installed-icon
  exception. The badge asset is the same principle applied to a second
  constrained surface.
- `MOBILE.md:20` — account settings is a **shared** surface, so the permission
  switch lands once and renders in all three postures.

## Recent changes

- `docs/specs/pwa-notifications/playground/wb-notification-banner.html` — the
  board. Four platform frames (iOS 17, Android 14, macOS Notification Centre,
  Chrome's own), real pixel sizes, title-only, plus the field list.
- `docs/specs/pwa-notifications/prompt-android-notification-badge.md` — the
  badge prompt, handed to the user.
- `docs/specs/pwa-notifications/README.md` — scope, the real surface, settled vs
  open.
- `playgrounds.json` — new ticket `pwa-notifications`, one entry.

## Learnings

**The design surface is two strings, not a canvas.** `showNotification(title,
options)` takes `actions`, `badge`, `body`, `data`, `dir`, `icon`, `image`,
`lang`, `navigate`, `renotify`, `requireInteraction`, `silent`, `tag`,
`timestamp`, `vibrate`. Nothing describes appearance.

**Safari is the constraint, and it is severe.** Safari 16.4+ on iOS *and* macOS
renders title, body, `tag` and `data`, and uses the installed web app icon — the
`icon` we pass is discarded, and `badge`, `image` and `actions` are absent
entirely. Chromium honours all four and caps actions at two
(`Notification.maxActions`). So: write for the smallest surface; assets are
Chromium-only enhancement, never a dependency.

**Android's badge is an alpha-channel asset, not an image.** It maps onto the
Android notification *small icon*, which also appears in the status bar, so the
OS keeps only the alpha channel and applies its own tint (~96px source, masked
automatically). The shipped mark is opaque across the full disc, so its alpha is
a solid circle and it draws as a dot. Fix: halo and disc opaque, white ring cut
to transparency. Passing no badge is worse — Chrome substitutes its own glyph.
The file is white on transparency by convention; the board renders it dark
because Android tints it dark on a light header. That is not a contradiction and
it caught the user's eye — worth labelling if the board is revisited.

**`<base href>` depth.** A playground at `docs/specs/<ticket>/playground/` is
**four** levels deep and needs `../../../../`. I shipped `../../../`, every asset
404'd, and the user saw a page of broken images. The preview's "referenced file
not found" warning fires either way, so it cannot be used to tell the two apart
— check the depth by counting the path, or probe `document.baseURI` in the live
view.

**Process, and the real failure of this session.** The user asked repeatedly for
less: the first board carried an option board, a red team and six rules for a
decision that turned out to be "use the string you were given." Working rule for
this topic: the platform gives us almost nothing to design, so the deliverable
should be almost nothing. Ask what is prescribable *before* building the artefact
that prescribes it.

## Artifacts

- `docs/specs/pwa-notifications/playground/wb-notification-banner.html`
- `docs/specs/pwa-notifications/prompt-android-notification-badge.md`
- `docs/specs/pwa-notifications/README.md`
- `playgrounds.json` (entry added)

## Action Items & Next Steps

1. **Resolve the placement objection.** Either confirm the board stays in
   `docs/specs/` or move it to root and amend `CLAUDE.md`.
2. **The permission ask** — recommendation above, awaiting ratification. Nothing
   should be built until it is.
3. **The badge asset** — the user's own agent runs
   `prompt-android-notification-badge.md` against the wiki brand pack. When it
   lands, the board's Android frame can point at the real file instead of the
   inline SVG.
4. Desktop firing frequency — explicitly deferred by the user, untouched.
5. Whether the app icon carries a badge count — never discussed, do not assume.

## Other Notes

- **No `CHANGELOG.md` entry.** Nothing shipped; the product's shape is unchanged.
- The user's voice input renders "surfaces" as "services" — read it that way.
- Keep replies short. Every long reply this session cost trust, and the board was
  cut three times before it was the right size.
