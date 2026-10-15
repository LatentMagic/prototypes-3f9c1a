/** What the player knows, sorted under a heading for each kind (scene, people, objects, statements). Each kind is a fenced list; a fact learnt this turn carries a New mark. */
export interface ClueCardsProps{
  /** facts accept **bold**; {new:true} marks one learnt this turn. */
  groups:{kind:string;facts:(string|{text:string;new?:boolean})[]}[];
  /** Text of the new mark. Default "New". */
  newLabel?:string;
  className?:string;
}
export declare function ClueCards(props:ClueCardsProps):JSX.Element;
