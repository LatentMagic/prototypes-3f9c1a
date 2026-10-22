/**
 * The three overlay kinds (ui-design.md § Responsive and adaptive design). Ask in order;
 * the first that fits is the kind. Only a Panel changes shape on a phone.
 *
 * All three: take focus on open, close on Escape, return focus to the opener on close.
 * What appears without taking focus (tooltip, status line) is none of these and does not swap.
 */

/** One question or one short edit; nothing behind it is usable until answered or dismissed.
 *  Centred at every width. Content is fixed and never scrolls: if it would outgrow the space
 *  above the on-screen keyboard, make it a page or a Panel, never a taller Dialog.
 *  Confirmation, Challenge and Form dialogs (Delete, Remove member, Leave circle, Cancel
 *  subscription, Switch plan, Delete account, Edit circle). Scrim press dismisses. */
export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  /** Names the consequence or the edit. Labels the dialog. */
  title: React.ReactNode;
  /** Body line. Describes the dialog, so it is read with the title. */
  description?: React.ReactNode;
  /** Fields for a Form or Challenge dialog. */
  children?: React.ReactNode;
  /** Foot buttons, in order. Stack full-width yourself for the Delete dialog. */
  actions?: React.ReactNode;
  /** Defaults to the first focusable element. Confirmations put it on Cancel. */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Max width in px. Default 400. */
  width?: number;
  /** Position inside the nearest positioned ancestor instead of the viewport (previews). */
  contained?: boolean;
  style?: React.CSSProperties;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;

/** A short list of commands opened from a control; choosing one runs it and closes the menu.
 *  Opens at its control at every width: render it beside the trigger inside a
 *  `position: relative` wrapper. No scrim. Arrow keys, Home and End move between items.
 *  A list long enough to scroll is a Panel. Card menu, members row menu. */
export interface MenuProps {
  open?: boolean;
  onClose?: () => void;
  /** The trigger. Outside presses ignore it; focus returns to it on close. */
  anchorRef?: React.RefObject<HTMLElement>;
  /** Accessible name, e.g. "Actions for <title>". */
  label: string;
  /** Which edge of the trigger the menu lines up with. Default 'end'. */
  align?: 'start' | 'end';
  /** Width in px. Default 220. */
  width?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Menu(props: MenuProps): JSX.Element | null;

export interface MenuItemProps {
  icon?: React.ReactNode;
  /** Danger label for Delete and its kin. */
  destructive?: boolean;
  /** Set to render a menuitemcheckbox (e.g. Save). */
  checked?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}
export declare function MenuItem(props: MenuItemProps): JSX.Element;
export declare function MenuSeparator(): JSX.Element;

/** Anything else the user stays in and works with: a composer, a picker, a list that can grow
 *  or scroll. Below `breakpoint`: a bottom sheet (modal, scrim). At and above: anchored to its
 *  control (popover, no scrim) or centred (modal, scrim). Body scrolls; head and foot hold.
 *  Add reveal (640, anchored), The Swell (1024, centred), Who reacted (520, anchored). */
export interface PanelProps {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Foot actions; held while the body scrolls. */
  footer?: React.ReactNode;
  /** px. The surface's swap width from ui.md's adaptive table. Default 640. */
  breakpoint?: number;
  /** Shape at and above the breakpoint. 'anchored' needs a `position: relative` wrapper
   *  around the trigger and this panel. Default 'centred'. */
  desktop?: 'anchored' | 'centred';
  anchorRef?: React.RefObject<HTMLElement>;
  /** Pin one shape regardless of width (previews). Default 'auto'. */
  force?: 'auto' | 'sheet' | 'desktop';
  /** Desktop max width in px. Default 400. */
  width?: number;
  /** Anchored: which edge of the trigger it lines up with. Default 'end'. */
  align?: 'start' | 'end';
  /** Position inside the nearest positioned ancestor instead of the viewport (previews). */
  contained?: boolean;
  style?: React.CSSProperties;
}
export declare function Panel(props: PanelProps): JSX.Element | null;

/** One entry point with the kind as its input. Only kind="panel" ever swaps to a sheet. */
export type OverlayProps =
  | ({ kind?: 'dialog' } & DialogProps)
  | ({ kind: 'menu' } & MenuProps)
  | ({ kind: 'panel' } & PanelProps);
export declare function Overlay(props: OverlayProps): JSX.Element | null;
