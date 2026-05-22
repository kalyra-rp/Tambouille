type LogoProps = {
  compact?: boolean;
  tagline?: string;
};

export function Logo({
  compact = false,
  tagline = "Pop Kitchen pétillante",
}: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid h-[54px] w-[54px] -rotate-[5deg] place-items-center rounded-[19px] text-[28px] text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--wine-rose), var(--dark-rose), var(--hot-pink), var(--orange))",
          backgroundSize: "220% 220%",
          boxShadow: "0 14px 25px rgba(233, 38, 85, .28)",
          animation:
            "logoWiggle 3.8s ease-in-out infinite, gradientPulse 5s ease infinite",
        }}
        aria-hidden
      >
        🍲
      </div>
      {!compact && (
        <div>
          <p className="font-display text-[27px] leading-[0.9] tracking-[-0.5px] text-chocolate">
            Tambouille
          </p>
          <span className="mt-1 block text-[12px] font-bold text-cocoa">
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
}
