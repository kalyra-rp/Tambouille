"use client";

import { useState } from "react";

type Props = {
  className?: string;
  /** Pour personnaliser le label si besoin (variantes futures). */
  label?: string;
};

/**
 * Bouton "Ajouter au chaudron" — visuel uniquement pour l'instant.
 * Donne un feedback éphémère au click ; la vraie action sera câblée
 * quand le chaudron interactif sera en place.
 */
export function AddToCauldronButton({
  className = "",
  label = "Ajouter au chaudron 🍲",
}: Props) {
  const [clicked, setClicked] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        setClicked(true);
        window.setTimeout(() => setClicked(false), 1800);
      }}
      aria-live="polite"
      className={`btn-pop btn-pop--primary ${className}`.trim()}
    >
      {clicked ? "✨ Bientôt dans le chaudron !" : label}
    </button>
  );
}
