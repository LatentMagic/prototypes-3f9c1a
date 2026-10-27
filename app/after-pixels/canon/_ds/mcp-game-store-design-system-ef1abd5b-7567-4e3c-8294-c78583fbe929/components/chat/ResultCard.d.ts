/** How a game ended, as one fenced unit: title and StatusTag, an optional line, two to four boxed stats, then nav buttons (Share, Back). */
export interface ResultCardProps{
  title?:string;
  /** A string is a won status. */
  status?:string|{label:string;tone?:'live'|'won'|'lost'|'warn'|'idle'};
  line?:string;
  stats?:{label:string;value:string|number}[];
  /** NavButtons items, usually Share and Back to games. */
  actions?:{label:string;icon?:import('../media/Icon').IconName;out?:boolean;note?:string;href?:string}[];
  onGo?:(item:any,index:number)=>void;
  className?:string;
}
export declare function ResultCard(props:ResultCardProps):JSX.Element;
