import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Variante "section" = grande surface (radius plus large, fond plus clair). */
  as?: "card" | "section";
};

export function Card({
  as = "card",
  className = "",
  children,
  ...rest
}: CardProps) {
  const base =
    as === "section"
      ? "rounded-[36px] border border-white/55 p-6 backdrop-blur-md"
      : "rounded-[34px] border border-white/65 p-[22px] backdrop-blur-md";
  const background =
    as === "section"
      ? "rgba(255, 249, 239, 0.56)"
      : "rgba(255, 255, 255, 0.82)";
  return (
    <div
      className={`${base} transition ${className}`.trim()}
      style={{
        background,
        boxShadow: "var(--shadow-pop-soft)",
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
