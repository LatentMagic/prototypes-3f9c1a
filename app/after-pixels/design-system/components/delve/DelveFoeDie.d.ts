/** The foe's roll as a diamond: filled red when it hit, an outline when it missed. */
export interface DelveFoeDieProps{
  /** The number the foe rolled. */
  value:number;
  /** The other d20 of a roll with advantage (the foe keeps the higher): an empty diamond behind the die, no number. */
  other?:number;
  hit?:boolean;
  /** The fill a missed diamond takes: the card's, or the pop-up's inside the held roll. */
  surface?:'card'|'popup';
  /** Width in px; the height follows. Default 34. */
  size?:number;
  className?:string;
}
export declare function DelveFoeDie(props:DelveFoeDieProps):JSX.Element;
