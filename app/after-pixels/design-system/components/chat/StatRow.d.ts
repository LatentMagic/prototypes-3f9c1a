/** Small labelled counters (label 12px soft ink over value 17px heading type). A row that wraps, or with grid, boxed cells two across (three when there are three). */
export interface StatRowProps{
  items:{label:string;value:string|number}[];
  /** Boxed cells in a grid. ResultCard uses it. */
  grid?:boolean;
  label?:string;
  className?:string;
}
export declare function StatRow(props:StatRowProps):JSX.Element;
