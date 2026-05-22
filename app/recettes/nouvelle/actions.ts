"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase";
import { slugify } from "@/lib/slug";

/**
 * Création d'une recette — Server Action.
 *
 * Pourquoi côté serveur avec le service_role plutôt que l'anon client ?
 * Les politiques RLS du schéma exigent `auth.uid() = owner_id` pour les
 * inserts dans `recipes` (et écritures sur `recipe_ingredients` / `_steps`).
 * Tant qu'on n'a pas d'auth, l'anon client est bloqué. Le service_role
 * bypasse RLS — c'est OK pour ce flow tant qu'on valide les entrées ici.
 */

export type NewRecipeIngredient = {
  name: string;
  quantity: number | null;
  unit: string | null;
  ingredient_group: string;
  is_optional: boolean;
  sort_order: number;
};

export type NewRecipeStep = {
  step_number: number;
  content: string;
  duration_minutes: number | null;
  step_group: string | null;
  sort_order: number;
};

export type NewRecipePayload = {
  title: string;
  subtitle: string | null;
  description: string | null;
  emoji: string | null;
  category_id: string | null;
  prep_minutes: number;
  cook_minutes: number;
  rest_minutes: number;
  servings: number;
  difficulty: number;
  cost: number;
  status: "totry" | "tested" | "favorite";
  personal_note: string | null;
  family_note: string | null;
  source_url: string | null;
  source_name: string | null;
  ingredients: NewRecipeIngredient[];
  steps: NewRecipeStep[];
};

export type CreateRecipeResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export async function createRecipe(
  payload: NewRecipePayload,
): Promise<CreateRecipeResult> {
  // --- Validation côté serveur ---
  if (!payload.title?.trim()) {
    return { ok: false, error: "Le titre est requis." };
  }
  if (!Number.isInteger(payload.servings) || payload.servings < 1) {
    return { ok: false, error: "Il faut au moins 1 portion." };
  }
  if (![1, 2, 3, 4, 5].includes(payload.difficulty)) {
    return { ok: false, error: "Difficulté invalide." };
  }
  if (![1, 2, 3].includes(payload.cost)) {
    return { ok: false, error: "Coût invalide." };
  }
  if (!["totry", "tested", "favorite"].includes(payload.status)) {
    return { ok: false, error: "Statut invalide." };
  }

  try {
    const supabase = createAdminClient();

    // 1. Trouver un slug unique (slugify + suffixe -2, -3… si besoin)
    const baseSlug = slugify(payload.title);
    if (!baseSlug) {
      return {
        ok: false,
        error:
          "Le titre ne contient aucun caractère utilisable pour l'URL.",
      };
    }
    const finalSlug = await findUniqueSlug(supabase, baseSlug);

    // 2. Résoudre les ingrédients (chercher ou créer)
    const ingredientLines = payload.ingredients.filter((i) =>
      i.name?.trim(),
    );
    const uniqueNames = Array.from(
      new Set(ingredientLines.map((i) => i.name.trim().toLowerCase())),
    );
    const nameToId = new Map<string, string>();

    for (const lowerName of uniqueNames) {
      const { data: existing } = await supabase
        .from("ingredients")
        .select("id")
        .ilike("name", lowerName)
        .limit(1)
        .maybeSingle();

      if (existing) {
        nameToId.set(lowerName, existing.id);
        continue;
      }

      // Casse originale du premier match (pour respecter la saisie utilisateur)
      const originalCasing = ingredientLines
        .find((i) => i.name.trim().toLowerCase() === lowerName)!
        .name.trim();

      const { data: created, error: createError } = await supabase
        .from("ingredients")
        .insert({ name: originalCasing })
        .select("id")
        .single();

      if (createError) {
        // Race condition possible : un autre flow l'a créé entre-temps. Retry select.
        const { data: retry } = await supabase
          .from("ingredients")
          .select("id")
          .ilike("name", lowerName)
          .limit(1)
          .maybeSingle();
        if (retry) {
          nameToId.set(lowerName, retry.id);
        } else {
          return {
            ok: false,
            error: `Impossible de créer l'ingrédient "${originalCasing}" : ${createError.message}`,
          };
        }
      } else {
        nameToId.set(lowerName, created.id);
      }
    }

    // 3. Insert recipe
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .insert({
        title: payload.title.trim(),
        subtitle: payload.subtitle?.trim() || null,
        slug: finalSlug,
        description: payload.description?.trim() || null,
        emoji: payload.emoji?.trim() || null,
        category_id: payload.category_id,
        prep_minutes: payload.prep_minutes,
        cook_minutes: payload.cook_minutes,
        rest_minutes: payload.rest_minutes,
        servings: payload.servings,
        difficulty: payload.difficulty,
        cost: payload.cost,
        status: payload.status,
        personal_note: payload.personal_note?.trim() || null,
        family_note: payload.family_note?.trim() || null,
        source_url: payload.source_url?.trim() || null,
        source_name: payload.source_name?.trim() || null,
        is_shared: true,
      })
      .select("id, slug")
      .single();

    if (recipeError || !recipe) {
      return {
        ok: false,
        error: `Erreur lors de la création de la recette : ${
          recipeError?.message ?? "inconnue"
        }`,
      };
    }

    // 4. Insert recipe_ingredients
    if (ingredientLines.length > 0) {
      const rows = ingredientLines.map((i, idx) => ({
        recipe_id: recipe.id,
        ingredient_id: nameToId.get(i.name.trim().toLowerCase())!,
        quantity: i.quantity,
        unit: i.unit?.trim() || null,
        ingredient_group: i.ingredient_group?.trim() || "Base",
        is_optional: i.is_optional,
        sort_order: idx,
      }));
      const { error } = await supabase
        .from("recipe_ingredients")
        .insert(rows);
      if (error) {
        // Rollback de la recette pour ne pas laisser de coquille vide
        await supabase.from("recipes").delete().eq("id", recipe.id);
        return {
          ok: false,
          error: `Erreur lors de l'ajout des ingrédients : ${error.message}`,
        };
      }
    }

    // 5. Insert recipe_steps
    const stepLines = payload.steps.filter((s) => s.content?.trim());
    if (stepLines.length > 0) {
      const rows = stepLines.map((s, idx) => ({
        recipe_id: recipe.id,
        step_number: idx + 1,
        content: s.content.trim(),
        duration_minutes: s.duration_minutes,
        step_group: s.step_group?.trim() || null,
        sort_order: idx,
      }));
      const { error } = await supabase.from("recipe_steps").insert(rows);
      if (error) {
        await supabase.from("recipes").delete().eq("id", recipe.id);
        return {
          ok: false,
          error: `Erreur lors de l'ajout des étapes : ${error.message}`,
        };
      }
    }

    return { ok: true, slug: finalSlug };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return { ok: false, error: msg };
  }
}

async function findUniqueSlug(
  supabase: SupabaseClient,
  baseSlug: string,
): Promise<string> {
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? baseSlug : `${baseSlug}-${i + 1}`;
    const { data } = await supabase
      .from("recipes")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  // Fallback ultime : suffixe basé sur Date.now() (~impossible de collisionner)
  return `${baseSlug}-${Date.now().toString(36)}`;
}
