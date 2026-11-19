export type ChatBlock=
 |{type:'tiles';rows:{word:string;/** One letter per tile: x not in the word, y in the word, g right spot. */marks:string}[]}
 |{type:'list';items:string[]}
 |{type:'mono';text:string}
 /* Chat parts (components/chat/). Each block is the part's props plus its type. */
 |({type:'tilegrid'}&import('../chat/TileGrid').TileGridProps)
 |({type:'wordboard'}&import('../chat/WordBoard').WordBoardProps)
 |({type:'choices'}&import('../chat/ChoiceButtons').ChoiceButtonsProps)
 |({type:'confirm'}&import('../chat/ConfirmCard').ConfirmCardProps)
 |({type:'facts'}&import('../chat/FactRows').FactRowsProps)
 |({type:'stats'}&import('../chat/StatRow').StatRowProps)
 |({type:'status'}&import('../chat/StatusTag').StatusTagProps)
 |({type:'entities'}&import('../chat/EntityCards').EntityCardsProps)
 |({type:'clues'}&import('../chat/ClueCards').ClueCardsProps)
 |({type:'result'}&import('../chat/ResultCard').ResultCardProps)
 |({type:'track'}&import('../chat/Track').TrackProps)
 |({type:'roll'}&import('../chat/RollLine').RollLineProps)
 |({type:'nav'}&import('../chat/NavButtons').NavButtonsProps)
 |({type:'menu'}&import('../chat/MenuRows').MenuRowsProps)
 |({type:'picture'}&import('../chat/Picture').PictureProps);
export interface ChatTurn{
  from:'user'|'ai';
  /** One paragraph, or several. Inline markup: `**bold**`, `*italic*`, `__underline__`; they nest, and a marker with no partner stays as typed. */
  text?:string|string[];
  /** AI turns only. Shows a "Called <tool>" line before the blocks. Pass the game's display name in full, whatever its length (for example `Delve` or `The Barrow of Hollowmere`), shown as "Called Delve". A long name wraps; it is never cut or shortened. */
  tool?:string;
  /** AI turns only. What the tool returned, shown above the text. */
  blocks?:ChatBlock[];
  /** AI turns only. Blocks after the text: the moves and buttons at the foot of the turn (choices, nav). */
  after?:ChatBlock[];
}
/** A small picture of a game being played in a generic chat window. For product pages, in place of a screenshot of someone else's app.
 * @startingPoint section="Media" subtitle="Chat picture, game played in a chat" viewport="900x520"
 */
export interface ChatPictureProps{
  turns:ChatTurn[];
  /** Where the conversation opens. Default: on the latest turn, with a pill at the top that scrolls back to the first. 'top': on the first turn (a short conversation sits at the top, not the bottom), with a down-arrow pill above the reply box that scrolls to the latest turn and hides once it is there. Use it where the first turn is the point, such as the line a player types. */
  start?:'latest'|'top';
  /** Header label. Omit for no header; the page around it already says whose it is. */
  title?:string;
  /** Shown before the tool name in the tool-call card, followed by a dot (`After Pixels · Called Delve`), e.g. the store name. It never breaks inside itself. Omit for no by-line and no dot. */
  toolBy?:string;
  /** Image URL for the logo in the tool-call card. Omit for none. */
  mark?:string;
  /** Height of the conversation area in px. Default 290. Opens on the latest turn; earlier turns scroll up. Ignored with `fill`. 'auto' grows to the whole conversation with no scroll, for previews and specimen pages only. */
  height?:number|'auto';
  /** Max width in px. Default 360. Shrinks to its container. Ignored with `fill`. */
  width?:number;
  /** Stretch to the box it sits in (width and height) instead of using `height` and `width`. The box must have a height. Default false. */
  fill?:boolean;
  /** Spoken name of the arrow pill that scrolls back to the first turn. Default "Back to the start", or "On to the latest" with start='top'. */
  more?:string;
  /** Show the reply box. Default true. */
  composer?:boolean;
  /** A real action in the reply bar, in place of the send button: pass the ready-made Button or TextLink. The chat draws its place, its black text-only look and its tap size, and names the bar "Reply" for a screen reader. Without it the bar is a pretend one, hidden from screen readers. Ignored when `composer` is false. */
  action?:React.ReactNode;
  placeholder?:string;
  /** Accessible name for the picture. */
  label?:string;
  className?:string;
}
export declare function ChatPicture(props:ChatPictureProps):JSX.Element;
