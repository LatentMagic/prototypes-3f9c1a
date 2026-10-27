/** One game status in a small square tag (22px, 12px/600). live = ink edge (in progress), won = success fill (solved, escaped), lost = error fill (out of guesses), warn = warning fill (a partial outcome), idle = tone fill (not started). */
export interface StatusTagProps{
  tone?:'live'|'won'|'lost'|'warn'|'idle';
  /** The status word. Or pass it as children. */
  label?:string;
  children?:React.ReactNode;
  className?:string;
}
export declare function StatusTag(props:StatusTagProps):JSX.Element;
