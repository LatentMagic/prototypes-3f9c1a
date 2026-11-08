/** What the player knows, sorted under a heading for each kind (scene, people, objects, statements). Each kind is a fenced list; a fact learnt this turn carries a New mark. */
export interface ClueCardsProps{
  /** facts accept **bold**; {new:true} marks one learnt this turn. */
  groups:{kind:string;facts:(string|{text:string;new?:boolean})[]}[];
  /** Text of the new mark. Default "New". */
  newLabel?:string;
  /** Title of the fold. Default: the kind when there is one, else "Clues". The count is the number of facts. With one kind its section heading is dropped, since the title stands for it. */
  title?:string;
  /** Opt in: the card sits behind a disclosure headed by its title, a count and a chevron. Starts open. */
  collapsible?:boolean;
  /** Opt in and start closed. Implies collapsible. */
  collapsed?:boolean;
  className?:string;
}
export declare function ClueCards(props:ClueCardsProps):JSX.Element;
