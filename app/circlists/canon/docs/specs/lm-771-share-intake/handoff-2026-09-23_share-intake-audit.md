---
date: '2026-09-23'
ticket: 'LM-771'
topic: 'share-intake'
status: 'in-progress'
type: 'implementation'
---

# Handoff: share intake — the owner's audit, round one

Predecessor: `docs/specs/lm-771-share-intake/handoff.md` (2026-09-22, the build). Read it for file map, addresses and first-round reasoning; this file records what the audit changed.

## Current Focus

Two things await the owner's word:
1. ~~Ratify the `CHANGELOG.md` entry~~ — **ratified 2026-09-23.**
2. ~~The spacing around the hairline on the signed-out page~~ — **confirmed fine 2026-09-23.**

Background only: the asleep-circle case was named as "next" mid-session but then superseded by the no-circles ruling; the asleep drop-silently behaviour is unchanged and unqueried.

## Task(s)

Ruled this session (ratified in words by the owner):
- **Held link = option 01 "Ruled"** from `playground/wb-held-link.html`: bare mono line, no box, scrolls sideways, hidden scrollbar, 48px right-edge fade that clears at the end, **no left fade** (tried, vetoed). Hairline below it, `16px` above / `24px` below.
- **No circles → home's own empty state**, in-shell, unchanged, no added line. Link dropped. The picker's no-circles body and `ShareNoCirclesLine` are deleted.
- **Signed-out = option 03 "Split by role"** from `playground/wb-signed-out-lead.html`: link + hairline above the card; the card's subtitle becomes **"To add this link to a circle."** for share arrivals only. Chip (02) vetoed: the signed-out page must use the picker's syntax.
- **Column width: stays 300px.** 400px was tried; it broke Fund your circle (step 2) and the owner reverted it and does not want to deal with it now. The owner may raise a ticket.

Still open, unchanged from the predecessor:
- Sign-up from the signed-out card lands on home with the link dropped. Owner may raise a ticket.
- Asleep circle drops the link silently.

## Critical References

- `CLAUDE.md` § Ratification — nothing above is to be extended beyond what was ruled.
- `app/share-intake.jsx` — the whole feature surface.

## Recent changes

- `app/share-intake.jsx` — `ShareHeldLink` rewritten (scrolling bare line, mask fade, `SHARE_LINK_FADE = 48`); new `ShareLinkRule` (margin `16px 0 24px`); `ShareSignInLead` = link + rule, no margin; `SHARE_SIGNIN_SUBTITLE` exported; `ShareIntake` returns `null` with no circles; `ShareNoCirclesLine` removed.
- `app/main.jsx` — effect after `space` memo: `share-intake` with no circles → `setShareLink('')` + `setRoute('home')`; `SignIn` gets `subtitle` from `window.SHARE_SIGNIN_SUBTITLE` on share arrivals.
- `app/auth.jsx` — `SignIn` takes `subtitle` (default "Pick up your list where you left off.").
- `app/wizard.jsx` — `WIZARD_COL` back to 300 (net unchanged). `app/subscriptions.jsx` — net unchanged.
- `CHANGELOG.md` — new top entry (ratified).
- `playgrounds.json` — LM-771 ticket added with both boards.

## Learnings

- **Equal margins around a rule under a text line don't look equal.** The line box's leading and 4px padding add ~6px above the rule; below it, a card edge adds nothing. Hence 16/24, not 20/20. Same reason the signed-out lead carries no bottom margin.
- **Never wrap a URL on this screen.** Proposed (with a 4-line cap), rejected hard: a long link can eat the page.
- Base-relative playground paths trigger "referenced file not found" and skip the verifier. False positive per `CLAUDE.md`; check logs by hand.

## Artifacts

- `docs/specs/lm-771-share-intake/playground/wb-held-link.html` — options 01–04 (01 ratified).
- `docs/specs/lm-771-share-intake/playground/wb-signed-out-lead.html` — options 01, 03, 04, 05 (02 hidden; 03 ratified).
- This handoff.

## Action Items & Next Steps

1. ~~Get the CHANGELOG entry ratified~~ — done.
2. ~~Confirm the signed-out hairline spacing~~ — done.
3. Update the predecessor's "Unresolved" list if the owner raises tickets for column width / sign-up.

## Other Notes

- The owner reviews on phone and desktop; check 390 and 1280.
- "Card, card, card" is the owner's standing objection to stacked boxes on these screens — prefer rules and bare text over new containers.
