export interface NotchPickerOption{
  /** Stable id; `value`, `defaultValue` and `onChange` use it. */
  id:string;
  /** The tile's name. It wraps inside the tile and never truncates. */
  label:string;
  /** A mark above the name (an SVG, 32px, drawn in currentColor so it takes the tile's ink). Decorative: the name is what a screen reader hears. */
  icon?:React.ReactNode;
}
/** A few options (2 to 4) as tiles in one row, one pressed at a time, and the panel the pressed one controls below, with a notch on the panel's top edge under the pressed tile. A group of toggle buttons (`aria-pressed`), not tabs. Outlined tiles on the page colour; the pressed tile is filled. A surface restyles it with `--np-ink`, `--np-edge`, `--np-on`, `--np-on-ink`, `--np-panel`, `--np-panel-line` and `--np-gap`. */
export interface NotchPickerProps{
  /** Names the group of tiles for a screen reader, such as "Which app do you use?". */
  label:string;
  options:NotchPickerOption[];
  /** The pressed option's id, to control it; `null` presses none and hides the panel. Leave undefined to let the picker keep its own state. */
  value?:string|null;
  /** The pressed option's id when the picker keeps its own state. `null` (the default) presses none. */
  defaultValue?:string|null;
  onChange?:(id:string)=>void;
  /** The panel's content, or a function of the pressed id. Keep every option's content in one box if the page below must not move when the pressed tile changes. */
  children?:React.ReactNode|((id:string|null)=>React.ReactNode);
  className?:string;
  style?:React.CSSProperties;
}
export declare function NotchPicker(props:NotchPickerProps):JSX.Element;
