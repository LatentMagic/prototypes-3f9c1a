Tag is the small square label on covers and cards; use it for a game's status (Free, Daily, Locked) or a status word.

```jsx
<Tag kind="free">Free</Tag>
<Tag kind="daily">Daily</Tag>
<button type="button" className="your-tag-button"><Tag kind="locked">Pass</Tag></button>
<Tag kind="success">Success</Tag>
```

- Whether a game is free is a product-spec fact. Check the spec before using "Free".
- `locked` and `open` are the tags you press. They look like a small Secondary button (solid edge, chevron). Always put one inside a button or link with a 44px hit area: that parent supplies hover and press. Never draw it with a dashed edge; 1.5px dashes drop out on phone screens.
- `locked` is the Pass chip (lock glyph). `open` is the same chip without the lock, for a chip that opens something. Today that is only SoonCard's "Play chapter 1" (`icon="play"`), which SoonCard renders for you. Don't use it to dress other links or buttons as chips.

## Time chips

A game's time is one of two standard chips, `TIME_CHIPS.tiny` ("5–15 min") and `TIME_CHIPS.small` ("25–45 min"), drawn as `<Tag kind="daily">`. The text is written once, here.

- A game whose spec states a size shows its size's chip everywhere its time appears (its card, its product page's How long) and never types its own time.
- A game with no size shows its own time text, held once on the game.
- Medium and large are not defined yet.
- The ranges come from the size line in the monorepo's `specs/projects/mcp-games/game-specs/README.md`. When a range changes there, change it here.
