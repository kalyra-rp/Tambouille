"use client";

import Link from "next/link";
import type { CauldronItem } from "@/lib/useCauldron";

type Props = {
  item: CauldronItem;
  onServingsChange: (servings: number) => void;
  onRemove: () => void;
};

export function CauldronItemCard({ item, onServingsChange, onRemove }: Props) {
  return (
    <article
      className="recipe-card relative flex flex-col overflow-hidden rounded-[30px] bg-white p-[10px] transition"
      style={{ boxShadow: "0 16px 34px rgba(115, 42, 24, 0.12)" }}
    >
      {/* Visuel cliquable → fiche recette */}
      <Link
        href={`/recettes/${item.recipeId}`}
        aria-label={`Voir ${item.recipeTitle}`}
        className="relative grid h-[140px] place-items-center overflow-hidden rounded-[24px] no-underline"
        style={{ background: item.recipeGradient }}
      >
        <span aria-hidden className="text-[72px] drop-shadow-md">
          {item.recipeEmoji}
        </span>

        {/* Bouton supprimer (haut-droite) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Retirer ${item.recipeTitle} du chaudron`}
          className="absolute right-3 top-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-white/90 text-xl font-bold text-dark-rose backdrop-blur transition hover:scale-110 hover:bg-white"
          style={{ boxShadow: "0 8px 20px rgba(115, 42, 24, 0.18)" }}
        >
          ×
        </button>
      </Link>

      <div className="px-[10px] pb-[10px] pt-[14px]">
        <h3 className="mb-3 font-display text-[20px] leading-[1.05] text-chocolate">
          {item.recipeTitle}
        </h3>

        <div
          className="flex items-center justify-between gap-3 rounded-[18px] px-3 py-2"
          style={{ background: "var(--vanilla)" }}
        >
          <span className="text-[13px] font-black text-cocoa">Portions</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onServingsChange(item.servings - 1)}
              aria-label="Diminuer les portions"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-white text-lg font-bold text-dark-rose transition hover:scale-110 active:scale-95"
              style={{ boxShadow: "0 4px 10px rgba(155, 18, 63, 0.12)" }}
            >
              −
            </button>
            <span
              aria-live="polite"
              className="min-w-[32px] text-center font-display text-xl text-chocolate"
            >
              {item.servings}
            </span>
            <button
              type="button"
              onClick={() => onServingsChange(item.servings + 1)}
              aria-label="Augmenter les portions"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-white text-lg font-bold text-dark-rose transition hover:scale-110 active:scale-95"
              style={{ boxShadow: "0 4px 10px rgba(155, 18, 63, 0.12)" }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
