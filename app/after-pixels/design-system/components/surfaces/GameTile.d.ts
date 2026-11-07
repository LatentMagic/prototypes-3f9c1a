/** A game tile for the all-games wall: a square picture, the name (600 16px), the kind (14px muted). No blurb and no tags: the wall is an index to scan and search, where a GameCard is a pitch. Lay tiles in `.mcp-gwall` (auto-fill, 140px minimum, 180px from 720px). */
export interface GameTileProps{
  /** The picture. Usually GameArt shape="square". */
  art:React.ReactNode;
  /** Set on a game that needs the Pass, for a player without it. Draws the Pass mark (lock and "Pass", solid, square) in the picture's top-right corner. Leave it off for Pass holders and free games: the card is then unchanged. It shows the Pass, never a price. */
  pass?:boolean;
  /** Opens the Pass page. With it, the Pass mark is its own button, pressable apart from the tile: it sits above the stretched link and takes the Secondary button's hover, press and focus. Pass it wherever `pass` is set. */
  onPass?:(e:React.MouseEvent)=>void;
  /** Set on a game whose first edition is free and the rest need the Pass, for a player without the Pass. Draws "First free" with the lock in the picture's top-right corner, where the Pass mark sits. Never a control: the tile itself opens the game. Ignored when `soon` or `pass` is set. */
  first?:boolean;
  /** Set on a game that is out for now and coming back. Draws "Coming soon" (no lock) in the top-right corner and dims the picture, text and tags behind it. The tile cannot be pressed and has no hover, focus or press effect: pass `title` as plain text, not a link or button, and leave `mcp-art-host` off. Wins over `pass` and `first`. */
  soon?:boolean;
  /** The game's name. Pass the tile's one link or button here; it stretches over the tile when the tile has mcp-art-host. */
  title:React.ReactNode;
  /** The game's kind, e.g. "Puzzle". */
  kind?:React.ReactNode;
  className?:string;
  style?:React.CSSProperties;
}
export declare function GameTile(props:GameTileProps):JSX.Element;
