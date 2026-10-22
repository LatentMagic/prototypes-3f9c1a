export type IconName =
  | 'plus' | 'check' | 'x' | 'trash' | 'external-link' | 'arrow-left' | 'arrow-right'
  | 'menu' | 'menu-open' | 'users' | 'share' | 'chevron-right' | 'chevron-down' | 'copy'
  | 'link' | 'settings' | 'card' | 'crown' | 'edit' | 'more-vertical' | 'logout' | 'lock'
  | 'mail' | 'google' | 'shield' | 'feed' | 'circles' | 'home' | 'sparkle'
  | 'bookmark' | 'bookmark-filled' | 'bell' | 'bell-filled' | 'search';

/** Monoline icon: 24px viewBox, 1.5px stroke, currentColor. `google` renders in its brand colours. */
export interface IconProps {
  name: IconName;
  /** px. Default 20. */
  size?: number;
  /** Default 'currentColor'. */
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
export declare const ICONS: Record<string, string>;
