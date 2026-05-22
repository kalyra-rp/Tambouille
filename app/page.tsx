import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/Card";
import { Sparkle } from "@/components/Sparkle";
import { RecipeCard } from "@/components/RecipeCard";
import { HeroChaudronPanel } from "@/components/HeroChaudronPanel";
import { HomeMiniChaudron } from "@/components/HomeMiniChaudron";
import { HomeMiniCourses } from "@/components/HomeMiniCourses";

export const dynamic = "force-dynamic";

// Photo de cuisine — temporaire jusqu'à l'auth + upload Supabase Storage
const HERO_PHOTO =
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80";

const COLLECTIONS = [
  {
    emoji: "🥞",
    title: "Brunch qui claque",
    tagline: "Pancakes, œufs, douceurs et café salvateur.",
    categorySlug: "petit-dej",
  },
  {
    emoji: "🍝",
    title: "Soir de semaine",
    tagline: "Rapide, gourmand, pas de crise existentielle.",
    categorySlug: "plats",
  },
  {
    emoji: "🧁",
    title: "Desserts sexy",
    tagline: "Chocolat, fruits, crème, et zéro regret.",
    categorySlug: "desserts",
  },
  {
    emoji: "🧀",
    title: "Apéro dînatoire",
    tagline: "Petites bouchées, grands effets.",
    categorySlug: "entrees",
  },
];

const DIFFICULTY_LABELS = [
  "Très facile",
  "Facile",
  "Moyen",
  "Difficile",
  "Pro",
];

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
};

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

export default async function HomePage() {
  const [categoriesRes, recipesRes] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, emoji")
      .is("parent_id", null)
      .order("sort_order", { ascending: true })
      .limit(5),
    supabase
      .from("recipes")
      .select(
        "id, title, slug, photo_url, emoji, gradient, prep_minutes, cook_minutes, difficulty, cost, status",
      )
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const categories = categoriesRes.data ?? [];
  const recipes = (recipesRes.data ?? []) as RecipeRow[];

  return (
    <div className="grid gap-6">
      {/* ============================================
          HERO
          ============================================ */}
      <section
        className="hero-home relative overflow-hidden rounded-[42px] p-6 sm:p-10"
        style={{
          minHeight: 420,
          background: `linear-gradient(110deg, rgba(61, 31, 25, 0.9) 0%, rgba(90, 8, 40, 0.84) 42%, rgba(155, 18, 63, 0.48) 100%), url(${HERO_PHOTO})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "var(--shadow-pop)",
          color: "white",
        }}
      >
        {/* Étincelles décoratives */}
        <Sparkle className="left-[42%] top-[14%]" size={28} delay={-0.3} />
        <Sparkle
          className="left-[58%] bottom-[22%]"
          size={20}
          delay={-1.2}
          glyph="✧"
          color="#ff9fc0"
        />
        <Sparkle className="left-[34%] bottom-[30%]" size={16} delay={-2} />

        {/* Emojis flottants */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-[20px] top-[14px] z-[1] select-none text-[64px] sm:right-[26px] sm:top-[20px] sm:text-[72px]"
          style={{
            animation: "floaty 4.2s ease-in-out infinite",
            filter: "drop-shadow(0 12px 22px rgba(0, 0, 0, 0.18))",
          }}
        >
          🍓
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute right-[150px] bottom-[14px] z-[1] select-none text-[54px] sm:right-[170px] sm:bottom-[18px] sm:text-[64px]"
          style={{
            animation: "floaty 4.2s ease-in-out infinite",
            animationDelay: "-1.4s",
            filter: "drop-shadow(0 12px 22px rgba(0, 0, 0, 0.18))",
          }}
        >
          🍒
        </span>

        <div className="grid grid-cols-1 items-center gap-6 min-[1180px]:grid-cols-[1.15fr_0.85fr]">
          {/* Gauche : texte + actions */}
          <div className="relative z-[2]">
            <span
              className="mb-4 inline-flex items-center gap-2 rounded-full px-[13px] py-[8px] text-[13px] font-black"
              style={{
                background: "rgba(255, 255, 255, 0.18)",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(10px)",
              }}
            >
              🍓 Ton grimoire gourmand, pop et organisé
            </span>

            <h1
              className="m-0 mb-4 max-w-[680px] font-display text-white"
              style={{
                fontSize: "clamp(48px, 7vw, 82px)",
                lineHeight: 0.86,
                letterSpacing: "-2px",
                textShadow: "0 12px 34px rgba(0, 0, 0, 0.28)",
              }}
            >
              Qu&apos;est-ce qu&apos;on mijote aujourd&apos;hui ?
            </h1>

            <p
              className="m-0 mb-6 max-w-[600px] text-[17px] font-semibold leading-[1.6]"
              style={{ color: "rgba(255, 255, 255, 0.91)" }}
            >
              Explore tes recettes, prépare tes menus et transforme tes envies
              en liste de courses en quelques clics. La sorcellerie, mais avec
              du bacon.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/recettes"
                className="btn-pop btn-pop--primary no-underline"
              >
                🍒 Explorer mes recettes
              </Link>
              <Link
                href="/chaudron"
                className="btn-pop btn-pop--secondary no-underline"
              >
                🍲 Voir le chaudron
              </Link>
              <Link
                href="/recettes"
                className="btn-pop btn-pop--ghost no-underline"
              >
                ✨ Inspire-moi
              </Link>
            </div>
          </div>

          {/* Droite : panneau Chaudron du jour (client) */}
          <HeroChaudronPanel />
        </div>
      </section>

      {/* ============================================
          COLLECTIONS GOURMANDES
          ============================================ */}
      <Card as="section">
        <header className="mb-5">
          <h2 className="m-0 font-display text-[34px] text-chocolate">
            Collections gourmandes
          </h2>
          <p className="mt-1 font-semibold text-cocoa">
            Des raccourcis pour cuisiner sans partir en expédition dans le
            Mordor du frigo.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1180px]:grid-cols-4">
          {COLLECTIONS.map((col, i) => (
            <Link
              key={col.title}
              href={`/recettes?categorie=${col.categorySlug}`}
              className="collection-card relative block overflow-hidden rounded-[28px] bg-white p-[18px] no-underline transition"
              style={{
                minHeight: 126,
                boxShadow: "0 14px 28px rgba(115, 42, 24, 0.1)",
              }}
            >
              <strong className="mb-2 block font-display text-[24px] leading-none text-chocolate">
                {col.title}
              </strong>
              <span className="block text-[13px] font-bold text-cocoa">
                {col.tagline}
              </span>
              <span
                aria-hidden
                className="absolute -bottom-[10px] right-[10px] select-none text-[60px] opacity-25"
                style={{
                  animation: "iconBob 4s ease-in-out infinite",
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {col.emoji}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      {/* ============================================
          MAIN 2-COL : Recettes + Side stack
          ============================================ */}
      <div className="grid grid-cols-1 gap-6 min-[1180px]:grid-cols-[1fr_380px]">
        {/* Gauche : Recettes à croquer */}
        <Card as="section">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="m-0 font-display text-[34px] text-chocolate">
                Recettes à croquer
              </h2>
              <p className="mt-1 font-semibold text-cocoa">
                Les fiches en mode carte gourmande, avec filtres et statuts.
              </p>
            </div>
            <Link
              href="/recettes"
              className="rounded-full bg-white px-[14px] py-[10px] text-[13px] font-black text-dark-rose no-underline transition hover:-translate-y-[2px]"
              style={{ boxShadow: "0 8px 20px rgba(115, 42, 24, 0.08)" }}
            >
              Voir tout →
            </Link>
          </header>

          {categories.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-[9px]">
              <Link
                href="/recettes"
                className="chip-pop chip-hot text-white no-underline"
              >
                ✨ Tout voir
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/recettes?categorie=${cat.slug}`}
                  className="chip-pop bg-white text-cocoa no-underline"
                >
                  {cat.emoji ? `${cat.emoji} ` : ""}
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {recipes.length === 0 ? (
            <p className="m-0 font-semibold text-cocoa">
              Aucune recette pour l&apos;instant. Ajoute ta première trouvaille
              pour faire frémir la marmite ✨
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1180px]:grid-cols-3">
              {recipes.slice(0, 6).map((r) => (
                <RecipeCard
                  key={r.id}
                  title={r.title}
                  image={r.photo_url}
                  emoji={r.emoji}
                  gradient={r.gradient}
                  badge={buildBadge(r.status)}
                  meta={buildMeta(r)}
                  href={`/recettes/${r.slug ?? r.id}`}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Droite : Side stack — mini chaudron + mini courses (clients) */}
        <div className="grid gap-6 content-start">
          <HomeMiniChaudron />
          <HomeMiniCourses />
        </div>
      </div>
    </div>
  );
}
