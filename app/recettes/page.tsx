import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/Card";
import { RecipeCard } from "@/components/RecipeCard";
import { Sparkle } from "@/components/Sparkle";
import {
  CategoryFilter,
  type CategoryFilterItem,
} from "@/components/CategoryFilter";

// Toujours rendu à la requête : on lit des données fraîches de Supabase
export const dynamic = "force-dynamic";

type RecipeRow = {
  id: string;
  title: string;
  slug: string | null;
  photo_url: string | null;
  emoji: string | null;
  gradient: string | null;
  prep_minutes: number | null;
  cook_minutes: number | null;
  difficulty: number | null;
  cost: number | null;
  status: "totry" | "tested" | "favorite" | "archived" | null;
  category_id: string | null;
};

const DIFFICULTY_LABELS = [
  "Très facile",
  "Facile",
  "Moyen",
  "Difficile",
  "Pro",
];

function buildMeta(r: RecipeRow): string[] {
  const meta: string[] = [];
  const total = (r.prep_minutes ?? 0) + (r.cook_minutes ?? 0);
  if (total > 0) meta.push(`${total} min`);
  if (r.difficulty) meta.push(DIFFICULTY_LABELS[r.difficulty - 1] ?? "Facile");
  if (r.cost) meta.push("€".repeat(r.cost));
  return meta;
}

function buildBadge(status: RecipeRow["status"]): string | undefined {
  switch (status) {
    case "favorite":
      return "❤️ Chouchou";
    case "tested":
      return "🍓 Validée famille";
    case "totry":
      return "✨ À tenter";
    default:
      return undefined;
  }
}

type SearchParams = { categorie?: string };

export default async function RecettesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { categorie } = await searchParams;
  const activeSlug = categorie ?? null;

  // 1) Catégories de premier niveau (parent_id IS NULL) pour les chips
  const categoriesResult = await supabase
    .from("categories")
    .select("id, name, slug, emoji")
    .is("parent_id", null)
    .order("sort_order", { ascending: true });

  // 2) Si une catégorie est active, trouver son id pour filtrer les recettes
  let activeCategoryId: string | null = null;
  if (activeSlug && categoriesResult.data) {
    const found = categoriesResult.data.find((c) => c.slug === activeSlug);
    activeCategoryId = found?.id ?? null;
  }

  // 3) Recettes (filtrées si catégorie active)
  let recipesQuery = supabase
    .from("recipes")
    .select(
      "id, title, slug, photo_url, emoji, gradient, prep_minutes, cook_minutes, difficulty, cost, status, category_id",
    )
    .order("created_at", { ascending: false });

  if (activeCategoryId) {
    recipesQuery = recipesQuery.eq("category_id", activeCategoryId);
  }

  const recipesResult = await recipesQuery;

  // --- État : erreur -----------------------------------------------------
  if (categoriesResult.error || recipesResult.error) {
    const message =
      recipesResult.error?.message ??
      categoriesResult.error?.message ??
      "Erreur inconnue";
    return (
      <Card as="section" className="text-center">
        <h1 className="mb-3 font-display text-4xl text-chocolate">
          🪄 Le grimoire est rétif…
        </h1>
        <p className="mx-auto max-w-[520px] text-cocoa font-semibold">
          Impossible d&apos;invoquer les recettes pour le moment. Réessaye dans un
          instant, et si la marmite reste muette, jette un œil aux logs.
        </p>
        <p className="mx-auto mt-4 inline-block max-w-full overflow-x-auto rounded-full bg-vanilla px-4 py-2 text-[12px] font-bold text-dark-rose">
          {message}
        </p>
      </Card>
    );
  }

  const categories = (categoriesResult.data ?? []) as CategoryFilterItem[];
  const recipes = (recipesResult.data ?? []) as RecipeRow[];

  return (
    <Card as="section" className="relative overflow-hidden">
      <Sparkle className="right-[10%] top-[8%]" size={24} delay={-0.4} />
      <Sparkle
        className="right-[22%] top-[20%]"
        size={18}
        delay={-1.2}
        glyph="✧"
        color="#ff9fc0"
      />

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-[13px] py-[8px] text-[13px] font-black text-dark-rose">
            📚 Ta bibliothèque gourmande
          </span>
          <h1 className="m-0 font-display text-[clamp(36px,5vw,52px)] tracking-[-1px] text-chocolate">
            Recettes à croquer
          </h1>
          <p className="mt-2 max-w-[560px] text-cocoa font-semibold">
            Filtre par catégorie, ajoute au chaudron, transforme tout ça en
            liste de courses. Pas de pitié pour le chaos du frigo.
          </p>
        </div>
        <Link
          href="/recettes/nouvelle"
          className="btn-pop btn-pop--secondary"
          style={{ textDecoration: "none" }}
        >
          + Nouvelle recette
        </Link>
      </header>

      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryFilter categories={categories} activeSlug={activeSlug} />
        </div>
      )}

      {/* --- État : vide --- */}
      {recipes.length === 0 ? (
        <div className="rounded-[28px] bg-vanilla/70 p-10 text-center">
          <div
            className="mx-auto mb-4 grid h-[88px] w-[88px] place-items-center rounded-[28px] text-[44px]"
            style={{
              background:
                "linear-gradient(135deg, var(--butter), var(--orange), var(--hot-pink))",
              boxShadow: "0 18px 36px rgba(233, 38, 85, 0.26)",
              animation: "floaty 4.2s ease-in-out infinite",
            }}
          >
            🪄
          </div>
          <h2 className="mb-2 font-display text-[28px] text-chocolate">
            {activeSlug
              ? "Cette case est encore vide…"
              : "Ton grimoire est encore vierge…"}
          </h2>
          <p className="mx-auto mb-6 max-w-[440px] text-cocoa font-semibold">
            {activeSlug
              ? "Aucune recette dans cette catégorie pour le moment. Le four chauffe — ajoute ta première trouvaille !"
              : "Aucune recette pour l'instant. Ajoute ta première trouvaille et fais frémir la marmite ✨"}
          </p>
          <Link
            href="/recettes/nouvelle"
            className="btn-pop btn-pop--primary inline-block no-underline"
          >
            🍒 Ajouter ma première recette
          </Link>
          {activeSlug && (
            <div className="mt-4">
              <Link
                href="/recettes"
                className="text-[13px] font-bold text-dark-rose underline"
              >
                ← Revenir à toutes les recettes
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1180px]:grid-cols-3">
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              title={r.title}
              image={r.photo_url}
              emoji={r.emoji}
              gradient={r.gradient}
              badge={buildBadge(r.status)}
              meta={buildMeta(r)}
              href={r.slug ? `/recettes/${r.slug}` : undefined}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
