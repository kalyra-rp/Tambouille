type SparkleProps = {
  className?: string;
  glyph?: string;
  delay?: number;
  color?: string;
  size?: number;
};

export function Sparkle({
  className = "",
  glyph = "✦",
  delay = 0,
  color = "var(--gold)",
  size = 28,
}: SparkleProps) {
  return (
    <span
      aria-hidden
      className={`sparkle pointer-events-none absolute z-[1] select-none ${className}`}
      style={{
        color,
        fontSize: size,
        opacity: 0.85,
        textShadow: "0 0 18px rgba(255, 212, 71, .7)",
        animation: "sparkleDance 3.5s ease-in-out infinite",
        animationDelay: `${delay}s`,
      }}
    >
      {glyph}
    </span>
  );
}
