# The Add-a-link surface — whiteboard

**Latest handoff:** `handoff-2026-08-17_direction-2-integrated.md`

**Resolved (2026-08-17): direction 2, "The other side".** Chosen from the five below, then
resolved part by part on three further boards and integrated into the LM-652 candidate as
`docs/specs/lm-652-discourse/cand-lm652-add.jsx`. What it now is: the link in a white row
with a link glyph at its head → the thought behind a second face that is nothing but room to
write, reached from a prompt row → back by the arrow alone → the written thought returned as
two lines on warm paper with the cut drawn as a fade → mark-as-read and The Swell unchanged
beneath it. Optionality is said once, by the writing face's placeholder: **"Say why you're
sharing it, or leave it blank."**

- `pg-wb-returned.html` (+ `wb-returned.jsx`) — the returned state, 4 answers. Row **1**.
- `pg-wb-return-ctl.html` (+ `wb-return-ctl.jsx`) — the way back, 4 answers. Option **1**.
- `pg-wb-linkslot.html` (+ `wb-link-field.jsx`) — the link's slot, 3 answers. Option **3**.

The original question and the five directions are kept below as the record.

The question: how should adding a link with a thought look and behave? The add
surface has carried four things at once (the required link, the optional thought,
mark-as-read, and The Swell beneath it) without ever being ideated. The full
prompt arrived in chat and is held upstream in business-ops.

- Entry: `pg-wb-add-surface.html` (root, so `app/*`, `tokens.css` and `swell.css` resolve)
- Modules: `wb-add-parts.jsx` (frames, shell, Swell mount), `wb-add-options.jsx`
  (the five), `wb-add-board.jsx` (the board)

Real components mounted, not redrawn: the Swell input trio (`SwellPad`,
`SwellPalette`, `SwellGlyphRadios` — `app/swell-reactions.jsx`), the mark-as-read
switch and the thought's paper (`CandSwitch`, `CAND_PAPER` — the LM-652 candidate
parts), `Field`, `Button`, `Avatar`. Only the FAB is re-drawn, because the shipped
one is `position: fixed` and cannot be mounted inside a frame.

Every option honours the settled rules: bare link fully valid, thought
independent of read state, toggle off by default with The Swell collapsed until
it is on, plain text only, mobile sheet / desktop popover, no overflow.

## The five

| # | Name | Direction | Cost | Length |
|---|------|-----------|------|--------|
| 1 | One box | The link lands in the box as a chip and the same box becomes the writing space | Two behaviours in one control; changing the link is a second gesture | No cap; box grows then scrolls |
| 2 | The other side | Two faces: the link, and a second face that is nothing but room to write | A second step, and the words are out of sight when you commit | No cap; own room, own scroll |
| 3 | The note | The surface is the warm paper itself — no field boxes anywhere | The required link has the weakest target; the Swell needs a white inset | Capped at 500, count from 400 |
| 4 | Asked | No title: "Why this one?" is the title, so the field needs no label | Reads as homework; loudest type goes to the optional thing | Capped at 600, 4 lines at rest |
| 5 | Handed over | Addressed to the circle: the words lead, the link is attached under them | Required sits under optional; borrowed composer idiom | No cap; grows to 200px then scrolls |

## The Swell's framing — its own board

`pg-wb-swell-framing.html` (+ `wb-swell-framing.jsx`). Six routes for how the block
communicates its role and its optionality, each drawn on the **same** host — the
baseline surface — so only the framing varies. Each row reports the measured height
of everything under the toggle row, because the cost here is literally pixels.

1 Said in full · 2 Nothing · 3 The toggle says it · 4 Skip, not a caption ·
5 Until you touch it · 6 A section, not a sentence

## Not decided

The Swell's framing inside the add surface. The candidate keeps its heading and caption; the
whiteboard uses a single caption and no heading. They disagree on purpose — the question was
never answered.
