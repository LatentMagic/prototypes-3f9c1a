# BIZ-80 — Original prompt

Verbatim, as given.

---

## Circlists — card metadata-extraction playground

Build a **playground** prototype for exploring how a Circlists feed card gets enriched with extracted metadata. Not one design — a configurable playground that shows the current app and lets me flip between **five distinct card options** live. Do your own ideation on top of the parameters below; treat them as a starting frame, not the whole solution space.

### What Circlists is

A calm app for small circles of people sharing links. The heart is a feed of cards inside a circle. Today a card carries almost nothing: the **raw URL** as its headline (JetBrains Mono), an **attribution line** ("Added by Marcus T." with an avatar), and a recessive action row — **Open · Mark as read · delete**. Warm-neutral, paper-leaning palette; Pulse Green accent (`#047857`); Inter for text, JetBrains Mono for the URL; generous whitespace; soft rounded cards. Keep everything you build inside that visual language.

### The intent to explore

We're giving a card an identity past the bare URL, via metadata extracted from the link on add. The MVP fields, already settled:

- **Title** — the extracted page title. Becomes the card's headline.
- **Source** — the publication / site (e.g. "Pragmatic Engineer"), or the bare domain when nothing better is available. Always present — the domain is free from the URL string, so this never fails.
- **Image** — the page's preview image when present.

Settled rules to honour (don't reopen these):

- **Author is not a field.** Source does the identity work instead. Attribution ("Added by …") stays as it is today.
- **Graceful fallback, never a naked URL.** When there's no preview image, fall back to a **default image keyed on the source**. When extraction gets nothing at all, the card still shows source (domain) + a default image + the URL. There is no broken/empty card state.
- **Editability is out of scope.** No edit surfaces, no "fix this title." Rely on defaulting.
- Extraction happens on add, inside the existing add-button loading state.

### Parameters to vary across the five options

These are *some* of the levers, not all — vary them, and add your own:

- **Where the favicon lives** — it's an optional garnish, not the main image. Beside the source? Absent? Somewhere else?
- **Whether the raw URL is still shown** — and if so, how it recedes (a small domain chip, a muted line, gone entirely). Related open question: when a title looks confidently wrong, does showing the URL alongside help *clear things up*? Explore that.
- **Whether the explicit "Open" button still exists** — now the title is clickable, is a dedicated Open button redundant or still worth keeping?
- **Default-image treatment** — the shape, style, and feel of the fallback images, and how they sit within the current theme. This is wide open — surprise us.

If you spot problems or tensions the parameters don't name, integrate your own answers to them into the options. That's wanted.

### Playground shape

- It should **render the actual Circlists app** — the real feed, real card, real theme — then let me switch which card treatment is showing.
- Put the **five options as selectable entries down the left sidebar**, where a circle's list currently lives.
- Any other config (toggles for the parameters above, a failure-case switch to see the fallback, etc.) can live in the **heading**.
- The five options should be genuinely distinct directions, not five shades of one idea.

Seed the feed with a few believable cards — a newsletter article, a GitHub repo, a YouTube video, a plain blog post, and one link that fails extraction — so every state and fallback is visible.

---

### Follow-up clarification (verbatim)

> I have not read that, so just make my own intentions clear for a second. I want to see a playground that actually mimics the prototype, where circles are actually like options to explore, and then the heading is like configs I can change. There are things that we can be exploring, of course, config-wise. I was thinking about backup images and default images. There are obviously lots of parameters to be considered, but we also need to make sure we're thinking in a way that is, in terms of defaulting and stuff like that, actually manageable to sort of trace.
