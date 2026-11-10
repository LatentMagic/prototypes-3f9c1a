/** A step of how something goes, as a card: picture at 2:1, name (card title), one muted line. Looks like a GameCard but is never a game: no chips, no Pass mark, no link, never pressable. Put StepCards inside StepCards, which shares their lines. */
export interface StepCardProps{
  /** The step's picture, shown at 2:1 and never stretched. A still image or SVG in cover colours on a cover ground. */
  art:React.ReactNode;
  /** The step's name, at most 20 characters, set as mcp-t-card. */
  title:React.ReactNode;
  /** One line about the step, 14px muted, at most about 45 characters. Keep the lines of one set within about 10 characters of each other: the longest sets every card's height. */
  line:React.ReactNode;
  className?:string;
  style?:React.CSSProperties;
}
export declare function StepCard(props:StepCardProps):JSX.Element;
/** The ordered list of StepCards: two by two under a 520px row (8px gaps), four across from it (12px gaps; 16px gaps and 16px card padding from an 852px row). Never a CardRow: nothing scrolls sideways. */
export interface StepCardsProps{
  /** The list's spoken name, when the section heading does not already give it. */
  label?:string;
  children:React.ReactNode;
  className?:string;
  style?:React.CSSProperties;
}
export declare function StepCards(props:StepCardsProps):JSX.Element;
