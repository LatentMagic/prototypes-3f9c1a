export type IconName='search'|'back'|'close'|'lock'|'play'|'settings'|'mail'|'logout'|'card'|'check'|'warn'|'error'|'down'|'next'|'send'|'out'|'share'|'list';
/** One of the hand-off's 24px icons. Line drawings: 1.75 stroke, square ends, mitred joins. */
export interface IconProps{
  name:IconName;
  /** Pixel size. Default 20. */
  size?:number;
  className?:string;
  style?:React.CSSProperties;
  /** Accessible name. Omit for decorative icons (aria-hidden). */
  label?:string;
}
export declare function Icon(props:IconProps):JSX.Element|null;
