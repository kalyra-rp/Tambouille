"use client";

import Link from "next/link";
import { useCauldron } from "@/lib/useCauldron";
import { Card } from "./Card";

/**
 * Carte latérale de l'accueil : aperçu du chaudron (3 derniers ajouts).
 */
export function HomeMiniChaudron() {
  const { items } = useCauldron();

  if (items.length === 0) {
    return (
      <Card>
        <h3 className="m-0 mb-2 font-display text-[28px] leading-none text-chocolate">
          🍲 Le Chaudron
        </h3>
        <p className="m-0 mb-4 font-semibold text-cocoa">
          Vide pour l&apos;instant. Choisis tes premières recettes pour faire
          frémir la marmite.
        </p>
        <Link
          href="/recettes"
          className="btn-pop btn-pop--secondary inline-block no-underline"
        >
          📚 Explorer les recettes
        </Link>
      </Card>
    );
  }

  // Les 3 plus récemment ajoutés (en fin de tableau)
  const recent = items.slice(-3).reverse();
  const remaining = items.length - recent.length;

  return (
    <Card>
      <h3 className="m-0 mb-2 font-display text-[28px] leading-none text-chocolate">
        🍲 Le Chaudron
      </h3>
      <p className="m-0 mb-4 font-semibold text-cocoa">
        Les recettes sélectionnées pour générer ta liste magique.
      </p>

      <ul className="m-0 mb-3 grid list-none gap-2 p-0">
        {recent.map((item) => (
          <li
            key={item.recipeId}
            className="flex items-center justify-between gap-3 rounded-[18px] px-3 py-3 font-bold transition hover:translate-x-1"
            style={{ background: "var(--vanilla)" }}
          >
            <span className="flex items-center gap-2 text-chocolate">
              <span aria-hidden className="text-xl">
                {item.recipeEmoji}
              </span>
              <span className="line-clamp-1">{item.recipeTitle}</span>
            </span>
            <span
              className="shrink-0 rounded-full px-2 py-1 text-[11px] font-black text-dark-rose"
              style={{ background: "#ffe2eb" }}
            >
              {item.servings} pers.
            </span>
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <p className="m-0 mb-3 text-[13px] font-semibold text-cocoa">
          + {remaining} autre{remaining > 1 ? "s" : ""} dans le chaudron…
        </p>
      )}

      <Link
        href="/chaudron"
        className="text-[13px] font-black text-dark-rose underline"
      >
        Voir tout le chaudron →
      </Link>
    </Card>
  );
}
