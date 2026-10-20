# Covers: one house style, or each game its own look? (2026-10-06)

Advice from an advisor seat, briefed to attack Joe's lean to one house style. A recommendation, not a ruling. Nothing here is decided.

Labels: **observed** = I read the page or file today; **reported** = a source says so; **estimated** = my judgement or memory, not checked. Taste is marked as Joe's.

## Recommendation

Keep the one drawing hand for the games made in-house. Do not make it a rule of the platform.

Split the thing called "house style" into three parts and give them different owners:

1. **The slot**: the cover's shape, its safe area, where the name sits, and how it shrinks to a 64px icon. The platform owns this, for every game, for ever.
2. **The hand**: how the picture is drawn (flat code-drawn shapes, a fixed construction rule). The in-house studio owns this, as its own label look. A guest game is not required to use it.
3. **The content**: each game's colour and its motif. The game owns this. The three covers on the second board already work this way: one hand, three palettes (observed, [index.html](../../_outputs/theme-board-2/index.html)).

Then let each game's own page leave the hand behind if it wants to. Joe's own picture is a library of books where "you can click into the book, and you would see the storefront for that specific book" ([log.md](../../_context/log.md), 2026-10-06). The shelf can match; the inside of the book need not.

This costs nothing extra now. It is the choice Joe leans to, with one sentence changed: the look belongs to our games, not to the shop.

## What the lean gets right

- **The platform has no name and no art budget. A line look is the one brand asset it can own at three games.** Small unknown publishers do build recognition this way. Oink Games is known for uniform small boxes "in striking colours, with distinctive graphic design" across 30-plus titles, and Button Shy for the 18-card wallet (reported: [Tabletop Gaming](https://tabletopgaming.co.uk/Features/the-iconic-oink-meet-the-distinctive-japanese-maker-of-deep-sea-advent), [Meeple Mountain](https://www.meeplemountain.com/articles/publisher-profiles-button-shy-games/)). This is the strongest point for Joe's lean, and it is a better comparison than the New York Times.
- **Rule-drawn covers are close to free and avoid generated-picture sameness.** The covers are a few SVG primitives each (observed: the Dungeon Quest cover is three triangles on a green rectangle, [index.html](../../_outputs/theme-board/index.html) line 592). The earlier survey found no source naming flat shapes as a machine-made giveaway (reported, [system-terrain.md](system-terrain.md)).
- **Incumbents with a small, similar set of games do exactly this.** NYT Games rebuilt its app around "distinct cards, clear game branding and playful color" over shared components, across games "built by different teams using entirely different technologies" (reported: search summary of [TechCrunch](https://techcrunch.com/?p=2675705) and [Creative Review](https://www.creativereview.co.uk/new-york-times-games-wordle-crossplay-design-jonathan-knight/); the Creative Review body is paywalled and I did not read it).

## Where it breaks

**1. Genre range. The concrete case is Dungeon Quest.**
Every one-hand example I found covers games of one weight: NYT and Puzzmo are all short puzzles; Oink is all small 20-minute boxes. Every example that spans genres unifies by frame and lets the art differ: Steam, Playdate Catalog, Netflix, Jackbox.
- Jackbox, on why each game in a pack looks different: "The games are consistent in some of the structure and the general UI but the art sets them apart instead of bringing them together", which "creates contrast between the games and makes them more memorable"; the shared part is the picker menu (observed: [Jackbox blog](https://www.jackboxgames.com/blog/behind-the-scenes-of-pp10-art)).
- Jonny's Delve mock-up puts a 25 to 40 minute story game under a d20, two candles and arches, with a serif title (observed: [the PDF](../2026-10-06_prop-chat-games-platform-poc.pdf)). Its art is also flat line-work. So the gap between "house hand" and "own look" is smaller than the question assumes: the difference is a specific motif and its own type, not painted key art.
- Estimated: two triangles on green do not tell a stranger "a story your AI runs for half an hour". A grid of nine squares does tell them "daily puzzle". The hand suits the puzzle and under-sells the adventure.
- I found no product that runs one drawing hand across a two-minute puzzle and a long narrative game. That is absence of an example, not proof it fails.

**2. Outsiders' games.**
A drawing hand survives guests only if the platform draws every guest's cover itself.
- Puzzmo takes games from outside designers (Bongo with Seth Godin, Weather Memoku with The Weather Network; reported: [Seth's blog](https://seths.blog/2024/11/bongo-is-here/), search summary). It acts as publisher and builds them into its own look (estimated, from memory; I could not open the page today).
- Playdate Catalog hand-picks games, fixes the slot (380×180, 380×90, 185×90, 1-bit PNG) and leaves the art to the developer (reported: [Playdate help](https://help.play.date/developer/publishing-in-catalog)). Steam fixes capsule sizes and content rules and leaves the art to the developer (reported: [Steamworks](https://partner.steamgames.com/doc/store/assets/rules)).
- When NYT bought Wordle it changed the font and made a hub icon; players complained it was being welded to the brand, among louder complaints (reported: [Daily Northwestern](https://dailynorthwestern.com/2022/05/16/opinion/crawford-whats-wrong-with-wordle/)). The cost of a house look falls on the game that had its own.
So with guests the choice is: redraw them all (publisher model, cost per game, needs their consent) or fall back to a shared slot. Nobody found does a third thing.

**3. Outside the shop, the house style mostly does not travel.**
- ChatGPT: "Don't use custom fonts, even in full screen modes"; "Use system colors"; "Do not include your logo as part of the response. ChatGPT will always append your logo and app name" (observed: [OpenAI UI guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines)). The directory icon is 64×64 (reported, search summary).
- Claude: a directory listing is a name, a one-liner, a description, an icon and, for an MCP App, three to five screenshots (observed: [Claude submission docs](https://claude.com/docs/connectors/building/submission.md)). No cover slot. Icon size not stated on that page.
- So in the two places the platform does not control, a game is a small icon and a name beside other firms' icons. What must work there is each game's icon read alone at 64px.
- Wordle spread through its emoji grid, the game's own artefact, which people recognised with no link and no brand on it (reported: [Know Your Meme](https://knowyourmeme.com/memes/subcultures/wordle), [TechCrunch](https://techcrunch.com/2022/05/04/wordle-new-york-times-user-growth)). Recognition in the wild came from the game's mechanic, not from a cover or a publisher's style. Estimated: if every game's share card wears the same hand, a feed shows the shop and hides which game.

## Is "easier to maintain" true?

- **At 3: yes.** A new cover is minutes of work.
- **At 10: yes, if the rule is written down.** Today the hand is whatever the generator drew on the day. Without a written rule (grid, colour budget, how a shape is built, what a motif must show) each new cover is a fresh taste call for Joe and the set drifts. The rule is the maintenance, and it does not exist yet (observed: nothing in the record states one).
- **At 30: unproven, probably strained.** A small shape vocabulary runs out. Word game, groups game, sudoku, crossword and escape room all want a grid. Icon research finds distinct icons are found faster in clutter, that concrete pictures are learned far more easily than abstract ones, and that strongly consistent flat sets can cost distinctiveness; one study found extra colour or shape difference alone did not help learning (reported: [Graphics Interface 2020](https://graphicsinterface.org/wp-content/uploads/gi2020-12.pdf), [UX Psychology summary](https://uxpsychology.substack.com/p/unlocking-icon-usability-insights)). The NYT icons are concrete (a bee, the board itself). The ring-and-bar cover for the weekly game is abstract. Estimated: the risk at 30 is abstraction, more than uniformity.
- **With outsiders: no.** The platform must draw or police every cover. A free interior moves that cost to the developer.
- **Hidden count:** Daily Puzzles is one store entry holding several games ([PRODUCT.md](../../_outputs/theme-board/PRODUCT.md)). If each inner game gets a picture, the count is already five or more.

## Is the NYT comparison sound?

Partly. NYT had the masthead and a crossword app from 2009 (reported, same TechCrunch summary). Its look grew out of one kind of game and the name does the recognising. Here there is no name and the range is wider. So "NYT does it" does not transfer.

The argument that survives is the reverse one: because there is no name, the look has to do the name's job. That is Oink's case, with one condition. Oink's look is one person's hand: Jun Sasaki, chief executive, lead designer and former graphic designer (reported, Tabletop Gaming). A house style is somebody's eye. Here it would be a generator held to a rule, with Joe as the eye. Joe has already asked how to "give some sense of taste that makes this special to us" ([log.md](../../_context/log.md)). That question is the same question as this one.

## The choice is not binary

| Option | Who does it | What it costs |
|---|---|---|
| A. Full house: one hand and one palette | NYT hub (observed in [system-terrain.md](system-terrain.md)) | Games blur together soonest; breaks at genre range and at guests. |
| B. One hand; each game owns colour and motif | Oink; the second board as built | Needs a written rule and an owner. Guests still need redrawing. |
| C. House slot, free interior | Steam, Playdate Catalog (reported) | The shelf is only as good as the worst cover; needs art per game, which is where generated-picture sameness comes back. |
| D. Two tiers: house hand for in-house, slot only for guests | Netflix puts its logo on every game icon (reported: [The Star](https://www.thestar.co.uk/business/consumer/netflix-games-how-to-use-it-4663873)); Apple supplies a fixed Arcade badge (reported: [Apple](https://www.apple.com/in/itunes/marketing-on-arcade/identity-guidelines.html)) | One tier reads as second class. Which one depends on execution. |
| E. One hand on the shelf; each game's page owns its world | Jackbox: shared picker, free art per game | Two looks to design per game. Deferred cost, not avoided. |

The recommendation is B now, with the slot specified separately so that C or D is available later without redrawing anything, and E left open for the game page.

## What would make the opposite right

**Each game fully its own look, now**, if any of these holds:
- Guest games are a near-term plan, not a "later, maybe".
- Each game is listed separately in the Claude and ChatGPT directories and people mostly find games there, not in the shop. Jonny's files propose one endpoint and one listing per game ([jonny-working-files-snapshot.md](jonny-working-files-snapshot.md), a proposal, not ratified).
- People pay per game. Then each cover has to sell its own game.
- Strangers cannot tell what kind of game Dungeon Quest is from its house-hand cover.

**A stricter house style than recommended (option A)**, if:
- People pay for the platform as one pass (Jonny's mock-up says "[Platform] Pass"; pricing is an open row in [CONTEXT.md](../../CONTEXT.md)) and come for the bundle, as NYT subscribers do.
- The platform stays in-house and stays small and puzzle-shaped.

## Unknown

- Whether a listing in each host is one per game or one for the platform. Proposed, not decided.
- Pricing: pass or per game. Open.
- Whether guest games are a real intention. I did not find it in the log; it reached me from the brief.
- Whether the house hand holds past three covers and across story games. Nothing has tested it.
- What Claude allows an MCP App to style inside the chat. Not checked.

## Cheapest check

One sheet, about half an hour for a builder: twelve made-up covers in the one hand (the three that exist, plus nine across kinds, at least two of them story games, and one "guest" in its own art inside the same slot), shown at shelf size and at 64px with no names.

Two readings from it:
- **Evidence:** five people who have not seen the shop, asked "which is the long story game, which is the daily word puzzle?" If they cannot pick the story games, the hand under-sells them and the cover needs a specific motif.
- **Joe's eye:** does the row of twelve still look like a shelf he wants, or like twelve tiles from one generator? Does the guest spoil it or relieve it?

## What is evidence and what is Joe's

Evidence: what the two hosts let a game show; what comparable products do, and that the ones spanning genres unify by frame; that Wordle travelled on its own artefact; that concrete pictures are easier to learn than abstract ones.

Joe's to feel: whether flat shapes are the right hand at all; whether a matching shelf is the shop he wants; whether the look is "ours". No source measures a uniform cover style against a varied one for installs or sales. I looked and found none.

## Could not find or reach

- Puzzmo's live page (fetch blocked; the browser was in use by another seat). Its treatment of outside games is from memory.
- The Creative Review interview with NYT Games' head (paywalled).
- Anything on LinkedIn Games' visual system.
- Apple Arcade and Netflix game pages were not opened; claims are from sources.
- Any games shop built on MCP to compare with.
