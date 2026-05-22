/**
 * Données fictives — uniquement pour le développement visuel.
 * À remplacer par les requêtes Supabase dès que le schéma est seedé.
 */

export type MockRecipe = {
  id: string;
  title: string;
  image: string;
  badge?: string;
  meta: string[];
};

export const MOCK_RECIPES: MockRecipe[] = [
  {
    id: "r1",
    title: "Poulet miel citron",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
    badge: "🍓 Validée famille",
    meta: ["35 min", "Facile", "€€"],
  },
  {
    id: "r2",
    title: "Riz sauté du frigo",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
    badge: "✨ À tenter",
    meta: ["22 min", "Anti-gaspi", "€"],
  },
  {
    id: "r3",
    title: "Gâteau chocolat doudou",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
    badge: "❤️ Chouchou",
    meta: ["50 min", "Four", "€"],
  },
];

export type MockCauldronItem = {
  recipeId: string;
  title: string;
  servingsLabel: string;
};

export const MOCK_CAULDRON: MockCauldronItem[] = [
  { recipeId: "r1", title: "Poulet miel citron", servingsLabel: "4 pers." },
  { recipeId: "r4", title: "Salade César bacon", servingsLabel: "6 pers." },
  { recipeId: "r3", title: "Gâteau chocolat doudou", servingsLabel: "8 parts" },
];

export type MockShoppingItem = {
  aisle: string;
  name: string;
};

export const MOCK_SHOPPING: MockShoppingItem[] = [
  { aisle: "Fruits & légumes", name: "2 citrons" },
  { aisle: "Fruits & légumes", name: "1 laitue romaine" },
  { aisle: "Frais", name: "12 œufs" },
  { aisle: "Frais", name: "250 g parmesan" },
  { aisle: "Boucherie", name: "600 g poulet" },
  { aisle: "Boucherie", name: "300 g bacon" },
];
