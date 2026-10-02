# Review 2 Oct: subscription page on a phone

Board: `playground/pg-subscribe-phone.html`.

## Ratified, in Joe's words
- **01.2, at every width.** "Integrate this." Desktop is the centred column from 01's desktop frame, which replaces the candidate's two columns. I first built phone only, having misread "That seems reasonable" (Joe meant the principle note). Corrected: "the rest was implicit. Fucking get it in."
- **Save £10** on the yearly pill: "I really like the Save £10. I think that's probably the way to go." Joe will feed this back to the pricing agent upstream.
- The receipt rows reuse the Account card's rows: "I really like the reuse of our new row system."

## 01.2, as built into the candidate (phone and desktop)
- Pill reads Save £10. Under the plans are the receipt rows: Due today, then From <date> or Renews.
- Both states: the lede reads "Subscribe to run your own circles.", held whole. (Free month used first kept "Joining circles is free. Subscribe to run your own."; Joe moved it to the same lede on 2 Oct.)
- "A card is needed to start." is cut. Under the button is "Cancel before <date> and pay nothing."
- The ticks are centred as a group.
- The heading scales: `clamp(24px, calc(8.57cqi + 0.34px), 30px)` on the page's container width.

## Set aside / open
- The desktop board (`pg-subscribe-desktop.html`) is superseded by this choice. It stays on the record.
- Joe on losing "Joining circles is free." from the trial page: "unfortunate to lose the copy that we had because I really liked it, but yeah, it's cool to try."
- The heading at 320 in 01.1 failed on alignment, not overhang: a narrow block over a full-width page. Fixed in 01.2 by the scale.
- The principle note (a role never changes; the levers in order: size, spacing, layout, rewording) is ratified and now in CLAUDE.md under Designing, revised per Joe's agent. Proposed upstream for `ui-design.md` "Every width is designed".
