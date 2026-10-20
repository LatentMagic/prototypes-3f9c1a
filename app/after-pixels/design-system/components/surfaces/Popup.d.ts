/** The overlay that takes focus and dims the page. Two of the three kinds in ui-design.md ("Only a panel changes shape on a phone"):
 * - kind="dialog" (default): one question or one short edit. Centred 380px window at every width; content never scrolls.
 * - kind="panel": something the user stays in and works with (a picker, a growing list). Bottom sheet below 640px
 *   (full width, slides up, max 85% high, body scrolls); centred 480px window at 640px and above (body scrolls past 640px high).
 * The third kind, the menu, is the `Menu` component.
 * Both sit over a 55% black dim (200ms). Open 260ms, close 200ms on cubic-bezier(.16,1,.3,1).
 * Closes from a button, the dim, or Escape (not while busy); focus moves into it on open and back to the opener on close.
 * @startingPoint section="Surfaces" subtitle="Dialog: centred at every width. Panel: sheet on phones" viewport="700x400"
 */
export interface PopupProps{
  open:boolean;
  onClose?:()=>void;
  title?:string;
  children?:React.ReactNode;
  /** Buttons laid out as an equal pair: safe action first, then the main or delete action. */
  actions?:React.ReactNode;
  /** Which kind of overlay this is. Only 'panel' becomes a bottom sheet on a phone. Default 'dialog'. */
  kind?:'dialog'|'panel';
  /** Panels only. 'auto' follows the breakpoint; force 'sheet' or 'window' only for demos. Ignored for dialogs. */
  posture?:'auto'|'sheet'|'window';
  /** Panels only. Width in px where the sheet becomes a window, measured on the area the popup renders in (the viewport, or a phone frame in a prototype). Default 640; may be set per surface. */
  breakpoint?:number;
  /** Position inside the nearest positioned parent instead of the viewport. */
  contained?:boolean;
  /** Set while the main action is working: Escape and the dim no longer close it. Pair with Button loading. */
  busy?:boolean;
  /** Accessible name if no title. */
  label?:string;
}
export declare function Popup(props:PopupProps):JSX.Element;
