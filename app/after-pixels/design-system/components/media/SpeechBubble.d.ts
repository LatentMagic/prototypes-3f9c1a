/** Words the player types into their chat, drawn inline as a sent message: off-white fill, page-colour text at the size of the words around it, weight 500, round corners with the bottom-right one nearly square (the tail). Sits on the text's baseline and adds no height. Static by default; with `copy` it is a button that copies the words, drawn exactly as the static bubble. A clear gap (4px) is set before it in the component's own CSS, beside the space the sentence carries. */
export interface SpeechBubbleProps{
  /** The exact words the player types. */
  children:React.ReactNode;
  /** A long bubble: when it does not fit the rest of the line it moves to the next line whole, and breaks inside itself only when a line is too narrow for it. A short bubble never breaks. */
  wrap?:boolean;
  /** The bubble is a button that copies its words. Looks like the static bubble (pointer and hover only); on press the words swap to "Copied" for 2400ms. Use only where the page's design says the typed line copies. */
  copy?:boolean;
  /** For a light ground (inside a ChatPicture): a 1.5px warm-grey edge drawn inside the bubble, so the off-white fill reads against the chat's off-white. Same size and shape. */
  edge?:boolean;
  /** Called with the words when a copying bubble is pressed; without it the bubble writes to the clipboard itself. Return false (or a promise of false) when the copy was refused: the bubble then does not swap to "Copied". */
  onCopy?:(text:string)=>void|boolean|Promise<boolean|void>;
  className?:string;
}
export declare function SpeechBubble(props:SpeechBubbleProps):JSX.Element;
