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
import { Card } from "@/components/Card";
import { Sparkle } from "@/components/Sparkle";

export default function CoursesPage() {
  const { items } = useCauldron();
  const [fetched, setFetched] = useState<{
    key: string;
    recipes: RecipeWithIngredients[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  // Clé stable du SET de recettes (les changements de portions ne déclenchent pas de fetch)
  const recipeIdsKey = useMemo(
    () =>
      items
        .map((i) => i.recipeId)
        .sort()
        .join(","),
    [items],
  );

  // Fetch des ingrédients
  useEffect(() => {
    if (!recipeIdsKey) return;
    const ids = recipeIdsKey.split(",").filter(Boolean);
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(RECIPE_SELECT_FOR_SHOPPING)
        .in("id", ids);

      if (cancelled) return;
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      setErrorMsg(null);
      setFetched({
        key: recipeIdsKey,
        recipes: (data ?? []) as unknown as RecipeWithIngredients[],
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [recipeIdsKey]);

  // Statut dérivé
  const status: "empty" | "loading" | "error" | "success" =
    items.length === 0
      ? "empty"
      : errorMsg
        ? "error"
        : fetched?.key !== recipeIdsKey
          ? "loading"
          : "success";

  // Fusion + groupage (lib/shopping)
  const { merged, groups } = useMemo(() => {
    if (status !== "success" || !fetched) {
      return { merged: [], groups: [] };
    }
    return buildShoppingList(items, fetched.recipes);
  }, [fetched, items, status]);

  // Comptes & progression
  const totalCount = merged.length;
  const checkedCount = useMemo(
    () => merged.filter((i) => checked.has(i.key)).length,
    [merged, checked],
  );
  const progress = totalCount > 0 ? checkedCount / totalCount : 0;
  const totalServings = items.reduce((s, i) => s + i.servings, 0);
  const recipesCount = items.length;

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
      return;
    }
    try {
      const lines: string[] = [];
      lines.push("🛒 Liste de courses Tambouille");
      lines.push(
        `${recipesCount} recette${recipesCount > 1 ? "s" : ""} · ${totalServings} portion${totalServings > 1 ? "s" : ""}`,
      );
      lines.push("");
      for (const group of groups) {
        lines.push(`▸ ${AISLE_LABELS[group.aisle]}`);
        for (const item of group.items) {
          const qty = formatQuantity(item.totalQuantity, item.unit);
          const qtyPart = qty
            ? `${qty}${item.unit ? ` ${item.unit}` : ""} `
            : "";
          const sources =
            item.sourceCount > 1
              ? ` (pour ${item.sourceCount} recettes)`
              : "";
          lines.push(`  - ${qtyPart}${item.name}${sources}`);
        }
        lines.push("");
      }
      await navigator.clipboard.writeText(lines.join("\n").trimEnd());
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    }
  };

  // -----------------------------------------------------------
  // États
  // -----------------------------------------------------------

  if (status === "empty") {
    return (
      <Card as="section" className="relative overflow-hidden text-center">
        <Sparkle className="left-[18%] top-[16%]" delay={-0.4} />
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
              "linear-gradient(135deg, var(--mint), var(--basil), var(--orange), var(--hot-pink))",
            boxShadow: "0 18px 36px rgba(233, 38, 85, 0.26)",
          }}
        >
          🛒
        </div>
        <h1 className="m-0 font-display text-[clamp(36px,5vw,52px)] tracking-[-1px] text-chocolate">
          Pas de liste sans ingrédients
        </h1>
        <p className="mx-auto mt-3 max-w-[480px] font-semibold text-cocoa">
          Ton chaudron est vide… pas de liste magique sans ingrédients !
          Retourne mijoter quelque chose 🍲
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

  if (status === "loading") {
    return (
      <div className="grid gap-6">
        <Card as="section">
          <div className="mb-4 h-8 w-2/3 animate-pulse rounded-full bg-cream-2/70" />
          <div className="mb-4 h-4 w-1/2 animate-pulse rounded-full bg-cream-2/70" />
          <div className="h-3 w-full animate-pulse rounded-full bg-cream-2/70" />
        </Card>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <div className="mb-4 h-6 w-1/3 animate-pulse rounded-full bg-cream-2/70" />
            <div className="grid gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="h-[48px] animate-pulse rounded-[18px] bg-cream-2/70"
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <Card as="section" className="text-center">
        <h1 className="mb-3 font-display text-4xl text-chocolate">
          🪄 La liste magique a un rhume…
        </h1>
        <p className="mx-auto max-w-[520px] font-semibold text-cocoa">
          Impossible de récupérer les ingrédients pour le moment. La marmite
          refuse de coopérer. Réessaye dans un instant.
        </p>
        <p className="mx-auto mt-4 inline-block max-w-full overflow-x-auto rounded-full bg-vanilla px-4 py-2 text-[12px] font-bold text-dark-rose">
          {errorMsg}
        </p>
      </Card>
    );
  }

  // -----------------------------------------------------------
  // Succès
  // -----------------------------------------------------------

  if (totalCount === 0) {
    return (
      <Card as="section" className="text-center">
        <h1 className="mb-3 font-display text-4xl text-chocolate">
          🪄 Aucun ingrédient à acheter
        </h1>
        <p className="mx-auto max-w-[520px] font-semibold text-cocoa">
          Tes recettes du chaudron n&apos;ont pas encore d&apos;ingrédients
          renseignés. Ajoutes-en dans Supabase pour voir la magie opérer.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Card as="section" className="relative overflow-hidden">
        <Sparkle className="right-[10%] top-[12%]" size={26} delay={-0.3} />
        <Sparkle
          className="right-[24%] top-[28%]"
          size={18}
          delay={-1.2}
          glyph="✧"
          color="#ff9fc0"
        />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-[13px] py-[8px] text-[13px] font-black text-dark-rose">
              🛒 Courses magiques
            </span>
            <h1 className="m-0 font-display text-[clamp(36px,5vw,52px)] tracking-[-1px] text-chocolate">
              {totalCount} article{totalCount > 1 ? "s" : ""} dans la besace
            </h1>
            <p className="mt-2 max-w-[560px] font-semibold text-cocoa">
              Fusionnés depuis {recipesCount} recette
              {recipesCount > 1 ? "s" : ""} · {totalServings} portion
              {totalServings > 1 ? "s" : ""} au total. Classés par rayon — le
              chaos part faire un tour.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-pop btn-pop--secondary"
              aria-live="polite"
            >
              {copyStatus === "copied"
                ? "✅ Copié !"
                : copyStatus === "error"
                  ? "❌ Échec"
                  : "📋 Copier la liste"}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-pop btn-pop--primary"
            >
              🖨 Imprimer
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-[13px] font-black text-cocoa">
            <span>Progression</span>
            <span aria-live="polite">
              {checkedCount} / {totalCount}
            </span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={checkedCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
            style={{ background: "var(--vanilla)" }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{
                width: `${progress * 100}%`,
                background:
                  "linear-gradient(90deg, var(--butter), var(--orange), var(--hot-pink), var(--wine-rose))",
                backgroundSize: "220% 220%",
                animation: "gradientPulse 4s ease infinite",
              }}
            />
          </div>
        </div>
      </Card>

      {/* Rayons */}
      {groups.map((group) => (
        <Card key={group.aisle} className="relative overflow-hidden">
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="m-0 flex items-center gap-2 font-display text-[26px] text-dark-rose">
              <span aria-hidden className="text-3xl">
                {AISLE_EMOJIS[group.aisle]}
              </span>
              {AISLE_LABELS[group.aisle]}
            </h2>
            <span
              className="rounded-full bg-vanilla px-3 py-1 text-[12px] font-black text-cocoa"
              style={{ boxShadow: "var(--shadow-pop-soft)" }}
            >
              {group.items.length} article{group.items.length > 1 ? "s" : ""}
            </span>
          </header>

          <ul className="m-0 grid list-none gap-2 p-0">
            {group.items.map((item) => {
              const isChecked = checked.has(item.key);
              const qty = formatQuantity(item.totalQuantity, item.unit);
              const tooltip =
                item.sourceCount > 1
                  ? `Pour : ${item.sourceTitles.join(", ")}`
                  : undefined;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    onClick={() => toggle(item.key)}
                    title={tooltip}
                    className={`shopping-item ${
                      isChecked ? "shopping-item--checked" : ""
                    }`}
                  >
                    <span
                      aria-hidden
                      className="shopping-check"
                      data-checked={isChecked || undefined}
                    >
                      {isChecked ? "✓" : ""}
                    </span>

                    <span className="shopping-item__label flex-1">
                      {qty && (
                        <span className="font-display text-dark-rose">
                          {qty}
                          {item.unit ? ` ${item.unit}` : ""}{" "}
                        </span>
                      )}
                      <span className="text-chocolate">{item.name}</span>
                    </span>

                    {item.sourceCount > 1 && (
                      <span className="shopping-badge">
                        Pour {item.sourceCount} recettes
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
    </div>
  );
}
