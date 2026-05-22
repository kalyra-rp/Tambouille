"use client";

import { useState, type CSSProperties } from "react";
import { useCauldron } from "@/lib/useCauldron";

type Props = {
  recipeId: string;
  recipeTitle: string;
  recipeEmoji: string | null;
  recipeGradient: string | null;
  defaultServings?: number;
  className?: string;
};

type ConfettiPiece = {
  emoji: string;
  tx: number;
  ty: number;
  rot: number;
  delay: number;
  scale: number;
};

/**
 * Burst de confettis pré-calculé (déterministe → pas de Math.random au render).
 * 16 emojis projetés en cercle autour du bouton, légèrement biaisés vers le haut.
 */
const CONFETTI_PIECES: ConfettiPiece[] = (() => {
  const emojis = ["🎉", "🍒", "✨", "🍓", "🍲", "🎊"];
  const count = 16;
  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (i % 2 ? 0.3 : 0);
    const distance = 60 + ((i * 13) % 50);
    pieces.push({
      emoji: emojis[i % emojis.length],
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance - 30,
      rot: ((i * 47) % 360) - 180,
      delay: (i * 25) % 200,
      scale: 0.8 + ((i * 7) % 5) / 10,
    });
  }
  return pieces;
})();

const DEFAULT_GRADIENT = "linear-gradient(135deg, var(--butter), var(--orange))";

export function AddToCauldronButton({
  recipeId,
  recipeTitle,
  recipeEmoji,
  recipeGradient,
  defaultServings = 4,
  className = "",
}: Props) {
  const { isInCauldron, addItem, removeItem } = useCauldron();
  const inCauldron = isInCauldron(recipeId);
  const [burst, setBurst] = useState(0);

  const handleClick = () => {
    if (inCauldron) {
      removeItem(recipeId);
      return;
    }
    addItem({
      recipeId,
      recipeTitle,
      recipeEmoji: recipeEmoji ?? "🍽️",
      recipeGradient: recipeGradient ?? DEFAULT_GRADIENT,
      servings: defaultServings,
    });
    setBurst((b) => b + 1);
  };

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={inCauldron}
        className={`btn-pop ${
          inCauldron ? "btn-pop--secondary" : "btn-pop--primary"
        } ${className}`.trim()}
      >
        {inCauldron ? "✅ Dans le chaudron" : "Ajouter au chaudron 🍲"}
      </button>

      {burst > 0 && (
        <span
          key={burst}
          aria-hidden
          className="confetti-burst"
        >
          {CONFETTI_PIECES.map((p, i) => {
            const style: CSSProperties = {
              ["--tx" as string]: `${p.tx}px`,
              ["--ty" as string]: `${p.ty}px`,
              ["--rot" as string]: `${p.rot}deg`,
              ["--delay" as string]: `${p.delay}ms`,
              ["--scale" as string]: String(p.scale),
            };
            return (
              <span key={i} className="confetti-piece" style={style}>
                {p.emoji}
              </span>
            );
          })}
        </span>
      )}
    </span>
  );
}
