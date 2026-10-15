/** Card surface: #262320 fill, 1px #37332E line, card shadow, 16px padding, square corners. Title in Bricolage 20px. */
export interface CardProps{
  title?:string;
  /** Static cards only: one control on the title's row, right-aligned (usually a TextLink such as "All cases"). */
  action?:React.ReactNode;
  children?:React.ReactNode;
  className?:string;
  style?:React.CSSProperties;
  /** Makes the whole card one link. Use for navigation (opening a case, a game, a page). */
  href?:string;
  /** Makes the whole card one button (or runs alongside href). Clickable cards show a trailing chevron at rest, lift on hover, scale on press. Never put another button or link inside a clickable card. */
  onClick?:(e:React.MouseEvent)=>void;
  /** Accessible name when the visible text alone doesn't say where the card goes. */
  label?:string;
  /** Trailing chevron on a clickable card. Default true. Turn off only where the layout already says "this opens" (e.g. a grid of covers). */
  chevron?:boolean;
}
export declare function Card(props:CardProps):JSX.Element;
/** Bricolage Grotesque 700 heading at the three decided sizes: page 34px, section 24px, card 20px. */
export interface HeadingProps{
  level?:'page'|'section'|'card';
  /** Override the element (defaults h1/h2/h3). */
  as?:string;
  children?:React.ReactNode;
}
export declare function Heading(props:HeadingProps):JSX.Element;
