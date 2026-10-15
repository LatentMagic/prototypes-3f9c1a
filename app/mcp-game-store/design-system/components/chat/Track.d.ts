/** One or more tracks lined up: a label, a row of steps (12 or fewer) or a short bar, and "n of max". progress = ink, threat = dark red, health = dark green. */
export interface TrackProps{
  items:{label:string;value:number;max?:number;tone?:'progress'|'threat'|'health';/** Force steps or bar. Default steps when max is 12 or less. */steps?:boolean}[];
  className?:string;
}
export declare function Track(props:TrackProps):JSX.Element;
