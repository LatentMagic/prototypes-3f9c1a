/** One roll on one line: label, die, the roll in a die face, the bonus, the total, the number needed, and the outcome as a StatusTag (hit won, weak warn, miss lost). Wraps on a phone. */
export interface RollLineProps{
  /** What was tried, e.g. "Stealth". */
  label?:string;
  /** Default "d20". */
  die?:string;
  roll:number;
  mod?:number;
  /** Default roll + mod. */
  total?:number;
  /** The number needed. */
  target?:number;
  result?:'hit'|'weak'|'miss';
  /** Outcome text. Default Hit, Weak hit, Miss. */
  outcome?:string;
  className?:string;
}
export declare function RollLine(props:RollLineProps):JSX.Element;
