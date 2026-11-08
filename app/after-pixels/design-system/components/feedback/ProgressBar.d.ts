/** 8px square track in a mid tone (--control-edge at 40% over --page) with an off-white fill; label and percentage above in 14px/600. */
export interface ProgressBarProps{
  label?:string;
  value?:number;
  max?:number;
  showValue?:boolean;
}
export declare function ProgressBar(props:ProgressBarProps):JSX.Element;
