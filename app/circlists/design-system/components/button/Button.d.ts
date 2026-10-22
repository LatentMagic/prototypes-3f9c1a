/**
 * The house button. primary = accent fill (main action). secondary = neutral box.
 * tertiary = text. destructive = danger fill. destructive-secondary = secondary box with
 * danger label (Leave, both Delete reaches). ghost = outlined, muted.
 */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'destructive-secondary' | 'ghost';
  /** sm 36px · md 44px (touch floor) · lg 52px. Default md. */
  size?: 'sm' | 'md' | 'lg';
  /** The working state. Set it from the press until the result: a ring replaces the icon,
   *  the label stays, and the button cannot be pressed again (clicks and form submits are
   *  swallowed). Stays focusable; announced with aria-busy and aria-disabled. */
  loading?: boolean;
  disabled?: boolean;
  /** Full width (phone stacks). */
  full?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  title?: string;
  autoFocus?: boolean;
  name?: string;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'menu' | 'dialog' | boolean;
  'aria-controls'?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;
/** The plain in-button ring Button draws while `loading`. Not the brand spinner. */
export declare function Ring(props: { size?: number; light?: boolean }): JSX.Element;
/** @deprecated Use Ring. */
export declare function Spinner(props: { size?: number; light?: boolean }): JSX.Element;
