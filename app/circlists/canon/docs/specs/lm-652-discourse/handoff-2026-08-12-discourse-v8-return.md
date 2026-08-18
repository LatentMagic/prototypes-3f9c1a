---
ticket: 'LM-652'
date: '2026-08-12'
topic: 'discourse-v8-return'
status: 'in-progress'
type: 'exploration'
---

# Handoff: discourse v8 — return built out, six states, awaiting his play

## Current Focus

**He has not played any of it yet.** The whole session was building; the verdict
is outstanding. Next session's job is to take his reactions and turn them into
eliminations — not to build more, and not to decide anything. Ratification is
strict here (`CLAUDE.md`, `discourse-pack/07-working-with-me.md`): present,
recommend, stop.

Two verdicts are wanted, and they are separate:

1. Which of the five states' own **return** mechanisms survive (states 1–5).
2. Which of the sixth state's five **circle-level** affordances survive
   (6.1–6.5) — the "wherever you are in a circle, how does it reach you"
   question.

Everything below is background.

## Task(s)

### The gap he named (this is the thing the previous handoff was waiting on)

The prior agent built only half of return: **the mark** — a watched card says
something was said on it. His point, in his words: a mark only works if you are
already looking at the card, and the Read tab **silts up**. A fortnight in, the
card you were part of is a hundred down and you cannot find it. So the missing
half is **retrieval** — something that gathers the watched cards with something
new and carries you to one, clearing as you arrive.

Note for the record: the previous handoff's own theory (that four of five states
only change something in place then switch tabs) was **not** it, and he said so.
The defect was a missing half of the feature, not a weak transition.

He also gave latitude on the boundary: a new screen **may** be appropriate;
minimal is better.

### Built — retrieval in all five original states

| # | State | Retrieval | Where | Loudness |
|---|---|---|---|---|
| 1 | Held in the disc | sticky pill under the tabs on Read carrying the new glyphs; tap and the feed **travels** to the next moved card, tap again for the one after | feed head | quiet |
| 2 | The back of the card | changed cards **held out of the pile** as a stack of card edges; open it and Read filters to those until you put them back (set frozen on open) | feed head | quiet |
| 3 | Talk lifts the card | nothing anywhere — moved cards already at the top of Read under a "still moving" label, closed by the app's own `FeedDivider` | the order | silent |
| 4 | The line | sticky strip on **both** tabs speaking the newest line by name; opens the full list; a row goes straight into that card's record | chrome | loud |
| 5 | The card's page | doorway on **both** tabs → a small screen of the pages still moving; each leaves as you visit it | its own screen | a destination |

All clear on arrival, none counts anything, all reachable by hand.

### Built — the sixth state, `Return, on its own`

A deliberately **neutral** app (verdict taken, he deferred to me): plain thought
on the card, reflection at the read, record behind the shipped door, and
**nothing on the card carrying a mark**. Every signal is circle-level, so the
five are judged against each other and against the app's real chrome.

The one state with a switcher; the switcher lives in the **rig's rail**, never
in the app.

- **6.1 On the circle's name** — a mark portalled into the top bar ahead of the
  gear; opens what's moving. *Costs: the top bar was status-only by design, and
  it now competes with the gear for the same corner.*
- **6.2 On the Read tab** — the tab carries the mark; going to Read *is* the
  journey (moved cards gathered at top, under the waterline). *Costs: can only
  ever say "something is on Read".*
- **6.3 On the settings gear** — mark on the gear; what's moving lives at the
  head of circle settings. *Costs: the liveliest thing behind the dullest door.*
- **6.4 The card comes back** — no mark; the card returns to **Active** while
  the circle is talking, and leaves once you've been in. *Costs: overloads what
  Active means; can read as the app undoing your progress.*
- **6.5 On the arrival pill** — the app's own New pill carries talk as well as
  links. *Costs: one signal, two meanings — the first break in the liveliness
  grammar.*

### Built — the three things he flagged alongside

- **Affordance pass.** State 5 had deleted the card's normal action button and
  put the way in on the "3w" timestamp; state 3 had removed its door entirely.
  Both now carry a real control in the card's own action row. The attribution
  row stays a second, larger target on 5; "spoke 3h" stays as its signal.
- **Circle settings is live in every state**, mounting the app's real
  `MembersSurface` (`app/spaces.jsx:217`) — he was explicit: don't make one up.
  It was previously rendered but **dead** (`showMembers={false}` greyed the
  gear). This materially changes the read on 6.1 and 6.3.
- **Seeded for scale.** Twelve extra read cards (`D8_SILT`) so Read actually
  silts; two more watched cards given new talk, one of them watched **by hand**
  so the manual watch path is felt. Four cards now sit in the gathered set.

### Built — rig craft

- Rail rebuilt to the new `PLAYGROUND.md` rules 10 and 11: **number + name on
  the face**, stance/return/cost behind a per-row chevron, one open at a time.
  States are 1–6; the sixth's variants are 6.1–6.5 so they can be named aloud.
- Driver beat renamed **"Someone speaks"**: two members speak and it **leaves
  you where you are**, so you can judge whether a state would ever reach you.

### `PLAYGROUND.md` — reflection he asked for, and ratified

Six new non-negotiables (8–13), one fix, two prunings. See Recent changes.

## Critical References

- `PLAYGROUND.md` — rules **8–13** are new and were written from this session's
  own failures; rule 8 (live-or-absent controls) and rule 13 (seed for the
  problem) are the two that were actually breached here.
- `CLAUDE.md` + `discourse-pack/07-working-with-me.md` — ratification is strict,
  and elimination beats generation with this owner.
- `docs/specs/lm-652-discourse/handoff-2026-08-12-discourse-v8-playground.md` — the
  prior handoff, carrying the **verbatim v8 prompt**. Still the brief. Its
  "What I know is thin" section is superseded by the Current Focus above; the
  two files probably want folding, but that is his call, not the next agent's.

## Recent changes

**New**
- `docs/specs/lm-652-discourse/pg-d8-return.jsx` — the five retrieval surfaces plus the
  shared model (`d8Wanted`, `d8NewSaid`, `d8Title`).
- `docs/specs/lm-652-discourse/pg-d8-six.jsx` — the sixth state, its five variants, the
  `D8Dot` control decorator, `D8InHeader` portal, `D8MovedList`,
  `D8SettingsTop`.

**Changed**
- `pg-d8-app.jsx` — `variantId` state + persistence; `wanted`/`pulled`; `goTo()`
  travel (scroll + wash + mark seen at 1700ms); `st.arrange()` override;
  `st.cardTab()`; the members route mounting `MembersSurface`; `showMembers`
  turned on in both shells; re-key scoped to `keyedContent`.
- `pg-d8-rig.jsx` — rewritten: numbered rows, disclosure, nested variant list.
- `pg-d8-states-a.jsx` / `pg-d8-states-b.jsx` — `ret` copy, return slots,
  affordance fixes on states 3 and 5.
- `pg-d8-card.jsx` — exports `d8DeriveTitle` / `d8HostOf`.
- `pg-d8-data.jsx` — `D8_SILT` + `d8Silt()`; new talk on jvns.ca and
  errors-are-values (the latter `watched: true`).
- `discourse-playground-v8.html` — loads `app/spaces.jsx`, `pg-d8-return.jsx`,
  `pg-d8-six.jsx`; hover/focus CSS for the new affordances.
- `PLAYGROUND.md` — rules 8–13 added; the "re-key the app" bullet corrected to
  say **content only, never the rig's chrome**; Traceability cut to one scoped
  paragraph; the Auto+override config section scoped to "only where the rig
  genuinely has levers"; a Wiring note that an asset-bound playground should be
  exported as **pure HTML** (compile the JSX with the page's own Babel, drop the
  transpiler).

## Learnings

- **Re-keying the whole tree remounts the rig.** `key={stateId + ':' + variantId}`
  wrapped the shell, so every pick remounted the rail and reset its scroll — the
  reviewer was thrown back to the top of the list each time. Key the app content
  only. Now captured in `PLAYGROUND.md`.
- **A greyed control hides a constraint.** The dead settings gear made 6.1 and
  6.3 unjudgeable without anyone noticing. Rule 8.
- **A signal without retrieval is not a feature.** The whole cause of this
  session. Rule 9.
- **`\uXXXX` in JSX.** Valid inside a JS string literal; prints **literally**
  inside JSX text children and string attributes. Bit again this session on an
  `aria-label`. Write the character directly.
- **`eval_js_user_view` reads the user's tab, not the agent's iframe** — it
  returned a different circle entirely mid-session. Drive the agent's own
  preview with screenshot code steps instead.

**GOTCHA.md candidates — not added, needs his approval per `CLAUDE.md`:** the
JSX `\uXXXX` trap, and the re-key/rig-remount trap.

## Artifacts

- `discourse-playground-v8.html` (entry) + `docs/specs/lm-652-discourse/pg-d8-*.jsx`
- `discourse-playground-v8-standalone.html` — regenerated, current. Compiled
  output: never edit, always regenerate from the entry.
- `PLAYGROUND.md`

## Action Items & Next Steps

1. **Take his verdicts** on 1–5 and 6.1–6.5. Eliminate; do not generate. Put
   kills to him one at a time — that is what worked before.
2. **Staleness is still unbuilt.** Nothing ever leaves the watched set. The
   original prompt asked for it. Open since the last handoff.
3. **Swell internals** are copied into `pg-d8-swell.jsx` rather than exported
   from `app/swell-reactions.jsx`. Still open for a verdict; `app/` was not
   touched, correctly, to serve an exploration.
4. **State 4's depth-scaled writing room** — felt grammar, or rationing speech?
   Unanswered.
5. **Pure-HTML export of the standalone** — offered, he has not taken it up. The
   rule is written into `PLAYGROUND.md`; the conversion itself is not done.
6. **Product intent → a doc.** He wants the three axes from the v8 prompt
   (Simple/Lovable/Complete · the superposed-state gap · lightening the load)
   captured somewhere durable and linked from `PLAYGROUND.md`. My
   recommendation was `docs/ABOUT.md` over the PRD, since he said the PRD goes
   stale. **He deferred this explicitly — "don't worry about the PRD-type stuff
   just yet."** Do not do it unprompted.

## Other Notes

- **Nothing in this session is ratified.** No `CHANGELOG.md` entry was added and
  none should be — this is exploration, and `app/` is untouched.
- He values the playground craft itself highly and named four things that work:
  use of space, the viewport control, how config is shown, and detail on demand.
  The rail rebuild came from the last of those.
- Read the copy voice (`wiki/circlists-copy-voice.md`) before writing any string
  that lands in the app.
- Do not resurrect the dead ends listed in the prompt: devices that shape what a
  member says, interruption, waiting/exclusion, destruction, new destinations
  beyond what is already in the spread, screen bloat.
