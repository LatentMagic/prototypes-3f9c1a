---
name: validate-ui
description: Validate a rendered change in this prototype before it is called done. Render it, check it against what was asked, and report only what is broken. Use in a fresh session that did not build the thing, when the user says $validate-ui or asks to check, validate or QA a build.
metadata:
  author: LatentMagic
  version: "1.0.0"
---

# validate-ui

A front-end change is the one kind of work whose defects are invisible in its own source. The code reads fine and the thing is unusable on a phone. Somebody has to look at it rendered. You are that look.

- **Scope.** One rendered surface or flow in this prototype: a screen, a state, a component, a dialog.
- **Effect.** Either a pass line, or the breaks. Nothing in between.
- **Boundary.** Validates; never fixes, never redesigns. A break goes to the owner and the fix is a separate job.

**Run this in a new session, never the one that built the thing.** The session that built it already believes it works. If you are that session, stop and tell the owner to open a new one.

## Silence is the product

A reviewer has an unlimited supply of things that could be nicer. One that returns a list every time is worse than none, because the reader learns to skim it. The bar is breakage a person would notice and mind: unreadable, unusable, overlapping, cut off, missing, or wrong against what was asked or against a rule the project declares. If you would have to argue that it matters, it does not.

One exception: a control with no accessible name, or a tap target too small to hit, is breakage even though it looks fine. Report it when it makes the thing unusable, never as a score.

## Phases

### Phase 0 - Ground

- Find what you are checking against. The user's prompt names one of: the brief the build came from (its acceptance criteria are the checklist), a spec (read it from the path given), or one specific thing. If none is named, ask the owner once, in chat. Do not invent a standard.
- Find the surfaces, states and widths in scope. A state is reached by its address (see `ARCHITECTURE.md` and `app/README.md`) or through the States and QA aids. If none are named, take every surface the brief or spec touches, at phone and desktop.
- Find what the project declares: `tokens.css`, `CLAUDE.md` and the design law its product block names, `GOTCHA.md`. Read [blind-spots.md](references/blind-spots.md).
- Take nothing about the build on trust: not a handoff, not a summary, not the request's account of it.

A pointer that does not resolve is a break to report, not something to work around or guess past. Name what you could not find.

### Phase 1 - Render it

Open the real page in this environment's preview and look at it. Use only what this environment gives you. If you cannot do one of the following, say so in the report; never claim a check you did not run.

- Reach the state that matters before looking. A screen checked only in its empty state is checked in the one state its defects hide in.
- Look at three sizes: desktop (about 1440 wide), phone (about 390 wide), and phone with the browser chrome taken off the height (about 390 by 664). Use the Config Viewport setting and the preview's own size control.

### Phase 2 - The checks

1. **Against what was asked.** Go through the brief's acceptance criteria, or the spec's statements, or the one thing named. Mark each as met, not met, or not reachable. This is the main check.
2. **Console errors on load**, where readable.
3. **Layout breakage.** Overflow, overlap, clipped text, contrast too low to read, at every size looked at.
4. **What a picture misses.** An element positioned off the screen, a scroll area that cannot scroll, a control with no accessible name, a tap target too small, text present but never painted. Measure boxes against the visible screen, not only against their parent. Where the source uses `vh`, `dvh`, `svh` or `lvh`, look again at the chrome-reduced size.
5. **Declared rules.** Only the rules the project wrote down (`tokens.css`, the design law, `CLAUDE.md`, `GOTCHA.md`). Nothing declared for a point means that check does not run; say so. Never substitute your own taste.

Do not edit any file in the build while validating. Your own findings file is the only thing you write.

### Phase 3 - Report

Write the report to the file the prompt names. If it names none, write `docs/specs/<id>-<topic>/validation-{YYYY-MM-DD}-{topic}.md`. Then say in chat what the file holds, in two lines.

Nothing cleared the bar:

```text
PASS - checked [what] against [what it was checked against] at [sizes]. Ran checks [n, n]; skipped [n] because [reason].
```

Something did:

```text
### Breaks

[Which check] - [where: the screen, state, size]. How to see it: [the steps or address].
What a person would experience. The evidence: [what you saw, the console line, the measured box].

### Ran and clean

The checks that found nothing, and any skipped, with the reason.
```

"Ran and clean" is short and not optional: it tells the reader what was verified rather than assumed. Something you could not reach or could not stage is a break to report too, because a pass that never reached the state is not a pass.

End with a handoff per `create-handoff`: what was checked, what broke, what could not be checked.

## CRITICAL: SILENCE IS A PASS

- DO NOT report a nitpick: a few pixels, a margin you would have set differently, a colour you find drab, wording you would change.
- DO NOT judge against a rule the project has not declared.
- DO NOT take the request's or the handoff's account of the screen as a substitute for looking at it.
- DO NOT look only at nominal sizes; the chrome-reduced one is where some defects appear.
- DO NOT fix or redesign anything. Breaks go to the owner.
- DO NOT pad the report, and DO NOT claim a check you did not run or a state you did not reach.
- DO NOT call it a pass when the state or size a defect needs was never reached.
