/** A picture in an AI turn, full width of the turn, 96px tall and cropped to fit. It scrolls with the turns. Inside ChatSide it draws 2:1, at most 400px wide. */
export interface PictureProps{
  /** Image URL. */
  src:string;
  /** What the picture shows, for a screen reader. */
  alt:string;
  className?:string;
}
export declare function Picture(props:PictureProps):JSX.Element;
