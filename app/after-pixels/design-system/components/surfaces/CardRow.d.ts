/** A row of cards that scrolls sideways when they don't fit. The heading line is its own row: title left, Previous and Next right (44px each, chevrons: the back arrow means leave this page, so it never scrolls a row), centred on the title's first line; they show only while the row overflows and each hides at its end, handing focus to the other. An optional sentence runs under both at full width, so the arrows never drop to a line of their own. Cards share the width when they fit (220-280px each from 560px); otherwise 280px (82% on a phone) and the row snaps. Game cards are GameCards: the row then owns four shared lines (picture, name, blurb, tags) and every card's parts sit on them, so they start level and every card is one height. */
export interface CardRowProps{
  /** Section heading, set as mcp-t-sec. */
  title:React.ReactNode;
  /** One sentence under the heading line. */
  sub?:React.ReactNode;
  /** Accessible name for the region and the arrows. Defaults to title when it is a string. */
  label?:string;
  /** Heading element. Default 'h2'. */
  as?:'h2'|'h3';
  /** What the row holds. 'cards' (default): 220-280px from 560px, 280px (82% on a phone) when they don't fit. 'chat': ChatPictures, each in a ChatFigure; 300-380px from 560px, 340px (86% on a phone) when they don't fit. Either way the row scrolls only when its items don't fit, never at a set screen width. */
  kind?:'cards'|'chat';
  /** The cards. Each child is one card; game cards are GameCards. */
  children?:React.ReactNode;
  className?:string;
}
export declare function CardRow(props:CardRowProps):JSX.Element;
