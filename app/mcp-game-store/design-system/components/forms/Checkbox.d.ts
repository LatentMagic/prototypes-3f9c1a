/** Square 24px checkbox in a 48px row. Checked = off-white fill with dark tick. */
export interface CheckboxProps{
  label?:React.ReactNode;
  checked?:boolean;
  defaultChecked?:boolean;
  onChange?:(e:any)=>void;
  className?:string;
}
export declare function Checkbox(props:CheckboxProps):JSX.Element;
