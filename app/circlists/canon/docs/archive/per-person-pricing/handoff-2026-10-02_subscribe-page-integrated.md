---
date: '2026-10-02'
ticket: 'per-person-pricing (business-ops store-launch/_subtasks/pricing-model; no monorepo id yet)'
topic: 'subscribe-page-integrated'
status: 'in-progress'
type: 'implementation'
---

> **Latest:** `handoff-2026-10-02_qa-pass.md` supersedes this one.

# Handoff: subscribe-page-integrated — the subscription page settled and built; the candidate's live state in one place

This handoff inlines everything still live from the earlier ones in this folder: `handoff.md`, `handoff-2026-10-02_account-card.md`, `handoff-2026-10-02_pricing-playgrounds.md` and `handoff-2026-10-02_account-card-integrated.md`. Each of those now points here. Read them only for history. `handoff.md` stays the per-surface reference (shape, hooks, surfaces 1–7, staged states), and its surface 1 is updated to match this handoff.

## Current Focus

Joe will look at **the next playground** next. He names which surface it covers: he is walking the candidate surface by surface, from the top of the scenario list, and naming the "particularly bad" ones. Wait for him to name it. Don't pick one yourself.

These are settled and built: the Account card, the Switch overlay and the subscription page. Treat them as background unless Joe raises them.

## Where the candidate stands

The candidate is `docs/specs/per-person-pricing/circlists-per-person-pricing.html`. It's the app plus `cand-ppp-*` overlays and additive hooks in `app/`, gated on `window.CircPricing`. The main app's per-circle model is untouched. See `handoff.md` "Shape".

Settled pieces, each ratified by Joe in words (see the review notes):
- **Subscription page** (`cand-ppp-pricing.jsx` `PricingScreen`): phone board **01.2**, one centred column at every width. `review-2026-10-02-subscribe-phone.md`.
  - The yearly pill reads **Save £10**.
  - Under the plans are receipt rows in the Account card's `.ppp-row` style:
    - free month: Due today £0.00, then From <date> £50 a year
    - used: Due today £50, then Renews <date>.
  - The ticks are centred as a group.
  - The free-month lede reads "Subscribe to run your own circles." The used lede reads "Joining circles is free. Subscribe to run your own.", with each sentence held whole.
  - "A card is needed to start." is **cut**. Under the button is "Cancel before <date> and pay nothing."
  - The heading scales: `clamp(24px, calc(8.57cqi + 0.34px), 30px)`, with `.ppp-body` as the container.
  - The two-column desktop is gone.
- **Account card** (`cand-ppp-account.jsx`), ratified as **02.1**, **N2** and **Keep <plan>**. `review-2026-10-02-account-card.md`.
  - Subscribed: Update payment card and Switch sit as an even pair (`.ppp-pair`, two columns from 440px, otherwise stacked). Under them are a billing foot, a rule, and Cancel as red text.
  - While a switch is pending, a **Keep <plan>** button clears it, with no confirm.
  - Not subscribed: "Subscribe" is a door link inside the line.
- **Switch overlay** (`PppSwitchSheet`): **02.1 centred**, a before-and-after panel. `review-2026-10-02-switch-sheet.md`.
  - It reads Now plan · price, then an arrow, then From <date> plan · price, with the text centred in each half.
  - Buttons: Switch to <plan>, Cancel.
- **Resume** behaves as canon: no confirm, cannot fail. There are no Resume error lines.

## Critical References

- `CLAUDE.md`. Two rules matter most here:
  - The ratification rule.
  - The new Designing rule, added this session: **when layout rules collide, a role never changes**. The levers go in order: size within the role, then spacing, then layout, then rewording.
- `skills/candidate-build/SKILL.md`. Nothing in the candidate counts as ratified for `app/` or `CHANGELOG.md` until the whole candidate is.
- `skills/build-playground/SKILL.md`, for the next board. The real surface mounts as 00, and every option has a number, a name, a claim and a cost.
- `specs/governance/standards/ui-design.md` (monorepo, live): every width designed, no overhanging line.

## Recent changes (this session)

- `cand-ppp-pricing.jsx`:
  - The header comment now describes board 01.2.
  - `pppKeep()` joins a phrase with no-break spaces.
  - The pill reads Save £10. The receipt is `.ppp-receipt` and the cancel line is `.ppp-cancel-by`.
  - The lede is now `.ppp-lede-ph`, with spans held whole.
  - The `.ppp-terms` and `.ppp-quiet` markup is removed. `PPP_LEDE` is still used by the Account card.
- `circlists-per-person-pricing.html` and `playground/pg-ppp.css`, kept in step:
  - New rules: `.ppp-body` container, the scaled `.ppp-title`, `.ppp-lede-ph`, `.ppp-receipt`, centred `.ppp-a-gets .ppp-bullets`, `.ppp-cancel-by`.
  - Every `[data-circ-posture="desktop"] .ppp-*` page rule is removed.
- `playground/pg-subscribe-phone.jsx` + `pg-subscribe-parts.jsx` + `pg-ppp.css` (board only):
  - 01 is tweaked in place: ticks centred, lede and terms sentences held whole, a desktop frame added.
  - New **01.1**: the free-month lede, and the card line cut.
  - New **01.2**: 01.1 with the scaled heading.
  - Parts: `pgNb`, plus the `nb`, `lede` and `noCard` props, `.pg-bullets-c`, `.pg-col-c`, `.pg-hcq`, `.pg-h-small`.
- `CLAUDE.md` Designing: the role-never-changes rule. It's worded per Joe's agent: no pixel numbers, and rewording is the last lever rather than one to avoid.
- `review-2026-10-02-subscribe-phone.md` (new). `handoff.md` surface 1 and Calls updated. Pointers added to the three earlier handoffs. `playgrounds.json` notes updated. `github.md` Last sync refreshed.

## Learnings

- **Joe's "integrate" means everywhere.** When he ratifies an option and says build it, build it at every width. Don't split it into phone-only and ask about desktop. When he answered "That seems reasonable" to a two-part message, he was agreeing to the principle note. I read it as agreeing to phone only, and that cost a round and his temper.
- **When asked to tweak, tweak.** "It's just 01 with a few tweaks" meant: make the tweaks now. Asking to ratify first frustrated him. Iterate in place, or as 01.1 / 01.2 when he asks to see the difference.
- **Answer the question asked, in its terms.** Asked "what tool did you use", the answer is the CSS function (`clamp()`), not an explanation of why. He had to ask three times.
- **Alignment as well as overhang.** A heading that wraps into a narrow block over a full-width page fails, even when the overhang rule passes. A fluid scale (`clamp`) is preferred to a fixed breakpoint ("Ew, why don't you scale it?").
- **The board's 320 frames don't show the candidate's `vw` clamp.** They sit inside a wide browser window. Container units (`cqi`) make a frame behave like a real phone.
- **Opening the candidate in Joe's wide window shows its desktop posture.** Say which width he'll see before sending him there.
- Wrapping rules, still binding:
  - Prices, dates and "N days left" never split.
  - A label/value row stays on one line or stacks whole.
  - Don't use `text-wrap: balance` on short copy.
  - An orphan is fixed with a no-break space between the last two words.
  - Button groups never wrap 2+1.
- The verifier doesn't run on nested entries (the base-href false positive), so check by eye.

## Artifacts

- Candidate: `circlists-per-person-pricing.html`, `cand-ppp-pricing.jsx`, `cand-ppp-account.jsx`, `cand-ppp-sheet.jsx`, `cand-ppp-store.jsx`, `cand-ppp-states.jsx`, `cand-ppp-circle.jsx`, `cand-ppp-main.jsx`.
- Boards in `playground/`:
  - `pg-account-card`, `pg-switch-sheet`, `pg-subscribe-phone` (01.2 chosen), all settled.
  - `pg-subscribe-desktop`, superseded by 01.2 and kept on the record.
- Reviews: `review-2026-10-02-account-card.md`, `-switch-sheet.md`, `-subscribe-phone.md`.

## Action Items & Next Steps

1. **The next playground.** Joe names the surface. Build its board in `playground/`, mount the real surface as 00, add it to `playgrounds.json`, and wait for his pick. Then build the pick into the candidate at every width, and write a `review-<date>-<surface>.md`.
2. **Upstream feedback that Joe owns.** He will tell his pricing agent about "Save £10". The "2 months free" wording is open in business-ops `decisions.md`, so don't write there without his say-so. He may also propose the role rule for `ui-design.md` "Every width is designed".
3. **Spec records still needed** (via Joe's spec agent): Keep <plan>, the Switch overlay's copy, and the subscription page's new copy (receipt rows, the cancel line, the card line cut).
4. **Still open, never asked:**
   - The "Resume subscription" label.
   - Payment failed shows Update payment card full width on its own. That was my call and needs flagging to Joe.
5. **Surfaces likely to need a look,** but don't change them unasked:
   - The Cancel sheet, against the Switch overlay's new shape.
   - Wrapping on checkout, the sleeping-circle card, the Cancel sheet, and the Switch panel at 320.
6. The free-month Account card still names the reminder email. The subscription page no longer does. Fine as is.

## Other Notes

- Each turn: one decision, a short reply, and the ask on the last line.
- Don't swing with Joe's frustration. Find the specific defect, fix it, and say plainly what went wrong.
- No CHANGELOG entry: this is iterative candidate work.
- `uploads/`: this session's screenshot and every check capture are deleted. Older files from earlier sessions are untouched. `card-previews/` and `card-favicons/` are load-bearing and must never be swept.
