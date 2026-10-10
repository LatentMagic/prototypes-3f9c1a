# Blind spots

Defect classes that got past a check before. Read before a run, and make the run able to find them.

## The unit that means something different without browser chrome

**Asked:** does this fit the screen?
**Green because:** in a preview with no browser chrome, `vh` and the visible height agree, so a defect that needs them to disagree cannot appear.

A real phone spends about 180px of its 844px height on browser chrome. Treat every viewport-relative unit (`vh`, `dvh`, `svh`, `lvh`) as a place where the preview and a real phone disagree. Look at a chrome-reduced height (about 390 by 664) as well as the nominal one, and re-measure anything sized or anchored in such a unit.

## The container that is sound inside itself and off the screen

**Asked:** does the content overflow its container?
**Green because:** it did not. The container overflowed the screen.

A bottom sheet capped at `100vh` with shorter content never hit its cap, so it never scrolled; anchored to the bottom, its top edge sat above the visible area and could not be reached. Checks ask whether content exceeds its parent. Also ask whether the parent exceeds the screen. Of any fixed or anchored element, ask whether it is on the screen.

Add an entry only for a defect that reached the owner after a validation ran, and name the class, not the instance.
