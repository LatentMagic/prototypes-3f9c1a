---
date: '2026-08-05'
topic: 'discourse-v5'
status: 'for-review'
type: 'exploration'
---

# Discourse v5 — seven more, aimed at the one gap nothing answered

v4 widened the set to ten and asked *what shape does discourse take*. The user's steer for v5 names the part still missing:

> "One of the major gaps is ongoing conversation whilst not being Slack. And not bloating the page but also showing content. We want to see thoughts on card."

So all seven are **card-visible** — no direction hides its content behind a door — and each commits to a mechanism that makes a conversation feel *ongoing* without a reply chain.

## Research (2026-08-05)

Three parallel sweeps: a catalogue of everything v1–v4 already used, a study of non-thread conversation structures, and a study of editorial treatments for a voice beside a work.

**The finding that shaped the set.** "Ongoing" is not one property. It separates into four, none of which needs a comment box:

| Mechanism | Evidence | Direction |
|---|---|---|
| **Revivability** — a thing that *can* resurface reads as alive whether or not it is busy | Discord forum posts persist and revive; threads auto-archive at 24h and read as dead | `returned` |
| **Visible incompleteness** — a shape-shaped hole where the next turn goes | renga's fixed form, exquisite corpse's folded paper | `slot` |
| **Lineage, not tally** — life shown as a trail of who took this up and what they made of it | Are.na re-placing a block; the quote-tweet forking rather than extending | `descend` |
| **Staggered shared object** — the object persists across independent visits; nobody is ever in the room together | Letterboxd: everyone watches alone, logs later, and it still feels collective | `chorus`, `shelf` |

The corollary matters as much: **a card that hard-closes is a designed-finished object, not an ongoing one.** Several v4 directions close by construction. That was never wrong — but nothing in the set was *open*, which is why the feeling was missing.

**Typographic research** supplied the treatments. Every one of the seven uses an editorial idea no v4 direction uses — the standfirst/deck, the translator's bracket, the name-led chorus line, the ruled slot, the dateline, the shelf talker, the lineage reference.

## The seven

| # | Direction | Mechanism | Treatment | Continuation |
|---|---|---|---|---|
| 11 | **The standfirst** | contested current-best | italic deck under the title, title keeps its size | anyone offers a better line; the most-pointed-at holds the deck |
| 12 | **The aside** | append-in-paragraph | `[text — Name]` inline, one running paragraph | asides append into the same paragraph; grows in lines, never blocks |
| 13 | **The chorus** | staggered accretion | name-led small caps, one line each, capped at three | accretes across visits; the rest is a plain word |
| 14 | **The open slot** | visible incompleteness | every line sits on a rule; the empty one has no words yet | filling one opens the next; closes when the circle has all read |
| 15 | **The long return** | revivability | the past compresses; the return is dated and full size | return whenever, but not twice in a day |
| 16 | **The shelf talker** | staggered accretion | a small sunken card pinned beside the item | anyone may pin one; they gather along the shelf edge |
| 17 | **Reading on** | lineage / fork-not-reply | the thought compresses; the descendant share is the subject | continuing *is* sharing — the response becomes the next card |

`descend` is the one worth arguing about. It is the only direction where responding makes the circle something new instead of adding to a pile, and it is the most product-native answer available: in a link-sharing app, the natural reply to a good link is another link. Its cost is real and stated — the exchange leaves the card, so the feed shows results rather than talking.

## What this deliberately does not do

- **No threads.** Nothing nests, nothing has a reply target except `notes` in v4, which is untouched here.
- **No new global rule.** The v4 postmortem's second failure was promoting one preference into a rule every option obeyed, which spent the variety. These seven append; they change nothing about the eleven.
- **No configuration to reach the variety.** Each is pre-seeded and card-visible; the distinctive moment is on screen at rest.

## Wiring

Additive by construction, so v4 is byte-identical when v5 is not loaded:

- `pg-d5-treatments-a.jsx` — `Pg5Standfirst`, `Pg5Bracket`, `Pg5Chorus`, `Pg5Shelf`.
- `pg-d5-treatments-b.jsx` — `Pg5Slot`, `Pg5Returned`, `Pg5Descend`.
- `pg-d5-data.jsx` — the seven direction objects (pushed onto the same `PGD4_DIRS` array the v4 app already holds), the two extra fixtures, the response labels, and a dispatcher that handles the new `treat` values and falls through to v4's for the old ones.
- `discourse-playground-v5.html` — v4's entry with three script tags inserted before `pg-d4-card.jsx`.

One line changed in a v4 file: `pg-d4-card.jsx` held a hardcoded whitelist of treatments that render inside the card body. It now reads `window.PGD_INLINE_TREATS` and falls back to the original five, so v4 behaviour is unchanged and v5 can extend it.

**Load order matters and bit once.** The treatment files must load *before* `pg-d5-data.jsx` (the dispatcher names their components), which means the fixtures `pg-d5-data.jsx` defines are not yet on `window` while the treatment modules' top level runs. `pg-d5-treatments-b.jsx` therefore reads `PGD5_LATE`, `PGD5_DESCENDANTS` and `PGD4_ITEMS` through accessor functions at call time, not by destructuring at module load. Destructuring crashed `Pg5Descend` on every card.

## Verification

The sandbox this was built in blocks unpkg, so the prototype's CDN React and Babel never load and the page cannot mount the normal way. Rather than ship unverified, the modules were compiled offline — esbuild for the JSX transform, the repo's own vendored React/ReactDOM UMD builds, tokens and swell inlined — into a single self-contained file, and driven in Chromium at 390×844.

All eighteen directions mount; the seven new ones render with no JS errors and no horizontal overflow; each was screenshotted on both Active and Read.

**A defect the screenshots caught and a reading would not have.** `slot`, `returned` and `descend` first shipped with an identical base — name above, text below, 10px gaps — differing only in one element at the bottom. That is precisely the failure the v4 postmortem records (*"the same fuckin' note… but there's an emoji in a different place"*), and it was invisible in the code. Fixed by making each base carry its own mechanism: the rule as a repeated motif in `slot`, compression-of-the-past in `returned`, inverted weight in `descend`.

## Open, deliberately

- Whether the slot's empty invitation reads as *available* or as *owed*. Calm is the floor, and an empty slot with your name on it is the closest any of the seven comes to an obligation.
- Whether `descend` belongs in this exploration at all or is a separate product concept — a response that becomes a share touches sharing, not discourse.
- `bracket` at six voices is dense. It is the answer to "not bloating the page", and it may be too dense to read. That is a judgement to make by looking.
