/** Words the player types into their chat, drawn inline as a sent message: off-white fill, page-colour text at the size of the words around it, weight 500, round corners with the bottom-right one nearly square (the tail). Sits on the text's baseline and adds no height. Static by default; with `copy` it is a button that copies the words, marked by a copy glyph at its right end. A clear gap (4px) is set before it in the component's own CSS, beside the space the sentence carries. */
export interface SpeechBubbleProps{
  /** The exact words the player types. */
  children:React.ReactNode;
  /** A long bubble: when it does not fit the rest of the line it moves to the next line whole, and breaks inside itself only when a line is too narrow for it. A short bubble never breaks. */
  wrap?:boolean;
  /** The bubble is a button that copies its words. Marked at rest by a copy glyph; on press the words swap to "Copied" for 2400ms. Use only where the page's design says the typed line copies. */
  copy?:boolean;
  /** Called with the words when a copying bubble is pressed; without it the bubble writes to the clipboard itself. */
  onCopy?:(text:string)=>void;
  className?:string;
}
export declare function SpeechBubble(props:SpeechBubbleProps):JSX.Element;
