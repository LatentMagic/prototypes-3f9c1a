/** Dropdown panel: a 52px Bricolage 17px heading row that opens a short block of muted text (220ms height, chevron rotates). */
export interface DisclosureProps{
  title:string;
  children?:React.ReactNode;
  defaultOpen?:boolean;
}
export declare function Disclosure(props:DisclosureProps):JSX.Element;
