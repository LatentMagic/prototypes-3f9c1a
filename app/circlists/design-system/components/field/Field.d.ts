/** Label + input + inline hint or error. Input text is always 16px. */
export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Quiet helper under the field; hidden while an error shows. */
  hint?: string;
  /** Inline error, shown after the first submit attempt (deferred validation). */
  error?: string;
  /** JetBrains Mono — for URLs and addresses. */
  mono?: boolean;
  /** Trailing element positioned inside the field wrapper. */
  suffix?: React.ReactNode;
}
export declare function Field(props: FieldProps): JSX.Element;
