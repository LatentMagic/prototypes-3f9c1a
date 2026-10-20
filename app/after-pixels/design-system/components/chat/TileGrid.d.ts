/** Squares that hold one letter or nothing, in rows that stack into a grid. Any length, any number of rows. Tiles size to the chat's text (32px, smaller when a long row would not fit) and two or more rows are fenced as one unit. Marks: hit = cover green, near = cover amber, miss = flat tone with a soft letter, filled = ink edge. */
export interface TileGridProps{
  /** One entry per row. letters: one character per tile; a space is an empty tile. marks: one character per tile, h right place, n in it but wrong place, x not in it, any other character (or none) just filled. */
  rows:{letters:string;marks?:string}[];
  /** Tiles per row. Default: the longest row. Shorter rows are padded with empty tiles. */
  length?:number;
  /** Total rows to draw; blank rows are added after the played ones (e.g. 6 for six tries). */
  count?:number;
  /** Accessible description. Default: each row read out, tile by tile, with its mark. */
  label?:string;
  className?:string;
}
export declare function TileGrid(props:TileGridProps):JSX.Element;
