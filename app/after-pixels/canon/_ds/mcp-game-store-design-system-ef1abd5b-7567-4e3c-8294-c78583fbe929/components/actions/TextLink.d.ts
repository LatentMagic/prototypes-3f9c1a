/** Off-white underlined text action (600 16px, 48px tall hit area). danger turns it red, for the lighter-weight delete. Press dims to .55. */
export interface TextLinkProps{
  children?:React.ReactNode;
  danger?:boolean;
  /** Renders an <a> when set, else a <button>. */
  href?:string;
  onClick?:(e:any)=>void;
  className?:string;
}
export declare function TextLink(props:TextLinkProps):JSX.Element;
