NotchPicker is a few options as tiles, one pressed at a time, with the panel the pressed one controls below. A notch on the panel's top edge sits under the pressed tile and glides to the next one. Use it to choose which of two to four things the panel below is about, such as the app a setup is for. It is not tabs: a tile is a toggle button (`aria-pressed`), and the panel does not stay for every tile separately.

```jsx
<NotchPicker label="Which app do you use?" defaultValue="claude"
  options={[{id:'claude',label:'Claude',icon:<svg …/>},{id:'chatgpt',label:'ChatGPT',icon:<svg …/>},{id:'other',label:'Other',icon:<svg …/>}]}>
  {(id)=><p>Setup steps for {id}.</p>}
</NotchPicker>
```

- Two to four options, one row at every width: the tiles share the row equally and their names wrap. Five or more is a Menu or a list.
- Press a tile to change the panel. Pressing the pressed tile does nothing, so the panel is never empty once one is picked; start with none (`value={null}`, the default) only when the panel should stay closed until the first press.
- With an `icon`, the tile is 88px tall with the mark above the name; without one it is 56px. Give every option an icon or none.
- Tiles are outlined on the page colour; the pressed tile is filled with the main-button colours. Hover tints an unpressed tile on a mouse; press scales it; focus shows the ring.
- The panel is a Card-coloured box with a 16px padded body. Content that changes height moves what is below the picker; keep every option's content to one height if that matters.
- Theming: a surface that recolours it sets `--np-ink` (tile text), `--np-edge` (unpressed tile border), `--np-on` (the pressed tile's fill and the focus ring), `--np-on-ink` (text on that fill), `--np-panel` (panel and notch fill), `--np-panel-line` (panel and notch border) and `--np-gap` (between tiles), each defaulting to the design system's token.
- Connect's app picker on the platform is this part, with its panel holding the setup steps.
