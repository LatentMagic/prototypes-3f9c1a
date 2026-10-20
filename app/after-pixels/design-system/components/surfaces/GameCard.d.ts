/** The one game card. Use it wherever a game is shown as a card: every CardRow (Available games, Just added, Free to play, More games). Discover's two picks are GamePicks. Three slots, always rendered, in this order: picture (2:1), text (name with an optional mark beside it, then the blurb, 16px muted, snug together), chips. Inside a CardRow the row shares three lines: pictures and text start level, every card is the same height, and each card's chips are centred in the shared chip line, so one row of chips sits level with the middle of another card's two. Outside a CardRow it stacks normally. */
export interface GameCardProps{
  /** The picture. Usually GameArt; it is shown at 2:1. */
  art:React.ReactNode;
  /** Set on a game that needs the Pass, for a player without it. Draws the Pass mark (lock and "Pass", solid, square) in the picture's top-right corner. Leave it off for Pass holders and free games: the card is then unchanged. It shows the Pass, never a price. */
  pass?:boolean;
  /** Opens the Pass page. With it, the Pass mark is its own button, pressable apart from the card: it sits above the card's stretched link and takes the Secondary button's hover, press and focus. Pass it wherever `pass` is set. */
  onPass?:(e:React.MouseEvent)=>void;
  /** The game's name, set as mcp-t-card. Pass the card's one main link or button here when the card opens something. */
  title:React.ReactNode;
  /** Optional Tag beside the name, e.g. "Played". */
  mark?:React.ReactNode;
  /** One or two sentences about the game. Wraps normally; never text-wrap: balance. */
  blurb:React.ReactNode;
  /** The game's Tags. */
  tags?:React.ReactNode;
  className?:string;
  style?:React.CSSProperties;
}
export declare function GameCard(props:GameCardProps):JSX.Element;
