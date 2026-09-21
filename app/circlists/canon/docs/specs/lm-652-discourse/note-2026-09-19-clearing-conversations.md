# Clearing conversations

A way out of the returns bar that is not reading every card behind it. Lives with
LM-652, the ticket that built the bar.

## The question

The bar's presence is its state: it is there while a watched, read card carries
words you have not seen, and it leaves only when you have been to each card. A
clear ends it in one gesture. The same act on home is more terminal, because the
home strip is the union of every funded circle.

## Held fixed (the user's lean, 2026-09-19)

**One clear for the whole home strip**, never one per circle group — a per-group
clear rebuilds the circle's own bar inside home. The cost it buys: a member who
wants to clear one busy circle goes into it. Not built, deliberately: per-row
dismiss, and a per-group clear.

## Round one, rejected (2026-09-20)

All three were rejected, and the rejection was of the *affordance*, not the
placement: a text "Clear" loose beside the bordered chevron in the collapsed
head (two registers colliding in the one row that is always on screen), and a
clear row at the foot of the panel that read as one more conversation, cut off
from its own subject by "More in the circles below". The third option was not a
third idea — it was the second with undo bolted on.

The rule taken from that: **the act may borrow the BAR's forms — the rule, the
boxed 34px control, the hairline, the card's own edges — and never the ROWS'
forms.** No title over subtitle, no trailing chevron, nothing that invites a
press expecting a conversation.

## The axis (round two)

What KIND of thing the act is, not where it sits:

1. **The base** — furniture. The open panel gains a floor: a full-bleed band on
   the sunken surface carrying the act, the true count and the teaching line,
   and absorbing "More in the circles below".
2. **The pair** — a peer of the chevron. Nothing collapsed; open, the head's two
   lines fall to one short count and a second boxed control stands beside the
   chevron, same height, border and radius.
3. **The sweep** — a gesture. No control in either state: the collapsed bar is
   pulled aside, grey while it can still be taken back, accent once a release
   will act.

**Protection is no longer the axis** (the user's call: get the affordance right
first). All three act at once, and an **undo lever** in the rig's chrome turns
the receipt on across all three, so reversal is judged on its own.

## What clearing is

`talkSeenAt` moves forward to now on every card the bar stands for — the same
write `app/talk-surface.jsx` makes when you leave a conversation. Nothing is
deleted and nobody else's view moves, which is why all three say so in the same
words: *"Marks them seen in your view. The conversations stay on the cards."*

## The rig

`playground/pg-clear-conversations.html` — the real app, both bars swapped for
forks of `app/talk-return.jsx` and `app/home-returns.jsx`. Seeded at the home
strip's ceiling (five talking circles, cloned the way `app/states.jsx`'s
`stageHome({ crowd })` clones) so the terminal clear is felt rather than
described. "Put them back" re-seeds, since clearing is terminal by construction.

**What the rig surfaces that the brief did not:** on home the panel shows six
rows from three circles while the clear ends the whole union — ten conversations
in four circles on this seed. Option 1's band is the only one that carries the
total *and* the circle count at the point of the act; option 2 carries it in the
head's line; option 3 carries nothing, because a gesture cannot say anything.

**On whether undo belongs here at all.** Clearing destroys no content — every
word stays on its card — so the loss is not the talk, it is the *index*: after a
clear there is no way to reconstruct which cards had words you had not seen.
That, not data loss, is the case for undo, and it is the same case notification
surfaces usually decline to make.
