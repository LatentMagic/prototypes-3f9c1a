Cover shows a game's 4:3 flat-shape art with its name below; use it for every game tile in the shop.

```jsx
<Cover name="Daily Puzzles" art="daily-puzzles"/>
<Cover name="Dungeon Quest" art="dungeon-quest" onClick={open}/>
<Cover name="New game" src="covers/new-game.svg"/>
```

- Art is flat geometric shapes in solid cover colours on an indigo, wine or forest ground. No gradients, outlines-as-decoration or photos.
- The five `art` keys are the hand-off's examples only. Cover assembly rules are not decided.

**Beside a heading** (a game's page head): `fill` the cover so it and the text share a top and a bottom edge.

```jsx
<section className="mcp-cover-head">
  <Cover art="dungeon-quest" fill/>
  <div className="mcp-cover-head-text">
    <h1 className="mcp-t-page">Dungeon Quest</h1>
    <div className="mcp-cover-head-links"><TextLink>About this game</TextLink><TextLink>Every quest</TextLink></div>
  </div>
</section>
```

- The layout stretches the cover to the text; nothing is measured. The cover is never shorter than 4:3 and has no maximum. Keep the title short instead.
- The edges are the ink: the cover's top meets the title's cap height, its bottom meets the last link's underline. Letters taller than capitals (b, k, round C and S) may rise a pixel or two above; that is intended. Text shorter than the cover is centred on it.
- The art never stretches or crops. It stays a 4:3 picture placed by its `extend`, and its `ground` fills the rest. An asset used with `fill` must declare `extend`; built-in arts do. For your own `src` or `children`, pass `ground` and `extend` from the asset's description.
