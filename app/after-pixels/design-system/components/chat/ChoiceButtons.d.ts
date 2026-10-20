/** A short row of moves at the foot of an AI turn. Square, ink edge: the look of a move. Wraps on a phone; 34px tall with a 44px target. Once one is taken it shows pressed (ink fill, tick) and the others are spent. */
export interface ChoiceButtonsProps{
  /** The moves, each a label that is also the move sent. */
  items:(string|{label:string})[];
  /** The move the player took, by label or index. Set it on an earlier turn's row. */
  picked?:string|number;
  /** Makes the buttons live. Omit inside a picture. */
  onChoose?:(label:string,index:number)=>void;
  label?:string;
  className?:string;
}
export declare function ChoiceButtons(props:ChoiceButtonsProps):JSX.Element;
