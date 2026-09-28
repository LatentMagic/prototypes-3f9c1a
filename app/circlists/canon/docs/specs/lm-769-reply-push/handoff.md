# LM-769 reply push — handoff

## Built
- `app/push-preview.jsx`: reply push "New replies in {circle}" beside link pushes, same drawing, lock screen and Android shade. Staging: first funded circle carries both kinds (busy case), second a link push, third a reply push. Badge = distinct circles (3). Heading "Three circles with something new"; captions "one per circle, per kind" / "the badge counts circles, each once".
- `app/push.jsx`: ask + Account card sentence → "Get notified when new links land in your circles, or conversations you're following." (same string both places).
- Space flag `repliesUnseen`; Home row (`app/home.jsx`) and rail (`app/shell.jsx`) light the one dot on `unseen || repliesUnseen`. Cleared in `app/main.jsx` on visiting the circle (any in-circle route, which covers opening a card).
- `app/states.jsx`: `stageCircleMicro({ reply })`.

## Staged states
- `push-device-preview` — relabelled "On the device — three circles with news, links and replies".
- `circle-micro-new-reply` (Home) — sp-backend lit by a reply alone.

## Why
- Wording: **ratified by the user.** "Conversations you're following" is chosen over naming Watching: it consolidates the sentence, avoiding "replies on cards you're watching".
- Three circles so both-kinds, link-only and reply-only are all visible and the badge (3, not 4) proves count-once.

## Open / next
- Seed data has no reply-push source; `repliesUnseen` is staged only, not set by live reply activity.

## Delta — replies send a push, and nothing else (2026-09-28)

### Changed
- Removed state `circle-micro-new-reply` and its staging (`stageCircleMicro({ reply })`) from `app/states.jsx`.
- Removed the `repliesUnseen` flag everywhere: Home row (`app/home.jsx`) and rail (`app/shell.jsx`) light on `unseen` only; the clear-on-visit effect in `app/main.jsx` is gone.
- `push-device-preview`: badge counts distinct circles with a link notification (2 of the 3). The reply notification stays on the lock screen and Android shade. Caption now "Home screen — the badge counts circles with new links". Heading "Three circles with something new" is still true, so it stays.
- Unchanged: reply push wording, ask and Account sentence.

### Unresolved
- None. The earlier gap (live replies never set `repliesUnseen`) no longer applies.
