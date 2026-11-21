/** A Delve turn drawn as a hexagon. strong = filled green, weak = filled yellow, miss = empty with a grey edge, use = empty with a sparkle in place of the number. */
export interface DelveDieProps{
  kind?:'strong'|'weak'|'miss'|'use';
  /** The number rolled (the higher die when two were rolled). Not drawn for kind 'use'. */
  value?:number;
  /** The other die of an advantage or disadvantage roll: a hex behind the die under 64px, a small numbered die at its corner from 64px. */
  other?:number;
  /** Natural 20: rimmed in green. */
  crit?:boolean;
  /** Natural 1: a red edge, heavier than a miss's grey one. */
  fumble?:boolean;
  /** The foe struck back: a red hex behind the die, outside the advantage hex. Cleared when selected and from 64px. */
  foe?:boolean;
  /** Ringed in off-white; the hex behind it and the foe's hex are cleared. */
  selected?:boolean;
  /** The fill an empty hex takes: the card's, or the pop-up's inside the held roll. */
  surface?:'card'|'popup';
  /** Width in px; the height follows. Default 36. */
  size?:number;
  className?:string;
}
export declare function DelveDie(props:DelveDieProps):JSX.Element;
export interface DelveUseDieProps{/** Filled green: the use that ends a won run. */won?:boolean;foe?:boolean;selected?:boolean;surface?:'card'|'popup';size?:number;className?:string}
/** A turn that used an ability, the ultimate or gear, with no roll. */
export declare function DelveUseDie(props:DelveUseDieProps):JSX.Element;
