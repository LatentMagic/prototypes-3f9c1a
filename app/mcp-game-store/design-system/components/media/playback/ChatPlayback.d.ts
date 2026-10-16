import type { ChatTurn } from '../ChatPicture';
/** Pacing in ms at speed 1. Every field is optional; unset fields keep their defaults. */
export interface ChatPlaybackPace{
  /** Before the first turn. Default 500. */
  lead?:number;
  /** Typing speed of the user's line in the reply box, characters per second. Default 32. */
  type?:number;
  /** Shortest and longest a user's line takes to type. Defaults 450 and 1600. */
  typeMin?:number; typeMax?:number;
  /** Typed line held in the box before it is sent. Default 300. */
  send?:number;
  /** A piece (user line, tool call, block) fading and rising in. Default 260 (--time-popup). */
  enter?:number;
  /** Before an AI turn's first piece. Default 700. */
  think?:number;
  /** After the tool-call line, before what it returned. Default 450. */
  call?:number;
  /** Between one AI paragraph word and the next. Default 55. */
  word?:number;
  /** One word fading in. Default 140. */
  wordIn?:number;
  /** Between pieces of one AI turn. Default 300. */
  gap?:number;
  /** Held after a user turn. Default 450. A turn's own `hold` overrides it. */
  user?:number;
  /** Held after an AI turn, to read it. Default 1400. A turn's own `hold` overrides it. */
  read?:number;
  /** With `loop`, the finished chat held before it starts again. Default 4000. */
  end?:number;
}
/** The same chat as ChatPicture, played out turn by turn. Any chat's turns; for a hero or a product page that shows a game being played.
 * Drawn from the turns and a time alone, so a given time always gives the same picture.
 */
export interface ChatPlaybackProps{
  /** The same turns ChatPicture takes. A turn's `hold` (ms) overrides how long it is held. */
  turns:(ChatTurn&{hold?:number})[];
  /** Show the chat at this time, in ms from the start. While set, no clock runs and there is no pause control: the caller owns the time (a recorder, a scrubber). Omit to play by itself. */
  time?:number;
  /** Start playing on mount. Default true. Ignored with `time`. */
  autoplay?:boolean;
  /** Start again after holding the finished chat. Default false: it stops on the finished chat and the control offers Play again. */
  loop?:boolean;
  /** Multiplies the pace: 2 plays twice as fast. Default 1. */
  speed?:number;
  pace?:ChatPlaybackPace;
  /** Same as ChatPicture. */
  title?:string; toolBy?:string; mark?:string;
  height?:number|'auto'; width?:number; fill?:boolean;
  composer?:boolean; placeholder?:string; label?:string; more?:string;
  /** Spoken names of the control. Defaults "Pause", "Play", "Play again". */
  pauseLabel?:string; playLabel?:string; replayLabel?:string;
  className?:string;
}
export declare function ChatPlayback(props:ChatPlaybackProps):JSX.Element;
export declare namespace ChatPlayback{
  /** Ms from the start to the finished chat, for the same turns and options. */
  function duration(turns:ChatPlaybackProps['turns'],opts?:{pace?:ChatPlaybackPace;speed?:number;composer?:boolean}):number;
}
