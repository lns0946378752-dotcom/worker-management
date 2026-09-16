import type { HTMLAttributes } from "react";

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  size?: "sm" | "md" | "lg";
  src?: string;
};

export function Avatar({ name, size = "md", src, className = "", ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={['ui-avatar', `ui-avatar--${size}`, className].filter(Boolean).join(' ')}
      {...props}
      aria-label={name}
    >
      {src ? <img src={src} alt={name} className="ui-avatar__image" /> : initials || "U"}
    </div>
  );
}
