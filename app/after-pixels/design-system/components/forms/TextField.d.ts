/** Labelled 48px text input, 16px text (never smaller: iOS zoom floor). Error shows inline under the field with an error glyph, red border.
 * Validate only after the first submit attempt, then live. On a refused submit, move focus to the first invalid field.
 */
export interface TextFieldProps{
  label?:string;
  id?:string;
  /** Inline error message. Name the fix: "Enter an email with an @ in it." */
  error?:string;
  /** Muted helper line, hidden while an error shows. */
  hint?:string;
  type?:string;
  value?:string;
  defaultValue?:string;
  placeholder?:string;
  onChange?:(e:any)=>void;
  inputRef?:any;
  autoComplete?:string;
  className?:string;
}
export declare function TextField(props:TextFieldProps):JSX.Element;
/** Search input with a leading search glyph. */
export interface SearchFieldProps{label?:string;id?:string;placeholder?:string;value?:string;onChange?:(e:any)=>void;className?:string;}
export declare function SearchField(props:SearchFieldProps):JSX.Element;
