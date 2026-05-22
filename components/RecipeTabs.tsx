"use client";

import { useState, type ReactNode } from "react";

export type RecipeTab = {
  id: string;
  label: string;
  emoji?: string;
  content: ReactNode;
};

type Props = {
  tabs: RecipeTab[];
};

export function RecipeTabs({ tabs }: Props) {
  const [activeId, setActiveId] = useState<string>(tabs[0]?.id ?? "");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Sections de la recette"
        className="mb-6 flex flex-wrap gap-2"
      >
        {tabs.map((t) => {
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => setActiveId(t.id)}
              className={`chip-pop cursor-pointer border-0 ${
                active ? "chip-hot text-white" : "bg-white text-cocoa"
              }`}
            >
              {t.emoji && <span aria-hidden>{t.emoji} </span>}
              {t.label}
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          id={`panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== activeId}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
