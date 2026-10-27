Card is the raised surface on the page; Heading sets the three decided heading sizes.

```jsx
<Heading level="page">All games</Heading>
<Card title="Daily Puzzles"><p>A new puzzle every morning.</p><Tag kind="daily">Daily</Tag></Card>
```

- Page, card and pop-up are told apart by fill, outline and shadow, never by radius (radius is 0).
- `action` puts one control on the title's row of a static card: `<Card title="Your cases" action={<TextLink href="/cases">All cases</TextLink>}>`.
- To lay cards out on a page, use `PageGrid`. For a list inside a card, use `RowList` + `ListRow`.

## Clickable cards
Give `Card` an `href` (goes somewhere) or `onClick` (does something). The whole card becomes one link or button; don't wrap a Card in your own `<a>` or add `cursor`/hover styles yourself.

```jsx
<Card href="/cases/night-train"><span>Week of 28 September</span><Heading>The Night Train to Fort William</Heading><Tag kind="success">Solved</Tag></Card>
```

- `chevron={false}` drops the chevron where the layout already signals "opens"; hover/press still apply.
- At rest: a trailing chevron, so it reads as clickable on touch screens where there is no hover.
- Hover (mouse only): fill lifts one step, outline brightens to the control edge, chevron turns full text colour and nudges right. Pointer cursor.
- Press: deeper fill, scale to 98.5%, held at least 120ms like Button.
- Focus: 2px off-white ring, 2px offset.
- Nothing clickable inside a clickable card. If a card needs two actions, use a static Card with Buttons in it.
- A static Card never gets hover. Hover means "this goes somewhere".
