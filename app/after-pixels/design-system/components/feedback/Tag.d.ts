/** 26px small label, 13px/600. free = off-white fill; daily = quiet neutral; locked = no fill, solid control edge, lock glyph and trailing chevron (Secondary button look: it is the chip you press, so put it inside a button or link, which supplies hover and press); open = the same pressable look without the lock, for a chip that opens something (SoonCard's Play chapter 1, icon play); success/warning/error = status fills. */
export interface TagProps{
  kind?:'free'|'daily'|'locked'|'open'|'success'|'warning'|'error';
  children?:React.ReactNode;
  /** Leading glyph. locked gets 'lock' automatically. */
  icon?:'search'|'back'|'close'|'lock'|'play'|'settings';
  /** Trailing next chevron. Defaults to true for locked and open, false otherwise. */
  go?:boolean;
}
export declare function Tag(props:TagProps):JSX.Element;
