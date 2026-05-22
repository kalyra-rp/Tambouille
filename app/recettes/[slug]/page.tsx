import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/Card";
import { Sparkle } from "@/components/Sparkle";
import { RecipeTabs } from "@/components/RecipeTabs";
import {
  PortionAdjuster,
  type AdjusterIngredient,
} from "@/components/PortionAdjuster";
import { AddToCauldronButton } from "@/components/AddToCauldronButton";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DIFFICULTY_LABELS = [
  "Très facile",
  "Facile",
  "Moyen",
  "Difficile",
  "Pro",
];

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, var(--butter), var(--orange))",
  "linear-gradient(135deg, var(--raspberry), var(--hot-pink))",
  "linear-gradient(135deg, var(--mint), var(--basil))",
  "linear-gradient(135deg, var(--peach, #ffcba4), var(--cherry))",
  "linear-gradient(135deg, var(--orange), var(--cherry))",
];

function pickGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return FALLBACK_GRADIENTS[Math.abs(hash) % FALLBACK_GRADIENTS.length];
}

// ---------- Types miroir du select Supabase ----------

type Step = {
  id: string;
  step_number: number;
  content: string;
  duration_minutes: number | null;
  temperature: string | null;
  step_group: string | null;
  sort_order: number | null;
};

type RecipeIngredientRow = {
  id: string;
  quantity: number | null;
  unit: string | null;
  prep_note: string | null;
  ingredient_group: string | null;
  is_optional: boolean | null;
  sort_order: number | null;
  ingredient: {
    id: string;
    name: string;
    aisle: string | null;
    default_unit: string | null;
  } | null;
};

type Tag = { id: string; name: string; slug: string; color: string | null };

type RecipeFull = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string | null;
  description: string | null;
  emoji: string | null;
  gradient: string | null;
  accent: string | null;
  prep_minutes: number | null;
  cook_minutes: number | null;
  rest_minutes: number | null;
  total_minutes: number | null;
  servings: number | null;
  difficulty: number | null;
  cost: number | null;
  season: string | null;
  status: "totry" | "tested" | "favorite" | "archived" | null;
  rating: number | null;
  family_note: string | null;
  personal_note: string | null;
  source_url: string | null;
  source_name: string | null;
  photo_url: string | null;
  times_cooked: number | null;
  category: {
    id: string;
    name: string;
    slug: string;
    emoji: string | null;
  } | null;
  recipe_ingredients: RecipeIngredientRow[] | null;
  recipe_steps: Step[] | null;
  recipe_tags: Array<{ tag: Tag | null }> | null;
};

const SELECT = `
  id, title, subtitle, slug, description, emoji, gradient, accent,
  prep_minutes, cook_minutes, rest_minutes, total_minutes, servings,
  difficulty, cost, season, status, rating, family_note, personal_note,
  source_url, source_name, photo_url, times_cooked,
  category:categories(id, name, slug, emoji),
  recipe_ingredients(
    id, quantity, unit, prep_note, ingredient_group, is_optional, sort_order,
    ingredient:ingredients(id, name, aisle, default_unit)
  ),
  recipe_steps(
    id, step_number, content, duration_minutes, temperature, step_group, sort_order
  ),
  recipe_tags(
    tag:tags(id, name, slug, color)
  )
`;

async function fetchRecipe(param: string): Promise<RecipeFull | null> {
  // Tentative par slug
  const bySlug = await supabase
    .from("recipes")
    .select(SELECT)
    .eq("slug", param)
    .maybeSingle();
  if (bySlug.data) return bySlug.data as unknown as RecipeFull;

  // Fallback : par id (uniquement si le paramètre ressemble à un UUID)
  if (UUID_RE.test(param)) {
    const byId = await supabase
      .from("recipes")
      .select(SELECT)
      .eq("id", param)
      .maybeSingle();
    if (byId.data) return byId.data as unknown as RecipeFull;
  }

  return null;
}

function statusBadge(status: RecipeFull["status"]): string | null {
  switch (status) {
    case "favorite":
      return "❤️ Chouchou famille";
    case "tested":
      return "🍓 Validée famille";
    case "totry":
      return "✨ À tenter";
    case "archived":
      return "📦 Archivée";
    default:
      return null;
  }
}

// ---------- Helpers de présentation ----------

function StepsList({ steps }: { steps: Step[] }) {
  if (steps.length === 0) {
    return (
      <p className="m-0 font-semibold text-cocoa">
        Aucune étape renseignée pour le moment. La recette se passe peut-être
        d&apos;explications… mais on en doute.
      </p>
    );
  }

  // Construire des groupes contigus pour afficher un en-tête à chaque changement
  const grouped: Array<{ name: string | null; items: Step[] }> = [];
  for (const s of steps) {
    const g = s.step_group ?? null;
    const last = grouped[grouped.length - 1];
    if (!last || last.name !== g) {
      grouped.push({ name: g, items: [s] });
    } else {
      last.items.push(s);
    }
  }
  const showHeaders = grouped.some((g) => g.name);

  let globalIndex = 0;
  return (
    <div className="grid gap-6">
      {grouped.map((group, gIdx) => (
        <div key={`${group.name ?? "default"}-${gIdx}`}>
          {showHeaders && group.name && (
            <h4 className="mb-3 font-display text-[18px] uppercase tracking-[0.08em] text-dark-rose">
              {group.name}
            </h4>
          )}
          <ol className="m-0 grid list-none gap-4 p-0">
            {group.items.map((s) => {
              const num = ++globalIndex;
              return (
                <li key={s.id} className="flex gap-4">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-xl text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--butter), var(--orange), var(--hot-pink))",
                      boxShadow: "0 8px 20px rgba(155, 18, 63, 0.25)",
                    }}
                  >
                    {num}
                  </div>
                  <div className="flex-1">
                    <p className="m-0 whitespace-pre-line font-semibold leading-relaxed text-chocolate">
                      {s.content}
                    </p>
                    {(s.duration_minutes || s.temperature) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {s.duration_minutes && (
                          <span className="chip-pop bg-cream-2 text-cocoa">
                            ⏱ {s.duration_minutes} min
                          </span>
                        )}
                        {s.temperature && (
                          <span className="chip-pop bg-cream-2 text-cocoa">
                            🌡 {s.temperature}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}

function NotesBlock({
  personal,
  family,
}: {
  personal: string | null;
  family: string | null;
}) {
  if (!personal && !family) {
    return (
      <p className="m-0 font-semibold text-cocoa">
        Aucune note pour cette recette pour le moment. À toi d&apos;écrire la
        suite ✏️
      </p>
    );
  }
  return (
    <div className="grid gap-4">
      {personal && (
        <div
          className="rounded-[24px] p-6"
          style={{
            background: "linear-gradient(135deg, #fff7d6, #ffedf2)",
            boxShadow: "var(--shadow-pop-soft)",
          }}
        >
          <h4 className="m-0 mb-2 font-display text-xl text-dark-rose">
            💡 Astuce
          </h4>
          <p className="m-0 whitespace-pre-line font-semibold leading-relaxed text-chocolate">
            {personal}
          </p>
        </div>
      )}
      {family && (
        <div
          className="rounded-[24px] p-6"
          style={{
            background: "linear-gradient(135deg, #ffe1ec, #ffd7c8)",
            boxShadow: "var(--shadow-pop-soft)",
          }}
        >
          <h4 className="m-0 mb-2 font-display text-xl text-dark-rose">
            💌 Avis famille
          </h4>
          <p className="m-0 whitespace-pre-line font-semibold leading-relaxed text-chocolate">
            {family}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------- Page ----------

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await fetchRecipe(slug);
  if (!recipe) notFound();

  // Préparer les données pour les composants
  const tags: Tag[] = (recipe.recipe_tags ?? [])
    .map((rt) => rt.tag)
    .filter((t): t is Tag => t !== null);

  const ingredients: AdjusterIngredient[] = (recipe.recipe_ingredients ?? [])
    .filter((ri) => ri.ingredient !== null)
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((ri) => ({
      id: ri.id,
      name: ri.ingredient!.name,
      quantity: ri.quantity,
      unit: ri.unit,
      prep_note: ri.prep_note,
      ingredient_group: ri.ingredient_group || "Base",
      is_optional: ri.is_optional ?? false,
    }));

  const steps: Step[] = (recipe.recipe_steps ?? [])
    .slice()
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
        a.step_number - b.step_number,
    );

  const badge = statusBadge(recipe.status);
  const fallbackGradient = recipe.gradient ?? pickGradient(recipe.title);
  const heroBg = recipe.photo_url
    ? `linear-gradient(180deg, transparent 30%, rgba(58, 12, 42, 0.4) 60%, rgba(58, 12, 42, 0.88) 100%), url(${recipe.photo_url})`
    : fallbackGradient;
  const baseServings = recipe.servings && recipe.servings > 0 ? recipe.servings : 4;

  // Méta chips
  const metaItems: { emoji: string; label: string }[] = [];
  const total =
    recipe.total_minutes ??
    (recipe.prep_minutes ?? 0) +
      (recipe.cook_minutes ?? 0) +
      (recipe.rest_minutes ?? 0);
  if (total > 0) metaItems.push({ emoji: "⏱", label: `${total} min au total` });
  if (recipe.prep_minutes)
    metaItems.push({ emoji: "🔪", label: `Prépa ${recipe.prep_minutes} min` });
  if (recipe.cook_minutes)
    metaItems.push({ emoji: "🔥", label: `Cuisson ${recipe.cook_minutes} min` });
  if (recipe.rest_minutes)
    metaItems.push({ emoji: "💤", label: `Repos ${recipe.rest_minutes} min` });
  if (recipe.difficulty)
    metaItems.push({
      emoji: "🎚",
      label: DIFFICULTY_LABELS[recipe.difficulty - 1] ?? "Facile",
    });
  if (recipe.cost) metaItems.push({ emoji: "💰", label: "€".repeat(recipe.cost) });
  metaItems.push({
    emoji: "👥",
    label: `${baseServings} ${baseServings > 1 ? "personnes" : "personne"}`,
  });
  if (recipe.rating != null)
    metaItems.push({ emoji: "⭐", label: `${recipe.rating}/5` });
  if (recipe.season) metaItems.push({ emoji: "🌿", label: recipe.season });
  if (recipe.times_cooked && recipe.times_cooked > 0)
    metaItems.push({
      emoji: "🍽️",
      label: `Cuisinée ${recipe.times_cooked}×`,
    });

  return (
    <div className="grid gap-6">
      {/* Fil d'Ariane */}
      <Link
        href="/recettes"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[13px] font-black text-dark-rose no-underline backdrop-blur transition hover:-translate-y-[2px]"
        style={{ boxShadow: "var(--shadow-pop-soft)" }}
      >
        ← Toutes les recettes
      </Link>

      {/* HERO */}
      <div
        className="relative overflow-hidden rounded-[42px]"
        style={{
          minHeight: 440,
          background: heroBg,
          backgroundSize: recipe.photo_url ? "cover" : undefined,
          backgroundPosition: "center",
          boxShadow: "var(--shadow-pop)",
        }}
      >
        {!recipe.photo_url && (
          <span
            aria-hidden
            className="placeholder-emoji pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 select-none text-[clamp(140px,18vw,220px)] opacity-80"
          >
            {recipe.emoji ?? "🍽️"}
          </span>
        )}

        {/* Étincelles */}
        <Sparkle className="left-[10%] top-[14%]" size={28} delay={-0.3} />
        <Sparkle
          className="right-[18%] top-[10%]"
          size={22}
          delay={-1.2}
          glyph="✧"
          color="#ff9fc0"
        />
        <Sparkle className="left-[58%] top-[24%]" size={16} delay={-2} />

        {/* Overlay sombre + texte (en bas) */}
        <div className="absolute inset-x-0 bottom-0 p-6 pt-32 text-white sm:p-10 sm:pt-40">
          <div className="flex flex-wrap items-center gap-3">
            {badge && (
              <span
                className="rounded-full px-[13px] py-[8px] text-[13px] font-black backdrop-blur"
                style={{ background: "rgba(255, 255, 255, 0.22)" }}
              >
                {badge}
              </span>
            )}
            {recipe.category && (
              <Link
                href={`/recettes?categorie=${recipe.category.slug}`}
                className="rounded-full px-[13px] py-[8px] text-[13px] font-black text-white no-underline backdrop-blur transition hover:-translate-y-[2px]"
                style={{ background: "rgba(255, 255, 255, 0.22)" }}
              >
                {recipe.category.emoji
                  ? `${recipe.category.emoji} `
                  : ""}
                {recipe.category.name}
              </Link>
            )}
          </div>

          <h1
            className="m-0 mt-3 font-display tracking-[-1.5px] text-white"
            style={{
              fontSize: "clamp(40px, 7vw, 76px)",
              lineHeight: 0.95,
              textShadow: "0 12px 34px rgba(0, 0, 0, 0.28)",
            }}
          >
            {recipe.title}
          </h1>

          {recipe.subtitle && (
            <p className="mt-3 max-w-[640px] text-[17px] font-semibold opacity-90">
              {recipe.subtitle}
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t.id}
                  className="chip-pop text-white"
                  style={{
                    background: t.color ?? "rgba(255, 255, 255, 0.22)",
                    boxShadow: "none",
                  }}
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Méta + Description + CTA */}
      <Card className="relative overflow-hidden">
        <div className="grid gap-6 min-[1180px]:grid-cols-[1fr_auto] min-[1180px]:items-start">
          <div>
            {recipe.description && (
              <p className="m-0 mb-4 max-w-[640px] whitespace-pre-line font-semibold leading-relaxed text-cocoa">
                {recipe.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {metaItems.map((m) => (
                <span
                  key={m.label}
                  className="chip-pop bg-vanilla text-cocoa"
                  style={{ boxShadow: "var(--shadow-pop-soft)" }}
                >
                  <span aria-hidden>{m.emoji} </span>
                  {m.label}
                </span>
              ))}
            </div>
            {(recipe.source_name || recipe.source_url) && (
              <p className="mt-4 text-[13px] font-semibold text-cocoa">
                Source :{" "}
                {recipe.source_url ? (
                  <a
                    href={recipe.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-dark-rose underline"
                  >
                    {recipe.source_name ?? recipe.source_url}
                  </a>
                ) : (
                  <span className="font-bold text-dark-rose">
                    {recipe.source_name}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 min-[1180px]:items-end">
            <AddToCauldronButton
              recipeId={recipe.id}
              recipeTitle={recipe.title}
              recipeEmoji={recipe.emoji}
              recipeGradient={recipe.gradient ?? fallbackGradient}
              defaultServings={baseServings}
            />
            <span className="text-[12px] font-semibold text-cocoa">
              Tu pourras ajuster les portions juste après.
            </span>
          </div>
        </div>
      </Card>

      {/* Onglets */}
      <Card>
        <RecipeTabs
          tabs={[
            {
              id: "ingredients",
              label: "Ingrédients",
              emoji: "🧂",
              content: (
                <PortionAdjuster
                  baseServings={baseServings}
                  ingredients={ingredients}
                />
              ),
            },
            {
              id: "steps",
              label: "Étapes",
              emoji: "📜",
              content: <StepsList steps={steps} />,
            },
            {
              id: "notes",
              label: "Notes & Astuces",
              emoji: "💌",
              content: (
                <NotesBlock
                  personal={recipe.personal_note}
                  family={recipe.family_note}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
