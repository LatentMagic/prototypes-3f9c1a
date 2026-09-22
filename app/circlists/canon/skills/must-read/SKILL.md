---
name: must-read
description: >
  Close a finished body of work by naming the one thing the user cannot skip.
  Fires after work is done — a change landed, a doc written, a review run — not
  after conversation or a question answered. Invoke with $must-read.
metadata:
  version: "1.0.0"
---

# must-read

After finishing a body of work, assume the user read none of it. Close by naming the one thing they cannot skip.

Not conversation. Not a question answered. Work done.

## Rules

- **One item. Two at most.** Ranked by cost-if-wrong, not by size.
- **Point precisely** — file + line, or the section. Never "review the changes".
- **Assume no context is loaded.** They're on a phone, not in the codebase, and haven't read what you just did. Anything you reference — or ask about — has to carry enough to be understood cold. A name that means something only to someone who just read the work is not a reference; it's a lookup you've handed them.
- **Say why it matters** in a clause. The pointer without the stake gets skipped.
- **A must-read is not a summary.** It is what you would flag if you had one sentence and they were walking away.
- Nothing genuinely load-bearing → say that, plainly. Don't manufacture one.

## When the must-read is dense

Reach for whichever shaping skills this project actually has — cut it down, strip the jargon, or show the shape instead of describing it. If none are available, do those three things by hand: fewer words, plainer words, a sketch over a paragraph.
