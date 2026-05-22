import { HTMLAttributes } from "react";

type ChipVariant = "neutral" | "hot" | "mint" | "butter";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: ChipVariant;
};

const VARIANT_CLASS: Record<ChipVariant, string> = {
  neutral: "bg-white text-cocoa",
  hot: "text-white chip-hot",
  mint: "bg-mint text-[#073d2a]",
  butter: "bg-butter text-chocolate",
};

export function Chip({
  variant = "neutral",
  className = "",
  children,
  ...rest
}: ChipProps) {
  return (
    <span
      className={`chip-pop ${VARIANT_CLASS[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
}
