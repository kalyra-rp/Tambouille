/**
 * Convertit un texte arbitraire en slug d'URL.
 * Gère les caractères français (accents, ligatures) avant le strip alpha-num.
 *
 *   slugify("Crêpes & Œufs sur le plat") → "crepes-oeufs-sur-le-plat"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}
