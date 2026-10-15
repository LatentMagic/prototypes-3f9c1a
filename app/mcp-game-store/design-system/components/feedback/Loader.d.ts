/** The logo mark animated for loading: the orange circle travels clockwise round the four slots, and the square it leaves fades and recovers. 1.2s a lap. Still mark under reduced motion. */
export interface LoaderProps{
  /** Rendered size in px. Default 64. */
  size?:number;
  /** Accessible name. Default "Loading". */
  label?:string;
}
export declare function Loader(props:LoaderProps):JSX.Element;
