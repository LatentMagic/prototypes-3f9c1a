/** Page layout: one column on a phone; from 900px of its own width, two columns that line up. Children fill it in source order (main, side, main, side), so source order IS the phone order. Paired cards stretch to the same height. 24px gaps. */
export interface PageGridProps{
  /** Children in priority order: the phone reads them top to bottom; desktop pairs them row by row. Usually Cards. */
  children?:React.ReactNode;
  /** 'main' (default): wide main column beside a side column, 2fr / minmax(320px,1fr). 'even': two equal columns. */
  split?:'main'|'even';
  className?:string;
  style?:React.CSSProperties;
}
export declare function PageGrid(props:PageGridProps):JSX.Element;
