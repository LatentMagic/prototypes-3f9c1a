/** A fenced list, one row per entry: 40px art (svg markup, image URL or icon), name, one line, an optional StatusTag and meta, and a NavButton-style action. search adds a text field at the top: menus are the one place a field may appear. */
export interface MenuRowsProps{
  items:{name:string;line?:string;art?:string|React.ReactNode;icon?:import('../media/Icon').IconName;status?:string|{label:string;tone?:'live'|'won'|'lost'|'warn'|'idle'};meta?:string;action?:string|{label:string;icon?:import('../media/Icon').IconName}}[];
  /** Placeholder for a search field above the rows. */
  search?:string;
  onSearch?:(text:string)=>void;
  onGo?:(item:any,index:number)=>void;
  label?:string;
  className?:string;
}
export declare function MenuRows(props:MenuRowsProps):JSX.Element;
