/** Labelled facts, one per line (label left in soft ink, value right). Fenced unless plain. ConfirmCard uses it plain. */
export interface FactRowsProps{
  /** value accepts **bold**. */
  items:{label:string;value:string}[];
  /** No fence, for use inside another part. In a fold it drops the fence around the folded card too. */
  plain?:boolean;
  label?:string;
  /** Fold title (falls back to label, then "Details"); the count is the number of rows. */
  title?:string;
  /** Puts the card behind a disclosure headed by its title, a count and a chevron: 'open' starts it open, 'closed' starts it closed. Absent: no fold. */
  fold?:'open'|'closed';
  className?:string;
}
export declare function FactRows(props:FactRowsProps):JSX.Element;
