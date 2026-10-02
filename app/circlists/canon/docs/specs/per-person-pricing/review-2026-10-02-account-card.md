---
date: '2026-10-02'
board: playground/pg-account-card.html
status: leanings, NOT ratified. Nothing here goes into the candidate until the user ratifies it in words.
---

# Account card review: running notes

Integration is deferred so all boards can land in one pass.

## User leanings (said, not ratified)
- 03.1 (rows on desktop, stack on phone): the user liked it but set it aside, because two layouts for one card is asking too much. It stays on the board for reference.
- Even-shaped buttons feel right. The pick is between 01 and 02 (with tweaks). 03 is out.
- Wants to see 01's shape with the card icon on Update. Now on the board as **01.1**.
- Update payment card and Switch to yearly are very different acts and maybe shouldn't look identical. The icon might be enough to set them apart. Not a big deal.
- Desktop layout is good. **Hard rule from the user:** the button group must never wrap into two on one row and one on the next, whatever the alignment. Breakpoints must make it either a single row or a full stack.
- 02 also looks good. The user is undecided between 01 and 02 and puts that down to the lack of a design system, which isn't ours to fix now.
- 02's billing line ("Billed to … · Card ending 4242") should be on one line when it fits and split only when it has to. The current split looks like "text vomit". **02.1** tries two unbreakable phrases with a clipped dot separator.
- N-card: likes "Joining circles is free. Subscribe to run your own." The user's instinct is that the Subscribe button is unnecessary bloat, and they invited a challenge.
- Orphans on mobile (one or two words hanging on the last line) bother the user a lot. This is already covered by ui-design.md.
- Hold off on the state-by-state audit for now (trial, active, failed, ending, pending). Do it after the tweaks, unless there is a specific state worth flagging.

## Ratified
- **02.1** (2 Oct): even pair of buttons with the card icon on Update; the billing line on one line when it fits; Cancel subscription as red text below the rule. The rule: a button's weight comes from its action, so a rare destructive act is quiet red text, and full destructive weight goes to the confirm step.
- **Keep <current plan>** (2 Oct): while a switch is pending, the card offers "Keep monthly" or "Keep yearly", whichever is the current plan, to undo the switch. The user ratified this after talking to the spec agent. It's shown on the board in 01.1 and 02.1 (State: Switch pending). Behaviour change: the switch confirm and the spec need a matching undo.
- **N2** (2 Oct): Subscribe stays a word in the sentence, with no button. The user ratified it, adding that it "just feels better" as text. When it's built, the link's tap area is padded to 44px with no visible change. Deciding fact: the main ways to subscribe are contextual (making a circle, taking one over, resubscribing), so Account is a secondary door.

## Open questions put to the user
1. Cancel: ratified as 02.1 (see above).
2. N-card. The user won't take the Subscribe button as built: the heading says Subscription, the line says subscribe and the button says Subscribe. The button also doesn't fix the orphan. **N3** (a link with a full-size tap target) and **N4** (keep the button, with the line rewritten to give the price) are now on the board.
3. Design-system band-aid. The user asked whether anything could be captured in the harness until a real system exists. Not yet proposed.
4. 01.1 or 02.1: settled as 02.1. The user had already agreed to it; I misread a later remark as reopening it.
5. Switch pending. In 02.1, Update is left alone in a half-width slot. In 01.1 the gap doesn't arise, because Update and Cancel make an even pair. Proposed for 02.1: (a) the lone button goes full width, or (b) the empty slot gets **Keep monthly**, which undoes the pending switch. That's new behaviour: today a pending switch can't be undone from the card. The user is taking (b) to the spec agent; wait for that.

## Recommendations (mine, awaiting ratification)
- **Cancel's treatment is set by the action, not the layout.** (This corrects my earlier "match the neighbours" argument. The user challenged it, and it was a local spacing note in `app/primitives.jsx` that I overstated as a rule.) Common practice is to weight a button by how important and how risky its action is. Cancel subscription is rare and destructive, so the card offers it quietly as red text, the same everywhere, and full destructive weight goes to the confirm step. That fits 02 more naturally than 01.
- **Keep the Subscribe button (N1).** It is the card's only act, and a one-word link misses the 44px touch floor. The calm sentence carries the tone either way.
- **Orphans:** `text-wrap: pretty` is already on card copy, but browsers that don't support it fall back to orphaning. For short fixed lines, join the last two words with a no-break space so they can't be left alone.

## Costs noticed in the new options
- 01.1 needs about 620px of card content to fit three full-label boxes in one row, so the desktop Account column (720) sits close to that threshold. Below it, the buttons stack.
- 02.1 doesn't break inside a phrase, so a very long email address could overflow at 320. The demo email fits.
