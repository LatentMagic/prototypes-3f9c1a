/** Things in the game: a name and one line, with a 28px picture only when you pass real art (pic) or an icon, in a grid of compact cards. Without a line a card is a chip. state out strikes the name; picked rings it. */
export interface EntityCardsProps{
  /** Heading above the grid, e.g. "Suspects". */
  title?:string;
  items:{name:string;line?:string;pic?:string;icon?:import('../media/Icon').IconName;tone?:'amber'|'teal'|'orange'|'lilac'|'green'|'cream';state?:'out'|'picked'}[];
  onPick?:(item:any,index:number)=>void;
  className?:string;
}
export declare function EntityCards(props:EntityCardsProps):JSX.Element;
