/** A grid of short word chips the player picks from. Each solved group becomes a band with its label and words, above the chips still in play. Fenced as one unit. Chip type shrinks (13px down to 10px) so four across fit a phone. */
export interface WordBoardProps{
  /** The chips still in play, in board order. */
  words:string[];
  /** Solved groups, in the order found. tone defaults to amber, teal, orange, lilac in turn. */
  solved?:{label:string;words:string[];tone?:'amber'|'teal'|'orange'|'lilac'}[];
  /** Chips currently picked (drawn in ink). */
  picked?:string[];
  /** Chips per row. Default 4. */
  cols?:number;
  /** Makes chips live buttons. Omit inside a picture. */
  onPick?:(word:string)=>void;
  label?:string;
  className?:string;
}
export declare function WordBoard(props:WordBoardProps):JSX.Element;
