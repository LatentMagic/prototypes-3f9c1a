# Discourse — the elimination sheet

Written 2026-08-11. Self-contained: an agent picking this up cold needs no other
file, though `docs/specs/lm-652-discourse/discourse-v7-reactions.md` (the verbatim dump) and
`docs/specs/lm-652-discourse/postmortem-2026-08-03-discourse.md` are the primary
sources behind it.

**Why this exists.** Seven rounds of exploration produced ~30 built directions
and no answer. The product owner's position: *"I just don't know how to find my
way to an answer here."* So this pass stops choosing and eliminates instead —
the laws are his own verdicts, and what survives, survives on the record rather
than on anyone's taste.

**Status.** The laws in section 1 are **ratified** (2026-08-11, individually).
Everything from section 3 onward is a reading of the result and is **not
ratified** — it is put up to be accepted, amended or shredded.

---

## 1. The laws — ratified

Four. A law eliminates a direction on contact.

| | Law | Source |
|---|---|---|
| **L1** | **Nothing waits on other people.** No unlocking on elapsed time, on everyone having read, or on a publishing cadence. | 04 The Seal, 08 The Dispatch — *"we cannot expect people to come back"* |
| **L2** | **Nobody is excluded from speaking.** No cap on who may enter a conversation. | 07 Seats — *"That's not inclusive. This is an inclusive app"* |
| **L3** | **Nothing written is overwritten or replaced.** | 09 Palimpsest — *"that's not fair to the contributor at all"* |
| **L4** | **Nothing grows without bound.** Words per member, per card and per surface are finite by construction, not policed by rules. | 11 The Record — *"it's already too big for the screen… it's going to get bigger and bigger"* |

Carried in as already settled and not re-asked (`docs/specs/lm-652-discourse/PROMPT.md`):
reveal-on-read · no comment threads · no unread badges, counts or kudos tallies ·
communal library, individual read-state · sharing before reading is never
punished · The Swell and the Reaction door are unchanged · not WhatsApp, not
Slack.

### Preferences — they argue, they do not kill

| | Preference |
|---|---|
| **P1** | **No scaffolding what a member says** — no prompts, stems, mandated questions, pulled quotes, matching. *"Contributors are serious people who have serious thoughts to share."* |
| **P2** | **No second screen** — the attached thought belongs in the add popover, the reflection in the reaction modal. |
| **P3** | **The contributor's note may be public before the read** — a permission, not a prohibition. Everything said after reading stays behind the read. |

### Design philosophy — not a law

**A feature must remove more than it adds.** Belonging to the circle means
staying on the pulse without feeling overwhelmed. Ruled a philosophy, explicitly
not a law: *"it's not so much a law."*

### Explicitly NOT laws — the two live areas

Both were put up as laws and **rejected**, on the grounds that they are
*"half baked but interesting"* and **need more grounded ideation**:

- **A new place alongside Active and Read.** Not killed. The Table, the
  after-note surface and the Dispatch all attempted it; none convinced.
- **A permanently open talk surface.** Not killed. *"I'm not entirely against
  that."*

Read this as a standing instruction, not an omission: these two are the areas
the laws are not permitted to settle.

---

## 2. The grid

Every direction built across v1, v4 and v7, against the four laws. v2 and v3 are
omitted: their option models are dead (see the postmortem) and their mechanisms
recur here. The column names the **first** law broken, not all of them.

### v1 — the eight directions

| | Direction | Mechanism | Breaks | |
|---|---|---|---|---|
| 00 | Reaction only | baseline, no words | — | survives |
| 01 | Passing notes | one note back per member | — | survives |
| 02 | Marginalia | short notes in the card's margin | — | survives |
| 03 | The Table | cards graduate to a third tab | — | survives |
| 04 | Guided statements | complete a sentence stem | — | survives (P1 argues) |
| 05 | Inside the door | epilogue written at loop closure | — | survives |
| 06 | The Echo | echo a line, plus one word | — | survives |
| 07 | The question | answer the sharer's question | — | survives (P1 argues) |
| 08 | Card flip | words on the back of the card | — | survives (presentation, not a mechanism) |

### v4 — the ten, widened

| | Direction | Mechanism | Breaks | |
|---|---|---|---|---|
| 00 | Reaction only | baseline | — | survives |
| 01 | The invitation | the sharer's living line, locks when pointed at | **L3?** | contested — a line that edits itself replaces its own earlier text, though only its author's |
| 02 | Passing notes | one note back, addressed to a person | — | survives |
| 03 | Marginalia | *keep* annotating, never a reply | **L4** | unlimited annotation |
| 04 | The question | later turns must be questions | **L4** | unlimited turns |
| 05 | Same | point at a line; unlimited and terminal | — | survives (pointing is a tap, not text) |
| 06 | The vanishing prompt | say anything until somebody lands it | **L4** | unbounded until landed |
| 07 | Guided statements | restate, **replacing** your old one | **L3** | replacement, even of your own |
| 08 | Inside the door | answer a person; rounds open on reading | **L1** | a round opens when someone else reads |
| 09 | The Swell speaks | words as labels flanking the disc | — | survives |
| 10 | The Table | speak twice at the table, then land it | — | survives |

### v7 — the thirteen

| | Direction | Mechanism | Breaks | |
|---|---|---|---|---|
| 01 | The Question | interrogative only; anyone reopens the card | **L4** | unbounded reopening |
| 02 | The Depths | a room per Swell depth | **L4** | a room has no bound |
| 03 | Countercard | a response is another card | **L4** | queue inflation, stated in its own cost |
| 04 | The Seal | nothing readable until it all opens at once | **L1** | waits on the slowest reader |
| 05 | The Pulled Line | sharer and readers each pull a quote | — | survives the laws — **vetoed by the owner regardless** |
| 06 | Sounding | one proposition per member, answered by pull | — | survives |
| 07 | Seats | four seats; later readers may never enter | **L2** | exclusion |
| 08 | The Dispatch | talk compiles into an issue on a cadence | **L1** | Monday's thought is public Sunday |
| 09 | Palimpsest | any reader writes over the card's one line | **L3** | overwriting |
| 10 | The Stream | one continuous chronological talk surface | **L4** | unfinishable by design |
| 11 | The Record | reaction and line as one act, held in the door | **L4** | *"nothing bounds how many lines a record takes"* — its own stated cost, and the defect you hit |
| 12 | Said the Same | point at a line rather than write it again | — | survives |
| 13 | The Note | note public before the read, two per card | — | survives |

---

## 3. What the grid actually did — opinion

**It killed mechanisms, not ideas.** Every kill is unboundedness, deferral,
exclusion or destruction — and in three cases those are incidental to the idea
rather than the idea itself:

- **11 The Record** — the direction you responded to most warmly dies on L4, on
  exactly the defect you named. Bound the record and the mechanism survives
  intact. This is a fixable failure, not a refutation.
- **08 The Dispatch** — dies on cadence, which is its delivery, not its instinct.
- **10 The Stream** — dies on being unfinishable, which is a property of a river,
  not of a talk surface.

**What survives is one family, not fifteen options.** Strip the presentation off
the survivors and they say the same thing:

> One bounded utterance per member per item, left in a place that already
> exists, revealed under the rules already settled.

They differ in *where the utterance is set down* (card, margin, door, disc, a
place) and *what form it takes* (a note, a pull, a point, a proposition, a
stem). Nothing that survives requires a new mechanism.

**So elimination has done what it can and it has not produced an answer.** It has
produced a floor — and the honest reading is that the floor was never the hard
part. The hard part is the two areas the laws are not allowed to touch.

## 4. "Ship nothing" — argued properly

Put up as a genuine contender, because until now everything has competed against
an imaginary better yes.

**The case for.** The circle already has The Swell: a glyph and how hard it
landed, revealed to everyone once they have read. That is a real communal signal
and it is shipped. The thing members actually want to *say* has somewhere to go
today — the group chat they already have, which does threads and continuation
better than any bounded mechanism will. Seven rounds have not found a shape
anyone believes in, which is evidence about the problem, not only about the
rounds. And the product's own philosophy says a feature must remove more than it
adds; none of the survivors clearly does.

**The case against, in your own words.** *"A reaction says something landed but
does not close the loop."* The missing magic is belonging — collaborative, on the
pulse together. If the talk lives in WhatsApp, the pulse lives in WhatsApp, and
Circlists is a filing cabinet with a feelings widget. And the note (13) is the
cheapest thing in the entire corpus and you liked it immediately.

**My reading:** "ship nothing" loses, but only just, and only because of the
note. **The note is not discourse — it is context on a card**, and it survives
every law and every preference at near-zero cost. If the answer were "ship the
note and stop", that is a defensible place to land and it is not a defeat.

## 5. Where I think the work actually is

Not another set of directions. Two grounded ideations, each now constrained by
four ratified laws that no previous round had:

1. **A place, that does not wait and does not grow.** Every attempt so far broke
   a law incidentally — the Table was vague, the Dispatch had a cadence, the
   after-note was unreachable. None of them has been designed against L1 and L4
   as constraints. That is a genuinely different brief from "add a third tab".
2. **A talk surface, bounded.** The Stream failed for being a river. A talk
   surface with a floor and a ceiling has not been drawn.

Both are your rejections, kept open on your instruction. Everything else in the
corpus is either dead or is a variation on the floor.

## 6. Open questions — put to the owner, unanswered

1. If we shipped **only the note** (13) and nothing else — sharer's line on the
   card, character-capped, visible before the read — is the loop closed enough
   to leave the rest for later?
2. Today, when your circle wants to say something about a link, where does it
   actually happen? Is that a problem you want Circlists to take, or one it
   should leave alone?
3. Is the missing magic in **being heard** or in **hearing**? Every direction
   has assumed both; they have very different answers.
4. Reader 2 never seeing reader 10's thought — is that a gap you have *felt*, or
   a completeness instinct? It is the single assumption holding up the entire
   return problem.
