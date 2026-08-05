---
date: '2026-08-05'
topic: 'discourse-v6'
status: 'for-review'
type: 'ideation'
---

# Discourse v6 — mechanisms, not treatments

v5 was rejected, and the rejection is correct. Verdict, in the user's words:

> "the only thing that is there is that you came up with five to ten tweaks of how to present a quote. You didn't ground at all with what was trying to be achieved… is there something special and interesting and novel and surprising about the way that you provide your thoughts? Like how the reaction is brave too. That, for me, has been missed."

v4 needed ten typographic treatments because v2/v3 had shipped one generic line twelve times. v5 read that instruction forward into a round where it no longer applied and produced seven more ways to set a sentence. **Typography is now solved and is not the question.** This round varies the *system*: what the act of contributing is, when it is possible, what it costs, what it produces, and how it stands with the reaction primitive that already ships.

No JSX here. Nothing built. This document is the thinking that was missing.

---

## Part 1 — Grounding

### What discourse is for in this product

Circlists is a **communal library with individual read-state** ([`circlists-positioning.md`](../../../wiki/circlists-positioning.md)) — one shared queue, each member keeping their own place. Its emotional target is three moments: *confident release* (giving a link), *quiet cohesion* (receiving what the circle shares), *composed relief* (clearing what's read) ([`docs/ABOUT.md`](../../ABOUT.md)).

The original brief names the hole precisely:

> "as a contributor you want to attach a thought to what you share ('why this mattered to me'); as a consumer you want to respond… A reaction says something, but it does not feel enough; it does not close the loop. What closes it is the feeling of belonging — collaborative, on the pulse together, like a family."
> — [`PROMPT.md`](PROMPT.md)

So discourse is not a communication feature. It is the mechanism by which **reading alone becomes reading together**. The members are never in the room at the same time — they read on their own commutes, days apart. The product's whole job is to make that staggered, solitary activity feel joint. Reactions already carry *that it landed*. Discourse must carry *what it did to you*, and must carry it across time gaps of days without anyone having to be present.

That framing generates the success and failure tests.

**It succeeds if:** opening the app after being away feels like arriving somewhere inhabited, not like finding a backlog. Contributing feels like an offering — deliberate, slightly exposing, worth having made. The record of an item, read cold in six months, tells you what the circle made of it. And a member who never writes a word is not thereby a lesser member.

**It fails if:** the card grows. Reading the feed becomes reading a conversation. There is ever an unanswered thing with your name on it. Writing becomes the way to be visible in the circle, so not writing becomes a way to be invisible — that is a scoreboard, and calm is the floor. Or: it becomes so ceremonial nobody uses it, and the feature is a dead surface.

The last two are a **vice**, not a spectrum with a safe middle. Cheap contribution bloats and creates performance pressure. Expensive contribution goes unused. Every mechanism below is, at bottom, a different resolution of that vice — which is why "how it is set on the card" was never going to be the variable.

### The constraints, sourced

Binding, from the repo — not restated as preference:

- **Calm is the floor.** "Avoid anxiety, performance pressure, FOMO by design" ([`CLAUDE.md`](../../../CLAUDE.md)). Reinforced in the brief as "no unread-count badges, no notification pressure, no kudos tallies" ([`PROMPT.md`](PROMPT.md)).
- **Reveal-on-read.** "another member's thought, reaction, or response on an item is not revealed to you until you have read the item yourself" ([`PROMPT.md`](PROMPT.md), Settled).
- **Communal library, individual read-state.** "Delete is everyone-delete, not private dismissal. No 'who read it' signals" ([`CLAUDE.md`](../../../CLAUDE.md)). This is the structural moat ([`circlists-positioning.md`](../../../wiki/circlists-positioning.md)) — no mechanism may collapse it into shared state.
- **No comment threads.** "threaded, open-ended discussion is deliberately parked. No option builds a thread" ([`PROMPT.md`](PROMPT.md)).
- **Not WhatsApp or Slack.** "Discourse here is centred in what Circlists is — a reading circle — not a messaging feature transplanted in" ([`PROMPT.md`](PROMPT.md)).
- **No emoji, ever** in product copy ([`CLAUDE.md`](../../../CLAUDE.md)). The Swell's five glyphs are the one scoped exception, declared in [`app/swell-reactions.jsx`](../../../app/swell-reactions.jsx): *"the reaction vocabulary being prototyped — deliberate, scoped to this feature; not general product decoration."* No mechanism may spread emoji beyond that vocabulary.
- **Locked palette.** Accent `#047857` for primary actions, active states, focus rings only — never status, never decoration; destructive `#991B1B` only; page `#FAFAF7`, surface `#FFFFFF`, sunken `#F5F5F2`. "Hierarchy via size and weight, never colour." 4px grid, readable from 320px ([`CLAUDE.md`](../../../CLAUDE.md), [`PROMPT.md`](PROMPT.md)).
- **Sharing before reading is a valid register**, never punished ([`PROMPT.md`](PROMPT.md)).
- **URLs only** — the atomic unit is a URL; no notes-as-items, no files ([`docs/ABOUT.md`](../../ABOUT.md)). A thought is always *attached to* an item; it is never itself an item. (One mechanism below, **The Handing On**, deliberately tests this line.)
- **Circle cap is 10** (champion + 9) ([`circlists.md`](../../../wiki/circlists.md)). Every "one per member" mechanism therefore has a hard ceiling of ten voices, which is what makes per-member scarcity structurally safe rather than a policy.
- **Three postures, one core.** A shared surface change lands in all three with no per-posture edit ([`ARCHITECTURE.md`](../../../ARCHITECTURE.md)). Nothing here may need a desktop-only affordance.
- **Buildable in the playground.** Directions render as React components against a fixture set, mounting the real card and the real `SwellReactionFlow` ([`PLAYGROUND.md`](../../../PLAYGROUND.md)). Every mechanism below is expressible as fixture state plus a component; none needs a server or real time passing (time-based ones are driven by a beat button).

### What the reaction primitive already does

This matters more than anything else in this document, because four of the client's six questions are really *"why isn't this just the reaction again?"* From [`app/swell-reactions.jsx`](../../../app/swell-reactions.jsx):

- A reaction is `{ name, glyph, intensity, nx, ny }`. Five glyphs — heart, fire, thumbs-up, bulb, laugh — are **the whole alphabet**.
- **Intensity is 0..1 and means depth**, quantised to three spoken rungs: *a little / moderately / deeply*. It drives both glyph size and distance from centre. So the primitive already encodes **magnitude**, not just kind.
- **Position is free.** A committed drag stores `nx, ny`; absent that, position derives from glyph direction + intensity + a stable per-name jitter. The disc is a **constellation**, not a tally.
- **A skip is first-class**: read, no note — `{ name, skipped: true }`. It appears in the roster, never on the disc, always last, as an empty ring, *"same name, same weight as any reaction; only the mark differs."* Silence is already a designed, dignified state.
- **The reveal is passive and gated**: you react, then you are shown how the circle landed. `SwellDoor` on a Read-tab card reopens the record permanently.

So the reaction primitive **already delivers**: that it landed, how hard, in what register, by whom, as a shape rather than a count, revealed only after your own read, and with a dignified way to say nothing.

Two consequences bind the whole set:

1. **A short word attached to a reaction is not new.** Direction 09 in v4 already did it. Any mechanism whose only content is "the glyph, plus a word" is a treatment, not a system. It has to change *when* or *whether* or *at what cost* you may speak.
2. **The reaction is the honest baseline of bravery.** The client's phrase — *"how the reaction is brave too"* — points at something real: committing a glyph at a depth, in public, with no hedging, is a small exposure. It is brave because it is **unqualified and unretractable**, not because it is effortful. That is the property discourse must match. A text box is not braver than a glyph; it is just longer. Bravery comes from **commitment, exposure, or irreversibility** — the three levers the mechanisms below actually pull.

---

## Part 2 — The question set as a design space

Six questions, each laid out as an axis with the trade-off at each end. These are the *dimensions*, not the answers; the mechanisms in Part 3 are points in this space.

### Axis 1 — the first thought vs the reflection

The contributor's line at share and a reader's considered thought three days later are **different speech acts** and the app has been treating them as one class of content.

| End | What it is | Buys | Costs |
|---|---|---|---|
| **First thought only** | The line attached at share; the response written at mark-read | Immediacy. One moment, one act, no returning | Everything said is said in the first ten seconds after reading — the least considered moment there is |
| **Reflection only** | Nothing may be written at the moment of reading; words are invited later | Considered content. What people say is worth reading in six months | Requires a second visit; needs a reason to return that isn't a nag |
| **Both, typed differently** | The first thought and the reflection are distinct object classes with distinct treatments and distinct rules | Honest — matches how reading actually works | Two systems to explain; risk of the card carrying both |

The unexplored end is *reflection*, and it is the client's first named gap. The mechanism that makes it work is **whatever legitimately brings you back** — completion, a change of mind, another member's arrival, the item closing.

### Axis 2 — continuation over time

| Shape | Rule | Buys | Costs |
|---|---|---|---|
| **Closed** | One turn, then sealed | Zero bloat; a finished object | The circle cannot follow up; v4's 09 |
| **Bounded** | Fixed number of turns (2, 3) known in advance | Feels complete; the end is designed | Arbitrary; the interesting exchange stops at the cap |
| **Episodic** | Discourse happens in rounds, each opened by an event (a member reads, the item closes) | Continuation without continuous presence — matches staggered reading | Whether a round is "open" is invisible state to explain |
| **Revivable** | Long dormant, reopenable at any distance | Nothing dies; a year-old item can wake | An always-open door is an always-open obligation |
| **Continuous** | Speak whenever, as often as you like | Feels alive | Slack. Rejected by the brief |

Note the trap: **continuous ≠ alive**. v5 got that far — a thing that *can* revive reads as alive whether or not it is busy. What v5 missed is that revivability has to be paid for by something, or it is just an unbounded comment box with slower defaults.

### Axis 3 — reactions ↔ discourse

Four genuinely different relations. Every mechanism must pick one and defend it.

| Relation | Reaction is… | Buys | Costs |
|---|---|---|---|
| **Degenerate contribution** | The zero-word contribution; words are the same act with more of it | One system, one place, one record. Silence stays dignified because it is on the same continuum | Blurs the line: a glyph and a paragraph in one list flattens both |
| **Gate** | The thing that earns or unlocks the right to words | Scarcity for free; reacting stays the default, writing is the escalation | Can read as a paywall on speech |
| **Separate channel** | An orthogonal signal beside discourse | Clean; each does one job | Two systems, the failure the brief explicitly warns against |
| **Raw material** | The substrate discourse is *made of* — words qualify, name, or explain glyphs; the constellation is the document | Most novel; discourse cannot exist without the reaction, so they can never drift apart | Constrains what can be said; needs the constellation to be legible at 320px |

The **raw material** relation is the least explored and the most product-native. The **gate** relation is the one that quietly solves scarcity, bravery, and bloat in a single move.

### Axis 4 — bloat control

Three tiers, and a mechanism is defined as much by what it puts in tier 3 as tier 1.

- **On the card, at rest** — costs feed scroll for every member on every pass. Budget is honestly **0–3 lines**, and a hard ceiling of one line per member (max 10, cap-bound). The card today is title + attribution + footer. Anything added competes with scannability, which is the queue's core value.
- **One level in** — the Swell door, the back of the card, a sheet. Free in scroll, costs a deliberate act. The known cost: *"discourse you cannot see from the feed is discourse most members never go looking for"* (v4, direction 08).
- **Never appears** — deliberately not renderable: the drafting, the fact somebody is writing, the count, who has read.

The under-used move is **compression rather than truncation**: the card carries a *derived* artefact (a shape, a composed sentence, a single held line) that is genuinely smaller than its inputs, and the inputs live one level in. That is not "collapse with a More link" — it is a different object at the smaller size.

### Axis 5 — scarcity

| Model | Rule | Buys | Costs |
|---|---|---|---|
| **Unlimited** | Say anything, whenever | Nothing gets blocked | Bloat; the loudest member sets the tone |
| **One per person per item** | You have exactly one voice here | Bounded by the 10-cap; egalitarian by construction | You cannot come back with a better thought (unless revision is allowed) |
| **One per circle per item** | The item holds one line, contested | Radical compression; makes writing *matter* | Nine people are silent; contest can feel competitive |
| **Rationed** | A budget over time, replenishing | Forces choosing where it matters — genuinely economic | A budget is a number, and numbers invite tallies. Dangerous near "calm is the floor" |
| **Earned** | Unlocked by an act — reading, reacting, changing your mind | Scarcity as a by-product of behaviour, invisible as a rule | Can be perceived as gatekeeping |
| **Expiring** | The window opens and closes | Urgency, ceremony, a natural end | Urgency is FOMO's neighbour; must be handled carefully |

**One-per-person is the safe default; earned is the interesting one.** Rationed is the highest-variance idea in the whole space: it is the only model that makes a contribution *feel* costly in the moment, and it is one design slip from a scoreboard.

### Axis 6 — the act of contributing

The client's real question. What makes it brave, considered, or costly rather than cheap? Six distinct sources, only the first of which the exploration has used:

1. **Effort** — length, a form to fill. Weakest. Costly to do, not costly to bear.
2. **Exposure** — the content is inherently self-revealing (naming what changed your mind, disagreeing, addressing one person by name). This is what makes the reaction brave.
3. **Irreversibility** — it commits, publicly, and cannot be edited or withdrawn. The Swell already works this way.
4. **Displacement** — saying this means not saying something else, or replacing someone's line with yours. Cost paid in what you give up.
5. **Ceremony** — a narrow window, a ritual moment. Cost paid in timing.
6. **Consequence** — your words *do* something: they move the item, close it, hand it to someone, become what the circle keeps.

The strongest mechanisms below combine **exposure + consequence**. The weakest combine effort with nothing.

---

## Part 3 — Thirteen mechanisms

Each is a system. Named `M1`–`M13`. Read the one-line rule first; if the rule is the same as another's with different type, one of them is wrong.

---

### M1 — The Second Pass
**Rule.** You cannot write at the moment of reading. The item returns to you once, later, on its own, and only then are words possible.

**On the card at rest.** Nothing new on Active. On Read, one compressed line — the circle's reflections rendered as a **count-free stack of at most three, oldest compressed to a dateline**. A returned item carries a single mono eyebrow: *second pass*. Budget: 1 line at rest, 3 when it has been passed over.

**The act, and its cost.** Marking read gives you the Swell and nothing else — the moment stays exactly as it ships. The item reappears in a **Second pass** position (its own slot at the top of Read, not a new tab, not a badge) after the circle's next share lands, or after a set distance. Writing costs you *having thought about it since*. Nothing to say is the expected answer; the pass closes silently.

**Continuation.** Episodic by construction. Each member's second pass is their own, so words accumulate over days as the circle drifts through. Ends when everyone has had their pass; the item seals.

**Reactions.** Separate channel, deliberately — the reaction owns the moment of reading, the reflection owns everything after. Cleanest division in the set; also the one that risks two systems.

**Only this can.** Produce content that is actually *considered*, because it is structurally impossible to write in the first ten seconds. Directly answers the client's first bullet.

**Cost.** A returning item is the closest thing in the set to a to-do. It must read as *offered*, never *owed*, and if it fails that test it fails calm.

**Answers:** reflections (fully), continuation (episodic), bloat. **Does not answer:** reactions↔discourse (it keeps them apart), or bravery — a second pass is considered, not brave.

---

### M2 — Change of Heart
**Rule.** Words are unlocked only by your reaction *moving*. Come back, shift your glyph or your depth, and the app asks what changed.

**On the card at rest.** The Swell disc, unchanged, plus — on Read only — the movements as **short trails**: your glyph's old position ghosted, the new one solid, the line between them carrying the sentence. At most one trail per member. Zero lines when nobody has moved, which is most of the time.

**The act, and its cost.** Reopen the door, drag your glyph, commit. The composer appears *only* if the position or depth actually changed, prompted by what you moved: "It went deeper." / "It landed differently." You pay in **admission** — you are on record as having changed your mind, and the old position stays visible.

**Continuation.** Revivable and self-limiting. There is no cap on how often you may move, but you cannot move without having genuinely reconsidered, and each move overwrites the previous trail — the record shows where you started and where you are, never the wobble between.

**Reactions.** Gate, in the purest form available: the reaction is not adjacent to discourse, it is the **only** door into it. They cannot drift apart because one cannot exist without the other.

**Only this can.** Make contributing brave in the same way reacting is brave — by exposure, not effort. "I was wrong about this" is the single most self-revealing thing a reading circle member can say, and this is the only mechanism that makes it the *primary* speech act rather than an awkward edge case.

**Cost.** Most items never change anyone's mind, so most items stay silent. That is a feature for calm and a real problem for liveliness — a circle could go a fortnight with no discourse at all.

**Answers:** reactions↔discourse (definitively), bravery, scarcity (earned), bloat. **Does not answer:** the sharer's first thought at contribution — it is purely a consumer-side mechanism and needs pairing.

---

### M3 — The Passage
**Rule.** You may not write prose. You mark a passage from the piece, and up to eight words beside it.

**On the card at rest.** One quoted fragment in the type of the source, set at the card's measure with a hairline rule left; the eight words follow the name. Cap: the card holds the **most-marked passage only** (compression, not truncation); the rest live behind the door.

**The act, and its cost.** After marking read, the composer is not a text box — it is *"what did you underline?"* You paste or type the sentence that hit you. The cost is real work of a different kind: you must go back to the piece and find it, which means you must have actually read it. Eight words is a comment, not an essay, and it cannot become one.

**Continuation.** Continuous but structurally self-limiting: anyone may mark a passage at any time forever. Multiple people marking the *same* passage is the most interesting event in the mechanism and produces no new content at all — it thickens the rule beside the quote. The item never closes; it accretes underlinings the way a shared paperback does.

**Reactions.** Raw material, inverted: the reaction says how it landed, the passage says **where**. Together they make one statement — *this bit, this hard* — that neither carries alone.

**Only this can.** Ground the discourse in the text rather than in the members. Nobody is performing; the article is doing the talking and the circle is choosing. It is also the only mechanism where two members can strongly agree without either writing a word about the other.

**Cost.** Videos and podcasts have no passages — a real gap, since the product is links generally. Needs a timestamp fallback, which is a second design. And a copy-paste flow on mobile is friction at exactly the wrong moment.

**Answers:** bloat, scarcity (structural), the act (considered), reactions↔discourse. **Does not answer:** continuation-as-conversation — nobody ever addresses anybody.

---

### M4 — The Standing Note
**Rule.** Every member holds exactly one line per item, forever, and may rewrite it at any time. The card shows what the circle currently thinks, never what it has thought.

**On the card at rest.** Up to three lines, name-led, the rest behind the door — a strict ceiling of one line per member means a 10-cap circle can never exceed ten, and the card shows the three most recently *changed*. No timestamps on the card; a changed line is simply different next time you look.

**The act, and its cost.** Write a line. Change it whenever. The cost is **displacement of yourself**: there is no second line, so improving your thought means destroying your earlier one. Nobody sees the history — not even you.

**Continuation.** Continuous in permission, static in volume. The record never grows; it *ripens*. An item read a year later shows the circle's settled view, not its transcript. Ends never, and needs no ending, because it cannot grow.

**Reactions.** Degenerate-contribution: a member with a glyph and no line is showing their reaction as their standing note. The roster and the lines are one list.

**Only this can.** Make an old item worth revisiting — the record is *current* rather than archival, which nothing else in the set achieves. And it makes bloat mathematically impossible rather than policed.

**Cost.** Erases exchange entirely. Nobody replies to anybody; a circle of ten produces ten monologues that happen to sit together. Also loses the record of a mind changing, which is the very thing M2 treats as precious.

**Answers:** bloat (definitively), continuation (as revision), scarcity (one per person). **Does not answer:** reflections vs first thought (they collapse), bravery.

---

### M5 — The Held Line
**Rule.** The item holds **one** line for the whole circle. To say something, you must replace what is there — and the person you replaced sees that you did.

**On the card at rest.** Exactly one line, always. Set as the card's own subtitle, attributed. The card never grows by a single pixel regardless of how much discourse has happened. The superseded lines exist behind the door as a stack, most recent first — the item's history of being understood.

**The act, and its cost.** Write the line you think the circle should keep. Committing displaces the current holder. Costs the most of any mechanism in the set: **you have to think yours is better**, and the person you took it from is named and knows.

**Continuation.** Continuous and contested, but each turn is expensive enough that it cannot run away. It ends when it stops being taken — a line that survives a week has been agreed by silence.

**Reactions.** Gate, softly: the pointing gesture is a reaction — you can back the current line with a glyph instead of replacing it, which is how the majority participate.

**Only this can.** Produce a genuine circle-level artefact — one sentence the circle collectively stands behind — rather than a pile of individual ones. It is the only mechanism where discourse *converges*.

**Cost.** Competitive by construction, which sits uneasily with calm. Also silences nine people per item structurally. The design lives or dies on whether displacement reads as *building on* or *beating*.

**Answers:** bloat (absolutely), scarcity (one per circle), the act (costly). **Does not answer:** reflections, and it actively fights the egalitarian instinct in the product.

---

### M6 — The Weather
**Rule.** There are no messages. Words attach to a glyph as its label, and the card renders a **composed sentence derived from the constellation**.

**On the card at rest.** One derived line of prose, generated from the reaction data: *"Landed deeply for Priya and Dev; glanced off Sam."* Plus, when labels exist, the two most-intense labels inline. One or two lines, always, no matter how many members. The full constellation with every label pinned to its glyph lives behind the door.

**The act, and its cost.** During the Swell, having placed your glyph, you may type a few words that become that glyph's **label**. Not a comment — a caption for your own mark. Cost is exposure again: your words are permanently bound to how hard you said it landed, and cannot be softened by context.

**Continuation.** Bounded and merged: the reaction is one act, so its label is one act. Relabelling means re-reacting, which routes into M2's territory. Left alone, this ends when the circle finishes reading.

**Reactions.** Raw material, in the strongest sense in the set: discourse is not *related* to the reaction, it is a **property of** it. The constellation is the document.

**Only this can.** Make the card's discourse *smaller* as more people speak, because the derived sentence compresses rather than accumulates. Ten members produce one line. It is the only mechanism whose bloat curve is flat by construction, and the only one where reading the record means reading a diagram.

**Cost.** Words bound to a glyph cannot disagree, cannot ask, cannot address. It is expressive, not conversational. And a machine-composed sentence must never sound machine-composed — copy work of the hardest kind ([`wiki/circlists-copy-voice.md`](../../../wiki/circlists-copy-voice.md) governs).

**Answers:** reactions↔discourse (definitively), bloat (definitively). **Does not answer:** continuation, reflections. Deliberately closed.

---

### M7 — The Handing On
**Rule.** A thought is not left on an item. It is **given to the next member who reads it**, and shown to them *before* they read.

**On the card at rest.** Nothing on Active except, for you alone, a quiet mono line when something is waiting: *passed to you*. After you read, it becomes an ordinary attributed line. The item never carries more than one line per handoff.

**The act, and its cost.** Having read, you write one thing and it goes to whoever reads next — you do not know who. Cost is **not choosing your audience**: you are writing for an unknown member of your own circle, which is a distinct and slightly exposing register.

**Continuation.** A chain, not a thread. Each reader receives one and leaves one; the chain runs the length of the circle and stops when the last member reads. Behind the door, the whole chain reads as a relay.

**Reactions.** Separate but sequenced: the Swell fires at mark-read as it ships, and the handoff is what you do *after* it closes.

**Only this can.** Break reveal-on-read's one real cost — that nobody's thought is ever *context* for your reading — without breaking the rule itself, because what you receive is from a reader, never the sharer, and only after somebody has genuinely read. It also makes the circle's staggered reading into the actual medium: the gap between two people's reads is where the product lives.

**Cost.** Reading order becomes load-bearing, and the last reader receives everything while the first receives nothing. Asymmetric by construction. Also the hardest to make legible: "why am I seeing this?" needs answering in a phrase.

**Answers:** continuation (as chain), the act (novel and exposing), bloat. **Does not answer:** the sharer's first thought, scarcity.

---

### M8 — The Baton
**Rule.** Only one member may hold the floor on an item at a time. You take it, say your piece, and pass it or let it lapse.

**On the card at rest.** One line — the current holder's, or the last spoken if the floor is free. A single hairline mark shows the floor is open. Two lines maximum, ever.

**The act, and its cost.** Taking the floor is an explicit act, and while you hold it, nobody else may speak. Cost is **time-bounded responsibility**: the floor lapses if you say nothing, and holding it is visible. It is the only mechanism where contributing is a *turn* in the theatrical sense.

**Continuation.** Continuous but strictly serialised — which is precisely what makes it not-Slack. Slack's texture comes from simultaneity and interleaving; a strictly serial floor with a lapse timer produces something closer to a slow correspondence. The item goes quiet when nobody takes the floor.

**Reactions.** Gate: you may only take the floor on an item you have read and reacted to. Reacting is how the other nine participate while somebody holds it.

**Only this can.** Deliver genuinely *unlimited* continuation — say anything, as often as the circle likes — while making a chat texture structurally unreachable. It is the only mechanism in the set that answers "what if we really do want a long conversation" without conceding to threads.

**Cost.** Its liveliness depends on people passing, and a floor nobody takes reads as dead. Lapse timing is a clock, and clocks border on pressure.

**Answers:** continuation (fully), bloat, reactions↔discourse (gate). **Does not answer:** reflections, and it is the mechanism closest to the Slack line — it must be built to be judged.

---

### M9 — The Closing
**Rule.** Nothing may be said while the item is live. When the last member marks it read, the item **closes**, and closing opens exactly one round: everybody writes one line, revealed together.

**On the card at rest.** Absolutely nothing on Active — the queue is perfectly silent, which is this mechanism's whole claim on bloat. A closed item, on Read, carries the round as a set: all lines, one per member, revealed simultaneously and sealed.

**The act, and its cost.** You write blind. You cannot see what anyone else wrote until the round resolves, so you cannot agree with, defer to, or echo them. Cost is **committing without cover** — the same exposure the Swell has, extended to words.

**Continuation.** Bounded and ceremonial: one round, one line each, then sealed forever. The item is a finished object.

**Reactions.** Degenerate contribution: reacting and not writing puts your glyph in the round as your line. The round is the reaction reveal, grown up.

**Only this can.** Produce simultaneity in a product where nobody is ever present at the same time. Everyone speaks at once, days apart. It is also the only mechanism where the circle's *completion* of a piece is an event rather than a state change, which is exactly the "on the pulse together" feeling the brief names.

**Cost.** Depends on everyone finishing. One member who never reads holds the round shut forever, so it needs a graceful expiry — and any expiry rule is a deadline in disguise.

**Answers:** bloat (absolutely), the act (brave), reactions↔discourse. **Does not answer:** continuation (closed by design), reflections mid-flight.

---

### M10 — Ink
**Rule.** Each member has a small, slowly replenishing budget of words across the whole circle. Speak where it matters.

**On the card at rest.** Ordinary attributed lines, one per member, capped at two on the card. What makes it a system is not the card at all — it is what happens at the composer.

**The act, and its cost.** The composer shows your remaining ink as a **length**, never a number (a number is a tally, and tallies are banned). Writing here means not writing on the next three items. Cost is the only genuinely **economic** one in the set: paid in opportunity, not effort.

**Continuation.** Continuous and self-regulating. Nothing is capped per item; the circle's total volume is capped by the sum of budgets. Items with much to say get much said.

**Reactions.** Separate channel with an important asymmetry: **reactions are free and infinite**. That is the design's calm valve — you can always participate fully at zero cost, and ink is only for words.

**Only this can.** Make contribution genuinely costly without making any single contribution ceremonial. It is the only mechanism where the member decides *where* the scarcity lands, rather than the system deciding for them.

**Cost.** The highest-risk idea here. A budget is a quantity, quantities become scores, and an empty budget is the app telling you to be quiet. If it ever reads as a rationing of belonging, it is dead on arrival. Include it precisely because that boundary is worth seeing rendered.

**Answers:** scarcity (fully), bloat, the act (costly). **Does not answer:** reactions↔discourse (kept apart), reflections.

---

### M11 — The Quorum
**Rule.** Words are written freely but revealed to nobody until a threshold of the circle has read the item. Discourse arrives all at once, or not at all.

**On the card at rest.** Before quorum: nothing, on either tab, plus a single unobtrusive mono state — *held*. After: the full set, one line per member, delivered in one motion.

**The act, and its cost.** Writing is cheap; you type after reading, as normal. What costs is **patience** — you speak into a sealed room and cannot know when it opens. And because nobody has spoken yet when you write, nobody can be echoed.

**Continuation.** Episodic in the purest form: quorum opens the item, and subsequent readers land into a room already talking, where a second, smaller round is possible. Ends when the circle's readers are exhausted.

**Reactions.** Extends reveal-on-read from the individual to the collective. A reaction is revealed on *your* read; a word is revealed on *the circle's*. Same rule, different subject — which is why this feels native rather than bolted on.

**Only this can.** Deliver an unmistakable *arrival* — the moment an item goes from silent to inhabited — without a notification, a badge, or a count. And it makes non-echoing structural: nobody can pile on, because nobody has seen anything.

**Cost.** An item the circle half-reads is silent forever, and that silence is invisible — members can't tell whether nothing was said or nothing was shown. Also the hardest to explain in a phrase.

**Answers:** reactions↔discourse (as a shared rule), bloat, continuation (episodic). **Does not answer:** the act (writing stays cheap), scarcity.

---

### M12 — The Second Reader
**Rule.** The sharer's thought is not published. It is sealed and released to each member individually **at the moment they finish** — and only they can answer it, once, privately, back to the sharer.

**On the card at rest.** Nothing, ever. Not on Active, not on Read, not one line. The entire mechanism is invisible to the feed; the record lives behind the door as a set of **paired exchanges** — sharer's line, one member's answer — one pair per member, each pair visible only to its two participants and never to the rest.

**The act, and its cost.** Cost is **address**: you are writing to one named person, who shared this, about why they shared it. Nothing you write is on show to the circle, so nothing you write is performance. It is the least performative and most personal act in the set.

**Continuation.** Bounded per pair — one line and one answer, closed — but *repeated* across the circle, so the sharer receives up to nine separate small exchanges as the circle drifts through the piece over a week. Their inbox is the item's door.

**Reactions.** Adjacent and complementary: reactions remain the **public** signal, this is the **private** one. The disc shows the circle; the pairs show the relationships inside it.

**Only this can.** Deliver intimacy — which is what "like a family" actually means, and what every public mechanism in this set structurally cannot provide. It is also the only one that makes sharing feel rewarded rather than observed.

**Cost.** Private content in a communal library cuts against the product's grain — the library is shared and this is not. Genuinely arguable whether it belongs. It also gives the circle no shared record at all.

**Answers:** the act (novel, exposing), bloat (definitively), reflections. **Does not answer:** the communal feeling, and it needs a companion mechanism for public discourse.

---

### M13 — The Shelf
**Rule.** Discourse does not attach to items. Every so often, the circle's reading is gathered into a single spread — one line per item — and one member **lands** it.

**On the card at rest.** Nothing. Cards are untouched, on both tabs, permanently. Discourse lives in **time**, not on objects: a periodic surface, entered deliberately, showing the stretch of reading the circle has just come through.

**The act, and its cost.** Writing is per-item and short, but it is written **in view of the whole stretch**, so what you say is comparative — this mattered more than that. Landing the shelf is a single act by one member that closes it and keeps it. Cost is **consequence**: what is landed is what the circle keeps of that period.

**Continuation.** Bounded per shelf, endless as a rhythm. Each shelf closes; another opens. The circle's discourse becomes periodic rather than per-item.

**Reactions.** Raw material at the aggregate level: the shelf is seeded from the reaction data — the items that landed hardest are already laid out, and words fill in around a shape the circle produced without trying.

**Only this can.** Give the circle a **memory** rather than a record, and put the sense of shared journey into the one place nothing else touches: the passage of time. It is also the only mechanism where discourse costs the feed literally nothing, because it is not in the feed.

**Cost.** The furthest thing from a card in this document, and the client's stated want is *thoughts on cards*. It is here because "not on the card at all" is a genuine end of the bloat axis and deserves representation — and because a place you must enter is a place you can forget to enter.

**Answers:** bloat (absolutely), continuation (as rhythm), reflections. **Does not answer:** thoughts on cards, which may disqualify it — worth knowing on purpose.

---

## Coverage check

| | Reflection vs first | Continuation | Reactions relation | Bloat at rest | Scarcity | The act's cost |
|---|---|---|---|---|---|---|
| M1 Second Pass | reflection only | episodic | separate | 1 line | one per person per pass | delay |
| M2 Change of Heart | reflection | revivable | **gate** | 0–1 trail | earned | admission |
| M3 The Passage | first thought | continuous | raw material | 1 quote | structural | finding it |
| M4 Standing Note | collapsed | revision | degenerate | ≤3 lines | one per person | self-displacement |
| M5 Held Line | either | contested | gate (soft) | **1 line always** | **one per circle** | displacing a person |
| M6 The Weather | first thought | closed | **raw material** | 1 derived line | one per reaction | irreversibility |
| M7 Handing On | first thought | chain | sequential | 1 line | one per handoff | unknown audience |
| M8 The Baton | either | **continuous, serial** | gate | ≤2 lines | floor-held | visible turn |
| M9 The Closing | reflection | **closed round** | degenerate | **0 on Active** | one per person | writing blind |
| M10 Ink | either | continuous | separate (free reactions) | ≤2 lines | **rationed** | opportunity |
| M11 The Quorum | first thought | episodic | shared rule | 0 until quorum | none | patience |
| M12 Second Reader | reflection | bounded pairs | adjacent, private | **0 ever** | one per pair | address |
| M13 The Shelf | reflection | periodic | aggregate material | **0, not on cards** | one per item per shelf | consequence |

No two rows are the same system, and no row differs from another only in how text is set. M4 and M5 are the closest pair and differ on the load-bearing question — whose line it is — which changes the record, the cost, and the social dynamic entirely.

## The three strongest

**M2 — Change of Heart.** The only mechanism that makes contributing brave in the same way reacting is brave: by exposure rather than effort. It answers the reactions↔discourse question definitively — the reaction is not adjacent to discourse, it is the only door into it, so the two systems can never drift apart. Scarcity, bloat, and the *why now* of continuation all fall out of one rule. Its weakness is real and stated: quiet items stay quiet.

**M3 — The Passage.** The most product-native idea available. In a reading app, the natural unit of discourse is the text, not the members. Brevity is structural, performance pressure nearly vanishes (the article speaks, you point), agreement is expressible with zero new content, and the record of an item becomes a shared annotated copy — exactly the "family book" register the brief reaches for. Its cost is honest: non-text media need a second design.

**M9 — The Closing.** The strongest answer to *"on the pulse together"*, and the only one that manufactures simultaneity in a product where nobody is ever present at once. It keeps the Active queue perfectly silent — the strictest bloat answer with words still on the card — and writing blind is genuinely brave in the Swell's sense. It needs a graceful expiry, and that is a solvable design problem rather than a flaw in the mechanism.

If a pairing is wanted rather than a single winner: **M2 + M9** covers consumer-side bravery and collective arrival with one shared rule and no overlap, and **M8** is the one to build if the answer to "can we keep talking?" must be *yes, indefinitely*.

## Deliberately not done

- No typographic variants. Where a mechanism names a treatment, it is the minimum needed to state the bloat budget, not the exploration.
- No global rule promoted out of a preference — postmortem failure 2. The set holds contradictory answers on purpose (M12 is private, M9 is simultaneous, M13 is not on the card at all).
- Nothing built, nothing in `app/`, no playground touched.
