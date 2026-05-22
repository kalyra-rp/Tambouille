"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCauldron } from "@/lib/useCauldron";
import { Card } from "@/components/Card";
import { Sparkle } from "@/components/Sparkle";
import { CauldronItemCard } from "@/components/CauldronItemCard";

export default function ChaudronPage() {
  const { items, updateServings, removeItem, clearCauldron } = useCauldron();
  const [magicPending, setMagicPending] = useState(false);

  const count = items.length;
  const totalServings = items.reduce((sum, i) => sum + i.servings, 0);

  // Titre dynamique de l'onglet (le ré-render Next remet le défaut au changement de route)
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title =
      count > 0
        ? `🍲 Mon Chaudron (${count}) — Tambouille`
        : "🍲 Mon Chaudron — Tambouille";
  }, [count]);

  // --- État vide ---
  if (count === 0) {
    return (
      <Card as="section" className="relative overflow-hidden text-center">
        <Sparkle className="left-[18%] top-[16%]" size={26} delay={-0.4} />
        <Sparkle
          className="right-[18%] top-[22%]"
          size={20}
          delay={-1.2}
          glyph="✧"
          color="#ff9fc0"
        />
        <Sparkle className="left-[52%] bottom-[18%]" size={16} delay={-2} />

        <div
          className="placeholder-emoji mx-auto mb-4 grid h-[120px] w-[120px] place-items-center rounded-[36px] text-[60px]"
          style={{
            background:
              "linear-gradient(135deg, var(--butter), var(--orange), var(--hot-pink), var(--wine-rose))",
            boxShadow: "0 18px 36px rgba(233, 38, 85, 0.26)",
          }}
        >
          🍲
        </div>
        <h1 className="m-0 font-display text-[clamp(36px,5vw,52px)] tracking-[-1px] text-chocolate">
          Ton chaudron frémit dans le vide…
        </h1>
        <p className="mx-auto mt-3 max-w-[480px] font-semibold text-cocoa">
          Ajoute des recettes pour lancer la magie ! Choisis tes plats préférés,
          ajuste les portions, et laisse la cuisine pétiller.
        </p>
        <Link
          href="/recettes"
          className="btn-pop btn-pop--primary mt-6 inline-block no-underline"
        >
          📚 Explorer les recettes
        </Link>
      </Card>
    );
  }

  // --- État rempli ---
  return (
    <div className="grid gap-6">
      {/* En-tête + résumé + actions */}
      <Card as="section" className="relative overflow-hidden">
        <Sparkle className="right-[8%] top-[14%]" size={26} delay={-0.3} />
        <Sparkle
          className="right-[22%] top-[28%]"
          size={18}
          delay={-1.2}
          glyph="✧"
          color="#ff9fc0"
        />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-[13px] py-[8px] text-[13px] font-black text-dark-rose">
              🍲 Mon chaudron
            </span>
            <h1 className="m-0 font-display text-[clamp(36px,5vw,52px)] tracking-[-1px] text-chocolate">
              Chaos vaincu
            </h1>
            <p className="mt-2 max-w-[560px] font-semibold text-cocoa">
              {count} recette{count > 1 ? "s" : ""} prête{count > 1 ? "s" : ""}{" "}
              à mijoter — {totalServings} portion
              {totalServings > 1 ? "s" : ""} au total. Quand tu es prête,
              transforme tout ça en une liste de courses magique.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Vider tout le chaudron ? Tu pourras toujours réajouter tes recettes.",
                  )
                ) {
                  clearCauldron();
                }
              }}
              className="btn-pop btn-pop--secondary"
            >
              Vider le chaudron
            </button>
            <button
              type="button"
              onClick={() => {
                setMagicPending(true);
                window.setTimeout(() => setMagicPending(false), 1800);
              }}
              className="btn-pop btn-pop--primary"
            >
              {magicPending
                ? "✨ Liste magique bientôt là !"
                : "Transformer en liste de courses ✨"}
            </button>
          </div>
        </div>
      </Card>

      {/* Grille des recettes du chaudron */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1180px]:grid-cols-3">
        {items.map((item) => (
          <CauldronItemCard
            key={item.recipeId}
            item={item}
            onServingsChange={(s) => updateServings(item.recipeId, s)}
            onRemove={() => removeItem(item.recipeId)}
          />
        ))}
      </div>

      {/* Rappel pied de page */}
      <Card className="relative overflow-hidden">
        <Sparkle className="left-[12%] top-[30%]" size={20} delay={-0.7} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="m-0 font-display text-xl text-chocolate">
              Prête pour la magie ?
            </h3>
            <p className="m-0 mt-1 text-[14px] font-semibold text-cocoa">
              On fusionne les ingrédients, on regroupe par rayon, le chaos part
              faire un tour.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMagicPending(true);
              window.setTimeout(() => setMagicPending(false), 1800);
            }}
            className="btn-pop btn-pop--primary"
          >
            {magicPending
              ? "✨ Liste magique bientôt là !"
              : "Générer la liste ✨"}
          </button>
        </div>
      </Card>
    </div>
  );
}
