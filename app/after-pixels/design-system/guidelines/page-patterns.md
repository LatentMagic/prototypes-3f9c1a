# Page patterns

This file gives the layout values for the pages written for each game: the product page, the game page in the Library and the session page. Whoever builds or checks one of those pages reads it beside the page's standard in the monorepo, at `specs/projects/mcp-games/pages/`. A standard gives the page's sections in order and names its look by the pattern names below; each heading here is one of those names, so keep each name as it is. The principles in [layout-and-patterns.md](layout-and-patterns.md) hold for every pattern here.

## Page frame

Every page sits in the same frame.

- The page is at most 1200px wide and centred. Its side gutters are 16px, and 24px from a 720px page. The top bar and the footer sit inside the same gutters.
- The page's sections stand 36px apart (`--space-6`). The first section starts 36px under the top bar, and the last ends 36px above the footer.
- Inside a section, parts stand 16px apart (`--space-4`). Tighter groups use 8px or 4px.
- The session page has 24px above its back link and 24px between the back link and the head.
- The footer stays at the foot of the window (see [layout-and-patterns.md](layout-and-patterns.md)).

## Breakpoints

A page pattern's breakpoint is a container width: the width of the page's container (`.gs-root`, the full width the page is given, not its 1200px column), or of the card for a card's own breakpoint, never the window's width. A page in a narrow column therefore lays out as a phone page. The button and panel rules at 640px are the exception: they follow the window (see Layout in [visual-foundations.md](visual-foundations.md)).

| Width | Measured on | What changes |
| --- | --- | --- |
| 480px | Card | The streak card shows its last six slots. |
| 560px | Card row | Game cards and chat cards go from one peeking card to several across. |
| 640px | Page | The now card's action row goes side by side. |
| 640px | Window | Buttons stop running full width. Panels become centred windows. |
| 672px | Session card | The board and the panel go side by side. |
| 720px | Page | Gutters grow to 24px. Library cards and the session card grow their padding to 24px. The product page head goes to two columns. The session page head's cover grows to 200px. |
| 900px | Page | The two-column pitch and the library card grid go to two columns. |

A game never moves a breakpoint in this table, except as Session card allows.

## Type in page patterns

The sizes, weights and families are in [visual-foundations.md](visual-foundations.md). The page patterns use them in these ways:

- **Page title.** On the library game page head, and on the session page head from a 720px page, the title shrinks with the page from 34px to 28px (`clamp(28px, 8cqi, 34px)`), at 700 with a line height of 1.08. Below a 720px page the session page title is 16px at 600, beside the small cover.
- **Eyebrow label.** A label above a title or a figure is 13px at 600, with a line height of 1.3 and letter spacing of 0.06em, in capitals. It is off-white on the product page and the now card, and muted on the session page head.
- **Figure caption.** A caption on a session card figure is 12px at 600, with letter spacing of 0.04em, in capitals and muted.
- **Result word.** In the session card's result band the result word is 28px at 700, and 24px under a 560px card. Its line is body text at label weight (16px, 600).

## Library band

The Library band sits above the Product page head.

- It is a card-filled band with a 1px line border, 12px padding above and below and 16px at the sides. Its parts stand 12px apart down and 16px apart across.
- Under a 640px page it holds the label and text, then its link on a row of its own. From a 640px page it holds a 64px picture, the label and text, and the link at the right, in one row.


## Product page head

The cover sits beside the play box.

- From a 720px page there are two columns: the cover takes 2fr and the play box takes 1fr, with 24px between them.
- The cover takes the play box's height, so the two end level. The cover is at least 320px tall.
- The cover's 4:3 drawing shows whole, never stretched or cropped. Where the frame is taller than 4:3, the cover's `extend` (bottom or centre) grows its ground to fill it. Where the frame is wider, ground shows at the sides.
- The label and the game's name sit at the cover's bottom left. The cover pads them 16px, and 24px from a 720px page. The label sits 4px above the name. The name is 34px.
- Below a 720px page the cover is a 96px thumbnail beside the title, 16px apart, so the play box is in view.
- The play box is a `Card` with 16px between its parts and 16px padding at every width. Its button runs the box's full width.

## Facts row

The facts row is a band across the page, with a 1px line above and below it. The facts wrap, 36px apart. Each fact has 12px above and below, and its label sits 4px above its value. The label is an eyebrow label, and the value is body text at 600.

## Two-column pitch

The pitch sits beside the How it plays box.

- From a 900px page there are two columns: the pitch takes 1.25fr and How it plays takes 1fr, with 36px between them. Below 900px they stack, 24px apart.
- The pitch and How it plays start at the same top.
- The pitch's paragraphs stand 16px apart.

## How it plays box

How it plays is a `Card` with 16px between its parts. Under its eyebrow label it holds two columns, one for the player's AI and one for the game engine. Each column has a card title and muted body text. The two columns sit side by side when the box has room for two columns of at least 200px with 16px between them. Otherwise they stack.

## Chat row

The chats sit in one `CardRow` of chat cards. In a narrow row each chat card is the smaller of 340px and 86% of the row, and the next one peeks in. From a 560px row each chat card is a third of the row less its gaps, held between 300px and 380px, with 24px between them. Three sit across from a row of about 948px; below that the row scrolls. A caption sits 12px under each chat, at 13px and muted.

## Game row

A row of games is a `CardRow` of game cards and featured cards. The row's card widths and its "All games" link are set in [layout-and-patterns.md](layout-and-patterns.md). On the product page the row shows four cards to a width, with 24px between them.

### Game card

The Game card is the `GameCard` component. Its values are in [layout-and-patterns.md](layout-and-patterns.md).

### Featured card

The Featured card is the `GamePick` component. Its values are in [layout-and-patterns.md](layout-and-patterns.md).

## Library game page head

The cover sits beside the title and its links (`Cover fill` in `.mcp-cover-head`).

- The cover column grows with the page from 112px to 144px (`clamp(112px, 26cqi, 144px)`). The text stands 24px from it.
- The text block centres on the cover. Its parts stand 14px apart. Its links stand 24px apart side by side, and 20px apart when they wrap.
- The head stands 24px above the first card, the same space the cards keep between them.

## Library card grid

The library game page standard sets the four cards, their order and that the cards in a row end level. This pattern says how.

- From a 900px page the grid has two columns, split as `PageGrid` splits them (see [layout-and-patterns.md](layout-and-patterns.md)). Below 900px the cards stack in one column.
- The cards stand 24px apart.
- Each card has 16px padding, and 24px from a 720px page. Its parts stand 16px apart. A list or a set of tiles inside a card runs to the card's edges and is inset by the same padding.
- No card shows empty space at its foot or side. Each card takes up spare height its own way, as its section below says.
- Check each card with its fewest and its most items.

### Now card

The now card is the top left card. It shares its look with the game's session page.

- The head holds the label and title at the left and the result at the top right. The result holds the top right at every width and takes at most half the head. The title wraps beside it.
- The card's picture centres in the card's height and width. It is never pinned to the card's top with an empty band under it.
- The card ends in one action row: a main `Button` at the left and one slot line at the right.
- No rule or band sits above the row. The row stands 24px under the content (`--space-5`: the card's 16px gap plus 8px). It is pinned to the card's foot with `margin-top: auto`, so a card beside a taller one opens its spare height above the row.
- Under a 640px page the button runs full width, and the slot line sits centred under it, 12px apart.

### Streak card

- The strip has ten equal slots, and six under a 480px card. Days before the player started are faint empty slots.
- From a 900px page the slots are 48px tall, and the strip and its legend stand 16px apart.
- Below a 900px page the card is trimmed: its padding stays 16px, the slots are square (about 31px), and the strip and its legend stand 12px apart.
- The strip and its legend centre together in the height under the heading.
- The legend is 13px, with 12px swatches.

### Achievements card

- The achievements are tiles across the card, each at least 240px wide. Beside the history card each tile is at least 260px wide, so a description wraps to two lines at most.
- A tile is one button: a 40px badge, 12px of space, then the name, its description at 14px muted and a status line. A tile is at least 64px tall.
- A status line uses the caption type, muted.
- A tile opens a dialog (`Popup`) with a 48px badge beside the description and the earned line.

### History card

- Beside the achievements card, the history card shows as many play rows as fit the achievements card's height.
- A play row keeps its own height, and any spare room sits under the last row. A history card with one play stays as tall as the achievements card beside it.

## Session page head

The session page head is the platform's, and the same on every game.

- The cover sits beside the text and grows to the text's height. The cover is 96px wide with 16px to the text, and from a 720px page 200px wide with 36px to the text.
- The text block centres on the cover. The eyebrow label (the game and the day played) sits 8px above the title, and the actions sit 16px under the title.
- The actions stand 12px apart. Their buttons keep their natural width and sit side by side at every width. This is the one exception to the rule that buttons run full width under 640px.

## Session card

The session card is the shared card that a daily puzzle's part of the session page is built on: a result band, a **board** (the game's own picture of the play) and a **panel** (the captioned figures beside it). The **rule** is the 1px line that separates the board from the panel.

- The card has 16px padding, and 24px from a 720px page. Its parts stand 24px apart.
- Under the head, the parts of the page stand 16px apart.

### Wide card: board and panel centre as one group

From a 672px card, the board and the panel sit side by side.

- The board, the rule and the panel centre as one group in the card. The space left of the board must equal the space right of the panel.
- The rule must be 64px from the board and 64px from the panel.
- The board takes the width of its own content, up to a limit the game sets. It shrinks before it pushes the panel out of the card.
- The panel takes the width of its own content.
- Never give either column more width than its content, as a fixed ratio such as 1.4 to 1 does, or `1fr auto`. A column wider than its content leaves empty space beside the board, and the group no longer centres.
- The panel carries the rule as its left border, with 64px of padding inside it (`gs-sess-card.css:22`). The rule rises past the result band (53px: the band's 29px and the card's 24px gap), so the panel centres on the whole card. A game may centre its panel on the board instead.

The shared card does this with `grid-template-columns: auto auto; justify-content: center; column-gap: 64px`. A game whose board fills its column uses `minmax(0, max-content) auto` in place of `auto auto`, so the board can shrink.

### Narrow card: board, then panel

Below a 672px card, the panel goes under the board, 24px apart, and the board and the panel each centre in the card. The panel has a 1px rule above it and 20px of padding under the rule. The shared card puts the panel's figures side by side, each centred in its half. A game may arrange them its own way.

If the board ends in a line of its own, such as the last border of a ruled list, the board keeps that line and the panel drops its rule. Two lines never stack under a board.

### What a game may set

A game may set these inside the session card:

- The board's content and its maximum width.
- How the panel arranges its own figures, in the order the session page standard sets.

A game never changes the group's centring, the 64px either side of the rule, or the 672px line. The one exception is a game whose board is too large to sit beside its panel at 672px. That game moves the line to an 840px card and stacks each part centred below it.

- Guess's card does not fit between about a 752px and an 812px card: the Hint tiles run past the card's right edge.

### How to check a session card

Open the card at window widths where the card is at least 672px wide (in canon, 1440, 1024 and 800), and measure four spaces:

1. From the card's left edge to the board.
2. From the board to the rule.
3. From the rule to the panel.
4. From the panel to the card's right edge.

Spaces 1 and 4 must be equal. Space 2 must be 64px, and space 3 must be 65px: the panel's 64px plus the rule's 1px. Below a 672px card, check that the board and the panel each centre in the card.

## Every move

Every move is a closed `Disclosure` under the game's part, with a `MoveList` of `MoveRow`s inside. It spans the page's width, and it is the same on every game.
