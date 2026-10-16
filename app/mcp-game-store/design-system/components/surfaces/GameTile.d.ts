/** A game tile for the all-games wall: a square picture, the name (600 16px), the kind (14px muted). No blurb and no tags: the wall is an index to scan and search, where a GameCard is a pitch. Lay tiles in `.mcp-gwall` (auto-fill, 140px minimum, 180px from 720px). */
export interface GameTileProps{
  /** The picture. Usually GameArt shape="square". */
  art:React.ReactNode;
  /** Set on a game that needs the Pass, for a player without it. Draws the Pass mark (lock and "Pass", solid, square) in the picture's top-right corner. Leave it off for Pass holders and free games: the card is then unchanged. It shows the Pass, never a price, and it isn't a control: the card's one link opens the game. */
  pass?:boolean;
  /** The game's name. Pass the tile's one link or button here; it stretches over the tile when the tile has mcp-art-host. */
  title:React.ReactNode;
  /** The game's kind, e.g. "Puzzle". */
  kind?:React.ReactNode;
  className?:string;
  style?:React.CSSProperties;
}
export declare function GameTile(props:GameTileProps):JSX.Element;
