import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({
  label,
  hint,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const classes = ["ui-input", error ? "ui-input--error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <label className="ui-input-field" htmlFor={inputId}>
      {label ? <span className="ui-input__label">{label}</span> : null}
      <input id={inputId} className={classes} {...props} />
      {hint && !error ? <span className="ui-input__hint">{hint}</span> : null}
      {error ? <span className="ui-input__error">{error}</span> : null}
    </label>
  );
}
