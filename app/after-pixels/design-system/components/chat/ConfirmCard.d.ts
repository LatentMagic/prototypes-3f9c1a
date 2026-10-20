/** A final move asked back before it lands: a title, the question, optional named facts, a note, then Cancel and Confirm (secondary first, main second). Fenced. answer shows which one was pressed. */
export interface ConfirmCardProps{
  title?:string;
  /** The question. **double asterisks** make words bold. */
  question?:string;
  /** What is being committed to, one line each (Suspect, Weapon, Room). */
  facts?:{label:string;value:string}[];
  /** What happens if confirmed, e.g. that it can't be changed. */
  note?:string;
  /** Confirm label. Default "Confirm"; name the move ("Confirm accusation"). */
  confirm?:string;
  cancel?:string;
  /** Which was pressed, on an earlier turn. */
  answer?:'confirm'|'cancel';
  onConfirm?:()=>void;
  onCancel?:()=>void;
  className?:string;
}
export declare function ConfirmCard(props:ConfirmCardProps):JSX.Element;
