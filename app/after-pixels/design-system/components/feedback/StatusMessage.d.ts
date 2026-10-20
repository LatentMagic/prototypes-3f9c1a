/** In-place status line: 14% status tint fill, 45% status edge, status-coloured glyph, 15px text. Not a toast; it sits where the thing happened. */
export interface StatusMessageProps{
  kind?:'success'|'warning'|'error';
  children?:React.ReactNode;
}
export declare function StatusMessage(props:StatusMessageProps):JSX.Element;
