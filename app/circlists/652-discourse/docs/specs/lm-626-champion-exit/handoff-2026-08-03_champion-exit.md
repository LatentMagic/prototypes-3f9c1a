---
date: '2026-08-03'
ticket: 'LM-626'
topic: 'champion-exit'
status: 'in-progress'
type: 'implementation'
---

# Handoff: champion-exit — dormancy, succession, leave, account deletion, the failing payment

## Current Focus

**The dormant screen rework is done and approved** (see the second appendix — read it
before touching that screen). What remains of LM-626 is the user's own surface-by-surface
review of everything else (the checklist below). **Both steered choices are now closed:** the
marker word (appendix 4) and the post-deletion landing (appendix 5, closed as out of scope
for a prototype). The only outstanding approval is the three `GOTCHA.md` candidates.

Background only: the brief's eight children / decisions.md upstream — this session worked
from the pasted delta brief alone.

## Task(s)

Implemented the LM-626 delta brief in full, on existing grammar, inventing no component:

1. **Dormant circle — one screen, Fund for everyone.** Role branch removed; names nobody;
   Fund routes into the existing standalone re-fund checkout for any member; rule stated in
   copy; plain contact door; Leave.
2. **Suspended — one screen, one action.** No role branch, no Fund, Get in touch only, and
   the screen says *why* funding is absent (subscription paused, not gone).
3. **Leave a circle.** Beneath the roster for a non-champion, and on the dormant screen.
   House destructive confirm. On accept the circle drops from state and the member lands on
   their next non-TEST circle, else the no-circle home. Champion of a funded circle gets a
   **statement** in the slot, never a control.
4. **Cancel funding confirms first.** Destructive confirm naming the cost stands in front of
   the provider deep-link. Nothing announces the role change afterwards.
5. **Failing renewal.** Funding card takes a third *textual* marker state with one line
   beneath carrying the retry window as a **duration**; both buttons stay live.
   The `ending` state (marker + "Funding ends on…" line) was **not present in the build** and
   was authored here, carrying the dormancy + succession fact as the brief requires.
6. **Delete your account.** Last control on the account surface (both password and SSO
   variants); confirmation enumerates no circles and points back into circle settings.
7. **No-champion window.** Statement where the crown was; no management for anybody
   (invite, rename, kebab, funding card all absent); reading/adding/reacting untouched.

## Critical References

- `CLAUDE.md` — kebab-case filenames, accent/danger colour rules, voice, three postures.
- `ARCHITECTURE.md` — `inShell()` swaps chrome only; a shared surface must not fork per
  posture. Everything here landed in shared surfaces, so all three postures got it free.
- `wiki/circlists-copy-voice.md` — governs every copy string added below.

## Recent changes

- `app/subscriptions.jsx:~250` — `DormantSpace` rewritten: props are now
  `{ space, dormancy, onFund, onLeave }` (no `isChampion` / `championName`); one body, two
  dormancy states; rule line; `window.SupportLine` as the contact door (asleep only — gating
  it on `!suspended` was the verifier's one defect fix); Leave button.
- `app/spaces.jsx:~196` — new `FUNDING_MARKERS`, `circFmtDay()`, `fundingStateLine(f)` above
  `MembersSurface`.
- `app/spaces.jsx` `MembersSurface` — new props `onCancelFunding`, `onLeave`; derived
  `unchampioned = !space.champion`, `funding = space.funding || {state:'active'}`; marker is
  now state-driven (icon only on `active`); one state line beneath the marker; Cancel funding
  calls `onCancelFunding` (confirm) instead of deep-linking; no-champion statement replaces
  the crown line; Leave-slot block (champion statement vs Leave control) after the funding card.
- `app/spaces.jsx` `AccountSettings` — new prop `onDeleteAccount`; new `DeleteAccount`
  component rendered in both the SSO and password branches, before `SupportLine`.
  `SupportLine` is now exported on `window`.
- `app/feed.jsx:~390` — `CONFIRM` map gains `leave`, `cancel-funding`, `delete-account`.
- `app/main.jsx` — `leaveSpace(id)`, `deleteAccount()`; `onConfirm` switches on the three new
  kinds; `beginRefund` comment de-roled; `onCheckoutSuccess` refund branch clears
  `funding` + `openUntil`; new props wired to `MembersSurface`, `AccountSettings`, `DormantSpace`.
- `app/config.jsx` — `withSpace(prev, id)` reseeds when a staged circle was left;
  `stageFunding(funding)`, `stageNonChampion()`, `stageNoChampion()`; Dormant group relabelled
  (no role language); new Members & funding entries.
- `CHANGELOG.md:6` — one entry, "Champion exit — the remedy belongs to every member".

## Learnings

- **State shape additions** (per circle, all optional): `funding: {state:'active'|'ending'|
  'retrying', endsAt, retryWindow}`, `openUntil: ts`, and `champion: null` for the
  unchampioned window. Absent `funding` reads as active, so no seed migration and no
  `STATE_KEY` bump was needed.
- **JSX text does not process `\u` escapes.** A `\u2019` typed into JSX *children* renders
  literally. Curly quotes inside JSX text must be the real character; escapes are only safe
  inside JS string/template literals. This cost one round trip.
- **`str_replace_edit` on a multi-line style-object opening** silently swallowed the rest of
  that opening when the replacement stopped short of it — the crown-line `<div>` lost its
  first two lines and the file only failed at Babel-parse time. Match whole JSX openings.
- Worth adding to `GOTCHA.md` (needs the user's approval per CLAUDE.md): the JSX-escape trap.
- `save_screenshot` with `steps[]` drives the live preview reliably; `multi_screenshot`
  failed to find `.circ-config-btn` mid-run. Fixed dialogs capture at document coordinates,
  so scroll to top before capturing one.

## Artifacts

- Changed: `app/subscriptions.jsx`, `app/spaces.jsx`, `app/feed.jsx`, `app/main.jsx`,
  `app/config.jsx`, `CHANGELOG.md`.
- This handoff. No new files in `app/`.

## Action Items & Next Steps

### The review list — surfaces to verify, one at a time

Each row is one screen. Reach them from **Config** (bottom-left) unless stated. Reset via
Config → *Seed data → Reset to seeded data* between passes if state drifts.

| # | Surface | How to reach | What to check |
|---|---|---|---|
| 1 | Dormant circle | Dormant circle → *Dormant circle* | Asleep, Fund, rule line, support address, Leave. **No name anywhere.** Reworked and approved — see appendix 2; re-check at 320 as well as phone and desktop |
| 2 | *(removed — see appendix)* | — | The role-shaped A/B pair was collapsed to one entry |
| 3 | Fund from dormant → checkout | #1 or #2, press Fund | Existing re-fund wizard, then the circle opens with **you** as champion |
| 4 | Suspended circle | Dormant circle → *Suspended by us* | Suspended, reason funding is absent, **Get in touch only** — no Fund, no Leave, no second contact route |
| 5 | Members — non-champion | Members & funding → *Members — non-champion* | Crown line intact; **your own roster row carries a "…" menu** holding *Leave this circle* — no other row has one, and there is no Leave button on the page (see appendix 3) |
| 6 | Leave confirm + landing | #5 → Leave | Names what does not come back; on Leave the circle leaves the switcher and you land in Backend Pod |
| 7 | Leave from the dormant screen | #1 → Leave | Same confirm, reachable with no settings route |
| 8 | Members — champion (you) | Members & funding → *Members — champion (you)* | Funding card marker **Active**, no state line; **nothing after the funding card but the support address** — no Leave, no role statement (see appendix 3) |
| 9 | Funding — ending on a date | Members & funding → *Funding — ending on a date* | Marker **Ending** + one line: date, goes dormant then, next funder champions it |
| 10 | Funding — payment failed | Members & funding → *Funding — payment retrying* | Marker **Payment failed** (text, no colour/symbol alone), one line, retry window as a **duration**; both buttons live; nothing else on the card changed |
| 11 | Cancel funding confirm | #8/#9/#10 → Cancel funding | Names the cost before the provider; **Cancel / Continue**; dismissing changes nothing; Continue reaches the provider deep-link |
| 12 | Circle with no champion | Members & funding → *Circle with no champion* | Statement where the crown was (nobody champions it, open-until date, any member may fund after); **no invite, rename, funding card, and no kebab on anyone else's row**; your own row's "…" → Leave is present |
| 13 | Feed of an unchampioned circle | #12 → back arrow | Reading, adding, reacting all still work |
| 14 | Account — delete control | Account → *Change email & password*, scroll | **Delete your account** as the last control, no new section |
| 15 | Delete-account confirm | #14 → Delete your account | No circle named or counted; funding consequence; points into circle settings; lands on sign-in |
| 16 | Account via SSO | Account → *Email & password via SSO* | Delete control present there too |
| 17 | App posture, payments off | Config → Platform: Mobile, then #1 → Fund | Finish-on-web handoff, not checkout |
| 18 | App posture, the new surfaces | Platform: Mobile, then #5, #10, #12, #14 | Identical content in the native chrome — no per-posture fork |

### After the review

1. ~~Steer or keep "Retrying" as the marker word.~~ Settled — appendix 4.
2. ~~Steer or keep sign-in as the resting place after account deletion.~~ Closed — appendix 5.
3. If approved, add the JSX-escape trap to `GOTCHA.md` (user approval required).

## Other Notes

- `docs/specs/lm-626-champion-exit/` holds no `PROMPT.md`; the brief arrived pasted in chat.
- Verifier pass (2026-08-03) drove all new states: console clean, tokens resolve. It found one
  defect (duplicate contact route on the suspended screen — fixed) and one advisory
  (Cancel/"Continue to cancel" ambiguity — the primary is now **Continue**).
- Deliberately NOT done, per the brief: no announcement to the outgoing champion when someone
  else funds; no disabled controls anywhere; no variant sets.

---

## Appendix — 2026-08-03, later: the dormant screen goes back to the drawing board

Added after the review above was written. **Read this before touching the dormant screen.**

### What the user said

1. **One dormant screen, generic.** Config carried two dormant entries ("you funded it last" /
   "someone else did"). That pair was mine, not the product's: an A/B I used to prove the role
   branch was gone. It implied two forms of a screen that has one. **Collapsed to a single
   *Dormant circle* entry** in `app/config.jsx`. Do not reintroduce the pair.
2. **The screen itself is a bloat/organisation failure.** It was not great before LM-626 and
   this work added to it. The verdict, verbatim in substance: every piece of *content* on it is
   correct — the problem is the **amount of bloat, the chaos, and the lack of beautiful
   organisation**. Specifically named: the eyebrow ("ASLEEP" — unsure about it, tolerable, but a
   problem in the context of the bloat); a heading, then a subheading carrying a fair bit of
   information; **three affordances of three different kinds** (Fund, support, Leave) with no
   mindful nuance to how they should rank; and the succession rule as a further floating
   paragraph — correct information, badly placed.
3. **Terminology.** The code standardised on *dormant*; the UI says *asleep*. The user is
   "all right with retaining asleep, but not quite sure" — an open question, not a decision.
4. **Permission to rework it entirely**, starting from a **whiteboard playground** (no config)
   carrying **three versions to react to**, because it needs a fundamental think.
5. **Steer towards the frozen.** Whatever we pick has to have synergistic UX with the frozen web
   posture — so it must hold at desktop and phone with no per-posture edit.

### What was built for it

- `whiteboard-playground.html` (project root) — the rig. Static candidates, no config, per
  `PLAYGROUND.md`'s whiteboard shape. Each candidate is mounted inside the **real `AppShell`**
  (rail, top bar, canvas) so the comparison includes the chrome that already names the circle;
  mobile read in the app's own phone frame, desktop read unframed at 560px.
- `docs/specs/lm-626-champion-exit/pg-wb-dormant.jsx` — the three candidate bodies.
- `docs/specs/lm-626-champion-exit/pg-wb-board.jsx` — board frame, pitches, and the **cost** of
  each direction, plus how each degrades to the **suspended** state.

**The three directions**

- **A — One sentence, one action.** Seven blocks → four. Eyebrow gone (the sentence says the
  state); the big circle name gone (the top bar already says it — the duplication nobody had
  named); the rule folded into the body sentence. Leave + contact leave the centred column and
  sit as a quiet footer, so hierarchy comes from **distance**.
- **B — The state as an object.** The screen becomes one thing you can act on, reusing the
  funding card's shipped grammar (name + textual marker + one line + action). Named inside the
  object, so nothing repeats the top bar.
- **C — Ranked, each thing bound to what it serves.** A real hero, nothing floating: the rule
  becomes the button's own micro-caption (the funding page's existing pattern), and the two
  secondary doors collapse into **one grey sentence with the links inside it** (the product's
  existing door construction). Three affordances of three kinds → one button + one sentence.

### Where this leaves the build

`app/subscriptions.jsx`'s `DormantSpace` is **still the LM-626 version** — correct in content,
under review for organisation. Nothing was changed in `app/` for the whiteboard. The user is
due to react to A/B/C; expect the answer to be a hybrid, and expect the eyebrow and the
asleep/dormant wording to be settled at the same time.

### Next action for a fresh session

1. Open `whiteboard-playground.html` and read the three captions.
2. Take the user's reaction, then rework `DormantSpace` **once** — no variant sets in `app/`.
3. Carry the chosen skeleton to the **suspended** state in the same pass (each caption states
   how that direction degrades), and re-check rows 1, 4, 7 and 17 of the review list.
4. `CHANGELOG.md` needs **no** new entry for the rework: the shape landed on 2026-08-03; this
   is organisation of the same step. A playground never earns an entry.


---

## Appendix 2 — 2026-08-03, later still: the dormant screen, resolved and shipped

Supersedes appendix 1's "expect a hybrid". **Read this before touching the dormant screen.**

### What shipped

Whiteboard direction **Di**, rebuilt on round three's structural findings.

- **Copy.** "This circle is asleep." / "Its funding ran out. Everything in it is still
  here." / caption: "Any member can fund it. Whoever funds it next champions it."
  The headline states the state, the subheading names the **cause** — without it, Fund
  reads as an upsell rather than a repair, which is what made the old screen feel evasive.
  Suspended trimmed to match. The eyebrow and the circle name in the heading stay gone.
- **Actions.** Fund (primary) + **Leave (`destructive-secondary`, a new Button variant:
  the house secondary box with the danger colour in the label)**. Row when the canvas has
  room, Leave **left** of Fund; stacked with **Fund on top** when it does not.
- **Leave's dialog.** The shipped `ConfirmDialog kind="leave"`, copy rewritten to the
  Remove-a-member dialog's shape — three beats, primary verb only ("Leave"). Circle
  settings' Leave uses the same dialog. *(Amended by appendix 3: settings' entry point is
  no longer the same **button** — the dialog is what stays identical.)*
- **The support address** is alone at the foot of the canvas. Never in a row with a button.

### Where it lives

`app/subscriptions.jsx` (`DormantSpace`), `app/primitives.jsx` (the variant),
`app/feed.jsx` (`CONFIRM['leave']`), `app/spaces.jsx` (settings' Leave control),
`circlists.html` (`.circ-dormant-*` + the variant's hover). No `CHANGELOG.md` entry:
the shape landed on 2026-08-03 and this is organisation of the same step.

### Learnings — the four that cost the most

1. **An unboxed control cannot sit in a stack with a boxed one.** A tertiary Leave's 52px
   target is ~18px of empty box above and below the label, so *equal gaps look unequal*
   next to a filled button — and hover paints that box, exposing the discrepancy. Negative
   margins "fixed" the resting state and broke the hover state, because they make the
   layout lie. **Give the control a real box instead.** Fill still outranks outline, so
   ranking survives; this is why the secondary won the argument over the tertiary.
2. **Inline styles beat CSS rules.** `Button` writes `background` inline from its variant
   map, so every variant hover rule in `circlists.html` needs `!important` — a plain rule
   silently does nothing. This is why the existing variants all carry it.
3. **A forced `ch` measure invents line breaks.** Capping the subheading at 28ch split it
   into two stranded fragments on a canvas with 400px to spare. Let the column be the
   measure; break only where the text genuinely runs out of room.
4. **A posture attribute is not adaptive design.** Keying the row/stack switch off the
   global `data-circ-posture` flag made the screen work at the two widths that were looked
   at and nowhere else. The screen now uses a **container query** on `.circ-dormant`
   (row at ≥520cqi) and `cqi` type scaling, so it holds at 320, in the app frame, and on
   any desktop canvas — one component, no per-posture edit. **Prefer this pattern for new
   shared surfaces.**
   Verified by probe, not by eye: 906 → row, 32px headline, subheading one line; 402 →
   stack (Fund on top), 28px, one line; 320 → stack, 23px, subheading breaks at the
   sentence. Both buttons 52px with a literal 12px gap.
5. The JSX `\u` escape trap from the main handoff **bit again** in a playground module.
   Real characters in JSX children; escapes only inside JS string literals.

### Copy voice — a rule I broke

`wiki/circlists-copy-voice.md` bans narrowing to "read" (format-neutral: articles, videos,
podcasts) and bans naming the mechanism ("links"). A draft subheading said "nobody can add
or read" — both rules, one line. **Read that file before writing product copy**; the
current lines avoid mechanism and format entirely.

### Playgrounds

- `whiteboard-playground-v2.html` + `docs/specs/lm-626-champion-exit/pg-wb2-{dormant,di,d,board}.jsx`
  — round two: D/E/F/G, the red-weight strip, the wording strip, and Di resolved.
- `whiteboard-playground-v3.html` + `pg-wb3-{dormant,board}.jsx` — round three: the four
  faults named, three architectures (H/I/J) at 320 / 402 / desktop. **J (the exit moves
  into the chrome) was not taken but is the cleanest answer if the canvas ever needs to
  hold only the state and the remedy.**

### Still open

- The caption under the actions is the last unbound element on the screen. If it ever
  reads as litter again, the fix is binding it to the button (round three, direction I),
  not respacing it.
- Three `GOTCHA.md` candidates now, all needing the user's approval per `CLAUDE.md`:
  the JSX escape trap, the inline-style/`!important` trap, and the unboxed-control
  spacing trap.

---

## Appendix 3 — 2026-08-03, later still: leaving moves onto your own roster row

Out of order relative to the review list, taken on the user's call. **Amends appendix 2's
"the act looks identical wherever you meet it" and review rows 5 and 12.**

### What changed

Circle settings' `destructive-secondary` **Leave this circle** button is gone. A
non-champion now leaves from a **"…" menu on their own roster row** — the same kebab, in
the same trailing slot, that the champion already carries on *other* members' rows.

- `app/spaces.jsx` `MembersSurface` — the trailing-slot branch is now
  `memberIsChampion → crown`, `(isChampion || isYou) → kebab`, else nothing. One shared
  menu; the item is `Remove` (trash, on someone else) or `Leave this circle` (logout, on
  you). `aria-label` is **"Your membership"** on your own row, never "Manage You".
- The champion-of-a-funded-circle statement is **deleted**, not relocated. It only ever
  existed to fill the slot the Leave button left, and that slot is gone. Everything it said
  is said better elsewhere: the crown on your own roster row is the single home for the role
  (the 2026-07-22 consolidation, which this statement had quietly re-broken by putting a
  second crown and a second role statement at the foot of the same page), and the
  cancel-funding confirm carries the consequence at the moment of the act.
  **Accepted cost:** nothing now states that a champion's exit is two steps — cancel
  funding, the circle sleeps, then Leave from the dormant screen. Cancelling is not
  leaving. Judged not worth pre-announcing a departure route on a calm surface; hand-off is
  operator-arbitrated per the PRD and the support address sits at the foot of that page.
  Do not reintroduce a statement here without a new reason.
- The dormant screen's Leave is **unchanged** (a `destructive-secondary` button): that
  canvas has no roster to hang a kebab on. The `ConfirmDialog kind="leave"` is the part
  that is identical in both places, and it is untouched.

### Also settled here

- **"Asleep" is the product word; "dormant" is code only.** Four user-facing strings still
  said *dormant* and were changed to *goes to sleep* / *Asleep*: the cancel-funding confirm,
  the delete-account confirm, the funding card's `ending` state line, and the app-posture
  home row summary. Config's group label and every identifier (`dormancy`, `DormantSpace`)
  stay as they are \u2014 the split is deliberate. Grep before adding copy.
- **A confirm's dismiss button is no longer always "Cancel".** `CONFIRM` entries take an
  optional `dismiss` label (default `Cancel`). Cancel-funding uses **Back / Continue**:
  "Cancel" next to a dialog titled *Cancel this circle's funding?* names the act and the
  escape with the same word. Use `dismiss` wherever the verb collides.

- **The Ending funding card loses its buttons.** Once cancellation is scheduled there is no\n  way back in the product, so *Update payment card* and *Cancel funding* are both no-ops \u2014\n  and the \"both open this circle's subscription on our payment provider\" caveat goes with\n  them, having nothing left to caveat. Ending is now title + `Ending` marker, the state line,\n  the billing line, and nothing else. Deliberately **no** sentence saying it can't be undone.\n  If a resume route is ever built, one secondary button comes back here \u2014 not before.\n- ~~**The Ending state line drops the succession clause.**~~ **Reversed 2026-08-03 (appendix 6).**\n\n- **The funding card's fine print is cut back (OUT OF SCOPE for LM-626 \u2014 raise as its own\n  ticket).** Two stacked grey paragraphs made every state read as a wall of text. Landed:\n  the billing line moves BELOW the buttons at footnote tier (12.5 / `fg-3`), and the\n  \"both open this circle's subscription on our payment provider\" caveat is **deleted** \u2014\n  the champion set the subscription up on the provider, they don't need telling again.\n  Every state now ends on exactly one grey line. Rejected along the way, for the record:\n  demoting the billing line while leaving it above the buttons (emptied the Active card),\n  and turning the payment detail into a bordered data row (over-built). Retrying's line was\n  also rewritten to carry the stake, not just the fix: *\"Payment declined. Update the card\n  within 14 days to keep the circle awake.\"* \u2014 it now rhymes with Ending's sleep language.\n\n### Why (the red team, kept because the objections will recur)

- **A one-item menu is not a new precedent** — the champion's kebab has only ever held
  `Remove`. This reuses that shape rather than inventing one.
- **The trailing slot already means "this row's membership."** Crown states the role, kebab
  carries what can be done to it. A non-champion has nothing in that column today, so a
  single kebab on your own row reads as yours without needing a label.
- **Rank.** A red box as the terminal element of a settings page over-emphasised the rarest,
  least-wanted act. One tap deep is the correct rank for an exit.
- **Scope the menu, or it rots.** It means **your membership of this circle** — Leave,
  later perhaps Mute. Not account settings, not display name, not a dumping ground. Test
  every future item against that sentence.
- **Unreachable case, checked:** a champion of a *dormant* circle would need a kebab in a
  slot the crown occupies — but dormant routes to `DormantSpace` with `showMembers:false`,
  so `MembersSurface` only ever sees a funded champion. No collision exists.

### The champion's missing exit — reviewed 2026-08-03, deliberately left as is

A funded champion has **no exit affordance on this page and no sentence explaining why**.
Reviewed on the user's flag that it "felt weird" and **kept that way**. What it actually is:
a symmetry artefact, not missing information — every other member has a "…" on their own
row, so the champion's crown-only row reads as *forgotten* rather than *blocked*. The two
alternatives were weighed and both refused:

- **Put the statement back on the page.** Appendix 3's reasons stand: a second crown and a
  second role sentence at the foot of a page that already states the role once.
- **Give the champion's own row the same "…", with a *Leave this circle* item that opens a
  dialog explaining funding must end first.** Refused by the user: a menu item that names
  one act and delivers a dialog about another is a bait-and-switch, and the crown already
  owns that slot.

**So the route stays discovered at the moment of the act:** the cancel-funding confirm
states that champion powers end and the circle sleeps, and Leave is on the dormant screen.
The accepted cost is unchanged from appendix 3 — nothing pre-announces that a champion's
exit is two steps. Do not add a statement, a disabled control, or a kebab here without a
new reason; all three have now been argued and lost.

---

## Appendix 4 — 2026-08-03: the third funding marker is ratified

**"Retrying" is gone. The marker is `Payment failed`.**

- `app/spaces.jsx` — `FUNDING_MARKERS.retrying` is now `'Payment failed'`, and
  `fundingStateLine`'s retrying branch drops its first sentence: **"Update the card within
  14 days to keep the circle awake."** The marker carries the fact, the line carries the
  remedy and the stake — one job each, and the card no longer says the payment failed twice.
- The state key stays `retrying`, as does Config's *Funding — payment retrying* entry.
  Same split as asleep/dormant: code word, not product word. Grep before adding copy.

### Why not the two that lost

- **"Retrying"** describes what our billing system is doing, not the state of the funding —
  the only marker in the set that is an activity rather than a state, so Active / Ending /
  Retrying is three states in name and two in kind. Worse, it reassures at the exact moment
  the line asks the member to act.
- **"Card declined"** (recommended in the whiteboard, rejected on the user's objection, and
  the objection was right) is over-specific: expiry, a bank block and insufficient funds all
  land in this state without a card being declined. **A marker must be true of every route
  into its state.**
- Also weighed: *Overdue* (ledger language, points at the person), *Failing* (loudest word in
  the set on the calmest surface), *At risk* (anxiety language; calm is the floor).
- **Industry convention** was the tiebreak: Stripe's `past_due`/`unpaid` leak into most
  billing UIs, and consumer products soften them to "Payment failed" or "Payment issue".
  Standard enough to need no explanation, accurate whatever went wrong, blames nobody.

### Process note

The user asked only to be told the next item to ratify; a whiteboard
(`whiteboard-marker-word.html`, project root) was built unasked and landed as a surprise.
**Present the open decision first, build the rig when asked for one.** The whiteboard's five
candidate cards are still a fair record of the argument if this reopens.

---

## Appendix 5 — 2026-08-03: delete gets a card

**The control was transplanted, not designed.** `DeleteAccount` was a
`variant="tertiary"` with the danger colour inline, sitting on bare page ground between
the last card and the support address. Two faults:

- **A tertiary destructive is a card-interior construction.** The only other one in the
  product is *Cancel funding*, which reads as a control because a boxed secondary sits
  beside it. Alone on page ground nothing establishes it as pressable — and the mailto 20px
  beneath recruited it into the footer-link kind. The most destructive act in the product
  wore the costume of a footer link.
- **It was homeless.** Every action on this page lives inside the card that names its
  subject (*Update email* in Change email, *Update password* in Change password). Deleting
  acts on the account and the page title was the only thing that named it, so the control
  was placed by elimination.

**Landed (A of three).** Its own card, matching the two above: title *Delete account*, the
standing consequence line (see the copy split below), and a `destructive-secondary` button,
left-aligned — the cards above right-align because their button terminates a form, and
right-aligning here would put a destructive control in the slot the green primaries occupy. `var(--space-5)` spacer before it in both the
password and SSO branches, as between the other cards. Nothing invented.

**Appendix 3's objection, and why it does not transfer.** That ruling rejected a red box as
a settings page's terminal element — but it concerned a naked `destructive-secondary` on
bare ground *with a better home available* (the roster-row kebab). There is no roster row on
the account page. Inside a card that names its subject the red is contained, and rank comes
from being **last**, not from being loud. Outline, never fill.

**Not taken:** folding it into the Change password card (makes deletion a footnote to
changing your password), and a top-bar kebab — round three's direction J — which buys
consistency with the roster row by inventing chrome no settings page has today, where the
card buys consistency with the page you are standing on by inventing nothing.

### The copy split — ratified

Landed after three passes, the first two wrong in opposite directions (everything dumped on
the card; then the card starved). The rule that settled it: **the card carries what is true
for every member, the dialog carries what is true only for champions.**

- **Card** — *"Your account goes, and your place in every circle. What you added stays,
  with your name."* Standing description, no billing: most members champion nothing, and all
  of them read this. "with your name" is lifted verbatim from the Leave dialog — a communal
  library keeps its contents when a member goes, and the two exits should say so identically.
- **Dialog** — *"It can't be undone. Deleting cancels your funding — any circle you champion
  runs to the end of its paid period, then goes to sleep."* The irreversible beat, then the
  money. Naming the cancelled funding is the point: a champion needs to know the charges stop
  and that the circle is not killed on the spot. **Agentive, deliberately:** *Deleting cancels
  your funding*, never *your funding is cancelled* — the passive reads as weather, and it hid
  the fact that we end the funding for them unless they deal with it themselves. The act and
  its cost belong in one sentence.

### The gap this flow sits on top of — for the real build, not the prototype

There is **no self-serve handover**. A champion leaving cannot pass a live circle to anyone;
the only moves are cancel (the circle sleeps, whoever funds it next champions it) or
operator-arbitrated hand-off per the PRD. This is why the dialog's signpost to circle settings
was cut rather than reworded: it pointed at a surface whose only real action is the same
cancellation the dialog states. **Do not write copy that implies the circle can be saved on
the way out.** If self-serve handover is ever built, this dialog and the cancel-funding
confirm are the two places it must appear.
- **Cut from both, and it stays cut** — *"You can manage funding in each circle's settings
  before you delete."* Restored to the dialog on 2026-08-03 (child 5 of the brief asks for a
  signpost) and cut again the same day once the reason became clear: **there is no self-serve
  handover**, so managing funding yourself reaches the same outcome the funding sentence
  already states. The line offered an escape that does not exist and said the same thing
  twice, on the surface where duplication is most expensive. The agentive rewrite of the
  funding beat is what replaces it — it now names who ends the funding and when, which is the
  substance the signpost was carrying. Rewrites tried and recorded so they aren't retried:
  *"Change a circle's funding in its own settings first"* (reads as an instruction to alter
  funding; "first" floats free) and *"...from that circle's settings"* (a demonstrative
  pointing at a circle the dialog never names). **Do not reintroduce a signpost here without
  a handover route for it to point at.**
- **The rule this settles, for the card/dialog line generally:** universal + standing → card;
  conditional on a role, or only actionable at the moment of the act → dialog. A signpost is
  not exempt from that test.

### The sign-in landing — closed, not ratified

Deleting resolves to the sign-in screen, and that is where it stays. **It was never a
prototype question:** the prototype has to route somewhere on sign-out of a deleted session,
sign-in is the only signed-out surface it models, and no design decision is being expressed
by that fallback. Nothing to ratify. Do not reopen it as a prototype item.

Recorded for whoever builds the real thing, because it is a genuine product question and
this is where it was noticed: the sign-in screen's primary action is *Sign in* and its
secondary is *Create an account*, so a just-deleted account lands on a form that will now
reject it, indistinguishable from an ordinary sign-out. The cheap remedy is one quiet
acknowledging line above the card — not a screen of its own. Out of scope here.

---

## Appendix 6 — 2026-08-03: the Ending card carries succession again

**Reverses appendix 3's cut.** The Ending state line is now:

> *"Funding ends on 21 August 2026. The circle then goes to sleep, and whoever funds it
> next champions it."*

Appendix 3 removed the succession half on the grounds that the cancel-funding confirm had
already said it. That reasoning confuses a **moment** with a **state**. The confirm is
passed through once and dismissed; the card is the standing description of what is going to
happen, read by a champion days later, and by any member with settings access. Without the
clause the card says the circle ends — the sleep is a stop, not a handover — which is the
one thing the whole feature exists to contradict.

- Where: `app/spaces.jsx` `fundingStateLine`, ending branch.
- **Both clauses are load-bearing:** that the circle goes to sleep, and that **whoever**
  funds it next champions it — the second half tells the reader the remedy is open to them.
  Two one-sentence compressions were tried and both **rejected**: *"until its next funder
  champions it"* (presumes a funder appears; never says the reader could be one) and
  *"until any member funds it — and champions it"* (dash-spliced, and "sleeps until" made
  the sleep sound conditional). Leave this wording alone. It may wrap to two lines; Ending
  has no buttons and no caveat, so the room is there.
- Wording matches the cancel confirm that got you here and the dormant screen's caption —
  keep the three in step if any changes.
- No `CHANGELOG.md` entry: copy within a landed step.
