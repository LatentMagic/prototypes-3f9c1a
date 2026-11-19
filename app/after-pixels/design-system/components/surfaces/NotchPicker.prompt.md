NotchPicker is options as tiles, one picked at a time, with the panel the picked one controls below. A notch on the panel's edge points at the picked tile and glides to the next one. Use it to choose which of several things the panel is about, such as the app a setup is for, or the game a block shows. It is not tabs: a tile is a toggle button (`aria-pressed`).

The picker owns which option is picked, the pointer, and coping with more options than fit in the row. A page owns its layout and content around it. Two pages use it, and each shows what a page may do:

- **Connect's app picker:** six apps in a sideways-scrolling row with Previous and Next (`row`), the panel holding the setup card, and a second press on the picked app closing the card (`closable`).
- **The homepage games block:** three games drawn by the page (`renderTile`) as a list of names with the description in a box beside it (`aside`, the notch pointing at that box), a row where the picked tile is wider and holds its description, and from 960px a column with the notch on the panel's left edge (`pointer="side"`).

```jsx
<NotchPicker label="Which app do you use?" defaultValue="claude"
  options={[{id:'claude',label:'Claude',icon:<svg …/>},{id:'chatgpt',label:'ChatGPT',icon:<svg …/>},{id:'other',label:'Other',icon:<svg …/>}]}>
  {(id)=><p>Setup steps for {id}.</p>}
</NotchPicker>
```

- **Default tiles:** outlined on the page colour, the picked one filled with the main-button colours. With an `icon` the tile is 88px tall with the mark above the name; without one it is 56px. Give every option an icon or none. Two to four options share one row equally and their names wrap.
- **More than fit:** with more than four options, or with `row`, the tiles keep their size and the row scrolls sideways, about 4½ showing so the half tile says there is more, and all fit side by side from 700px. A tile picked partly out of view scrolls into view. The notch follows the row as it scrolls and hides while its tile is out of view. `row={{title,sub}}` puts the tiles in a CardRow, with its heading, sentence and Previous and Next.
- **Pressing the picked tile:** does nothing by default, so the panel is never empty once one is picked. With `closable` it unpicks and closes the panel; `onChange` then gets `null`, and every tile carries `aria-expanded` (true on the picked one) so a screen reader hears whether the panel is open. Start with none (`value={null}`, `defaultValue` unset) only when the panel should stay closed until the first press.
- **Drawing the tiles yourself:** `renderTile(option,{on,buttonProps})`. Spread `buttonProps` on the one button inside the tile and put `data-np-tile` on the tile's outer element. Never put a link inside the button.
- **Pointing:** `pointer="top"` (the default) puts the notch on the panel's top edge under its target; `pointer="side"` puts it on the left edge, level with the target. `target="tile"` (the default) points at the picked tile; `target="aside"` points at the element marked `data-np-aside` inside `aside`. The notch is measured, so it follows any arrangement and a resize.
- **Spacing:** the panel sits 16px below the tiles. A page that sets its own `gap` on the picker's `className` replaces it.
- **The panel:** a Card-coloured box with a 16px padded body. A page that draws its own surface inside sets `--np-body-pad` to `0`. Content that changes height moves what is below the picker; keep every option's content to one height if that matters.
- **Theming:** a surface that recolours it sets `--np-ink` (tile text), `--np-edge` (unpicked tile border), `--np-on` (the picked tile's fill and the focus ring), `--np-on-ink` (text on that fill), `--np-panel` (panel and notch fill), `--np-panel-line` (panel and notch border), `--np-panel-ink` (text in the panel), `--np-panel-shadow`, `--np-body-pad` and `--np-gap` (between tiles), each defaulting to the design system's token.
