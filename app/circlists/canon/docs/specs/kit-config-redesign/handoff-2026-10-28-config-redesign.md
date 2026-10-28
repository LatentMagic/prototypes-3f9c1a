# Handoff: Config modal redesign (kit v9)

Version before: 8. Now: 9.

## Sections and rows
- **Global** (9 rows + 1 event). Review: Platform, Viewport (a note in the app), Mobile payments, Preview gate, TEST circles; event Reset to seeded data. Per-person pricing (candidate): Subscription, Free month, Plan.
- **Sign-in** (2): Apple account, Provider sheet.
- **Liveliness** (2 rows + 4 events): Timed check, Count; events Arrival in this circle, Arrival in another circle, Unsurfaced arrival, Delete by another member.
- **Notifications** (up to 5): Delivery, Device permission, In Circlists, The ask, Dismissals; notes where rows are absent.
- **Subscription card** (3): Card load, Card actions, End date.
- **Conversation** (8 events): returns bar in/out, Add a watched card, Everything unseen, Never visited, A new turn, A new reply in a tail, Watch every card with words.

Section order follows registration: modal groups first, then overlays.

## Kept from the old Config
- Prop-driven rows stay in `ConfigModal` (`app/config.jsx`): the root passes their state.
- Click-capture replay of events (now `.circ-config-action`), the scroll lock on the phone screen, Escape, the Notifications guard on `CircPushSetting`.
- Palette shell styles (`circ-config-scrim/-modal/-head/-title/-subtitle/-close/-body/-hint/-group-title`) for States and QA.

## Changes worth ratifying
- **Steppers became chips.** The Count stepper (1 to 20) is now 1, 2, 3, 5, 10, 20; Dismissals is 0 to 5.
- **Two ConfigExtra publishers merged.** `pricing-states.jsx` loaded after `talk-qa.jsx` and won, so the Conversation rows never showed. Both now export components; the new `app/config-extra.jsx` is the only publisher and shows both.
- **Subscription, Free month, Plan sit in Global** (the subscription changes who is looking); Card load, Card actions, End date are the Subscription card section.
- Hints were shortened; Liveliness arrival hints moved onto the events; Config events no longer call `onClose`.
- Added notes for absent Notifications rows.
- **Built from the Circlists design system (user's instruction, 2026-10-28):** options and events are the system's `Button` (`app/primitives.jsx`): the chosen option is primary, the rest and every event secondary; sm 36 on desktop, md 44 on a phone. Icons come from the system's `Icon` set (`info` and `chevron-left` added). The current rail section is in accent, like the tabs pattern. The scrim is the flat `--color-scrim`. This departs from the kit's look (near-black chip, pill events); raise it upstream. `Button` gained `className` and `aria-pressed` passthroughs, which are additive.

## Not done
- Copies in `docs/specs/lm-652-discourse/cand-lm652-qa.jsx` and `docs/archive/per-person-pricing/` still use the old classes; they are not loaded by the app.

## Next
- Check the QA and States palettes at phone width; confirm section order.
