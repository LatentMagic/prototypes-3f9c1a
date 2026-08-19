# LM-638 — a champion can resume funding before it ends

Delta built into the main app (no candidate build, no playground): the ending funding
card gains a way back, and the card control that was hidden with it returns.

## What landed

- `app/spaces.jsx` — `fundingStateLine('ending')` gains a third clause: resuming is
  possible until the funding-ends date. The action row is no longer suppressed on
  `ending`: **Update payment card** renders identically to its active-state self, and
  **Resume funding** takes the slot **Cancel funding** holds when funding is active.
  New prop `onResumeFunding`. The state comment block above `MembersSurface` was
  rewritten — its old text asserted there was no way back.
- `app/main.jsx` — `resumeFunding()` clears `funding` on the current space (and
  restores `funded`/`dormancy`), so the card returns to its ordinary funded state:
  marker *Active*, no line, both active controls. No route change, no confirm, no
  charge. Passed to `MembersSurface`.
- `app/feed.jsx` — the `cancel-funding` confirm keeps the full cost and nothing else.
  Its cost sentence was tidied (see choice 7). The multi-paragraph body mechanism added
  mid-build was reverted with the line it was for.

Reachable via the states browser: *Members & funding → Funding — ending on a date*.

## Overruled upstream

**Item 4 of the delta — "the cancel confirmation says you can change your mind" — was
cut on the user's word, 2026-08-19.** The reasoning: cancelling is a cancel, not a pause,
and a reassurance inside the destructive confirm made it read as one. The dialog was also
doing two jobs in a 400px panel that is already the most text-heavy confirm in the app.
The fact that resuming is possible now lives only on the ending card — the surface where
it can actually be acted on. If this is reopened upstream, the line goes back last, after
the cost, and the panel needs a wider measure to carry it.

## Choices made in the open slots

1. **Treatment: secondary.** Resume funding takes the same boxed secondary as Update
   payment card, so the ending card's action row reads as a pair of ordinary controls.
   Primary green was rejected: the accent marks primary actions and brand moments, and
   a filled green button on this card would celebrate a resume the brief says nothing
   should celebrate. A text control was rejected too — the house tertiary in that slot
   is destructive-red, and a plain text control beside a boxed sibling reads as weaker
   than the act is.
2. **Position: second, where Cancel funding sits.** Update payment card stays first.
3. **No icon.** Update payment card's card icon names an object; resuming names no
   object, and a second icon would make the pair look like a toolbar.
4. **Card line:** `Funding ends on <date>. The circle then goes to sleep, and whoever
   funds it next champions it. You can resume funding any time before that date.` —
   appended to the existing two load-bearing clauses, inside the card's
   marker-plus-one-line shape. No second indicator anywhere on the card.
5. **Confirmation's closing line:** `You can resume funding any time before the paid
   period ends.` — last, after the cost. It says *the paid period ends* rather than
   *that date* because the dialog names a period, not a date.
6. **After a resume the card says nothing extra** — it is the ordinary active card.
   No toast, no confirmation line, no "funding resumed" marker.
7. **The cost paragraph was tidied** (ratified 2026-08-19): *"When the paid period ends
   you stop being champion, the circle goes to sleep for everyone, and whoever funds it
   next becomes its champion."* One sentence instead of two. "Champion powers" is gone —
   the word *powers* appeared in no other user-facing string, and the role itself is the
   plainer way to say it. All three protected facts stay: the role ending, the circle
   sleeping *for everyone*, and succession by whoever funds it next.

## Untouched

Dormant and suspended screens, leave, account deletion, the failing-payment card, and
every other surface. A dormant circle still offers only **Fund**, open to every member.
