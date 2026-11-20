import type { ChatBlock } from './ChatPicture';
/** The game beside a chat on a wide page: an edition label, then what the AI draws, centred in the space left. It draws the same parts as the chat (tilegrid, clues, picture and the rest) and is inert. Give it the height of the stage it sits in. */
export interface ChatSideProps{
  /** The edition label, such as "Delve #40", set small in capitals at the top left. Omit for none. */
  label?:string;
  /** What to draw: the parts' blocks, as in a turn. */
  blocks:ChatBlock[];
  /** Spoken name of the group. Default "The game beside the chat". */
  name?:string;
  className?:string;
}
export declare function ChatSide(props:ChatSideProps):JSX.Element;
