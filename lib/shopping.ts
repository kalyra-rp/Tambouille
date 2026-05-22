/**
 * Logique de génération de liste de courses — partagée entre /courses
 * (la liste complète) et l'aperçu de l'accueil (premiers ingrédients).
 *
 * Entrées : items du chaudron (recipeId + portions voulues)
 *         + recettes hydratées depuis Supabase avec leurs ingrédients.
 * Sortie : items fusionnés par (nom, unité), groupés par rayon dans l'ordre canonique.
 */

import type { CauldronItem } from "./useCauldron";

// =============================================================
// Rayons
// =============================================================

export const AISLE_ORDER = [
  "F&L",
  "Frais",
  "Boucherie",
  "Épicerie",
  "Caves",
  "Surgelés",
  "Boulangerie",
  "Hygiène/Maison",
  "Autre",
] as const;

export type Aisle = (typeof AISLE_ORDER)[number];

export const AISLE_EMOJIS: Record<Aisle, string> = {
  "F&L": "🥬",
  Frais: "🧀",
  Boucherie: "🥩",
  Épicerie: "🥫",
  Caves: "🍷",
  Surgelés: "🧊",
  Boulangerie: "🥖",
  "Hygiène/Maison": "🧼",
  Autre: "📦",
};

export const AISLE_LABELS: Record<Aisle, string> = {
  "F&L": "Fruits & Légumes",
  Frais: "Frais",
  Boucherie: "Boucherie",
  Épicerie: "Épicerie",
  Caves: "Caves & Spiritueux",
  Surgelés: "Surgelés",
  Boulangerie: "Boulangerie",
  "Hygiène/Maison": "Hygiène & Maison",
  Autre: "Autre",
};

export function normalizeAisle(raw: string | null | undefined): Aisle {
  if (!raw) return "Autre";
  const trimmed = raw.trim();
  if ((AISLE_ORDER as readonly string[]).includes(trimmed)) {
    return trimmed as Aisle;
  }
  const lower = trimmed.toLowerCase();
  const found = (AISLE_ORDER as readonly string[]).find(
    (a) => a.toLowerCase() === lower,
  );
  return (found as Aisle | undefined) ?? "Autre";
}

// =============================================================
// Types (miroir Supabase)
// =============================================================

export type IngredientJoin = {
  name: string;
  aisle: string | null;
  default_unit: string | null;
};

export type RecipeIngredientRow = {
  quantity: number | null;
  unit: string | null;
  sort_order?: number | null;
  ingredient: IngredientJoin | null;
};

export type RecipeWithIngredients = {
  id: string;
  title: string;
  servings: number | null;
  recipe_ingredients: RecipeIngredientRow[] | null;
};

export type MergedItem = {
  key: string;
  name: string;
  unit: string;
  totalQuantity: number | null;
  aisle: Aisle;
  sourceCount: number;
  sourceTitles: string[];
};

export type AisleGroup = {
  aisle: Aisle;
  items: MergedItem[];
};

/** Le `select(...)` Supabase à utiliser pour alimenter `buildShoppingList`. */
export const RECIPE_SELECT_FOR_SHOPPING = `
  id, title, servings,
  recipe_ingredients(
    quantity, unit, sort_order,
    ingredient:ingredients(name, aisle, default_unit)
  )
`;

// =============================================================
// Construction de la liste fusionnée + groupée
// =============================================================

export function buildShoppingList(
  cauldronItems: CauldronItem[],
  recipes: RecipeWithIngredients[],
): { merged: MergedItem[]; groups: AisleGroup[] } {
  const map = new Map<string, MergedItem>();
  const itemByRecipeId = new Map(cauldronItems.map((i) => [i.recipeId, i]));

  for (const recipe of recipes) {
    const cauldronItem = itemByRecipeId.get(recipe.id);
    if (!cauldronItem) continue;
    const baseServings =
      recipe.servings && recipe.servings > 0 ? recipe.servings : 4;
    const ratio = cauldronItem.servings / baseServings;

    for (const ri of recipe.recipe_ingredients ?? []) {
      const ing = ri.ingredient;
      if (!ing) continue;
      const name = ing.name.trim();
      const unit = (ri.unit ?? ing.default_unit ?? "").trim();
      const key = `${name.toLowerCase()}|${unit.toLowerCase()}`;
      const adjustedQty = ri.quantity != null ? ri.quantity * ratio : null;
      const aisle = normalizeAisle(ing.aisle);

      const existing = map.get(key);
      if (existing) {
        if (adjustedQty != null) {
          existing.totalQuantity =
            (existing.totalQuantity ?? 0) + adjustedQty;
        }
        if (!existing.sourceTitles.includes(recipe.title)) {
          existing.sourceTitles.push(recipe.title);
          existing.sourceCount += 1;
        }
      } else {
        map.set(key, {
          key,
          name,
          unit,
          totalQuantity: adjustedQty,
          aisle,
          sourceCount: 1,
          sourceTitles: [recipe.title],
        });
      }
    }
  }

  const merged = [...map.values()];

  // Groupement par rayon dans l'ordre canonique
  const byAisle = new Map<Aisle, MergedItem[]>();
  for (const item of merged) {
    const arr = byAisle.get(item.aisle);
    if (arr) arr.push(item);
    else byAisle.set(item.aisle, [item]);
  }
  for (const arr of byAisle.values()) {
    arr.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }
  const groups: AisleGroup[] = AISLE_ORDER.filter((a) => byAisle.has(a)).map(
    (a) => ({ aisle: a, items: byAisle.get(a) as MergedItem[] }),
  );

  return { merged, groups };
}
