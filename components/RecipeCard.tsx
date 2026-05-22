type RecipeCardProps = {
  title: string;
  image: string;
  badge?: string;
  meta?: string[];
  onAdd?: () => void;
};

export function RecipeCard({
  title,
  image,
  badge,
  meta = [],
  onAdd,
}: RecipeCardProps) {
  return (
    <article
      className="recipe-card relative overflow-hidden rounded-[30px] bg-white p-[10px] transition"
      style={{ boxShadow: "0 16px 34px rgba(115, 42, 24, 0.12)" }}
    >
      <div
        className="relative h-[160px] rounded-[24px] bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        role="img"
        aria-label={title}
      >
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
      <div className="px-[10px] pb-[10px] pt-[14px]">
        <h3 className="mb-2 font-display text-[23px] leading-[0.95]">{title}</h3>
        {meta.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 text-[13px] font-extrabold text-cocoa">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={onAdd}
          className="add-to-cauldron w-full cursor-pointer rounded-[18px] border-0 px-3 py-[11px] font-black text-dark-rose transition"
          style={{
            background: "linear-gradient(135deg, #ffedf2, #ffe4b0)",
          }}
        >
          Ajouter au chaudron 🍲
        </button>
      </div>
    </article>
  );
}
