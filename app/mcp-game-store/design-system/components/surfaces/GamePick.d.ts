/** One of Discover's two picks: a game we feature by hand. Bigger than a GameCard: a 3:1 picture, a 13px caps label saying why it's picked, the name and blurb as one block (8px apart), then tags, 16px between parts. Put the pair in `.mcp-gpicks`: one column when narrow, two from about 720px, where the two share three lines so their text and tags start level. */
export interface GamePickProps{
  /** The picture. Usually GameArt shape="wide"; it is shown at 3:1. */
  art:React.ReactNode;
  /** Why it's picked, in caps, e.g. "FREE EVERY DAY". Both picks have one. */
  label:React.ReactNode;
  /** The game's name. Pass the card's one link or button here. */
  title:React.ReactNode;
  /** One or two sentences about the game. Wraps normally. */
  blurb:React.ReactNode;
  /** The game's Tags. */
  tags?:React.ReactNode;
  className?:string;
  style?:React.CSSProperties;
}
export declare function GamePick(props:GamePickProps):JSX.Element;
