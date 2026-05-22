/**
 * Helpers d'unités & quantités — partagés entre l'ajusteur de portions
 * (fiche recette) et la fusion de liste de courses.
 */

/** Unités exprimant un dénombrement → on arrondit à l'entier le plus proche (min 1). */
const PIECE_UNITS = new Set([
  "pièce",
  "pièces",
  "pcs",
  "unité",
  "unités",
  "œuf",
  "œufs",
  "oeuf",
  "oeufs",
  "part",
  "parts",
  "personne",
  "personnes",
  "botte",
  "bottes",
  "gousse",
  "gousses",
  "tranche",
  "tranches",
  "boîte",
  "boîtes",
  "boite",
  "boites",
  "bouquet",
  "bouquets",
]);

export function isPieceUnit(unit: string | null | undefined): boolean {
  if (!unit) return false;
  return PIECE_UNITS.has(unit.trim().toLowerCase());
}

/**
 * Affichage d'une quantité ajustée.
 * - Pièces → entier (min 1)
 * - Sinon → 2 décimales max, zéros inutiles supprimés (1.50 → "1.5", 2.00 → "2")
 */
export function formatQuantity(
  qty: number | null | undefined,
  unit: string | null | undefined,
): string {
  if (qty == null || Number.isNaN(qty)) return "";
  if (isPieceUnit(unit)) {
    return String(Math.max(1, Math.round(qty)));
  }
  const rounded = Math.round(qty * 100) / 100;
  return String(rounded);
}
