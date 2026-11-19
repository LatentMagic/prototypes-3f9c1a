export interface NotchPickerOption{
  /** Stable id; `value`, `defaultValue` and `onChange` use it. */
  id:string;
  /** The tile's name. It wraps inside the tile and never truncates. */
  label:string;
  /** A mark above the name (an SVG, 32px, drawn in currentColor so it takes the tile's ink). Decorative: the name is what a screen reader hears. Ignored when the page draws its own tiles. */
  icon?:React.ReactNode;
}
/** What a page's own tile gets: whether it is the picked one, and the props its button must carry (id, `aria-pressed`, `aria-controls`, `onClick`) so the picker owns the pick. */
export interface NotchPickerTileState{
  on:boolean;
  buttonProps:React.ButtonHTMLAttributes<HTMLButtonElement>&{id:string};
}
/** Options as tiles, one picked at a time, and the panel the picked one controls, with a notch on the panel's edge pointing at the picked tile. A group of toggle buttons (`aria-pressed`), not tabs.
 * The picker owns which option is picked, the pointer, and coping with more options than fit: with more than four options, or with `row`, the tiles keep their size and the row scrolls sideways, a tile picked partly out of view scrolls into view, and the notch follows the row and hides while its tile is out of view.
 * A page owns its arrangement and content: `renderTile` draws the tiles, `aside` puts a box between tiles and panel, `pointer` and `target` choose where the notch lands, and the page's own classes on `className` and `tilesClassName` lay the parts out.
 * Default tiles are outlined on the page colour; the picked tile is filled. A surface restyles the picker with `--np-ink`, `--np-edge`, `--np-on`, `--np-on-ink`, `--np-panel`, `--np-panel-line`, `--np-panel-ink`, `--np-panel-shadow`, `--np-body-pad` and `--np-gap`. */
export interface NotchPickerProps{
  /** Names the group of tiles for a screen reader, such as "Which app do you use?". */
  label:string;
  options:NotchPickerOption[];
  /** The picked option's id, to control it; `null` picks none and hides the panel. Leave undefined to let the picker keep its own state. */
  value?:string|null;
  /** The picked option's id when the picker keeps its own state. `null` (the default) picks none. */
  defaultValue?:string|null;
  /** Called with the new id, or with `null` when `closable` and the picked tile is pressed again. */
  onChange?:(id:string|null)=>void;
  /** Pressing the picked tile again unpicks it and closes the panel. Off by default: the panel is never empty once one is picked. */
  closable?:boolean;
  /** Put the tiles in a CardRow headed `title`, with `sub` as its sentence: the row scrolls sideways with Previous and Next. `label` names the row for a screen reader (defaults to the picker's `label`). */
  row?:{title:string;sub?:string;label?:string};
  /** Draws one tile yourself, such as a tile that also holds a description. Spread `buttonProps` on the one button inside it, and mark the tile's outer element `data-np-tile` so the pointer and the scroll-into-view find it. */
  renderTile?:(option:NotchPickerOption,state:NotchPickerTileState)=>React.ReactNode;
  /** Class and style for the group of tiles, for a page that lays them out itself (a list, a wider picked tile, a column). */
  tilesClassName?:string;
  tilesStyle?:React.CSSProperties;
  /** A box between the tiles and the panel, such as the picked option's description beside a list. Mark it `data-np-aside` to point the notch at it (`target="aside"`). */
  aside?:React.ReactNode;
  /** Which panel edge the notch sits on: `top` (under the tile, the default) or `side` (the left edge, level with the tile). */
  pointer?:'top'|'side';
  /** What the notch points at: the picked `tile` (the default) or the `aside`. */
  target?:'tile'|'aside';
  /** Props for the panel element, such as a `className` or `aria-live`. */
  panelProps?:React.HTMLAttributes<HTMLDivElement>;
  /** The panel's content, or a function of the picked id. Keep every option's content in one box if the page below must not move when the picked tile changes. */
  children?:React.ReactNode|((id:string|null)=>React.ReactNode);
  className?:string;
  style?:React.CSSProperties;
}
export declare function NotchPicker(props:NotchPickerProps):JSX.Element;
