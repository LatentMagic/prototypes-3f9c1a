---
ticket: 'LM-652'
date: '2026-08-12'
topic: 'discourse-v8-playground'
status: 'awaiting-explanation'
type: 'exploration'
---

# Handoff: discourse v8 — five states built, return is wrong

**Read this section first.** The playground is built and playable. The owner
played it and found something important missed on **return / watching**. He will
explain it to you in words — do not guess at it, do not start fixing return from
this document's own reading of the gap, and do not treat my note in
"What I know is thin" below as the answer. Wait for him, then act on what he says.

Nothing in this handoff is ratified. The five states are candidates.

---

## The prompt that generated v8

Captured verbatim. This is the brief the build was made against.

````markdown
# Circlists — discourse playground v8

> Self-contained prompt for the Claude Design agent. Paste as the first message of a **new session** in the Circlists project — a playground is built beside the prototype, never into it and never in the prototype's live session. Build a **playground**, not a finished design: one page carrying five genuinely distinct states, so the product owner can play them and choose.

## What Circlists is

Circlists is a calm, communal reading queue for small trusted circles — a few people who already share links and want one shared place for them. A member shares a URL into the circle; the circle reads through a queue with two tabs, **Active** and **Read**. The library is communal (delete is everyone-delete), read-state is individual. Marking an item read triggers the shipped reaction gesture (**The Swell**) — a glyph and a spoken depth, *a little · moderately · deeply*, given on a drag pad — and a **Reaction door** on the Read-tab card lets anyone who has read the item revisit how the circle responded.

## The intent this playground serves

Three axes of distinction weigh every feature, tweak, and styling call:

1. **Simple, Lovable, Complete.** Focus that is felt, delight that is felt, genuine completeness — no surface half-finished.
2. **The superposed-state gap, and what deepens it.** Shared curation with individual reading state is the reason to exist; beyond that, whatever strengthens what a circle *is* to its members extends it. Discourse is exactly this kind of deepening: a reaction says something landed but does not close the loop — what closes it is belonging, the circle on the pulse together. That feeling is the market gap.
3. **Lightening the load.** Calm is a constraint as well as a feeling: belonging to a circle must never become overwhelming, and staying on the pulse must never become a chore. Axes 2 and 3 pull against each other, and that tension is named on every call — a state that deepens the circle while quietly loading the member is a net loss.

The guardrail: belonging must never curdle into performance pressure — no scores, no tallies, no sense that reading or responding is being counted. And Circlists is not trying to be WhatsApp or Slack: discourse here is centred in what Circlists is, a reading circle, never a messaging feature transplanted in.

## What is settled — every state obeys all of it

These are ratified rules, not suggestions. A state that breaks one is not in the spread.

- **Discourse and reactions are designed together.** Discourse is another axis of the shipped reaction, not a system beside it — a self-contained discourse panel unrelated to the Swell has already failed and is not in the spread.
- **The attached thought.** When adding a link, the contributor may attach a thought — written freely, in their own words. Optional: a bare link remains fully valid. Attaching sits within the flow of adding, never as an interruption to it.
- **The reflection.** When marking an item read, any member may leave a reflection — written freely, in their own words. Reaction and reflection are each optional, skippable independently: either alone, both, or neither are all valid. The two flow as one act: the member steers the movement between them, and nothing advances on a timeout.
- **Reveal.** The contributor's thought is public before the read — a reader may see it on the card before choosing to read. (This is the ratified default; the owner holds it as a preference rather than a law.) Another member's reflection is revealed only once you have read the item yourself.
- **The visitable record.** Any member who has read an item can return to see the circle's reactions and reflections on it. On the Read tab it is seen from the card, just as reactions are — discourse is a sibling to reactions. It is encapsulated: it never sits open on the card's face; the card carries at most a way in.
- **Conversation is open and anchored.** No rule caps how much may be said; space and bloat are managed by design, not by limiting speech. A conversation is anchored to its item — it lives only on the card, and reveal-on-read applies to it as to any reflection — and it is never free-floating messaging. A continued reflection is a reflection: speaking later is the same mechanism as speaking at read, not a second one.
- **Persistence.** Discourse lives on the card for the card's life. Nothing fades on a timer; a late reader arrives to the full record.
- **Return — watching.** A member is not left to hunt the Read tab for the cards they are part of. What a member watches is defined by their own involvement — at minimum, having contributed or reflected — never by the circle's activity at large. When a watched card has new discourse, an indication of some form leads back to the card. The indication is never a count: no unread badges, no tallies — the calm floor holds. No brand-new destination: no new tab, no new screen; small in-place elements along the way are fine. This is the first place discourse moves the user across the app, and the movement is elegant, even at MVP. One affordance for every member — never contributor-specific.

## What to ideate — the open axes

Build **five complete states**. Each state is the whole app with discourse living in it: one committed answer to every axis below, played end to end. Across the five, each axis must span genuinely different answers — five states that agree on an axis have not explored it. This is where fresh thinking is wanted: the rules above are the floor, and the room above the floor is real.

Two standing terms of the exploration, both ratified:

- **Novelty is wanted, though not required.** The bar is the Swell's own grammar — a physical gesture whose meaning is carried by how it was performed, not a form control with a feeling painted on. What is wanted is a discourse mechanism with its own felt grammar, personal and special to this app — not a text box governed by rules about when you may type.
- **No pre-filtering on taste.** A structurally distinct state that obeys the rules goes into the spread even where you expect it to be rejected — a state rejected decisively is doing work. Enthusiasm for one state multiplies it; it never narrows the other four. The spread is the deliverable, not your pick within it.

**The attached thought**
- How it is bounded — and what the bound feels like.
- The surface it lives in: the existing add popover, a redesigned popover, or mindfully another shape.
- How it presents on the card: shown whole, or indicated and opened.

**The reflection**
- How it is reached: the same screen as the reaction, or another route done well. The surface follows the context — a bottom sheet on mobile (scroll may accommodate everything), a modal or popover on desktop, the same principles throughout.
- How it is bounded.
- The shape of contribution: individual reflections · replies to the initial thought · high-level posts holding replies within.
- How reflections present to later readers — including whether the reaction's spoken depth shows with the words. The Swell's depth is real material, but integrate it only where it genuinely earns its place: no gimmicks.
- What speaking again on a later visit looks like, as the same mechanism.
- Nothing elaborate — this whole axis stays inside simple functionality.

**The record**
- The way in from the card: a separate affordance, incorporation into the Reaction door, or something more inventive. The five states must not all take the same way in.
- How the record presents as it grows — a card with two lines of talk and a card with forty must both read calm. Elegant in every case.

**Watching**
- What the indication is and where it sits: on a button, on the card, elsewhere.
- How loud it is — from a quiet mark you pass on the way, to nothing at all until you look.
- Whether a member can also mark a card as watched by hand, beyond the automatic set — build it somewhere so it can be felt, not argued.
- How cards leave the watched set as they go stale.
- The transition from indication to card — a scroll, a movement, or simply clean.
- Whether a bare reaction (glyph, no words) counts as something new.

## Dead ends — do not rebuild

Thirty-odd directions across seven rounds already died. Do not resurrect:

- **Devices that shape what a member says.** Question framings, sentence stems, pulled quotes, guided statements, matching, seats. The thought is the member's own, whole.
- **Interruption.** Second modals bolted after the reaction, forced timeouts, unreachable affordances, dead controls.
- **Waiting and exclusion.** Nothing unlocks on other people — no elapsed-time seals, no everyone-has-read gates, no publishing cadence. Nobody is capped out of a conversation.
- **Destruction.** Nothing written is overwritten or replaced.
- **New destinations.** No third tab, no stream page, no room. Set aside deliberately, on the backlog — not yours to reopen.
- **Screen bloat.** The failure of the best previous direction was not its idea but its integration: reaction, depth, and words crowding a modal off the screen. Elegance of integration is the bar.

Earlier rounds hold moments worth knowing — a record merging glyph, depth, and words behind the door; a note visible on the card before the read; replying to someone while still leaving your own line. Take them as evidence of what resonated, never as templates: this is a fresh build from the rules, not a remix of the old thirteen.

## Playground craft

- **Played, not configured.** Five complete versions of the app, one per state — a flat named list, no config levers. If reaching the variety requires configuring, the rig has failed.
- **A driver over the loop.** One button per beat — add with a thought · land as a reader · reflect · return via watching — each putting the app in that state, so the whole loop is walkable in order. The beats must also be reachable by simply using the app: every affordance works, every surface is reachable, no dead controls. Judging a direction by clicking a button that goes nowhere poisoned the last review; it cannot happen again.
- **Inhabited data.** Seed several members and cards in varied conversational states — no words yet, a first reflection, a live exchange, a full late-arrival record — so each state can be felt as reader one and as reader four.
- **The real app.** Real shell, real cards, real Swell, real Reaction door — the prototype's components and tokens, not re-implementations. The shipped app as it stands today is the reference point the five states are judged against.
- **Both postures.** Works at 1024×720 desktop and 390×844 mobile; it will be played on a phone. Viewport control: Auto / Mobile.
- **Design language locked.** Pulse Green `#047857` accent for actions and active states only; warm-paper neutrals; Inter with JetBrains Mono accent; hierarchy by size and weight, never colour; 4px grid; no emoji, ever. States vary structure and behaviour, never the theme.
- **Output.** One page, five states, switchable, high fidelity. Each state labelled: a short name, one line on the stance it takes, and one line on what that stance costs — a state without its cost cannot be steered, only admired. Published as an artifact **and** exported as a fully standalone HTML file (all dependencies inlined, zero external references) so it can be kept on disc.

## Out of scope

Do not design: rooms or streams or any new surface · a contributor-specific digest · text formatting or markup in thoughts and reflections (text-only for now; pasted links should still present decently) · uploads · editing or deleting your own words · sharing an exchange beyond the circle · member-exit and deletion consequences. All tracked elsewhere.
````

---

## What exists

`discourse-playground-v8.html` (entry, project root), modules `pg-d8-*.jsx` in
`docs/specs/lm-652-discourse/`. `discourse-playground-v8-standalone.html` is the
compiled single file — regenerate it from the entry, never edit it.

Load order (set in the entry HTML): seed-data · primitives · brand-motion ·
liveliness · pg-d8-swell · feed · shell · app-shell · then pg-d8-data · parts ·
card · add · flow · states-a · states-b · rig · app.

Five complete versions of the app on a flat named list, each with its stance and
its cost. No config levers.

| | State | Attach | Reflect | Record — way in | Watching |
|---|---|---|---|---|---|
| 1 | **Held in the disc** | popover, one line | one line beside your glyph | the Reaction door, merged | micro dot on the door |
| 2 | **The back of the card** | popover, on the card's back | on the back, in the sheet | turn the card | a folded corner |
| 3 | **Talk lifts the card** | popover redesigned, thought first, a rule that runs out | three lines, same rule | tap the thought | position — the card rises |
| 4 | **The line** | popover, behind "Attach a thought" | room set by the depth just given | a second door beside the reactions door | the door's glyph fills |
| 5 | **The card's page** | on the card's page, after adding | on the page, after the reaction | the attribution row | the card's time line says the talk's age |

Driver: four beats — add with a thought · land as a reader · reflect · return by
watching. Every beat is also reachable by hand. No dead controls; that was the
v7 defect that poisoned the last review.

## How return is currently wired

So you can see what he is reacting to, not so you can act on it.

- **Watched set.** Automatic if you added the link or spoke on it. By hand, a
  "Watching this card" row inside each state's record surface — sheet, back, or
  page — which also stands a card down.
- **New** = anything said since your `seenAt` by someone else. States 3 and 5
  set `countBareReactions`, so a glyph with no words also counts; the other
  three ignore bare reactions.
- **Driver beat.** Appends a line from Dev K. to the most-talked watched card
  you have read, then switches to Read.
- **Clearing.** Opening the record marks it seen.
- **Staleness.** Not built. Nothing ever leaves the watched set on its own —
  the prompt asked for it and it is missing.

## What I know is thin — my reading, not the answer

Flagged to him before he replied, so you know it is already on the table: four
of the five states only change something in place and then switch the tab. Only
state 3 has actual movement. The prompt says return is *"the first place
discourse moves the user across the app, and the movement is elegant"* — what is
built is indication-in-place, and the transition from indication to card is a
plain open. **He said I missed something important and that this is not it in
his words. Take his account over mine.**

## Craft notes

- **The app is mounted, not rebuilt.** Shell, app-posture shell, tabs, add
  surface, the Swell (pad, palette, glyph radiogroup, disc, roster), the door,
  the empty state, the confirm dialog, the liveliness grammar, tokens.
- **Two copies, both stamped, neither tuned.** `pg-d8-swell.jsx` is
  `app/swell-reactions.jsx` verbatim with a wider `window` export — the flow has
  to compose the Swell's internals and the shipped module keeps them in Babel
  scope. `pg-d8-card.jsx` is `FeedCard` with four call-outs to the selected
  state (`onCard` · `cardActions` · `cardWrap` · `cardMeta`), because discourse
  has to sit inside the card's border. **The real fix for the first is exporting
  those internals from `app/`** — not taken, because `app/` is not touched to
  serve an exploration. Open for a verdict.
- **Posture follows the window** (< 1024 = the app posture). The rail is docked
  at desktop width and is the Home destination on a phone. Viewport: Auto /
  Mobile, Mobile framed in the app's own phone frame.
- Seeded: eleven cards spanning no words yet · a first reflection · a live
  exchange · an eleven-line record still moving · reactions with no words · a
  bare link with no thought. Nine members.
- Selection and viewport persist to `pg_d8_v1`; reset returns to `disc` / `auto`.
- **JSX escape trap.** `\uXXXX` escapes inside JSX *text children* and string
  attributes print literally — they are not string literals. Two shipped that
  way and were fixed. Write the character directly.

## Open, for him

1. Return — awaiting his explanation. Everything else is downstream of it.
2. Whether the Swell internals should be exported from `app/`.
3. Whether state 4's depth-scaled writing room reads as felt grammar or as
   rationing speech.
4. Staleness: nothing currently leaves the watched set.

`docs/specs/lm-652-discourse/handoff-2026-08-11-discourse-v8.md` was an earlier draft of
this handoff, written before he played it; it is folded in here and deleted, so
this file is the only one.
