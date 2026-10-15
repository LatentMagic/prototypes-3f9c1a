/** A card for screens with no cover: carries the small flat shape block in its top-right corner (teal, off-white, amber).
 * @startingPoint section="Surfaces" subtitle="Sign-in panel with corner shape block" viewport="700x380"
 */
export interface FormCardProps{
  title?:string;
  children?:React.ReactNode;
  className?:string;
  style?:React.CSSProperties;
}
export declare function FormCard(props:FormCardProps):JSX.Element;
