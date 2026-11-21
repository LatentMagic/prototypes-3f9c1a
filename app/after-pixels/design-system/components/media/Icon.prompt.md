Icon renders one of the hand-off's own 24px glyphs (search, back, close, lock, play, settings, mail, logout, card, stats, advantage, pack, ability, fight, plus check/warn/error/down); use it anywhere a glyph is needed instead of an outside icon set.

```jsx
<Icon name="search"/>
<Icon name="lock" size={14}/>
<Icon name="check" label="Done"/>
```

- Line drawings only: 1.75 stroke, square ends, mitred joins.
- Inherits colour from `currentColor`. Decorative unless `label` is passed.
- `stats` (a hex with a plus), `advantage` (two chevrons up), `pack` (a chest with a hasp), `ability` (two square pips, one filled) and `fight` (a double-headed axe) are the five tab icons of Delve's character sheet.
- `mail` = Continue with email, `logout` = Sign out, `card` = Update payment card.
