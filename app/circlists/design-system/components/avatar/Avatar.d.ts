/** Initials disc for a member. Display names are first name + surname initial ("Sam M."). */
export interface AvatarProps {
  name: string;
  /** px. Default 34. */
  size?: number;
  /** Accent fill — the current user. */
  accent?: boolean;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
export declare function initialsOf(name: string): string;
