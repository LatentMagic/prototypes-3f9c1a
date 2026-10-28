/** Dropdown panel: a 52px Bricolage 17px heading row that opens a short block of muted text (220ms height, chevron rotates). It can hold a MoveList instead: the list runs to its edges and keeps its rows' colours. */
export interface DisclosureProps{
  title:string;
  children?:React.ReactNode;
  defaultOpen?:boolean;
}
export declare function Disclosure(props:DisclosureProps):JSX.Element;
