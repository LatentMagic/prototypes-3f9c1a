/** A short list of commands opened from a control (ui-design.md: the "menu" kind). Choosing one runs it and closes the menu.
 * Opens at its control at every width: never a sheet, never centred. No dim. Pop-up fill, 1px control-edge border, card shadow,
 * square corners, 48px rows of 16px text. Fades and moves 4px into place over 220ms; closes in 200ms.
 * Arrow keys, Home and End move between items; Escape closes and returns focus to the control; a press outside closes.
 * A list long enough to scroll is a panel (Popup kind="panel"), not a menu. Keep it to about six commands.
 * @startingPoint section="Surfaces" subtitle="Opens at its control at every width" viewport="700x300"
 */
export interface MenuItem{
  label:string;
  onSelect?:()=>void;
  /** Destructive command: red text, the light destructive signal. */
  danger?:boolean;
  icon?:'search'|'back'|'close'|'lock'|'play'|'settings'|'mail'|'logout'|'card';
}
export interface MenuProps{
  /** The control that opens it, usually a secondary Button. Gets aria-haspopup, aria-expanded and the toggle. */
  trigger:React.ReactElement;
  items:MenuItem[];
  /** Accessible name for the list. */
  label?:string;
  /** Edge of the control the menu lines up with. 'end' for controls near the right edge. */
  align?:'start'|'end';
  /** 'above' for controls near the bottom of the screen. */
  placement?:'below'|'above';
  /** Demos only. */
  defaultOpen?:boolean;
}
export declare function Menu(props:MenuProps):JSX.Element;
