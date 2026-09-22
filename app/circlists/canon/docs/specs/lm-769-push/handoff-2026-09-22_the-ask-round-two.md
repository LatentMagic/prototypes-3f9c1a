---
date: '2026-09-22'
ticket: 'LM-769'
topic: 'the-ask-round-two'
status: 'in-progress'
type: 'exploration'
---

# Handoff: LM-769 — the ask, round two (the banner)

## Current Focus

**One thing is outstanding: whether the banner's pace is right.** 560ms in,
400ms out. The user was asked and has not answered. If he says yes, the banner
is the form and the write-up follows; if not, adjust the pair and ask again.

Everything else in the feature is built, working and unratified — background
until the form lands.

**Do not carry the "OK" on the banner's ground or its copy over to the form
itself.** Sunken and "Set up notifications" are ratified. The banner as *the
chosen ask* is not.

## Task(s)

Done this session:

- Built a second rig after the reset: `docs/specs/lm-769-push/playground-ask-v2/`.
  Five forms, each a different *kind of thing* — the block (prose), the card
  (an object in the list), the banner (chrome above it), the setting (the
  Account control brought forward), the tail (the same sentence at the foot).
- Rebuilt option 3 from "shelf" to **banner** on the user's instruction: bled
  to the full content row, arriving with a slide-down, leaving with the same
  motion reversed.
- Landed the ratified copy **"Set up notifications"** in the rig *and* in the
  shipped `app/push.jsx:70`.

Not done: everything the previous handoff listed as open (dismiss-never-returns
— now in question, see below; the refused and Safari-tab statements;
Notifications first on Account; the preview's three frames; desktop firing
frequency; the badge-count question; the `CHANGELOG.md` entry).

## Critical References

- **The previous handoff, `handoff-2026-09-22_push-notifications.md`** — the
  reset, and the four objections to the first rig's forms with what each was
  actually about. Read it before touching the ask; the mistakes it records are
  still the ones available to make.
- `CLAUDE.md` — the ratification rule and the ~150-word chat-reply rule. Both
  were broken this session (see Learnings).
- `skills/build-playground/SKILL.md` — the rig follows it; `pg-ask2-topbar.jsx`
  is a verbatim copy of the discourse bar.

### Previous handoffs on this ticket

- `docs/specs/lm-769-push/handoff.md` — the original build write-up: every
  "yours to decide" item and its reasoning.
- `docs/specs/lm-769-push/handoff-2026-09-22_pwa-notification-banner.md` — the
  device-banner reference board (iOS / Android / desktop at real size, the icon
  study, what the platform lets us specify). Note the name collision: that
  "banner" is the OS notification, not the in-app ask.
- `docs/specs/lm-769-push/handoff-2026-09-22_push-notifications.md` — the
  reset. The most important of the three.
- `docs/specs/lm-769-push/prompt-android-notification-badge.md` — the prompt
  behind the badge asset.

### Every other handoff in the project

Grouped by spec folder; all under `docs/specs/` unless marked archive.

- `_handoffs/` — `2026-08-18_addressable-states`, `2026-08-18_playground-lifecycle`
- `a3-invite-link/` — `2026-08-28_invite-link-candidate`
- `add-surface/` — `2026-08-17_add-surface-whiteboard`, `2026-08-17_direction-2-integrated`
- `biz-80-metadata/` — `2026-07-24_card-metadata-enrichment`, `…_card-metadata-shipped`,
  `…_card-metadata-v2`, `…_card-metadata-v3-direction`, `…_drop-the-hairline`,
  `…_swell-door-in-enriched-card`
- `biz-84-app-ia/` — `2026-07-27_app-ia-direction-08`, `2026-07-27_mobile-app-ia`
- `lm-570/` — `2026-07-27_create-fund-wizard`
- `lm-593-liveliness/` — `2026-07-29_liveliness-integrated`,
  `2026-07-30_liveliness-corrections`, `2026-07-31_liveliness-ticket-set`
- `lm-626-champion-exit/` — `2026-08-03_champion-exit`
- `lm-652-discourse/` — 24 handoffs, `2026-07-27-discourse-playground` through
  `2026-09-21_clearing-conversations-round-two`. The two most recent carry the
  current state of that ticket; the rest are its history.
- archive — `docs/archive/lm-666-link-deletion/handoff-2026-08-18-lm-666-link-deletion.md`,
  `docs/archive/motion/handoff-brand-motion.md`, `…/handoff-loading-motion.md`,
  `…/handoff-swell-mobile.md`,
  `docs/archive/tab-arrival-signal/handoff-2026-07-30-tab-arrival-signal.md`

## Recent changes

Shipped build:

- `app/push.jsx:70` — the offer reads **"Set up notifications"**. Ratified copy;
  the only product edit this session. Everything else stayed in the rig.

The rig, `docs/specs/lm-769-push/playground-ask-v2/`:

- `pg-the-ask-v2.html` — entry, `<base href="../../../../" />` (four levels).
  Derived from the first rig's entry; the option CSS block is replaced, the
  state key is `pg_ask2_state_v1` and the rig key is `pg_ask2_v1`.
- `pg-ask2-forms.jsx` — the five forms. `PgaBanner` carries the measurement,
  the slide-down and the deferred unmount.
- `pg-ask2-store.jsx` — options, costs, `PGA_LABEL`, the `ground` and `width`
  levers, `pgaRearm`.
- `pg-ask2-wire.jsx` — the single `window.CircPushAsk` override and `PGBAR`.
- `pg-ask2-topbar.jsx` — verbatim copy of the discourse bar.
- `playgrounds.json` — "The ask, round two" added above "The ask" under LM-769.

## Learnings

**A × needs an edge to sit against.** This is the finding of the session. In a
bounded form (the card, the banner) the × has a corner or a right edge and
reads as that object's control. In unbounded left-aligned prose it has neither:
at the column edge it is an orphan with a corridor of dead space behind it, and
after a short line it floats in the middle of the column with nothing under it.
The user has now rejected both placements, and he is right about both. Any
future prose ask has to solve the dismiss some other way — or not be prose.

**Do not answer a question by editing the rig.** He asked "am I the only one who
thinks this is wrong?" and the reply changed options 1 and 5 without asking.
Worse, the change — replacing the × with a worded "Dismiss" — put refusing
beside accepting as two text links, which is the *first* fault he ever flagged
on this feature. It was reverted in the next turn. The ratification rule exists
for exactly this; a question is not a brief.

**The banner's bleed must go on the SLOT, not the strip.** The slot owns the
height animation and therefore carries `overflow: hidden`, which clips
horizontally too — a strip wider than the column is simply cut off at the
column's edge, and the symptom is a banner whose first words are missing.
`pg-ask2-forms.jsx` puts `marginLeft`/`width` on the slot.

**Measure against the column, not the slot.** The measurement has to use a box
that does not move when the result is applied. The column's border box plus its
computed `paddingLeft` is stable; the slot's own rect is not, because widening
the slot is what the measurement is for. `100vw` is not an option either — the
app-posture phone frame has `transform: translateZ(0)`, so viewport units lie
inside it.

**Something that arrives with motion has to leave with it.** Pressing × made
`main.jsx` unmount the ask instantly, so the banner opened a slot with a
slide-down and then vanished out of it. The fix is local: the form holds a
`leaving` flag, plays the shut, and defers `onDismiss` by the animation's
length. The app keeps owning the unmount. Timings are the returns bar's own —
560 in, 400 out — so the banner is not inventing a pace.

**The screenshot tool cannot read a mid-animation frame.** It re-renders the
DOM and showed the banner already gone 200ms into a 400ms collapse. `eval_js`
with a timed `getBoundingClientRect` is the only honest check (53px → 12px at
80ms). Do not conclude an animation is broken from a capture.

**The "referenced file not found" warning on these entries is a false
positive** — base-relative paths, the page loads. It also blocks the
verification agent from forking, so verify these rigs by hand.

## Artifacts

- `docs/specs/lm-769-push/playground-ask-v2/pg-the-ask-v2.html` (+ four `pg-ask2-*.jsx`)
- `docs/specs/lm-769-push/playground/pg-the-ask.html` — the first rig, still
  listed. Its four forms are the record of what has been rejected.
- `app/push.jsx`, `app/push-preview.jsx`, `brand/assets/notification-badge.svg`
- `playgrounds.json`

## Action Items & Next Steps

1. **Get a yes or no on 560/400.** That is the only open question in the reply
   he is answering.
2. **Then ratify the form.** If the banner is it, land `PgaBanner` into
   `app/push.jsx` as `CircPushAsk` — the measurement, the slide-down, the
   deferred unmount and the sunken ground — move the CSS from the rig entry
   into `circlists.html` under `.circ-pushask*`, and archive both rigs.
3. **Get the dismiss semantics from him.** He said this session that the × is
   now *a temporary dismiss* and that he would give more detail. That
   contradicts the earlier ratified rule that dismissing removes the line for
   good, which the rig still implements. **Do not change it until he says
   what "temporary" means** — per circle, per session, per N days.
4. Then the rest of the unratified set, one at a time: the refused and
   Safari-tab statements, Notifications first on Account, the preview's three
   frames.
5. `CHANGELOG.md` entry once the shape is ratified — one terse title, 2–4
   shape-level bullets, written once and left alone.
6. Desktop firing frequency — still deferred. Badge count on desktop — never
   discussed.

## Other Notes

- **Ratified this session:** the copy "Set up notifications" (landed in the app);
  sunken over the accent tint for the banner's ground. Nothing else.
- **Still open from the levers:** full row vs column width. He asked for full
  and the rig defaults to it, but he has not said the word.
- **The addresses** (launcher → States, or `?state=<id>`): `push-ask`,
  `push-setting-on`, `push-setting-off`, `push-setting-refused`,
  `push-setting-safari-tab`, `push-device-preview`.
- **Known and left alone:** the New pill's negative margin pulls it 12px closer
  to whatever sits above it on desktop. Pre-existing; the pill's own question.
- `uploads/` — sweep unreferenced drops at session end per `CLAUDE.md`. Never
  touch `uploads/card-previews/` or `uploads/card-favicons/`.
