import Link from "next/link";

type RecipeCardProps = {
  title: string;
  /** URL de la photo. Si absente → fallback emoji + dégradé. */
  image?: string | null;
  emoji?: string | null;
  /** CSS gradient (ex. "linear-gradient(135deg, var(--butter), var(--orange))") utilisé en l'absence d'image. */
  gradient?: string | null;
  badge?: string;
  meta?: string[];
  /** Si fourni, la carte devient cliquable. */
  href?: string;
};

const DEFAULT_GRADIENTS = [
  "linear-gradient(135deg, var(--butter), var(--orange))",
  "linear-gradient(135deg, var(--raspberry), var(--hot-pink))",
  "linear-gradient(135deg, var(--mint), var(--basil))",
  "linear-gradient(135deg, var(--peach, #ffcba4), var(--cherry))",
  "linear-gradient(135deg, var(--orange), var(--cherry))",
];

function pickGradient(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return DEFAULT_GRADIENTS[Math.abs(hash) % DEFAULT_GRADIENTS.length];
}

export function RecipeCard({
  title,
  image,
  emoji,
  gradient,
  badge,
  meta = [],
  href,
}: RecipeCardProps) {
  const hasImage = Boolean(image);
  const fallbackGradient = gradient || pickGradient(title);

  const visual = (
    <div
      className="relative grid h-[160px] place-items-center overflow-hidden rounded-[24px]"
      style={
        hasImage
          ? {
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: fallbackGradient }
      }
      role="img"
      aria-label={title}
    >
      {!hasImage && (
        <span aria-hidden className="text-[72px] drop-shadow-md">
          {emoji ?? "🍽️"}
        </span>
      )}
      {badge && (
        <span
          className="absolute left-3 top-3 rounded-full bg-white/90 px-[10px] py-[8px] text-[12px] font-black text-dark-rose"
          style={{
            backdropFilter: "blur(10px)",
            animation: "badgePulse 2.8s ease-in-out infinite",
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );

  const body = (
    <>
      {visual}
      <div className="px-[10px] pb-[10px] pt-[14px]">
        <h3 className="mb-2 font-display text-[23px] leading-[0.95]">{title}</h3>
        {meta.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 text-[13px] font-extrabold text-cocoa">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        )}
        <span
          className="add-to-cauldron block w-full cursor-pointer rounded-[18px] border-0 px-3 py-[11px] text-center font-black text-dark-rose transition"
          style={{ background: "linear-gradient(135deg, #ffedf2, #ffe4b0)" }}
        >
          Ajouter au chaudron 🍲
        </span>
      </div>
    </>
  );

  const shellClass =
    "recipe-card relative block overflow-hidden rounded-[30px] bg-white p-[10px] no-underline text-chocolate transition";
  const shellStyle = { boxShadow: "0 16px 34px rgba(115, 42, 24, 0.12)" };

  if (href) {
    return (
      <Link href={href} className={shellClass} style={shellStyle}>
        {body}
      </Link>
    );
  }

  return (
    <article className={shellClass} style={shellStyle}>
      {body}
    </article>
  );
}
