/** One row in a list of things that each open (plays, editions, games, saves). A slotted row is two 20px lines at every width, 62px: title (and the game's name) over the result; when on the right, over Replay if there is one. The row fits its own text: it picks each text's form to fit, drops the game's name before it cuts the title, and warns in the console once per problem. Whole row is one target with a chevron at rest. A line of a play's record opens nothing: use MoveRow. */
export interface ListRowProps{
  /** The edition or thing as the product names it, without the game, in ink: "#212", "The Locked Study", "#14 · The Name", "Daily Word" (a game in a library). Plain text: the row cuts it to fit with a clean "…". Never put the game's name in it: pass game. */
  title?:React.ReactNode;
  /** The game's name, quiet, after the title: "The Locked Study · Escape". Only in a list that mixes games, beside a cover; without lead it is dropped. Too long: it goes first, whole, before the title is cut. */
  game?:string;
  /** The game's cover, 56×42 beside the two lines. Only in a list that mixes games. */
  lead?:React.ReactNode;
  /** The result, in ink. Plain text, or its forms longest first: ["All 4 groups, no mistakes", "No mistakes"]. From 440px of row width the row shows the longest form that fits; under 440 every row shows its last form. */
  result?:string|string[];
  /** Colours the result's icon only; the words stay in ink. 'none' is muted with no icon. */
  tone?:'ok'|'bad'|'none';
  /** When: plain text or its forms longest first (["6 Oct, 12:40", "6 Oct"]). A time under a day heading ("21:15"), otherwise a date ("6 Oct"). At most 8rem. From 440px of row width the longest form that fits; under 440 its last form. Centred across both lines unless the row is a replay. */
  when?:string|string[];
  /** This play repeats an earlier one: "Replay" under when. On or off; the row writes the word. */
  replay?:boolean;
  /** @deprecated Use replay. Any value shows as "Replay" and warns. */
  note?:React.ReactNode;
  /** Free meta line for rows that aren't a result (a save, a search hit). Spans with 12px gaps; it wraps. Ignored when result, when or replay is set. */
  meta?:React.ReactNode;
  /** One Tag before the chevron, on a row with no result, when or Replay (a save, a search hit). Dropped, with a warning, on a result row. */
  end?:React.ReactNode;
  /** A child of the row above it (a replay under its edition): one 44px line, Replay then result then when, indented to the title. No title, game, lead or end. */
  sub?:boolean;
  /** Makes the whole row one link. */
  href?:string;
  /** Makes the whole row one button. Never put a button or link inside a row. */
  onClick?:(e:React.MouseEvent)=>void;
  /** Accessible name. By default the row writes it from the full forms (title, game, Replay, result, when), so text hidden to fit is still read. */
  label?:string;
  /** Exists but can't be opened: muted title, no chevron, no hover. */
  muted?:boolean;
  className?:string;
}
export declare function ListRow(props:ListRowProps):JSX.Element;
/** The list that holds ListRows. Renders a ul; each child becomes an li. A line between rows (none above a sub row). Rows keep their two-line shape at every width; give a long list a measure (about 760px). */
export interface RowListProps{
  children?:React.ReactNode;
  label?:string;
  className?:string;
}
export declare function RowList(props:RowListProps):JSX.Element;
