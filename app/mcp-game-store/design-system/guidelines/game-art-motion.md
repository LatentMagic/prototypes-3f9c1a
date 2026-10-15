# Game art motion and shape

Decided 2026-10-09 from the playground review. The motion and shape rules apply to any game's art, whichever component draws it.

**The five pieces below are worked examples, not the game library.** Daily Mystery, Daily Word, Daily Groups, Casebook and 36,000 Summers Ago show how to describe a piece and how it moves. They are not a catalogue of the games, and a product should not assume its games use these pieces. Real game art comes from the game's owner, and each new piece follows the describe-then-draw method.

## Motion

The art answers the pointer by changing form, using the loader's own moves: square to circle, a small step up and to the right. It holds the new form until the pointer leaves, then returns.

1. **One timing.** 400ms on `--ease-art` (cubic-bezier(.45,0,.2,1)), going in and coming back. Never a slow in and a quick out, or the reverse.
2. **Nearly in step.** Shapes in a piece start together. Any stagger is 50ms or less per shape and 120ms or less in total, and it applies going in only; coming back, everything returns together. A visible 1, 2, 3, 4 reads as slow.
3. **Capped travel.** Distances are capped in pixels (about 18px for the largest move, 14px for the sun), so big art moves no further than small art and finishes in the same time.
4. **Shapes stay whole.** A shape may change form (square to circle, bar top rounds) but is never cut, broken or left with a stray edge. A triangle grows from its base; it never lifts off its edge.
5. **Edges stay anchored.** Anything that touches an edge at rest still touches it in the hover pose. Bars run past the bottom edge so they can rise without exposing a gap.
6. **Nothing scales the tile.** The frame never grows and the layout never shifts. The art's contents move inside it.
7. **Hold, don't reset.** Leaving partway reverses from wherever the shapes are, no restart.
8. **Reduced motion:** no transitions; the art does not change.

## Say something about the game

The hover describes what the game is, and where it can, becomes something more meaningful than the resting art. It is a change of meaning, not only a change of form. The motion rules above still apply; this rule picks which change to make.

- **Daily Mystery.** The ring beside the cigarette shrinks to about half its size, closing its hole until it reads as a bullseye. That makes it feel like a murder.
- **Daily Word.** The empty outline on the right thickens until it is filled and rounds into a circle, so the art ends as three filled circles: the word is solved.

Both are drawn in full under Shape below.

When writing a piece's hover line, say what the change means as well as what moves. If a form change says nothing about the game, look for one that does.

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

The whole card is the hover surface: art, title and the space around them. Hover, keyboard focus (`:focus-visible`) and press all play the pose. The title underline appears at the same moment, on every layout (tile, wide featured card, list row).

## Touch

No hover, so the pose plays while a finger is down on the card, as a button shows it is pressed, and returns on release. A tap opens the game. Text on the card is not selectable and the phone's selection and callout stay off it, so a long press never starts selecting a word; the card shows the pose and the shaded fill while the finger is down, and a tag on the card keeps its box. (A real link, an `<a href>`, keeps the phone's long-press menu.) A scroll that starts on a card cancels the pose.

## Extending a cover

Decided 2026-10-12 (docs/specs/cover-beside-heading/).

**Every visual asset must declare how it extends** when its box is taller than its drawing. The declaration is written with the asset, beside its ground colour, and nothing is inferred from the picture. An asset without one can't be used where its box may change shape.

- **Bottom:** the subject stands on the bottom edge. The drawing stays put on the bottom; the ground grows above it.
- **Centre:** the subject floats. The drawing stays centred; the ground grows above and below equally.

Either way the drawing keeps its size and shape: no stretch, no crop. A cover has one flat ground colour so it can extend.

## Shape: describe first, then draw

The five pieces that follow are examples of the method.

### Daily Mystery
A cigarette beside a ring. An orange ring left of centre and an upright cream cigarette with an amber tip to its right. Wine ground.
- Always: the ring is whole and never touches the cigarette; the tip sits on top of the cigarette.
- May change: drawn on a centred 4:3 stage, so square and wide frames show the whole piece with more wine around it, never a crop.
- Extends: from the centre.
- Hover: the ring shrinks to 45% of its size and becomes a bullseye. The cigarette and its tip round their tops and rise together (capped at 12px), 50ms behind.

### Daily Word
Three tiles of a guess. Three equal squares in a row across the middle on forest: amber and cream solid, an empty teal outline on the right.
- Always: the three tiles are the same size, at rest and in the hover pose, and evenly spaced; at rest the outline tile is hollow. The outline sits inside its tile's box, so it never grows or moves.
- May change: drawn on a centred 4:3 stage, like Daily Mystery.
- Extends: from the centre.
- Hover: amber and cream round into circles in a quick wave. The outline's border thickens inward until it fills the tile completely, with no hole left, as it rounds, over 240ms. Three filled circles of one size: the word is solved.

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
