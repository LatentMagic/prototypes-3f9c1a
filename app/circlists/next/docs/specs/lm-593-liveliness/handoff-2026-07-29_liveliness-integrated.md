---
date: '2026-07-29'
topic: 'liveliness-integrated'
status: 'integrated — corrected; no open questions'
type: 'spec'
---

> **Correction (2026-07-29, later).** The review switches this document describes were wrong to
> exist. Playground options do not belong in `app/config.jsx`. **Removed:** card time, arrival
> halo, last-seen rule, nothing-new answer, and the “Unfound” staging button. Config now carries
> **staging only** — background activity, and *In this circle* / *In another*. Two further
> corrections landed with it, both described in place below:
> - the last-seen rule is now **NEW**, drawn *above* the arrivals (it names the latest, not the past);
> - the arrival is a **wash**, not a halo: the card itself goes sage and resolves to its own white.
>
> Still open: nothing. The nothing-new answer is settled — see *The resolve* below.

# Handoff: LM-593 liveliness is INTEGRATED

## Current Focus

The arrival grammar is **in the product**, all three postures, behind no flag. `app/liveliness.jsx`
holds it; the playground (`liveliness-playground.html`) is now a **historical artifact**, not the
spec — the app is. Do not port anything else out of it without re-reading this document; several
playground options were explicitly rejected (see "Rejected" below).

Everything is settled. The last-seen rule is `NEW` + seam; the nothing-new answer is the arc
closing into a complete ring. Neither is a switch.

Both are live switches in **Config → Liveliness**, so the user can flip them in the running app
rather than reading a proposal. Do not remove those switches until the questions close.

## The grammar (this is the thing to protect)

> The app notices arrivals itself → signals quietly → the reader accepts.

Three signals, one vocabulary, and the **accept is the only thing that ever moves content**:

| Signal | Where | Means | The accept |
|---|---|---|---|
| **Micro dot** | beside a circle — web rail, mobile drawer, app home | this circle holds links you have not seen | opening the circle clears it |
| **New pill** (dot + "New") | top of the feed you are in | links landed while you were reading | clicking it lands them |
| **Arrival wash** | on the cards that just landed | *these* are the ones | it fades on its own |

Hard rules, all of them load-bearing:

- **No counts, no badges, no numbers, no toasts, no status colour.** The dot means unseen items,
  never presence.
- **Detection is silent.** Nothing renders while the app checks. The dot and the pill are its only
  visible consequences.
- **The feed never shifts underfoot.** Background arrivals into the circle you are IN go to
  `space.pending` and wait behind the pill. Arrivals elsewhere land in `items` and light the dot.
- **Sage is the mark's light, not a status colour.** An arriving card *washes* sage and resolves to
  its own white — the colour is in the card itself. No ring, no halo around it, nothing that
  travels across it. If sage ever *rests* on something, the rule has been broken.
- **The last-seen mark is frozen for the visit.** Entering a circle clears its dot but must NOT
  move `lastSeenAt` — the member is reading against that position. It is re-set on **leave**, and
  anything still waiting behind the pill is re-marked to land *above* it, so unrevealed arrivals
  read as new next visit instead of silently ageing into the pile.

## Reload is clicking the circle you are already in

There is **no refresh button** — not next to settings, not anywhere, and this was stated flatly.
Clicking the already-current circle in the rail/drawer navigates nowhere and refreshes instead.
Consequences that are easy to break:

- The busy state sits in **that circle's own signal slot** (`CircleSignal state="busy"`), not over
  the feed. Nothing blanks; the drawer stays open.
- `CircleSignal` is **one slot, three exclusive states** (`busy` / `settled` / `unseen`) so a
  circle can never wear two signals at once. Keep it that way.
- Whatever a refresh finds surfaces through the **same New pill** the silent background check
  uses. One consequence, one vocabulary.

## The resolve (SETTLED)

The user's position: a tick felt **aggressive**, and the spinner alone is enough validation. Their
agent pushed for an explicit "up to date". Shipped resolution, offered as something to react to:

> The spinner **is** the mark. When a refresh finds nothing, its arc **closes into a complete ring**,
> rests a beat, and fades (`.circ-sig-settle`, 1500ms). Same object, no new vocabulary, no words,
> no tick, no status colour.

**How the close is built** (`BrandSpinner resolving`): the arc's wrapper (`.circ-spinner-arcwrap`)
cross-fades out while a full ring of the same radius and stroke fades in, over 380ms. The rotor
keeps turning underneath — a closed ring rotating is indistinguishable from a still one, which is
what makes it continuous. **Never swap in a second component** (an earlier pass rendered `PulseMark`
for this and the cut read as brutal). The screen-reader equivalent says "Up to date".

**Do not resolve this by adding a tick or a text line.** Both were considered and both over-claim
at this size. If the resolve reads as too little, the next move is a longer rest, not a new object.

## The last-seen rule (CORRECTED)

`Earlier` was wrong: it leaned on what came *before*, when the rule exists to point at the latest.
Shipped now:

- **NEW** — 10.5px uppercase, `--color-fg-3`, at the left, hairline running out to the edge, drawn
  **above** the items that landed since the last visit. Same treatment the user liked; the label
  now heads the arrivals instead of closing them off.
- A plain hairline (`FeedSeam`) **closes** the group where the already-seen items resume. Without
  it the label reads as a header for the entire feed — the label alone is not enough in a
  newest-first list.
- Both drawn only when items sit on **both** sides (`circDividerIndex` returns -1 otherwise).
- Active tab only. Read is a shelf, not a timeline.
- No variants. The sentence and `off` options are gone.

## Card time

Coarse words on the attribution line: `just now`, `47m`, `6h`, `yesterday`, `3d`, `2w`. **No
interpunct** — the dot separator was explicitly dropped; space alone, `gap: 9`. `flexShrink: 0`, so
a long attribution ellipses before the time does. Derived from `item.at` at render, not a stored
string, so it stays honest as a session ages.

## Where it lives

| File | What it gained |
|---|---|
| `app/liveliness.jsx` | **new** — `circWhen`, `circDividerIndex`, `CircleSignal`, `NewPill`, `FeedDivider`, `FeedSeam`, `circNextDrop` |
| `circlists.html` | `.circ-arrive`, `.circ-newpill`, `.circ-fdiv*`, `.circ-fseam`, `.circ-sig*`, `.circ-spinner-ring`, `.circ-vh`; script tag after `brand-motion.jsx` |
| `app/brand-motion.jsx` | `BrandSpinner resolving` — the arc-to-ring close |
| `app/main.jsx` | `live.activity` (staging only), `refreshing`/`settledId`/`arrived`, `landItem`/`revealPending`/`refreshSpace`, leave-re-marking in `enterSpace`, dot-clearing effect, `liveActions` |
| `app/shell.jsx` | `RailBody` signal slot + click-to-refresh; `AppShell` passes `refreshingId`/`settledId`/`onRefreshSpace` |
| `app/home.jsx` | app-posture home rows carry the dot |
| `app/feed.jsx` | `showTime` prop; time from `item.at`; no interpunct |
| `app/seed-data.jsx` | `it.at` per item; `lastSeenAt`/`unseen`/`pending`/`queued` per circle; `STATE_KEY` → `circ_state_v10` |
| `app/config.jsx` | the **Liveliness** block |

**Shared surface, not forked.** The dot, pill, halo, rule and card time are the same components in
all three postures; only *where the circle list lives* differs (rail / drawer / home). If you find
yourself writing a posture branch inside any of these, you have taken a wrong turn — see
`ARCHITECTURE.md`.

## Testing it (Config → Liveliness)

The grammar is silent by design, so it cannot be seen without staging:

- **Background activity** — `off` / `slow` (~20s) / `fast` (~7s). Drops links into random funded
  circles on a timer.
- **Stage an arrival** — *In this circle* (→ New pill) or *In another* (→ dot). Two, not three.
- Nothing else. The grammar is not a set of options.

Session-only, and **the defaults ARE the shipped behaviour** — deleting `app/config.jsx` leaves the
product at its intended posture, per the deletable-aids rule.

Seeded state: only **Tuesday Book Club** stages a return visit (`NEW_ON_ENTRY`), so the landing
circle is quiet and the dot + rule can be watched arriving on a circle you switch *into*. Reset via
Config → Reset to seeded data if `circ_state_v10` gets stale.

## Rejected — do not reintroduce

- **A refresh button** next to settings, or anywhere. Clicking the circle is the gesture.
- **A tick / checkmark** after a refresh. Explicitly called aggressive.
- **The left-to-right sweep** on arriving cards — "too flourished". The card washes; nothing travels.
- **A ring or halo around an arriving card.** The colour belongs *in* the card.
- **Playground switches in `app/config.jsx`.** Config stages scenarios; it does not hold design options.
- **Swapping in a second mark** for the nothing-new answer. The spinner resolves in place.
- **The interpunct** before the card time.
- Counts, unread numbers, badges, toasts, "who read it" signals.

## Action Items & Next Steps

1. `docs/ABOUT.md` and `CLAUDE.md` do not yet mention liveliness. Worth a line — **ask first**.
2. CHANGELOG entry is **already written** (2026-07-29). Do not amend it as this iterates; it
   captures the shape, once.
3. GOTCHA.md — nothing here has earned an entry yet.

## Other Notes

- The user reacts fastest to **over-decoration and over-claiming**. Every rejection above is one of
  those two. When in doubt, the quieter option is the one they meant.
- "Calm is the floor" is not a style note here — it is the acceptance criterion. If a signal creates
  urgency, obligation, or a count to clear, it is wrong regardless of how good it looks.
