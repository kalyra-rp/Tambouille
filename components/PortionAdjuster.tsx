"use client";

import { useMemo, useState } from "react";
import { formatQuantity } from "@/lib/units";

export type AdjusterIngredient = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  prep_note: string | null;
  ingredient_group: string;
  is_optional: boolean;
};

type Props = {
  baseServings: number;
  ingredients: AdjusterIngredient[];
};

export function PortionAdjuster({ baseServings, ingredients }: Props) {
  const safeBase = baseServings > 0 ? baseServings : 1;
  const [servings, setServings] = useState(safeBase);
  const ratio = servings / safeBase;

  // Groupement par ingredient_group, en conservant l'ordre d'apparition.
  const groups = useMemo(() => {
    const out: Array<{ name: string; items: AdjusterIngredient[] }> = [];
    const indexByName = new Map<string, number>();
    for (const ing of ingredients) {
      const groupName = ing.ingredient_group || "Base";
      let idx = indexByName.get(groupName);
      if (idx === undefined) {
        idx = out.length;
        indexByName.set(groupName, idx);
        out.push({ name: groupName, items: [] });
      }
      out[idx].items.push(ing);
    }
    return out;
  }, [ingredients]);

  const showGroupHeaders =
    groups.length > 1 || (groups[0] && groups[0].name !== "Base");

  return (
    <div>
      {/* Bandeau d'ajustement */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <span className="font-bold text-cocoa">Pour</span>
        <div
          className="flex items-center gap-3 rounded-full p-2"
          style={{ background: "var(--vanilla)", boxShadow: "var(--shadow-pop-soft)" }}
        >
          <button
            type="button"
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            aria-label="Diminuer les portions"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-2xl font-bold text-dark-rose transition hover:scale-110 active:scale-95"
            style={{ boxShadow: "0 6px 14px rgba(155, 18, 63, 0.12)" }}
          >
            −
          </button>
          <span
            aria-live="polite"
            className="min-w-[60px] text-center font-display text-3xl text-chocolate"
          >
            {servings}
          </span>
          <button
            type="button"
            onClick={() => setServings((s) => Math.min(99, s + 1))}
            aria-label="Augmenter les portions"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-2xl font-bold text-dark-rose transition hover:scale-110 active:scale-95"
            style={{ boxShadow: "0 6px 14px rgba(155, 18, 63, 0.12)" }}
          >
            +
          </button>
        </div>
        <span className="font-bold text-cocoa">
          {servings > 1 ? "personnes" : "personne"}
        </span>
        {servings !== safeBase && (
          <button
            type="button"
            onClick={() => setServings(safeBase)}
            className="cursor-pointer border-0 bg-transparent text-[12px] font-bold text-dark-rose underline"
          >
            Revenir à {safeBase}
          </button>
        )}
      </div>

      {/* Liste des ingrédients */}
      {ingredients.length === 0 ? (
        <p className="font-semibold text-cocoa">
          Aucun ingrédient renseigné pour le moment.
        </p>
      ) : (
        <div className="grid gap-6">
          {groups.map((group) => (
            <div key={group.name}>
              {showGroupHeaders && (
                <h4 className="mb-3 font-display text-[18px] uppercase tracking-[0.08em] text-dark-rose">
                  {group.name}
                </h4>
              )}
              <ul className="m-0 grid list-none gap-2 p-0">
                {group.items.map((ing) => {
                  const adjustedQty =
                    ing.quantity != null ? ing.quantity * ratio : null;
                  const qtyText = formatQuantity(adjustedQty, ing.unit);
                  return (
                    <li
                      key={ing.id}
                      className="flex items-baseline gap-3 rounded-[18px] px-4 py-3 font-semibold transition hover:translate-x-1"
                      style={{ background: "var(--vanilla)" }}
                    >
                      <span className="min-w-[90px] font-display text-[18px] text-dark-rose">
                        {qtyText && `${qtyText} `}
                        {ing.unit ?? ""}
                      </span>
                      <span className="flex-1 text-chocolate">
                        {ing.name}
                        {ing.is_optional && (
                          <em className="ml-1 text-cocoa">(facultatif)</em>
                        )}
                        {ing.prep_note && (
                          <span className="ml-2 font-normal text-cocoa">
                            — {ing.prep_note}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
