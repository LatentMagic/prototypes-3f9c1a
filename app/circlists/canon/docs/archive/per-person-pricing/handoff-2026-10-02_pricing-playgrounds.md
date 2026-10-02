---
date: '2026-10-02'
ticket: 'per-person-pricing (business-ops store-launch/_subtasks/pricing-model)'
topic: 'pricing-playgrounds'
status: 'complete'
type: 'exploration'
---

# Handoff: pricing-playgrounds — three option boards for the Account card and the subscription page

> **Latest:** `handoff-2026-10-02_subscribe-page-integrated.md` carries everything still live from this handoff. Start there.

**Follows, in order:**
1. `docs/specs/per-person-pricing/handoff.md` (2 Oct): the candidate build as first delivered, covering its shape, hooks, surfaces, staged states and open calls.
2. `docs/specs/per-person-pricing/handoff-2026-10-02_account-card.md` (2 Oct): the Account card went back to canon's Funding-card buttons and the Resume error lines were removed.

Read both for context. This handoff covers only what landed since: three playgrounds and one copy change.

## Current Focus

Joe has three new option boards to react to. None of the options is ratified. The next session waits for his pick on each board and then builds the chosen option into the candidate. Ask him before building; do not infer a choice.

Joe named these as the three worst surfaces in the candidate. He expects to name more "particularly bad" surfaces from the scenario list later, starting from the top of that list. The rest of the candidate is background.

## Task(s)

Done this session:
1. **Account card playground**, built at Joe's request. His complaint: the mixed row (an icon button, a plain button, then red Cancel text) looks poor on desktop and worse on mobile, where it wraps into "three indentations". He wants three more elegant ways to present the three acts at both widths.
2. **Subscription page, phone playground.** His complaints:
   - the lede reads as a small, narrow block
   - the free month is not communicated adequately
   - the "2 months free" pill competes with the free month
   - "30 days free, then £50 a year" is not elegant
   - the card-terms lines sit left-aligned and look bolted on.
3. **Subscription page, desktop playground.** Joe called the as-built two-column layout bad: the lede is not centred, there is a big gap above the ticks, and the "£50 a year, from today" line is poorly placed. He is open to two columns if done with care, and also to going back to a centred page. Both are on the board.
4. **Copy change (ratified, Joe's words):** the lede is now "Joining circles is free. Subscribe to run your own." It replaces "Members are free. Subscribe to run circles of your own." on the non-subscriber Account card and at the top of the subscription page.

Raised by Joe, still open:
- **Not-subscribed Account card.** Joe thinks the Subscribe button is unnecessary and that "Subscribe" should be a green underlined link in the line. Built as option N2 on the Account card board. Not applied to the candidate. Confirm with him before applying.
- **"Members are free" as a concept.** Joe was unsure it makes sense and said he might explore it with a different agent. The copy change above may settle it. Do not touch it further unless asked.

## Critical References

- `skills/build-playground/SKILL.md`: these are option boards. Each option has a number, a name, a claim and a cost, and the real surface sits beside it as option 00.
- `specs/governance/standards/ui-design.md` (monorepo, live): every width designed, no overhanging line, destructive actions signal themselves, consistent affordances, touch floor.
- business-ops `store-launch/_subtasks/pricing-model/_context/decisions.md`: the wording "2 months free" is still listed as open there. The free month on both plans and £50 a year are ruled.

## Recent changes

- New `docs/specs/per-person-pricing/playground/`:
  - `pg-ppp.css`: a pointer-marked copy of the candidate's `.ppp-*` block, button states, focus ring, doorlink and config segmented control, plus the board chrome and `pg-*` option classes.
  - `pg-ppp-board.jsx`:
    - board chrome (`PgBoard`, `PgSeg`, `PgOpt`, `PgFrame`, `PgScaled`, `usePgSaved`)
    - swaps `window.CircPPP` for an in-memory store, so nothing writes the candidate's `circ_ppp_v1`
    - stubs `window.__pppApi`.
  - `pg-account-card.html` + `.jsx`:
    - mounts the real `PppSubscribed` / `PppNotSubscribed` as 00 and N1
    - `pgFacts` copies the card's marker, rows and line from `cand-ppp-account.jsx` so only the acts differ.
  - `pg-subscribe-parts.jsx`: copies of `PppPlanCard` and `PppCheck` with pill and sub-line slots, plus the receipt, timeline, quiet line, act block, page shell and `usePgPageState`.
  - `pg-subscribe-phone.html` + `.jsx`, `pg-subscribe-desktop.html` + `.jsx`: both mount the real `PricingScreen` as 00.
- `playgrounds.json`: three entries added under per-person-pricing.
- `docs/specs/per-person-pricing/cand-ppp-pricing.jsx:9`: `PPP_LEDE` now holds the new lede.
- `docs/specs/per-person-pricing/handoff.md`: the shared-lede quote in surface 1 is updated.
- `github.md`: Last sync refreshed.

## The options (numbers as Joe will cite them)

**Account card** (`pg-account-card.html`): a state control covers free month, active, payment failed, ending and switch pending. Each card is shown at 320, 390 and desktop (the 720px Account column).
- 00 As built.
- 01 One shape: three equal boxes, a row on desktop and a stack on a phone. Cancel is destructive-secondary. No icon.
- 02 Pair and a foot: Update and Switch as an even pair. Cancel moves below the billing line and a hairline, flush left.
- 03 Each act beside its fact: Switch on the Plan row, Resume on the Ends on row, and a new Payment card row with "Update card". The label is shortened, which is that option's stated cost.
- N1 As built, with the Subscribe button.
- N2 Subscribe as a doorlink in the line.

**Phone page** (`pg-subscribe-phone.html`): a state control switches between free month available and used. Frames at 390 and 320. Options 01–03 break the lede after its first sentence.
- 00 As built.
- 01 Receipt: "Due today £0.00", then the price "From <date>". The pill becomes "Save £10". One centred terms line under the button.
- 02 The offer under the heading: "30 days free, then £50 a year" moves under the title. No pill; the yearly card shows "£4.17 a month".
- 03 Timeline: three dated steps (starts, reminder, first payment). The pill keeps "2 months free" as a control. No terms line.

**Desktop page** (`pg-subscribe-desktop.html`): at 1280, scaled to fit. Options 01–03 all carry phone option 01's content, so only the layout differs.
- 00 As built.
- 01 Centred column.
- 02 Centred and wider, with the ticks in a row and the plans as side-by-side tiles.
- 03 Two columns: copy on the left, one white panel holding the whole decision on the right.

## Learnings

- Babel top-level `const`s in classic scripts are global, so the playgrounds reference `PppSubscribed`, `PppNotSubscribed` and `PricingScreen` directly.
- `PricingScreen` reads the global store. A board-level state control can drive it, but only one state renders at a time. Setting the store during render, rather than in an effect, avoids a first paint in the wrong state.
- The preview's "referenced file not found" warnings for `<base>`-relative paths are false positives (see CLAUDE.md). The pages load.
- The background verifier never ran: the base-relative warnings blocked `ready_for_verification`. I checked by eye that the account and desktop boards render cleanly. The phone board was checked only in part.

## Action Items & Next Steps

1. Get Joe's pick on the Account card board (01/02/03, plus N1 or N2). Then build the pick into `cand-ppp-account.jsx` and update `handoff.md` surfaces 3–4.
2. Get his pick on the phone board, which settles both the trial wording and the pill. Ask separately whether the "2 months free" wording changes, since it is open upstream too. If it changes, it also needs writing back to business-ops `decisions.md`, with his say-so.
3. Get his pick on the desktop board, then rebuild `PricingScreen` and the candidate's `.ppp-*` CSS to the chosen phone content and desktop layout.
4. Open since the earlier handoff, still unasked: Switch's treatment (now folded into the Account card board), the "Resume subscription" label, and anything Joe thinks the card doesn't need.
5. Joe will name more surfaces from the top of the scenario list. Each gets its own board in this folder, plus an entry in `playgrounds.json`.

## Other Notes

- The ratification rule applies. Only the copy change is ratified this session.
- No CHANGELOG entry: this is iterative candidate and playground work.
- `uploads/` got nothing new this session.
