import Link from "next/link";

export type CategoryFilterItem = {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
};

type CategoryFilterProps = {
  categories: CategoryFilterItem[];
  activeSlug: string | null;
  /** Route de base (par défaut /recettes). Permet de réutiliser le filtre ailleurs. */
  basePath?: string;
};

export function CategoryFilter({
  categories,
  activeSlug,
  basePath = "/recettes",
}: CategoryFilterProps) {
  const allActive = !activeSlug;

  return (
    <div className="flex flex-wrap gap-[9px]" role="group" aria-label="Filtrer par catégorie">
      <Link
        href={basePath}
        aria-current={allActive ? "true" : undefined}
        className={`chip-pop ${allActive ? "chip-hot text-white" : "bg-white text-cocoa"} no-underline`}
      >
        ✨ Tout voir
      </Link>
      {categories.map((cat) => {
        const active = activeSlug === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`${basePath}?categorie=${cat.slug}`}
            aria-current={active ? "true" : undefined}
            className={`chip-pop ${active ? "chip-hot text-white" : "bg-white text-cocoa"} no-underline`}
          >
            {cat.emoji ? `${cat.emoji} ` : ""}
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
