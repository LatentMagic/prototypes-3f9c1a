# Audit: every way the product shows a game (2026-10-13)

Read from the product's `app/` and the LM-1110 candidate. "Job" is what the surface is for.

## Game shown as a card or tile
| # | Where | Component | Picture | What it holds | Job |
|---|---|---|---|---|---|
| 1 | Home, Available games | `GsFeature` | GsArt wide, 2:1 | name, blurb, tags | browse |
| 2 | Product page, More games | `GsGameCard` | GsArt 4:3 (2:1 on a phone) | name, mark, blurb, tags | browse |
| 3 | Discover, Just added and Free to play | `DcRowCard` | GsArt wide, 2:1 | name, mark, blurb, tags | browse |
| 4 | Discover, the two picks | `DcPick` | GsArt wide | label, name, blurb, tags | browse (featured) |
| 5 | Discover, All games wall | `DcTile` | GsArt square | name, kind, mark | browse everything |
| 6 | Home, Discover and product pages, Coming soon | `GsSoonCard` | Cover 4:3, beside the text | name, line, "Coming soon" | tease (not playable) |

1 to 4 are one job with four layouts. They are now `GameCard`.

## Game shown as a row
| # | Where | Component | Picture |
|---|---|---|---|
| 7 | Library | `ListRow` | `GpMini` |
| 8 | History | `ListRow` | `PhLead` (raw SVG) |
| 9 | Editions list | `ListRow` | none |

## Game shown as a page head
| # | Where | Picture |
|---|---|---|
| 10 | Product page | `GsCover` (Cover, 4:3) |
| 11 | Library game page | `DS.Cover fill` |
| 12 | Session page, share card | `GsCover` |
| 13 | Player page | `GsCover` |

## How the picture is drawn: four ways
- `DS.GameArt`: motion pieces (word, mystery, groups, casebook, hunter).
- `GsArt` local pieces (`GS_ART_LOCAL`, e.g. Escape, Delve): built in the product, outside the design system.
- `GsCover` / `DS.Cover`: still SVG covers (`GS_ART[...].svg`).
- `GpMini` and `PhLead`: the same SVG again, drawn raw in rows.

The same game can therefore look different from one surface to the next.

## Recommendation
- **Cards (1 to 4): one `GameCard`.** Done in the design system; the product prompt is sent.
- **Wall tile (5): stays separate as `GameTile`** in the design system (owner, 2026-10-13: a distinct role, an index to scan).
- **Coming soon (6): stays separate** (owner, 2026-10-13).
- **Rows (7 to 9): keep `ListRow`.** This is a different job: a list of your own games or plays, with a result on every row. A card there would hide the result.
- **Page heads (10 to 13): keep.** They are not a list of games.
- **Picture: one source per game**, `GameArt`, in every shape (wide, 4:3, square, the small row lead). It is still where nothing is pressable, so it covers the still covers too. Escape's and Delve's pieces move into the design system. This is the larger change and needs its own ticket.

## Why the GameCard row in the design system card shows blank lines
The row shares four lines, and the tallest part sets each line. "36,000 Summers Ago" wraps its name to two lines and its blurb to three at 220px, and Casebook's tags take two lines. Every other card gets the same lines, so shorter parts leave blank under them. That is option 1's stated cost, shown by made-up games' copy that breaks the two-line rule.

## Correction (2026-10-13, owner)
Discover's picks (4) are their own card, `GamePick`: bigger, a 3:1 picture, a label, two side by side. Folding them into GameCard lost that. Tags in a GameCard now fill their shared line and sit centred in it, as in the playground; the first design-system version had pinned them to the top.
