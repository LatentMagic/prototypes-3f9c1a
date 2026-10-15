/** A game cover: 4:3 flat geometric art in cover colours, with the game name under it in Bricolage 15px.
 * @startingPoint section="Media" subtitle="Game cover tile, 4:3 flat shapes" viewport="700x260"
 */
export interface CoverProps{
  /** Game name shown under the art. */
  name?:string;
  /** One of the hand-off's example arts. Placeholders, not ratified cover designs. */
  art?:'daily-puzzles'|'daily-puzzles-diagonal'|'weekly-interrogation'|'dungeon-quest'|'dungeon-quest-single';
  /** Image URL for real cover art (overrides art). */
  src?:string;
  /** Custom SVG art (overrides src and art). */
  children?:React.ReactNode;
  /** Take the parent's height, never less than 4:3. The art stays a 4:3 picture placed by `extend`; the ground colour fills the rest. Use beside a heading (class mcp-cover-head). */
  fill?:boolean;
  /** The asset's ground colour, painted behind the art when filling. Built-in arts declare it. */
  ground?:'indigo'|'wine'|'forest';
  /** How the asset extends when its box is taller than 4:3, declared by the asset: bottom (the subject stands on the bottom edge; ground grows above) or centre (the subject floats; ground grows above and below equally). Required for fill. Built-in arts declare it. */
  extend?:'bottom'|'centre';
  /** Makes the whole cover a button. */
  onClick?:()=>void;
  className?:string;
}
export declare function Cover(props:CoverProps):JSX.Element;
