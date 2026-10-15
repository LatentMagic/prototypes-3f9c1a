/** Square-cornered 48px action. Main = off-white fill, dark text. Secondary = outlined, text-coloured. Danger = filled red for delete.
 * Hover (mouse only) is a half-step of the press colour; every press scales to .97 over 120ms. Labels name the action ("Delete save", never "OK").
 * Working state (the rule "every action that changes state shows it is working"): from the press until the result the button
 * shows a spinner beside its label and cannot be pressed again. It stays focusable (aria-busy, aria-disabled) so focus is not lost.
 * The spinner shows at once, as the receipt for the press, and holds at least 400ms once shown so it never flickers.
 * @startingPoint section="Actions" subtitle="Main, secondary, delete; working, done and disabled states" viewport="700x400"
 */
export interface ButtonProps{
  variant?:'main'|'secondary'|'danger';
  children?:React.ReactNode;
  /** Working state. Shows a spinner and blocks repeat presses (clicks, Enter, form submits) until it is false again. */
  loading?:boolean;
  /** Label while working, e.g. "Adding". Defaults to children. */
  loadingLabel?:string;
  /** With doneLabel set, swaps the label to a check + doneLabel over 160ms. */
  done?:boolean;
  doneLabel?:string;
  /** Prefer a plain statement in the slot over a disabled button (ui-design.md). Never use disabled for the working state. */
  disabled?:boolean;
  /** Full width. Use on phones; on desktop keep natural width ("fill by arranging, not stretching"). */
  block?:boolean;
  icon?:'search'|'back'|'close'|'lock'|'play'|'settings';
  type?:'button'|'submit'|'reset';
  /** If it returns a promise, the button enters the working state by itself until the promise settles. */
  onClick?:(e:any)=>void|Promise<unknown>;
  className?:string;
}
export declare function Button(props:ButtonProps):JSX.Element;
/** Two equal-width buttons side by side, 12px gap. Order: secondary then main (Sign in, Sign up; Keep it, Delete save). */
export interface ButtonPairProps{children?:React.ReactNode;className?:string;}
export declare function ButtonPair(props:ButtonPairProps):JSX.Element;
