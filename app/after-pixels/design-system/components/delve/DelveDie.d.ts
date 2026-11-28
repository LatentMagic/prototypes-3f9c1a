/** A Delve turn drawn as a hexagon. strong = filled green, weak = filled yellow, miss = empty with a grey edge, use = empty with a sparkle in place of the number. */
export interface DelveDieProps{
  kind?:'strong'|'weak'|'miss'|'use';
  /** The number rolled (the higher die when two were rolled). Not drawn for kind 'use'. */
  value?:number;
  /** The other die of an advantage or disadvantage roll: a grey hex behind the die when `behind` is set (the held roll's head), a small numbered die at its corner from 64px. */
  other?:number;
  /** Natural 20: rimmed in green. */
  crit?:boolean;
  /** Biggest hit, the run's most damage: a hit with a dark ring just inside its edge; not a natural 20, it is grown to the size a natural 20's rim takes. Only for kind 'strong'. */
  biggest?:boolean;
  /** Natural 1: a red edge, heavier than a miss's grey one. */
  fumble?:boolean;
  /** Draw the other die's grey hex behind the die, an even step up and left of its outline whatever its size; for the held roll's head only. Cleared when selected and from 64px. */
  behind?:boolean;
  /** Ringed in off-white; the hex behind it is cleared. */
  selected?:boolean;
  /** The fill an empty hex takes: the card's, or the pop-up's inside the held roll. */
  surface?:'card'|'popup';
  /** Width in px; the height follows. Default 36. */
  size?:number;
  /** Draw a key moment at one size: a plain key die's hexagon is grown to the footprint a natural 20's rim takes, in the same picture box. */
  even?:boolean;
  /** A pip with no number, for a map: `size` is the hexagon's own width. */
  mini?:boolean;
  className?:string;
}
export declare function DelveDie(props:DelveDieProps):JSX.Element;
export interface DelveUseDieProps{/** Filled green: the use that ends a won run. */won?:boolean;selected?:boolean;surface?:'card'|'popup';size?:number;className?:string}
/** A turn that used an ability, the ultimate or gear, with no roll. */
export declare function DelveUseDie(props:DelveUseDieProps):JSX.Element;
