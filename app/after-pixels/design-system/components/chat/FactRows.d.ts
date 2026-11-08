/** Labelled facts, one per line (label left in soft ink, value right). Fenced unless plain. ConfirmCard uses it plain. */
export interface FactRowsProps{
  /** value accepts **bold**. */
  items:{label:string;value:string}[];
  /** No fence, for use inside another part. */
  plain?:boolean;
  label?:string;
  /** Fold title (falls back to label). The count is the number of rows. */
  title?:string;
  /** Opt in: the card sits behind a disclosure headed by its title, a count and a chevron. Starts open. */
  collapsible?:boolean;
  /** Opt in and start closed. Implies collapsible. */
  collapsed?:boolean;
  className?:string;
}
export declare function FactRows(props:FactRowsProps):JSX.Element;
