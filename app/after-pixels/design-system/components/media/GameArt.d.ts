
/** Flat-shape game art. It plays its motion as the hover, focus and press response of the link or button it sits in (a clickable Card, ListRow or Cover, or an <a href>/<button> with class "mcp-art-host"): shapes change form together over 400ms and hold until the pointer leaves. With nothing pressable around it, it is still. It reflows its composition for square, landscape (4:3) and wide (3:1) frames.
 * @startingPoint section="Media" subtitle="Game art with hover motion" viewport="700x300"
 */
export interface GameArtProps{
  /** Which piece. These five are worked examples of the motion and shape rules, not the game library. */
  art:'groups'|'casebook'|'hunter'|'mystery'|'word';
  /** Frame shape: square 1:1, landscape 4:3, wide 3:1. */
  shape?:'square'|'landscape'|'wide';
  className?:string;
}
export declare function GameArt(props:GameArtProps):JSX.Element;
