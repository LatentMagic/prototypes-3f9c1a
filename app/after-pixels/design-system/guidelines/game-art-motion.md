# Game art motion and shape

The motion and shape rules apply to any game's art, whichever component draws it.

**The five pieces below are worked examples, not the game library.** Daily Mystery, Daily Word, Daily Groups, Casebook and 36,000 Summers Ago show how to describe a piece and how it moves. They are not a catalogue of the games, and a product should not assume its games use these pieces. Real game art comes from the game's owner, and each new piece follows the describe-then-draw method.

## Story first, then motion

Decided 2026-10-19 by the owner.

Every piece of art tells one small story about its game. Write the story before choosing any move. It has three parts.

1. **The rest stands on its own.** The resting art says what the game is with no help from motion. Many people never hover, touch shows the change only under a finger, and reduced motion never shows it. If the rest only reads as a setup for the hover, redraw it.
2. **The end pose is the payoff.** It says what happens in the game: the word is solved, the place is found, the culprit is named. Draw it as a still at every frame shape and review rest and end as a pair, before any motion exists.
3. **The change tells the story too.** The path from rest to end should call up what the player does: a guess filling in, a search closing on its target. A move that only carries the shapes from one pose to the other, with no sense of the game, is the wrong move.

Write the story as one line with the piece: "At rest, X. On hover it becomes Y, by Z." Then pick the move that does Z.

## Motion

The art answers the pointer by changing form. It holds the new form until the pointer leaves, then returns. Any move is open: change of form (square to circle), travel, rotation, growth, fills. Choose it for the story, not from the moves other pieces use. Borrowing a worked example's move for a different game is a sign the story came second.

1. **One timing.** 400ms on `--ease-art` (cubic-bezier(.45,0,.2,1)), going in and coming back. Never a slow in and a quick out, or the reverse.
2. **Nearly in step.** Shapes in a piece start together. Any stagger is 50ms or less per shape and 120ms or less in total, and it applies going in only; coming back, everything returns together. A visible 1, 2, 3, 4 reads as slow.
3. **Land at any size.** Art appears at many sizes, and every move must end in the right place at all of them. A move that has to meet something (a needle reaching its mark, a tile reaching its row) is set by where it ends, in proportion to the frame, never by a pixel distance. Only open-ended moves, which don't arrive anywhere (bars rising, a sun stepping up), may be capped in pixels (about 18px for the largest), so big art travels no further than small art. Prefer moves that land by construction: turns about a fixed point, growth from a fixed edge, fills inside a shape's own box.
4. **Shapes stay whole.** A shape may change form (square to circle, bar top rounds) but is never cut, broken or left with a stray edge. A triangle grows from its base; it never lifts off its edge.
5. **Edges stay anchored.** Anything that touches an edge at rest still touches it in the hover pose. Bars run past the bottom edge so they can rise without exposing a gap.
6. **Nothing scales the tile.** The frame never grows and the layout never shifts. The art's contents move inside it.
7. **Hold, don't reset.** Leaving partway reverses from wherever the shapes are, no restart.
8. **Reduced motion:** no transitions; the art does not change. The rest has to carry the story alone.

## Review in frames

Check a piece as a strip of stills side by side: rest, halfway, end, at the smallest and the largest size it is used at. Failures show halfway and at the size extremes, not in the rest still. Choose between options by looking at frames, not by describing them.

Before a piece is approved:
- Does the rest say what the game is, with no motion?
- Does the end pose say what happens in the game?
- Does the halfway frame already hint at it?
- Does every move that must meet something arrive, at every size?
- Is anything taken from another piece's hover?

Two worked examples of the story:
- **Daily Mystery.** At rest, a ring beside a cigarette. On hover it becomes a bullseye, by the ring shrinking until its hole closes. That makes it feel like a murder.
- **Daily Word.** At rest, a green tile, an amber tile and a small grey outline: one guess marked. On hover the outline grows to a full tile and fills, a letter not in the word, so the three tiles read as a whole marked guess.

Both are drawn in full under Shape below.

## When art moves

> A cover plays its motion as the hover, focus and press response of the nearest pressable thing it sits in; with nothing pressable around it, it is still.

"Cover" is any game art, whichever component draws it. The motion says "this opens", so it belongs to whatever opens.

- **On a card or link.** The card or link is the target and the cover moves with it. Pointing at, focusing or pressing any part of it plays the pose.
- **On its own.** Art on a game page header, in a dialog, or in a non-clickable `Card` does not answer a pointer or a touch. It shows its resting form and nothing else.
- **Small art moves too.** A 40px cover in a clickable `ListRow` lead plays the same pose with the row. Travel is in proportion to the frame and capped, so small art moves a little; there is no size below which it stops.

In the build, a clickable `Card`, `ListRow` or `Cover` is the host by itself. Any other link or button takes the class `mcp-art-host` on the whole `<a href>` or `<button>`.

A card that holds a second control (a Pass tag that opens something) can't be one button, because a button can't sit inside another. Make it a box with `mcp-art-host`, and give its one main link or button, stretched over the whole card, the class `mcp-art-link`. The art moves when that link is pointed at, focused or pressed. Over the second control it rests, because pressing that doesn't open the game.

Anywhere else `mcp-art-host` does nothing on an element that isn't pressable, and art outside a host sits at rest.

## Hover surface

The whole card is the hover surface: art, title and the space around them. Hover, keyboard focus (`:focus-visible`) and press all play the pose. Where the title is underlined (GameTile's name), the underline is there at rest and takes its hover look at the same moment (visual-foundations.md, Underlines).

## Touch

No hover, so the pose plays while a finger is down on the card, as a button shows it is pressed, and returns on release. A tap opens the game. Text on the card is not selectable and the phone's selection and callout stay off it, so a long press never starts selecting a word; the card shows the pose and the shaded fill while the finger is down, and a tag on the card keeps its box. (A real link, an `<a href>`, keeps the phone's long-press menu.) A scroll that starts on a card cancels the pose.

## Extending a cover

**Every visual asset must declare how it extends** when its box is taller than its drawing. The declaration is written with the asset, beside its ground colour, and nothing is inferred from the picture. An asset without one can't be used where its box may change shape.

- **Bottom:** the subject stands on the bottom edge. The drawing stays put on the bottom; the ground grows above it.
- **Centre:** the subject floats. The drawing stays centred; the ground grows above and below equally.

Either way the drawing keeps its size and shape: no stretch, no crop. A cover has one flat ground colour so it can extend.

## Title on the cover

Text sits on a cover in one place only, the page head of a single game: the label and title, in light text, bottom-left. It is the strictest test of a cover, so art that passes there is safe on every other surface without a further check.

- **Light shapes stay in the right half.** Cream and the other light cover colours sit in the right half of the drawing.
- **The test:** each cover with its real label and title, at every width that page reaches, phone to wide desktop. No text touches a shape it fails AA against.
- **A fail is fixed in the art.** Redraw the piece. Never change the text, and never add a scrim or a plate behind it.
- **A new or renamed game is tested again.**

## Shape: describe first, then draw

The five pieces that follow are examples of the method.

### Daily Mystery
A cigarette beside a ring. An orange ring left of centre and an upright cream cigarette with an amber tip to its right. Wine ground.
- Always: the ring is whole and never touches the cigarette; the tip sits on top of the cigarette.
- May change: drawn on a centred 4:3 stage, so square and wide frames show the whole piece with more wine around it, never a crop.
- Extends: from the centre.
- Hover: the ring shrinks to 45% of its size and becomes a bullseye. The cigarette and its tip round their tops and rise together (capped at 12px), 50ms behind.

### Daily Word
Three tiles of a guess, in the game's own marks. Three squares in a row across the middle on forest: green (in place) and amber (in the word) solid, and on the right the block for a letter not in the word, a thin grey outline (control edge) at .625 of its tile.
- Always: the three tile boxes are the same size and evenly spaced; green and amber never move. The grey block stays centred in its box.
- May change: drawn on a centred 4:3 stage, like Daily Mystery.
- Extends: from the centre.
- Hover: the grey block grows to full tile size as its outline thins away, over 400ms, and fills grey 100ms behind, over 300ms. Three full tiles: a marked guess. On touch, the product's game-page cover opens and closes the block by tap (the product owns that; ratified by the owner in the product, 2026-10-27).

Each piece is written in words before it is drawn. The words say what must stay true and what may move, so the art can be recomposed for square (1:1), landscape (4:3) and wide (3:1) frames without losing anything. A frame that doesn't suit the original drawing gets a recomposition, not a crop. Write the description, then draw each frame from it.

### Daily Groups
The four groups of a solved board. Sixteen equal squares in a 4 by 4 grid on indigo, one colour per row: amber, teal, orange, lilac from the top.
- Always: the grid is square and whole; gaps are about a third of a square; at least one gap's width of indigo on every side.
- May change: in wider frames the grid sizes to the height and stays centred; indigo fills the sides.
- Extends: from the centre.
- Hover: every square rounds into a dot, in a quick wave from the bottom left to the top right.

### Casebook
A line-up under a low sun. Three upright bars stand on the bottom edge, orange, lilac and cream, with an amber sun above and to the right of them. Indigo ground.
- Always: bars run off the bottom edge; lilac is tallest, cream shortest; the sun is a whole circle and never touches an edge or a bar.
- May change: in wider frames the bars get narrower and closer together, and the sun moves further right and lower relative to the frame.
- Extends: from the bottom edge.
- Hover: the bars round their tops and rise by different amounts together; the sun turns square and sinks a little, 50ms behind.

### 36,000 Summers Ago
Dawn over open ground. A lilac peak rises from the bottom edge, right of centre, with an amber sun half behind its left slope. A small teal square sits low on the left, a smaller cream square high on the right. Forest ground.
- Always: the peak runs off the bottom edge; the sun is a whole circle, partly covered by the peak; the cream square is the smallest shape.
- May change: in wider frames the peak narrows relative to the frame and moves towards the centre, with the sun kept tucked against its left slope.
- Extends: from the bottom edge.
- Hover: the teal square rounds, the sun turns square and rises, the peak grows 7% from its base, the cream square rounds and steps up and right.
