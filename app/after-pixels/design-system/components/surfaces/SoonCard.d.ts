/** Coming soon card: a game, or the next chapter of a game that is out. Cover (extended to the card's height) beside label, name, line and the Coming soon chip. Text runs from the top; the chips sit on the card's bottom edge, so a pair's chips share one line. The card itself is never a way in. */
export interface SoonCardProps{
  /** The cover: <Cover fill ground extend> with the game's art. It extends to the card's height by the asset's declared extend. */
  art:React.ReactNode;
  /** Chapters only, e.g. "CHAPTER 2". A whole game has no label. */
  label?:React.ReactNode;
  /** The game's name. Plain text, never a link. */
  title:React.ReactNode;
  /** The game's one line (its blurb). */
  line?:React.ReactNode;
  /** Chapters of a game that is out: the pressable chip's text, e.g. "Play chapter 1". Renders Tag kind="open" with the play glyph, after Coming soon on the same row (wraps under it only when there is no room). */
  play?:React.ReactNode;
  onPlay?:()=>void;
  playHref?:string;
  className?:string;
  style?:React.CSSProperties;
}
export declare function SoonCard(props:SoonCardProps):JSX.Element;
