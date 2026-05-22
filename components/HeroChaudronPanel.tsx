"use client";

import Link from "next/link";
import { useCauldron } from "@/lib/useCauldron";

/**
 * Panneau "Chaudron du jour" — affiché en encart vitrine dans le hero d'accueil.
 * Stats live (recettes, portions, ingrédients estimés) + CTA contextuel.
 */
export function HeroChaudronPanel() {
  const { items } = useCauldron();
  const recipesCount = items.length;
  const totalServings = items.reduce((sum, i) => sum + i.servings, 0);
  // Heuristique pour l'aperçu (≈ 8 ingrédients par recette en moyenne).
  // On reste vague exprès — la vraie valeur s'affiche sur /courses.
  const estimatedIngredients = recipesCount > 0 ? recipesCount * 8 : 0;

  const isEmpty = recipesCount === 0;

  return (
    <div
      className="relative z-[2] rounded-[32px] p-[22px] text-chocolate"
      style={{
        background: "rgba(255, 255, 255, 0.86)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 20px 45px rgba(0, 0, 0, 0.12)",
        animation: "cardFloat 5.6s ease-in-out infinite",
      }}
    >
      <h3 className="m-0 mb-2 font-display text-[28px] leading-none text-chocolate">
        Chaudron du jour
      </h3>
      <p className="m-0 mb-4 text-[14px] font-semibold text-cocoa">
        {isEmpty
          ? "Choisis tes recettes préférées, ajuste les portions, et laisse la magie fusionner les ingrédients."
          : "Ajuste les portions, et laisse la magie fusionner les ingrédients."}
      </p>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <Stat label="recettes" value={recipesCount} />
        <Stat label="portions" value={totalServings} />
        <Stat
          label="ingrédients"
          value={estimatedIngredients}
          prefix={estimatedIngredients > 0 ? "~" : ""}
        />
      </div>

      {isEmpty ? (
        <Link
          href="/recettes"
          className="btn-pop btn-pop--primary block w-full text-center no-underline"
          style={{ boxShadow: "none" }}
        >
          📚 Explorer les recettes
        </Link>
      ) : (
        <Link
          href="/courses"
          className="btn-pop btn-pop--primary block w-full text-center no-underline"
          style={{ boxShadow: "none" }}
        >
          Transformer en liste ✨
        </Link>
      )}
    </div>
  );
}

function Stat({
  value,
  label,
  prefix = "",
}: {
  value: number;
  label: string;
  prefix?: string;
}) {
  return (
    <div
      className="rounded-[20px] p-3 text-center text-[12px] font-black text-cocoa"
      style={{ background: "var(--vanilla)" }}
    >
      <span
        aria-live="polite"
        className="block font-display text-[26px] leading-none text-dark-rose"
      >
        {prefix}
        {value}
      </span>
      <span className="mt-1 block">{label}</span>
    </div>
  );
}
