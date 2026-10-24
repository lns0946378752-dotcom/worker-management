import type { HTMLAttributes, ReactNode } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
};

export function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
  ...props
}: CardProps) {
  const classes = ["ui-card", className].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      {(title || subtitle || action) && (
        <div className="ui-card__header">
          <div>
            {title ? <h3 className="ui-card__title">{title}</h3> : null}
            {subtitle ? <p className="ui-card__subtitle">{subtitle}</p> : null}
          </div>
          {action ? <div className="ui-card__action">{action}</div> : null}
        </div>
      )}
      <div className="ui-card__body">{children}</div>
    </div>
  );
}
