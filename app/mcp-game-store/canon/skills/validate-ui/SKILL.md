---
name: validate-ui
description: Validate a rendered change in this prototype before it is called done. Render it, fix what is broken, and report what needs the owner. Use in a fresh session that did not build the thing, when the user says $validate-ui or asks to check, validate or QA a build.
metadata:
  author: LatentMagic
  version: "1.1.0"
---

# validate-ui

A front-end change is the one kind of work whose defects are invisible in its own source. The code reads fine and the thing is unusable on a phone. Somebody has to look at it rendered. You are that look.

- **Scope.** One rendered surface or flow in this prototype: a screen, a state, a component, a dialog.
- **Effect.** Breaks fixed in place, then the report: what was fixed, what differs from the brief, what needs the owner. Or a pass line.
- **Boundary.** A UI check, not a requirements audit. Fixes what is broken with the smallest change; never redesigns, and never changes a taste call.

**Run this in a new session, never the one that built the thing.** The session that built it already believes it works. If you are that session, stop and tell the owner to open a new one.

## Silence is the product

A reviewer has an unlimited supply of things that could be nicer. One that returns a list every time is worse than none, because the reader learns to skim it. The bar is breakage a person would notice and mind: unreadable, unusable, overlapping, cut off, missing, dead, or against a rule the project declares. If you would have to argue that it matters, it does not.

One exception: a control with no accessible name, or a tap target too small to hit, is breakage even though it looks fine. Treat it as a break when it makes the thing unusable, never as a score.

## Phases

### Phase 0 - Ground

- Find what the prompt points you at: the brief the build came from, a spec (read it from the path given), or one specific thing. It tells you where to look and what the surface is meant to be. It is orientation, not a checklist to tick line by line. If none is named, ask the owner once, in chat.
- Find the surfaces, states and widths in scope. A state is reached by its address (see `ARCHITECTURE.md` and `app/README.md`) or through the States and QA aids. If none are named, take every surface the brief or spec touches, at phone and desktop.
- Find what the project declares: `tokens.css`, `CLAUDE.md` and the design law its product block names, `GOTCHA.md`. Read [blind-spots.md](references/blind-spots.md).
- Take nothing about the build on trust: not a handoff, not a summary, not the request's account of it.

A pointer that does not resolve is a break to report, not something to work around or guess past. Name what you could not find.

### Phase 1 - Render it

Open the real page in this environment's preview and look at it. Use only what this environment gives you. If you cannot do one of the following, say so in the report; never claim a check you did not run.

- Reach the state that matters before looking. A screen checked only in its empty state is checked in the one state its defects hide in.
- Look at three sizes: desktop (about 1440 wide), phone (about 390 wide), and phone with the browser chrome taken off the height (about 390 by 664). Use the Config Viewport setting and the preview's own size control.

### Phase 2 - The checks

1. **Console errors on load**, where readable.
2. **Dead or unreachable.** Controls that do nothing, states that cannot be reached, screens with no way on or back, and anything the brief names that a bug keeps from showing.
3. **Layout breakage.** Overflow, overlap, clipped text, contrast too low to read, at every size looked at.
4. **What a picture misses.** An element positioned off the screen, a scroll area that cannot scroll, a control with no accessible name, a tap target too small, text present but never painted. Measure boxes against the visible screen, not only against their parent. Where the source uses `vh`, `dvh`, `svh` or `lvh`, look again at the chrome-reduced size.
5. **Declared rules.** Only the rules the project wrote down (`tokens.css`, the design law, `CLAUDE.md`, `GOTCHA.md`). Nothing declared for a point means that check does not run; say so. Never substitute your own taste.

### Phase 3 - Fix

Fix each break in place with the smallest change that mends it. Look at it rendered again, at the size it broke, to confirm. Lean toward fixing. Stop after three failed attempts at one break and report it instead.

- **A difference from the brief is not a break.** Where the build differs noticeably from the brief or spec in what it does or shows, assume the owner changed it on purpose after the brief was written. Leave it and list it as "differs from the brief, left alone".
- **A small slip that is plainly a defect is a break.** A label cut off, a state the brief names that cannot be reached because of a bug: fix it.
- **Taste goes back, unfixed.** Wording, layout choices, a look that could be better: report it, short, and change nothing.

### Phase 4 - Report

Write the report to the file the prompt names. If it names none, write `docs/specs/<id>-<topic>/validation-{YYYY-MM-DD}-{topic}.md`. Then say in chat what the file holds, in two lines.

Nothing in any list below:

```text
PASS - checked [what] against [what it was checked against] at [sizes]. Ran checks [n, n]; skipped [n] because [reason].
```

Otherwise:

```text
### Fixed

[Where: the screen, state, size]. What was wrong. What changed. File.

### Differs from the brief, left alone

What the build does or shows, and what the brief says. One line each.

### Needs the owner's eye

Taste or design calls, short, unchanged.

### Could not check

What you could not reach or stage, and why.

### Ran and clean

The checks that found nothing, and any skipped, with the reason.
```

Leave out an empty list. "Ran and clean" is short and not optional: it tells the reader what was verified rather than assumed. Something you could not reach or stage goes under "Could not check", because a pass that never reached the state is not a pass.

End with a handoff per `create-handoff`: what was checked, what was fixed, what was left, what could not be checked.

## CRITICAL: SILENCE IS A PASS

- DO NOT report a nitpick: a few pixels, a margin you would have set differently, a colour you find drab, wording you would change.
- DO NOT audit requirements. The brief orients you; it is not a checklist.
- DO NOT fix a difference from the brief. Assume the owner meant it, and list it.
- DO NOT change anything that needs taste or a design decision. Report it.
- DO NOT judge against a rule the project has not declared.
- DO NOT take the request's or the handoff's account of the screen as a substitute for looking at it.
- DO NOT look only at nominal sizes; the chrome-reduced one is where some defects appear.
- DO NOT redesign. Mend a break with the smallest change, and look again rendered to confirm.
- DO NOT pad the report, and DO NOT claim a check you did not run or a state you did not reach.
- DO NOT call it a pass when the state or size a defect needs was never reached.
