/** One line of a play's record on its session page ("Every roll", "Every guess"). ListRow's look, spacing and separators, but it opens nothing: no chevron, no hover, no press. Two lines: the label, bold, over the parts, the first in text colour and the rest muted. Line two wraps, so rows differ in height; a row whose parts fit on one line is 62px, like a ListRow. Same shape at every width. */
export interface MoveRowProps{
  /** The line's name, as the game sends it: "Dexterity", "Room", "Guess 1", "Hint". Plain text, bold. */
  label:string;
  /** What happened, in parts, as plain strings, in the game's order: ["d20 8 + 3 = 11 vs 12", "Miss, HP 9/11"]. The first is in text colour, the rest muted. Each part wraps within itself; a part that doesn't fit beside the one before starts a new line. One form only: never a short form. */
  parts:string[];
  className?:string;
}
export declare function MoveRow(props:MoveRowProps):JSX.Element;
/** The list that holds MoveRows, in the order played. Renders an ol; each child becomes an li, with ListRow's line between rows. Put it in a Disclosure titled with the list's title, closed on the session page; give it ListRow's measure (about 760px) on wide screens. */
export interface MoveListProps{
  children?:React.ReactNode;
  /** Accessible name: the list's title ("Every roll"). */
  label?:string;
  className?:string;
}
export declare function MoveList(props:MoveListProps):JSX.Element;
