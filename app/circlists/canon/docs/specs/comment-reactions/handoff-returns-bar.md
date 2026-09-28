# Comment reactions reach the Returns bar — handoff

## What was built
- `app/talk-return.jsx`: `candFreshRx(item)` returns reactions others placed on turns by `You` after the card's `talkSeenAt`. Your own reaction never counts. `candBarRows` now takes a card with fresh words **or** fresh reactions, still only watched and read cards, and orders by `candBarAt` (the newest of either). `candBarSnap` rows carry `rx` (reactor names) and `glyphs` (up to three distinct, in arrival order). `candBarLine` gives each row its line, and `CandRxStack` draws the stack.
- Row line: names only, as canon (user, 2026-09-28). Every row names everyone behind what moved: repliers first, then reactors, shortened by `candNames`. The glyph stack is what says reactions were part of it. This overturns the brief's "{names} reacted" row line.
- Head: the reactors join the name list after their row's speakers. The verb stays on the head. On a phone (under 520px, or in the app posture) the head names one person, then "and others" ("Priya N. and others replied and reacted"); wider, it uses `candNames`. The verb follows what the named people did: "replied", "reacted", or "replied and reacted".
- `app/home-returns.jsx`: the Conversation preview uses `candBarAt` for its order, `candBarLine` on the metadata line ("Backend Pod · Ada L. reacted"), and the same stack before the chevron.
- A staged state can open the bar with the `cand-bar-open` window event.
- Clearing is unchanged. Opening the card or pressing Clear moves `talkSeenAt`, which clears reactions too.
- No push. Reactions still never go through `candAddTurn`, and the push code does not read `candFreshRx`.

## Seed (Backend Pod, `app/talk-data.jsx`)
- ACM postmortems card (`@fixture returns-bar-three-reactors`): the mark is now 3h ago. Priya, Marcus and Lena reacted to your reply ac3 with three different glyphs, so it is a reaction-only row.
- "On Naming Things You Later Regret" (`@fixture returns-bar-one-reaction`): new short thread. Sam comments, you reply, and Sam reacts to your reply. It is watched and is a one-reaction row.
- go.dev pipelines already carried reactions on your gp4 after the mark, so it is the words-and-reactions row.
- The state key was bumped to `circ_state_v14` so returning visitors get the new seed.

## Staged state
`?state=returns-bar-reactions`: Backend Pod on the Active tab, bar open. It shows jvns.ca (words only), FormerMember (one reaction), ACM (three reactors) and go.dev pipelines (both). errors-are-values and the runbook are quietened for this state only.

## Yours to decide — what I chose
- **Stack container: bare glyphs.** This follows the owner's lean. The pill is a control on a comment, where it opens "who reacted". In a row the whole row is the control, and a bordered pill inside a button would read as a second target. The glyph sizing is the pill's own (14px in 16px boxes, −2 overlap), so the two read as the same object.
- **Home preview:** the same line and stack. The stack sits before the chevron, vertically centred, outside the clipped text. The metadata line keeps the circle first, then names only, as the bar's rows.
- **Taken back or swapped:** the stack shows only what stands now. A swap keeps its original time and shows the new glyph. A reaction-only row with nothing left drops out. Nothing records that a reaction was ever there.

## Unresolved
- The brief's image (`returns-bar-with-reactions.png`) did not arrive, so it was not consulted.
- The "both" row (go.dev pipelines) has Ada as both replier and reactor, so it reads like words-only. A seed tweak giving the reactions to people who did not reply is proposed, not applied.
- With the default seed, Backend Pod's bar holds six rows and home shows "More in the circles below."

## Next
Decide the seed tweak above, then look at 320px with a three-glyph stack beside a long title.
