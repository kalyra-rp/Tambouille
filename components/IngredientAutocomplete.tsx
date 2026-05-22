"use client";

import { useEffect, useId, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export type IngredientSuggestion = {
  id: string;
  name: string;
  default_unit: string | null;
  aisle: string | null;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** Appelé quand l'utilisateur sélectionne une suggestion existante. */
  onSelectExisting?: (suggestion: IngredientSuggestion) => void;
  placeholder?: string;
  className?: string;
};

export function IngredientAutocomplete({
  value,
  onChange,
  onSelectExisting,
  placeholder = "Nom de l'ingrédient…",
  className = "",
}: Props) {
  const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Recherche avec debounce (220ms)
  useEffect(() => {
    if (value.trim().length < 2) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from("ingredients")
        .select("id, name, default_unit, aisle")
        .ilike("name", `%${value.trim()}%`)
        .order("name")
        .limit(6);
      if (cancelled || error) return;
      setSuggestions(data ?? []);
      setActiveIndex(-1);
    }, 220);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value]);

  // Fermeture au clic en dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (s: IngredientSuggestion) => {
    onChange(s.name);
    onSelectExisting?.(s);
    setIsOpen(false);
  };

  const showDropdown =
    isOpen && value.trim().length >= 2 && suggestions.length > 0;
  const listboxId = useId();

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        className="form-input"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (!showDropdown) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) =>
              Math.min(suggestions.length - 1, i + 1),
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(-1, i - 1));
          } else if (
            e.key === "Enter" &&
            activeIndex >= 0 &&
            suggestions[activeIndex]
          ) {
            e.preventDefault();
            select(suggestions[activeIndex]);
          } else if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        aria-controls={listboxId}
      />

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-[18px] border-2 bg-white"
          style={{
            borderColor: "#f0d4cf",
            boxShadow: "var(--shadow-pop-soft)",
          }}
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                select(s);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex cursor-pointer items-center gap-2 px-4 py-2 text-[14px] font-semibold transition ${
                i === activeIndex
                  ? "bg-vanilla text-dark-rose"
                  : "text-chocolate"
              }`}
            >
              <span className="flex-1">{s.name}</span>
              {s.default_unit && (
                <span className="text-[11px] font-bold text-cocoa">
                  {s.default_unit}
                </span>
              )}
              {s.aisle && (
                <span
                  className="rounded-full px-2 py-1 text-[10px] font-black text-dark-rose"
                  style={{ background: "#ffe2eb" }}
                >
                  {s.aisle}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
