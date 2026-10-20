/** Needs the Pass, in the form "What stays, what returns". Takes the place of a game's play control when the player cannot play without the Pass.
 * Two halves split by one 1px line in the line colour: side by side from 640px of screen, stacked (left above right) under it, where the button is full width.
 * One size and one grid place in both variants: a variant with less to say has less in it. Every line is built by rule from the props below; no game passes its own wording.
 * No price, no discount, no checkout; the button goes to the Pass page. Never promises earlier editions. */
export interface NeedsPassProps{
  /** The game's name. Used only in the never-had heading: "{game} comes only with the Pass." */
  game:string;
  /** The game's edition word, singular: "day", "week", "chapter", "room". Leave unset for a game with no editions. */
  word?:string;
  /** Plural edition word. Defaults to word + "s". */
  words?:string;
  /** The player's record in this game, when they had the Pass. Leave unset for a player who never had it.
   * last: their last session, ISO date ("2026-09-17"), shown as "17 SEP". chapter: chapter games only, the last chapter's number; it replaces the date.
   * played: editions played. earned: achievements earned. A count of 0 drops its clause from the foot line. */
  record?:{last:string;chapter?:number;played?:number;earned?:number};
  /** The game's achievements total, for "Earn {total} achievements." (never-had only). */
  total?:number;
  /** Go to the Pass page. */
  onGet?:()=>void;
  className?:string;
  style?:React.CSSProperties;
}
export declare function NeedsPass(props:NeedsPassProps):JSX.Element;
