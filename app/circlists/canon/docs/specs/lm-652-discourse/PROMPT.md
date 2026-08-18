---
date: '2026-07-27'
topic: 'discourse'
status: 'source'
type: 'prompt'
---

# Circlists — discourse playground

**The original brief, verbatim.** Pasted into chat at the start of the v1
session, re-pasted 2026-08-03 and saved here so it stops being the thing that
gets lost. This is the starting point for the whole discourse exploration. If a
later document conflicts with it, this file wins unless the user says otherwise.

---

> Self-contained prompt for the Claude Design agent. Paste as the first message of a **new session** in the Circlists project — a playground is built beside the prototype, never into it and never in the prototype's live session. Build a **playground**, not a finished design — one page carrying several genuinely distinct options for a single open question, so we can look at them together and choose.

## What Circlists is

Circlists is a calm, communal link-sharing app for small trusted circles — a few people who already share links and want one shared place for them. A member shares a URL into the circle; the circle reads through a queue with two tabs, **Active** and **Read**. Marking an item read triggers the shipped reaction gesture (**The Swell**), and a **Reaction door** lets you revisit reactions. The library is communal (delete is everyone-delete), read-state is individual, and reactions are revealed only after you have read the item yourself. Calm is the floor: no anxiety, no performance pressure, no FOMO, no kudos tallies.

## The question we are exploring

**What shape does discourse take in Circlists — the full loop, from a contributor's attached thought to a consumer's response — so that a circle feels on the pulse together without the app becoming a chat tool?**

Real testing surfaced the gap: as a contributor you want to attach a thought to what you share ("why this mattered to me"); as a consumer you want to respond — to that thought, or to the share itself. A reaction says something, but it does not feel enough; it does not close the loop. What closes it is the feeling of belonging — collaborative, on the pulse together, like a family. That feeling is the magic of the product, and it is currently missing.

A good answer covers the **whole loop as one shape**: thought attached → thought received (respecting reveal-on-read) → response given → the exchange lives somewhere (and might be referred back to, or travel out). Not every A-to-Z state — but a sense of completeness, not just the providing of the thought.

Three tensions must be held together in every option, never resolved in isolation:

1. **Simple, lovable, complete.** Belonging to the pulse must make belonging *easy*. Essay-length posts would bloat the surface and make engaging harder — brevity must be **structural** (built into the shape), not policed by rules.
2. **Synergy with reactions.** The Swell already ships. Discourse and reactions cannot be separate and distinct systems — every option must state how it relates to the reaction gesture (merged with it, adjacent to it, sequential after it — but related).
3. **The market gap.** The collaborative, on-the-pulse-together belonging — the loop closure a reaction by itself does not deliver.

And one guiding principle over all of it: **Circlists is not trying to be WhatsApp or Slack.** Discourse here is centred in what Circlists is — a reading circle — not a messaging feature transplanted in.

## Settled — do not reopen

Every option honours these.

- **Reveal-on-read** — another member's thought, reaction, or response on an item is not revealed to you until you have read the item yourself.
- **No comment threads** — threaded, open-ended discussion is deliberately parked. No option builds a thread.
- **Calm is the floor** — no unread-count badges, no notification pressure, no kudos tallies.
- **Communal library, individual read-state** — unchanged.
- **Sharer may share before reading** — a valid thought can be "reading this because I trust the source"; no option punishes pre-read sharing.
- **The Swell + Reaction door** — the shipped reaction design stays; options build in relation to it, not over it.
- **Design language** — locked, below.

## Levers to vary

Some of the levers, not all. A starting frame, not the whole solution space — vary them, and add your own.

- **Where discourse lives** — on the card itself · inside a bounded exchange · in a place of its own (e.g. a third tab beside Active / Read) · somewhere else entirely.
- **Response shape** — a short note back · a word attached to the reaction gesture · an echo/quote of the thought · something new.
- **Brevity mechanism** — a hard character limit (Twitter-style) · a register prompt ("why did this matter?") · progressive disclosure (short line, expandable) · a shape that simply has no room for essays.
- **Whose thought** — sharer's alone ("why I shared this") · any member's ("why I read it") · both.
- **Reveal moment** — at mark-read, with the Swell · after reacting · on entering a dedicated view.
- **Persistence and travel** — exchange fades after a window · lives on the card forever · can be shared out / referred back to.
- **Attachment obligation** — thought required at share · nudged but skippable · fully optional. A hard-mandatory field is unlikely to be right, but the range is open.
- **Multiplicity** — a bounded one-for-one exchange · many readers' notes accumulating on one thought.

Where you see a tension the levers above do not name, answer it inside the options. That is wanted.

One consideration to design around, not a settled rule: how often a member's name surfaces alongside shares is itself a kind of per-person share count. Visibility that tips toward performance pressure is a real risk — design around it, don't dismiss it.

## Seed directions

Three sets of seeds feed this playground: from Claude (grounded in the product intent), from a second ideator (below), and your own — you hold the prototype, so your directions come grounded in the real UI. **Ideate your own directions first, before weighing the seeds.** Then consolidate everything — yours plus all seeds — into **5–7 genuinely distinct options**. Where two are shades of one idea, merge them and note the merge. Alongside them, include today's design unchanged — reaction-only, no discourse — as a baseline reference option.

The seeds arrive as written directions, not designs. Your job is to **flesh each surviving option out into a fully designed, committed answer** — grounded in the app's real surfaces, resolving what the seed leaves open — never to render a seed thinly as given. Each option covers the full loop, not a partial sketch, labelled with a short name and one line on the direction it takes.

### Seeds from Claude

1. **Passing notes — the bounded exchange.** Discourse as a two-beat structure, not a thread. The contributor attaches a short thought at share; after you read the item, the thought reveals, and you can pass one note back. One thought, one response per member — brevity and no-essay are structural, by shape. The card's story becomes a small stack of paired exchanges. The loop closes (respond, not just react) but can never grow into chat.
2. **Marginalia — the card is the conversation.** No messaging metaphor at all. The card accumulates short pencil-notes in its margins — the sharer's why, readers' takeaways — all revealed only after your own read. The circle passes an annotated object around like a family book. Refer-back and share-out fall out naturally: the annotated card is the artefact. Discourse never has its own inbox; it lives on the thing itself. Notes never reply to one another — the margin annotates the work, it doesn't converse.
3. **The Table — a third place.** A third tab beside Active and Read as the organising idea. Cards graduate to the Table when exchange happens on them; the reading queue stays perfectly calm, and discourse is contained in a place you choose to enter. Belonging becomes visible geography — you see your circle gathered around the things that sparked something — while the queue never carries the weight.

### Seeds from a second ideator

1. **Reaction Door Epilogues.** Discourse lives as a structured aftermath enclosed entirely within the Reaction Door, framing thoughts as final reflections rather than opening statements. The contributor attaches a single-sentence "Preface" at the time of sharing. This remains completely hidden in the Active queue. When a consumer finishes the piece and triggers The Swell, the Reaction Door immediately opens to reveal the Preface alongside their own reaction. At this exact moment of loop closure, the consumer can leave an "Epilogue" — a strict, one-time text response. These Epilogues stack linearly inside the Reaction Door, permanently tied to the reaction state. There is no "reply" action to an Epilogue; the loop closes the moment it is written. By containing the discourse strictly within the existing reaction boundary, the feed remains pristine, and the exchange feels like a conclusive handshake rather than the start of a thread.
2. **Guided Statements.** Brevity is enforced structurally by requiring both the attached thought and the consumer's response to complete a semantic sentence stem. Instead of a blank text box, the contributor selects a semantic stem (e.g., "Shared because...", "The core insight is...") and finishes the sentence within a tight character limit. Upon reading and reacting, the consumer unlocks this statement on the card. To respond, the consumer must also choose a stem (e.g., "This landed for me because...", "A different angle is..."). These completed sentences live on a flipped "back" state of the card. Because the input is rigidly structured, essays are structurally impossible, and the barrier to participation is drastically lowered. The structured format distills the exchange into a calm, highly scannable loop that prevents open-ended threading while ensuring the shared pulse is immediately clear.
3. **The Woven Signal.** The attached thought and the consumer's response are injected directly into the visual rhythm of The Swell, prioritising the immediate impact of loop closure over static logs. The sharer attaches a short text thought to the card. When a consumer marks the item read, the sharer's text physically surfaces from within The Swell's animation. In that immediate, post-read window, the consumer is given a temporary text field to type a "Return Signal." Once submitted, this response is integrated into the reaction data and surfaces for the sharer only when they explicitly check the Reaction Door. The text persists quietly in the background, but the primary experience of the discourse is temporal — tied entirely to the physical act of marking the item read. This merges the discourse perfectly with the reaction gesture, creating a shared moment that vanishes back into calm, leaving the Active and Read queues visually silent.

### Your own

Add your own directions — ones the seeds above miss. You can see the real surfaces, spacing, and rhythm of the app; propose what the prototype itself suggests.

## Playground shape

**Framed** — render the real Circlists app around the options. Everything needed is stated here:

- **Rail = option selector** — each entry a numbered option with a short descriptor carrying its claim *and* its trade-off, using the app's rail active-state treatment (surface background + accent left bar + raised shadow).
- **Heading = config controls** — small labelled segmented controls for the levers above, defaulting to **Auto** (each option's own intended answer) with explicit overrides, plus data/state switches worth seeing: no-thought-attached, long-thought, shared-before-reading, nobody-has-responded-yet, everyone-has-responded.
- **Feed renders the seed cards in the selected option's treatment** — all states visible at once, not one at a time. Where an option adds a place (a tab, a door), make it navigable inside the frame.
- **Reuse the app's real theme and primitives** — import the design tokens and existing components rather than re-implementing; fidelity comes from reuse. Persist the selected option across reloads.

## Design language (locked — do not reopen)

**Palette** — accent Pulse Green `#047857` (primary actions, active states, focus rings only — never status, never decoration); page `#FAFAF7`, surface `#FFFFFF`, sunken `#F5F5F2`; text `#0A0A0A` / `#525252` / `#6E6E6B`; borders `#DCDCD8` / `#E8E8E5`; destructive `#991B1B` only for destructive actions; sage `#8BBFAD` is brand-mark only.

**Type** — Inter (primary), JetBrains Mono (mono accent). Hierarchy via size and weight, never colour. 4px grid.

**Feel** — calm, warm-paper neutrals, readable from 320px. Voice: direct, present-tense, verb-led, evergreen. No emoji, ever.

The design language holds across every option — no exceptions; the options vary structure and behaviour, not the theme.

## Mock data seed

Use the app's existing seed circles, members, and cards. Seed the discourse content itself so the options read as inhabited — attached thoughts across the full register spectrum, for example:

- *Functional gist:* "Gist: why measuring platform teams by tickets closed fails. Worth the 10 minutes."
- *Pre-read trust:* "Haven't read it yet — sharing because everything from this writer has landed for us."
- *Personal:* "This is the article that made me rethink my last job. Different company, same pattern."
- *Takeaway:* "Takeaway for us: our onboarding is exactly the failure he describes in part two."

And responses in kind: "Read it because of your note — the ending caught me off guard too." · "This landed. Can we try the checklist idea this week?"

## Output

- One page, 5–7 options plus the reaction-only baseline, switchable inside the app frame
- High fidelity — each option reads as a real screen, never a wireframe
- Each option labelled: short name + one line on its direction + which seeds it draws from
- The playground stands alone; leave the prototype itself untouched
