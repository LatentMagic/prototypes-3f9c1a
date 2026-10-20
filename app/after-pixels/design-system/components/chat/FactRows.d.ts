/** Labelled facts, one per line (label left in soft ink, value right). Fenced unless plain. ConfirmCard uses it plain. */
export interface FactRowsProps{
  /** value accepts **bold**. */
  items:{label:string;value:string}[];
  /** No fence, for use inside another part. */
  plain?:boolean;
  label?:string;
  className?:string;
}
export declare function FactRows(props:FactRowsProps):JSX.Element;
