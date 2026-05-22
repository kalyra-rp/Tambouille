"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Chaudron — état persisté en localStorage côté client.
 *
 * Pas d'auth pour l'instant : on stocke la sélection localement.
 * Quand les comptes famille seront en place, on migrera vers
 * `carts` + `cart_items` côté Supabase.
 *
 * Implémenté en `useSyncExternalStore` (React 18+) :
 *  - SSR-safe (snapshot serveur stable et vide → pas de hydration mismatch)
 *  - cross-tab via l'événement natif `storage`
 *  - cross-component (même onglet) via les abonnés du store
 */

const STORAGE_KEY = "tambouille_cauldron";

export type CauldronItem = {
  recipeId: string;
  recipeTitle: string;
  recipeEmoji: string;
  recipeGradient: string;
  servings: number;
};

/** Référence stable pour l'état vide → permet à React de détecter "pas de changement". */
const EMPTY: CauldronItem[] = [];

// =============================================================
// Storage helpers
// =============================================================

function isValidItem(x: unknown): x is CauldronItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.recipeId === "string" &&
    typeof o.recipeTitle === "string" &&
    typeof o.recipeEmoji === "string" &&
    typeof o.recipeGradient === "string" &&
    typeof o.servings === "number" &&
    o.servings > 0
  );
}

function readFromStorage(): CauldronItem[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const filtered = parsed.filter(isValidItem);
    return filtered.length === 0 ? EMPTY : filtered;
  } catch {
    return EMPTY;
  }
}

function writeToStorage(items: CauldronItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota dépassé / mode privé → on ignore, l'état React reste cohérent en session.
  }
}

function clampServings(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(99, Math.round(n)));
}

// =============================================================
// Store module-level (singleton client)
// =============================================================

let cache: CauldronItem[] | null = null;
const subscribers = new Set<() => void>();

function getOrInitCache(): CauldronItem[] {
  if (cache === null) cache = readFromStorage();
  return cache;
}

function notifyAll(): void {
  for (const cb of subscribers) cb();
}

function onStorageEvent(e: StorageEvent): void {
  if (e.key !== STORAGE_KEY) return;
  cache = readFromStorage();
  notifyAll();
}

function subscribe(cb: () => void): () => void {
  if (subscribers.size === 0 && typeof window !== "undefined") {
    window.addEventListener("storage", onStorageEvent);
  }
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
    if (subscribers.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorageEvent);
    }
  };
}

function getSnapshot(): CauldronItem[] {
  return getOrInitCache();
}

function getServerSnapshot(): CauldronItem[] {
  return EMPTY;
}

function setCache(next: CauldronItem[]): void {
  cache = next;
  writeToStorage(next);
  notifyAll();
}

// =============================================================
// Mutations (exposées via le hook)
// =============================================================

function addItemImpl(item: CauldronItem): void {
  const current = getOrInitCache();
  if (current.some((i) => i.recipeId === item.recipeId)) return;
  setCache([
    ...current,
    { ...item, servings: clampServings(item.servings) },
  ]);
}

function removeItemImpl(recipeId: string): void {
  const current = getOrInitCache();
  const next = current.filter((i) => i.recipeId !== recipeId);
  if (next.length === current.length) return;
  setCache(next.length === 0 ? EMPTY : next);
}

function updateServingsImpl(recipeId: string, servings: number): void {
  const current = getOrInitCache();
  const clamped = clampServings(servings);
  let changed = false;
  const next = current.map((i) => {
    if (i.recipeId === recipeId && i.servings !== clamped) {
      changed = true;
      return { ...i, servings: clamped };
    }
    return i;
  });
  if (!changed) return;
  setCache(next);
}

function clearCauldronImpl(): void {
  if (getOrInitCache().length === 0) return;
  setCache(EMPTY);
}

// =============================================================
// Hook
// =============================================================

export function useCauldron() {
  const items = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isInCauldron = useCallback(
    (recipeId: string) => items.some((i) => i.recipeId === recipeId),
    [items],
  );

  return {
    items,
    addItem: addItemImpl,
    removeItem: removeItemImpl,
    updateServings: updateServingsImpl,
    clearCauldron: clearCauldronImpl,
    isInCauldron,
  };
}
