# LM-652 — the QA round

2026-08-16. Part A landed in the candidate, Part B is proposed in chat only,
Part C is four playground pages. Nothing here is ratified.

## Part A — defects, fixed in the candidate

| | What changed | Where |
|---|---|---|
| D1 | The fold draws on Read only (`tab === 'read' && item.watching`) | `cand-lm652-card.jsx` |
| D2 | Adding a link enrols the contributor: `watching: true` + `talkSeenAt` | `cand-lm652-add.jsx` |
| D3 | `CAND_OWN_MIN` 1 → 3, placeholder comment kept, marked awaiting ratification | `cand-lm652-parts.jsx` |
| D4 | Open control built into the surface's action row | `cand-lm652-surface.jsx` |
| D5 | A reaction placed in the Add popover carries `atAdd` and rides no turn | `cand-lm652-add.jsx`, `cand-lm652-surface.jsx` |
| — | The alt face's actions take the cross's ink treatment (`.cand-altaction`) | `cand-lm652-card.jsx`, `circlists-lm652.html` |

**Left open, deliberately.** A card can be watched and unread at once — and after
D2 that is every contributor, immediately. The shelf shows nothing for that case.
No second mark was invented.

**Left open, deliberately.** When a reaction given at mark-read should ride a
turn, and what happens when a member reacts but never speaks. `atAdd` narrows the
change to the add-time case alone.

## Part C — the four playgrounds

Each is the real candidate, mounted whole, with one option set laid over it. They
share a shape: the page's own dark header bar carries the five options with their
direction and cost; the app below it is the product, engaged the normal way. The
app's own Config aid (bottom right) owns Viewport — none of the pages duplicates
it. Each page has its own persisted state key, so none of them touches the
candidate's.

| Page | Question | Overrides |
|---|---|---|
| `pg-c1-thought.html` | The contributor's thought, on the card and on the surface | `CircCandidate.CardRow`, `CandIntro` |
| `pg-c2-marks.html` | The marks on a Read card | `SwellDoor`, `CardRow`, `FeedLead`, `CandWatchControl` |
| `pg-c3-return.html` | The return affordance and its dropdown | `CircCandidate.FeedLead` |
| `pg-c4-thought-field.html` | The Add popover's thought field | `CandWrite`, for that field only |

Modules live in this folder as `pg-c1-*`, `pg-c2-*`, `pg-c3-*`, `pg-c4-*`, with
`pg-cx-bar.jsx` shared by C2–C4. No `app/` file and no `cand-*` file was edited to
serve any of them.

### C1 · the thought
Five mechanics, and each varies what the shelf does with the reader's place:
**1 Ledger** expands in place (shelf reflows) · **2 Forward** comes over the shelf
(frozen) · **3 Other side** turns the card over in its slot (no travel) ·
**4 Margin** never opens on the card at all (you leave) · **5 Layer** raises a
sheet (frozen, guaranteed return). A length lever forces every thought to one
line, a paragraph, or a paragraph with bullets. The shelf carries four thoughts
of different lengths among cards carrying none.

### C2 · the marks on a Read card
**1 Words** · **2 Inverted door** (the proposal on the table, built) · **3 A line
of its own** · **4 The edge** · **5 Still talking**. Four say the fold alone can
carry watching and make the corner operable; 3 says no and keeps the toggle. Seed
covers watched-quiet, watched-unseen, unwatched-unseen, unwatched-quiet, and a
card with no conversation.

### C3 · the return affordance
**1 One line** · **2 Rule** · **3 Card, tightened** · **4 Bar** · **5 The cards
themselves**. Three of the five have no open/closed state at all, which is the
axis the question turns on.

### C4 · the thought field
**1 Grow** · **2 Cap and scroll** · **3 Grow, then lift** · **4 Two steps** ·
**5 Room from the start**. Open Add and write a long one.
