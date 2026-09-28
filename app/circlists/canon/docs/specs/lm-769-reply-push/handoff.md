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
