/** Words the player types into their chat, drawn inline as a sent message: off-white fill, page-colour text at the size of the words around it, weight 500, round corners with the bottom-right one nearly square (the tail). Sits on the text's baseline and adds no height. Not a control: no pointer, hover or press. Put a non-breaking space between it and the word before it. */
export interface SpeechBubbleProps{
  /** The exact words the player types. */
  children:React.ReactNode;
  /** A long bubble: when it does not fit the rest of the line it moves to the next line whole, and breaks inside itself only when a line is too narrow for it. A short bubble never breaks. */
  wrap?:boolean;
  className?:string;
}
export declare function SpeechBubble(props:SpeechBubbleProps):JSX.Element;
