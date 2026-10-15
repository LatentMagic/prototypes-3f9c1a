/** Buttons that move around the store rather than play: stacked full-width rows, the same shape as ChoiceButtons, led by an icon so they read as going somewhere. out adds an outward arrow and a second line, "Opens in your browser". stack fills the container's width (inside a card) instead of stopping at 26rem. */
export interface NavButtonsProps{
  items:{label:string;icon?:import('../media/Icon').IconName;/** Leaves the chat. */out?:boolean;/** Second line for out. Default "Opens in your browser". */note?:string;/** Live link. */href?:string}[];
  stack?:boolean;
  onGo?:(item:any,index:number)=>void;
  label?:string;
  className?:string;
}
export declare function NavButtons(props:NavButtonsProps):JSX.Element;
