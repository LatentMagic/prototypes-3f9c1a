/** What the player knows, sorted under a heading for each kind (scene, people, objects, statements). Each kind is a fenced list; a fact learnt this turn carries a New mark. */
export interface ClueCardsProps{
  /** facts accept **bold**; {new:true} marks one learnt this turn. */
  groups:{kind:string;facts:(string|{text:string;new?:boolean})[]}[];
  /** Text of the new mark. Default "New". */
  newLabel?:string;
  /** Fold title; the count is the number of facts. Default: the kind when there is exactly one group, else "Clues". A one-group fold drops that group's own heading, so a custom title replaces the kind with no trace. */
  title?:string;
  /** Puts the card behind a disclosure headed by its title, a count and a chevron: 'open' starts it open, 'closed' starts it closed. Absent: no fold. */
  fold?:'open'|'closed';
  className?:string;
}
export declare function ClueCards(props:ClueCardsProps):JSX.Element;
