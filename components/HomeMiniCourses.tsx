"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCauldron } from "@/lib/useCauldron";
import { supabase } from "@/lib/supabase";
import { formatQuantity } from "@/lib/units";
import {
  AISLE_EMOJIS,
  AISLE_LABELS,
  RECIPE_SELECT_FOR_SHOPPING,
  buildShoppingList,
  type RecipeWithIngredients,
} from "@/lib/shopping";
import { Card } from "./Card";

/**
 * Carte latérale de l'accueil : aperçu de la liste de courses
 * (premiers ingrédients fusionnés, groupés par rayon).
 */
export function HomeMiniCourses() {
  const { items } = useCauldron();
  const [recipes, setRecipes] = useState<RecipeWithIngredients[] | null>(null);

  const recipeIdsKey = useMemo(
    () =>
      items
        .map((i) => i.recipeId)
        .sort()
        .join(","),
    [items],
  );

  useEffect(() => {
    if (!recipeIdsKey) {
      return;
    }
    const ids = recipeIdsKey.split(",").filter(Boolean);
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(RECIPE_SELECT_FOR_SHOPPING)
        .in("id", ids);
      if (cancelled || error) return;
      setRecipes((data ?? []) as unknown as RecipeWithIngredients[]);
    })();

    return () => {
      cancelled = true;
    };
  }, [recipeIdsKey]);

  const { merged, groups } = useMemo(() => {
    if (!recipes) return { merged: [], groups: [] };
    return buildShoppingList(items, recipes);
  }, [items, recipes]);

  // --- Aucun item dans le chaudron ---
  if (items.length === 0) {
    return (
      <Card>
        <h3 className="m-0 mb-2 font-display text-[28px] leading-none text-chocolate">
          🛒 Courses magiques
        </h3>
        <p className="m-0 font-semibold text-cocoa">
          Ta liste apparaîtra dès que des recettes seront dans le chaudron.
          Fusion automatique + classement par rayon, le chaos part faire un
          tour.
        </p>
      </Card>
    );
  }

  // --- Items dans le chaudron, en train de charger ---
  if (!recipes) {
    return (
      <Card>
        <h3 className="m-0 mb-2 font-display text-[28px] leading-none text-chocolate">
          🛒 Courses magiques
        </h3>
        <p className="m-0 mb-4 font-semibold text-cocoa">
          Fusion en cours…
        </p>
        <div className="grid gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[44px] animate-pulse rounded-[18px] bg-cream-2/70"
            />
          ))}
        </div>
      </Card>
    );
  }

  // --- Données prêtes : aperçu (3 items max, sur 1-2 rayons) ---
  const previewByAisle = groups.slice(0, 2).map((g) => ({
    aisle: g.aisle,
    items: g.items.slice(0, 2),
  }));
  const previewCount = previewByAisle.reduce((s, g) => s + g.items.length, 0);
  const remaining = Math.max(0, merged.length - previewCount);

  return (
    <Card>
      <h3 className="m-0 mb-2 font-display text-[28px] leading-none text-chocolate">
        🛒 Courses magiques
      </h3>
      <p className="m-0 mb-4 font-semibold text-cocoa">
        Fusion automatique + classement par rayon. Le chaos part faire un tour.
      </p>

      {previewByAisle.length === 0 ? (
        <p className="m-0 mb-4 font-semibold text-cocoa">
          Aucun ingrédient renseigné pour l&apos;instant.
        </p>
      ) : (
        <div className="mb-3">
          {previewByAisle.map((group) => (
            <div key={group.aisle} className="mb-3">
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.08em] text-dark-rose">
                {AISLE_EMOJIS[group.aisle]} {AISLE_LABELS[group.aisle]}
              </div>
              <ul className="m-0 grid list-none gap-2 p-0">
                {group.items.map((item) => {
                  const qty = formatQuantity(item.totalQuantity, item.unit);
                  return (
                    <li
                      key={item.key}
                      className="flex items-center gap-3 rounded-[14px] px-3 py-2 text-[13px] font-bold"
                      style={{ background: "var(--vanilla)" }}
                    >
                      <span
                        aria-hidden
                        className="grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border-2 bg-white"
                        style={{ borderColor: "#ffd0dc" }}
                      />
                      <span className="flex-1 text-chocolate">
                        {qty && (
                          <span className="font-display text-dark-rose">
                            {qty}
                            {item.unit ? ` ${item.unit}` : ""}{" "}
                          </span>
                        )}
                        {item.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <p className="m-0 mb-3 text-[13px] font-semibold text-cocoa">
          + {remaining} autre{remaining > 1 ? "s" : ""} ingrédient
          {remaining > 1 ? "s" : ""} à fusionner…
        </p>
      )}

      <Link
        href="/courses"
        className="text-[13px] font-black text-dark-rose underline"
      >
        Voir la liste complète →
      </Link>
    </Card>
  );
}
