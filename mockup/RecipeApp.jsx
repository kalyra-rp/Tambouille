import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search, Heart, ShoppingBasket, Sparkles, Clock, Star, Plus, Minus, Check,
  ChevronLeft, Filter, X, Calendar, Flame, Users, BookOpen, Home, ListChecks,
  Bookmark, Share2, Printer, ChevronRight, TrendingUp, Wand2, PartyPopper
} from 'lucide-react';

// ============== DESIGN TOKENS & STYLES ==============
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,600;1,9..144,800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

:root {
  --cream: #FFF6EC;
  --cream-deep: #FBE9D0;
  --butter: #FEF1DC;
  --raspberry: #E63946;
  --raspberry-deep: #B81E37;
  --coral: #FF7A66;
  --peach: #FFCBA4;
  --honey: #FFB627;
  --mustard: #EF8B30;
  --wine: #6B1E3F;
  --aubergine: #3C0C2A;
  --mint: #B8D4A3;
  --pistachio: #DDE8B8;
  --espresso: #2A1612;
  --ink: #1A0F0A;
  --magic: #C77DFF;
  --magic-deep: #7B2CBF;
  --gold: #FFD700;
}

* { box-sizing: border-box; }

.app-root {
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  background: var(--cream);
  -webkit-font-smoothing: antialiased;
}

.font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
.font-display-i { font-family: 'Fraunces', serif; font-style: italic; font-optical-sizing: auto; }

/* ========== ANIMATIONS ========== */
@keyframes float-slow {
  0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  33% { transform: translate(40px, -30px) rotate(120deg) scale(1.05); }
  66% { transform: translate(-30px, 20px) rotate(240deg) scale(0.95); }
}
.animate-float-slow { animation: float-slow 22s ease-in-out infinite; }

@keyframes float-slower {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-50px, 40px) scale(1.1); }
}
.animate-float-slower { animation: float-slower 28s ease-in-out infinite; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-up { animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards; }

@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.3) rotate(-15deg); }
  60% { transform: scale(1.15) rotate(5deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}
.animate-pop-in { animation: pop-in 0.55s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes shimmer-text {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
}
.sparkle { animation: sparkle 2.5s ease-in-out infinite; }

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
.twinkle { animation: twinkle 3s ease-in-out infinite; }

@keyframes dust-rise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.4; }
  100% { transform: translateY(-120vh) translateX(var(--dx, 20px)); opacity: 0; }
}
.dust-particle {
  position: absolute;
  bottom: -10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--gold), transparent);
  animation: dust-rise linear infinite;
  pointer-events: none;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-6deg); }
  75% { transform: rotate(6deg); }
}
.hover-wiggle:hover { animation: wiggle 0.45s ease-in-out; }

@keyframes bounce-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.bounce-soft { animation: bounce-soft 3s ease-in-out infinite; }

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spin-slow { animation: spin-slow 20s linear infinite; }

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(230, 57, 70, 0.4), 0 0 40px rgba(230, 57, 70, 0.2); }
  50% { box-shadow: 0 0 30px rgba(230, 57, 70, 0.7), 0 0 60px rgba(230, 57, 70, 0.4); }
}
.pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }

@keyframes wobble-emoji {
  0%, 100% { transform: rotate(-5deg) scale(1); }
  50% { transform: rotate(5deg) scale(1.05); }
}
.wobble-emoji { animation: wobble-emoji 4s ease-in-out infinite; }

@keyframes burst {
  0% { transform: scale(0) rotate(0deg); opacity: 1; }
  100% { transform: scale(1.5) rotate(var(--rot, 180deg)) translate(var(--tx, 0), var(--ty, -80px)); opacity: 0; }
}
.confetti-emoji {
  position: absolute;
  animation: burst 1.2s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
  pointer-events: none;
}

@keyframes letter-rise {
  from { opacity: 0; transform: translateY(40px) rotate(8deg); }
  to { opacity: 1; transform: translateY(0) rotate(0); }
}
.letter-rise {
  display: inline-block;
  animation: letter-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.gradient-animated {
  background: linear-gradient(120deg, #E63946 0%, #FF7A66 25%, #FFB627 50%, #C77DFF 75%, #E63946 100%);
  background-size: 300% 300%;
  animation: gradient-shift 8s ease infinite;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@keyframes card-tilt-in {
  from { opacity: 0; transform: rotateX(20deg) translateY(40px); }
  to { opacity: 1; transform: rotateX(0) translateY(0); }
}

@keyframes orbit {
  from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
}
.orbit-emoji {
  position: absolute;
  animation: orbit 12s linear infinite;
}

@keyframes glow-pulse {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6)); }
  50% { filter: drop-shadow(0 0 25px rgba(255, 215, 0, 1)); }
}
.glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }

@keyframes shimmer-sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
.shimmer-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
  animation: shimmer-sweep 4s ease-in-out infinite;
  pointer-events: none;
}

.recipe-emoji {
  filter: drop-shadow(0 12px 24px rgba(0,0,0,0.25)) drop-shadow(0 4px 8px rgba(0,0,0,0.15));
}

.glass {
  background: rgba(255, 246, 236, 0.65);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

.glass-dark {
  background: rgba(42, 22, 18, 0.45);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
}

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.text-balance { text-wrap: balance; }

.gradient-text {
  background: linear-gradient(135deg, #E63946 0%, #FF7A66 35%, #FFB627 70%, #C77DFF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #E63946 0%, #B81E37 100%);
  box-shadow: 0 8px 24px -8px rgba(230, 57, 70, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}
.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s;
}
.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 14px 36px -8px rgba(230, 57, 70, 0.65), inset 0 1px 0 rgba(255,255,255,0.3);
}
.btn-primary:hover::before { transform: translateX(100%); }

.card-recipe {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transform-style: preserve-3d;
  perspective: 1000px;
}
.card-recipe:hover {
  transform: translateY(-10px) rotateZ(-0.5deg);
}
.card-recipe:hover .card-inner {
  transform: rotateY(2deg) rotateX(-2deg);
}
.card-inner {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.tab-active {
  background: var(--ink);
  color: var(--cream);
}

.magic-cursor {
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--gold) 0%, var(--honey) 60%, transparent 100%);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: screen;
  opacity: 0;
  transition: opacity 0.3s;
}

@keyframes trail-fade {
  from { opacity: 0.8; transform: scale(1); }
  to { opacity: 0; transform: scale(0); }
}
.trail-particle {
  position: fixed;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  animation: trail-fade 0.8s ease-out forwards;
}

@keyframes drift-1 {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(15px, -25px); }
  50% { transform: translate(-10px, -15px); }
  75% { transform: translate(20px, 10px); }
}
@keyframes drift-2 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(-20px, 30px); }
  66% { transform: translate(25px, -10px); }
}
@keyframes drift-3 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-30px, -20px); }
}
.drift-1 { animation: drift-1 11s ease-in-out infinite; }
.drift-2 { animation: drift-2 13s ease-in-out infinite; }
.drift-3 { animation: drift-3 15s ease-in-out infinite; }

@keyframes magic-ring {
  0% { transform: scale(0.6); opacity: 0.9; }
  100% { transform: scale(2); opacity: 0; }
}
.magic-ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--gold);
  border-radius: 50%;
  animation: magic-ring 1.2s ease-out forwards;
  pointer-events: none;
}

/* Bookmark hover */
.bookmark-btn:hover svg {
  fill: var(--raspberry);
  color: var(--raspberry);
  transform: scale(1.2);
}
.bookmark-btn svg { transition: all 0.3s; }

/* progress ring */
@keyframes progress-glow {
  0%, 100% { filter: brightness(1) saturate(1); }
  50% { filter: brightness(1.2) saturate(1.3); }
}
.progress-glow { animation: progress-glow 2.5s ease-in-out infinite; }

@keyframes scale-in {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes shake-x {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}
.shake-x { animation: shake-x 0.5s ease-in-out; }
`;

// ============== RECIPE DATA ==============
const RECIPES = [
  {
    id: 1, title: "Tarte au citron meringuée", subtitle: "La classique réinventée",
    category: "Desserts", emoji: "🍋",
    gradient: "from-yellow-200 via-amber-300 to-orange-400",
    accent: "#FFB627",
    prep: 30, cook: 35, total: 65, difficulty: 3, servings: 6, rating: 5,
    status: "favorite", tags: ["Famille", "Acidulé", "Pâtisserie"],
    description: "Pâte sablée croustillante, crème citron vibrante, meringue italienne dorée. Le dessert qui fait l'unanimité chez les Dupont depuis 1987.",
    ingredients: [
      { name: "Citrons jaunes bio", qty: 4, unit: "pièces", aisle: "F&L", group: "Crème" },
      { name: "Œufs frais", qty: 4, unit: "pièces", aisle: "Frais", group: "Crème" },
      { name: "Sucre en poudre", qty: 180, unit: "g", aisle: "Épicerie", group: "Crème" },
      { name: "Beurre doux", qty: 100, unit: "g", aisle: "Frais", group: "Crème" },
      { name: "Farine T55", qty: 200, unit: "g", aisle: "Épicerie", group: "Pâte" },
      { name: "Sucre glace", qty: 80, unit: "g", aisle: "Épicerie", group: "Pâte" },
      { name: "Blancs d'œufs", qty: 3, unit: "pièces", aisle: "Frais", group: "Meringue" },
    ],
    steps: [
      "Préparer la pâte sablée : sabler farine, sucre glace et beurre froid. Ajouter un œuf, fraser puis filmer 1h au frais.",
      "Foncer un cercle de 22cm. Piquer le fond, ajouter des billes de cuisson et enfourner 20 min à 180°C.",
      "Pour la crème : zester et presser les citrons. Fouetter les œufs avec le sucre, ajouter le jus, les zestes et le beurre fondu.",
      "Cuire au bain-marie en remuant jusqu'à épaississement (82°C). Verser sur le fond précuit.",
      "Monter les blancs en neige avec le sucre cuit à 118°C pour une meringue italienne soyeuse.",
      "Pocher la meringue, dorer au chalumeau. Réserver 2h au frais avant dégustation."
    ]
  },
  {
    id: 2, title: "Risotto truffé aux champignons", subtitle: "Onctueux & terrien",
    category: "Plats", emoji: "🍄",
    gradient: "from-amber-300 via-orange-400 to-red-500",
    accent: "#EF8B30",
    prep: 15, cook: 25, total: 40, difficulty: 2, servings: 4, rating: 4,
    status: "tested", tags: ["Confort", "Italie", "Réconfortant"],
    description: "Riz Carnaroli crémeux, champignons forestiers poêlés, voile de truffe noire. L'élégance simple en bouche.",
    ingredients: [
      { name: "Riz Carnaroli", qty: 300, unit: "g", aisle: "Épicerie", group: "Base" },
      { name: "Champignons mélangés", qty: 400, unit: "g", aisle: "F&L", group: "Base" },
      { name: "Bouillon de volaille", qty: 1.2, unit: "L", aisle: "Épicerie", group: "Base" },
      { name: "Parmesan 24 mois", qty: 80, unit: "g", aisle: "Frais", group: "Finition" },
      { name: "Beurre", qty: 50, unit: "g", aisle: "Frais", group: "Finition" },
      { name: "Échalotes", qty: 2, unit: "pièces", aisle: "F&L", group: "Base" },
      { name: "Vin blanc sec", qty: 150, unit: "ml", aisle: "Caves", group: "Base" },
    ],
    steps: [
      "Émincer les échalotes, faire suer dans l'huile d'olive sans coloration.",
      "Nacrer le riz 2 min, déglacer au vin blanc et laisser évaporer.",
      "Ajouter le bouillon louche par louche en remuant à feu moyen.",
      "En parallèle, poêler les champignons à feu vif. Saler en fin de cuisson.",
      "Incorporer le beurre froid et le parmesan hors du feu. Mantecare 1 min.",
      "Dresser, ajouter les champignons et un filet d'huile de truffe."
    ]
  },
  {
    id: 3, title: "Burrata, tomates anciennes & basilic", subtitle: "L'été en assiette",
    category: "Entrées", emoji: "🍅",
    gradient: "from-rose-300 via-red-400 to-orange-500",
    accent: "#E63946",
    prep: 10, cook: 0, total: 10, difficulty: 1, servings: 4, rating: 5,
    status: "favorite", tags: ["Été", "Sans cuisson", "Italie"],
    description: "Trois variétés de tomates juteuses, burrata crémeuse, basilic frais, fleur de sel. La simplicité absolue.",
    ingredients: [
      { name: "Tomates anciennes mix", qty: 600, unit: "g", aisle: "F&L", group: "Base" },
      { name: "Burrata des Pouilles", qty: 2, unit: "pièces", aisle: "Frais", group: "Base" },
      { name: "Basilic frais", qty: 1, unit: "botte", aisle: "F&L", group: "Base" },
      { name: "Huile d'olive vierge extra", qty: 4, unit: "c.à.s", aisle: "Épicerie", group: "Assaisonnement" },
      { name: "Vinaigre balsamique vieilli", qty: 1, unit: "c.à.s", aisle: "Épicerie", group: "Assaisonnement" },
      { name: "Fleur de sel", qty: 1, unit: "pincée", aisle: "Épicerie", group: "Assaisonnement" },
    ],
    steps: [
      "Couper les tomates en quartiers, rondelles et dés selon les variétés.",
      "Dresser harmonieusement sur une grande assiette plate.",
      "Déposer les burratas entières au centre.",
      "Ciseler grossièrement le basilic, parsemer.",
      "Arroser d'huile d'olive, ajouter le balsamique en gouttes.",
      "Fleur de sel, poivre du moulin. Servir immédiatement."
    ]
  },
  {
    id: 4, title: "Bœuf bourguignon", subtitle: "Mijotage du dimanche",
    category: "Plats", emoji: "🍷",
    gradient: "from-red-500 via-red-800 to-purple-950",
    accent: "#6B1E3F",
    prep: 30, cook: 180, total: 210, difficulty: 3, servings: 6, rating: 5,
    status: "favorite", tags: ["Tradition", "Hiver", "Famille"],
    description: "Viande fondante, sauce profonde au vin rouge, lardons fumés, petits oignons glacés. Le plat de Mamie, sans concession.",
    ingredients: [
      { name: "Bœuf à mijoter (paleron/joue)", qty: 1.5, unit: "kg", aisle: "Boucherie", group: "Base" },
      { name: "Vin rouge corsé", qty: 750, unit: "ml", aisle: "Caves", group: "Base" },
      { name: "Lardons fumés", qty: 200, unit: "g", aisle: "Frais", group: "Base" },
      { name: "Petits oignons grelots", qty: 300, unit: "g", aisle: "F&L", group: "Garniture" },
      { name: "Champignons de Paris", qty: 250, unit: "g", aisle: "F&L", group: "Garniture" },
      { name: "Carottes", qty: 3, unit: "pièces", aisle: "F&L", group: "Base" },
      { name: "Bouquet garni", qty: 1, unit: "pièce", aisle: "F&L", group: "Base" },
    ],
    steps: [
      "Mariner la viande 12h au vin avec carottes, oignons et bouquet garni.",
      "Égoutter et sécher. Saisir vivement en cocotte fonte.",
      "Suer les lardons, déglacer au marc de Bourgogne.",
      "Remettre la viande, ajouter la marinade et le bouillon à hauteur.",
      "Mijoter 3h à feu très doux, couvercle entrouvert.",
      "Glacer les oignons, poêler les champignons. Ajouter en fin de cuisson."
    ]
  },
  {
    id: 5, title: "Tiramisu classico", subtitle: "Recette de Nonna",
    category: "Desserts", emoji: "☕",
    gradient: "from-amber-100 via-amber-400 to-amber-800",
    accent: "#B8651C",
    prep: 20, cook: 0, total: 260, difficulty: 2, servings: 8, rating: 5,
    status: "favorite", tags: ["Italie", "Sans cuisson", "Café"],
    description: "Mascarpone aérien, café corsé, biscuits cuillère, cacao amer. La version originelle, sans détour.",
    ingredients: [
      { name: "Mascarpone", qty: 500, unit: "g", aisle: "Frais", group: "Crème" },
      { name: "Œufs frais extra", qty: 6, unit: "pièces", aisle: "Frais", group: "Crème" },
      { name: "Sucre en poudre", qty: 150, unit: "g", aisle: "Épicerie", group: "Crème" },
      { name: "Biscuits cuillère", qty: 30, unit: "pièces", aisle: "Épicerie", group: "Montage" },
      { name: "Café espresso fort", qty: 500, unit: "ml", aisle: "Épicerie", group: "Montage" },
      { name: "Amaretto", qty: 4, unit: "c.à.s", aisle: "Caves", group: "Montage" },
      { name: "Cacao amer en poudre", qty: 30, unit: "g", aisle: "Épicerie", group: "Finition" },
    ],
    steps: [
      "Séparer blancs et jaunes. Préparer un café fort, refroidir et ajouter l'amaretto.",
      "Blanchir les jaunes avec le sucre jusqu'à ruban.",
      "Incorporer le mascarpone par petites quantités.",
      "Monter les blancs en neige ferme, incorporer délicatement à la maryse.",
      "Tremper rapidement les biscuits dans le café, alterner couches biscuits/crème.",
      "Filmer, réfrigérer 4h minimum. Saupoudrer de cacao juste avant service."
    ]
  },
  {
    id: 6, title: "Spritz Aperol maison", subtitle: "L'apéro qui pétille",
    category: "Boissons", emoji: "🍹",
    gradient: "from-orange-300 via-pink-400 to-rose-500",
    accent: "#FF7A66",
    prep: 5, cook: 0, total: 5, difficulty: 1, servings: 1, rating: 4,
    status: "tested", tags: ["Apéro", "Italie", "Été"],
    description: "Orange amer, bulles fines, glaçons en cascade. Le 3-2-1 vénitien dans toute sa splendeur.",
    ingredients: [
      { name: "Aperol", qty: 6, unit: "cl", aisle: "Caves", group: "Base" },
      { name: "Prosecco brut", qty: 9, unit: "cl", aisle: "Caves", group: "Base" },
      { name: "Eau gazeuse", qty: 3, unit: "cl", aisle: "Épicerie", group: "Base" },
      { name: "Glaçons", qty: 6, unit: "pièces", aisle: "Frais", group: "Service" },
      { name: "Tranche d'orange", qty: 1, unit: "pièce", aisle: "F&L", group: "Service" },
      { name: "Olives vertes", qty: 2, unit: "pièces", aisle: "Épicerie", group: "Service" },
    ],
    steps: [
      "Remplir un grand verre à vin de glaçons jusqu'en haut.",
      "Verser le prosecco bien frais en premier (3 parts).",
      "Ajouter l'Aperol par dessus (2 parts).",
      "Compléter d'un trait d'eau gazeuse (1 part).",
      "Garnir d'une tranche d'orange et d'olives sur pic.",
      "Servir immédiatement, Cin cin !"
    ]
  },
  {
    id: 7, title: "Velouté de potimarron au gingembre", subtitle: "Douceur d'automne",
    category: "Entrées", emoji: "🎃",
    gradient: "from-yellow-300 via-orange-400 to-orange-700",
    accent: "#EF8B30",
    prep: 15, cook: 30, total: 45, difficulty: 1, servings: 4, rating: 4,
    status: "totry", tags: ["Automne", "Réconfortant", "Végétarien"],
    description: "Potimarron rôti, lait de coco soyeux, pointe de gingembre frais, croûtons dorés. Une caresse en cuillerée.",
    ingredients: [
      { name: "Potimarron", qty: 1, unit: "pièce", aisle: "F&L", group: "Base" },
      { name: "Lait de coco", qty: 400, unit: "ml", aisle: "Épicerie", group: "Base" },
      { name: "Gingembre frais", qty: 30, unit: "g", aisle: "F&L", group: "Base" },
      { name: "Oignon", qty: 1, unit: "pièce", aisle: "F&L", group: "Base" },
      { name: "Bouillon de légumes", qty: 600, unit: "ml", aisle: "Épicerie", group: "Base" },
      { name: "Graines de courge", qty: 30, unit: "g", aisle: "Épicerie", group: "Finition" },
    ],
    steps: [
      "Couper le potimarron en cubes (avec la peau).",
      "Suer l'oignon et le gingembre râpé dans un peu d'huile.",
      "Ajouter le potimarron, mouiller à hauteur avec le bouillon.",
      "Cuire 25 min à feu doux.",
      "Mixer finement avec le lait de coco. Rectifier l'assaisonnement.",
      "Torréfier les graines de courge à sec. Dresser, parsemer."
    ]
  },
  {
    id: 8, title: "Pancakes ricotta-citron", subtitle: "Brunch dominical",
    category: "Petit-déj", emoji: "🥞",
    gradient: "from-amber-100 via-yellow-300 to-orange-400",
    accent: "#FFB627",
    prep: 10, cook: 15, total: 25, difficulty: 1, servings: 4, rating: 5,
    status: "favorite", tags: ["Brunch", "Famille", "Week-end"],
    description: "Pâte mousseuse, blancs montés, ricotta fondante, zestes de citron. Plus aériens, tu meurs.",
    ingredients: [
      { name: "Ricotta", qty: 250, unit: "g", aisle: "Frais", group: "Pâte" },
      { name: "Œufs", qty: 3, unit: "pièces", aisle: "Frais", group: "Pâte" },
      { name: "Farine T45", qty: 120, unit: "g", aisle: "Épicerie", group: "Pâte" },
      { name: "Sucre", qty: 40, unit: "g", aisle: "Épicerie", group: "Pâte" },
      { name: "Citron jaune", qty: 1, unit: "pièce", aisle: "F&L", group: "Pâte" },
      { name: "Lait entier", qty: 100, unit: "ml", aisle: "Frais", group: "Pâte" },
      { name: "Sirop d'érable", qty: 80, unit: "ml", aisle: "Épicerie", group: "Service" },
    ],
    steps: [
      "Séparer blancs et jaunes. Mélanger ricotta, jaunes, sucre et zestes.",
      "Ajouter farine tamisée, lait et levure. Détendre.",
      "Monter les blancs en neige souple. Incorporer délicatement.",
      "Cuire à feu moyen-doux dans une poêle huilée, 2 min par face.",
      "Empiler, arroser de sirop d'érable.",
      "Servir avec fruits rouges frais et chantilly légère."
    ]
  },
  {
    id: 9, title: "Pad Thaï crevettes", subtitle: "Street food de Bangkok",
    category: "Plats", emoji: "🍜",
    gradient: "from-orange-300 via-red-500 to-rose-600",
    accent: "#FF7A66",
    prep: 20, cook: 10, total: 30, difficulty: 2, servings: 4, rating: 5,
    status: "tested", tags: ["Thaï", "Wok", "Épicé"],
    description: "Nouilles de riz sautées, crevettes sauvages, cacahuètes, citron vert, sauce tamarin. L'umami à l'état pur.",
    ingredients: [
      { name: "Nouilles de riz", qty: 300, unit: "g", aisle: "Épicerie", group: "Base" },
      { name: "Crevettes crues décortiquées", qty: 400, unit: "g", aisle: "Frais", group: "Base" },
      { name: "Œufs", qty: 2, unit: "pièces", aisle: "Frais", group: "Base" },
      { name: "Pâte de tamarin", qty: 3, unit: "c.à.s", aisle: "Épicerie", group: "Sauce" },
      { name: "Sauce poisson (nuoc-mâm)", qty: 3, unit: "c.à.s", aisle: "Épicerie", group: "Sauce" },
      { name: "Cacahuètes grillées", qty: 60, unit: "g", aisle: "Épicerie", group: "Finition" },
      { name: "Citron vert", qty: 2, unit: "pièces", aisle: "F&L", group: "Finition" },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", aisle: "F&L", group: "Finition" },
    ],
    steps: [
      "Tremper les nouilles 15 min dans l'eau tiède.",
      "Préparer la sauce : tamarin, sauce poisson, sucre de palme.",
      "Faire chauffer le wok à feu très vif avec un filet d'huile.",
      "Sauter les crevettes 2 min, réserver.",
      "Cuire les œufs brouillés, ajouter les nouilles égouttées puis la sauce.",
      "Remettre les crevettes, sauter 2 min. Servir avec cacahuètes, citron vert, coriandre."
    ]
  },
  {
    id: 10, title: "Mousse au chocolat intense", subtitle: "70% cacao Valrhona",
    category: "Desserts", emoji: "🍫",
    gradient: "from-amber-700 via-amber-900 to-stone-900",
    accent: "#3C0C2A",
    prep: 15, cook: 0, total: 195, difficulty: 1, servings: 6, rating: 5,
    status: "favorite", tags: ["Chocolat", "Sans cuisson", "Express"],
    description: "Texture nuageuse, intensité cacao, fleur de sel. Trois ingrédients, l'extase.",
    ingredients: [
      { name: "Chocolat noir 70%", qty: 200, unit: "g", aisle: "Épicerie", group: "Base" },
      { name: "Œufs frais extra", qty: 6, unit: "pièces", aisle: "Frais", group: "Base" },
      { name: "Sucre en poudre", qty: 40, unit: "g", aisle: "Épicerie", group: "Base" },
      { name: "Fleur de sel", qty: 1, unit: "pincée", aisle: "Épicerie", group: "Finition" },
    ],
    steps: [
      "Faire fondre le chocolat au bain-marie. Tiédir.",
      "Séparer les blancs des jaunes. Incorporer les jaunes au chocolat tiède.",
      "Monter les blancs en neige souple, ajouter le sucre à mi-parcours.",
      "Incorporer un tiers des blancs au chocolat pour détendre.",
      "Ajouter le reste délicatement à la maryse, mouvements enveloppants.",
      "Répartir en ramequins, réfrigérer 3h minimum. Fleur de sel au moment de servir."
    ]
  },
  {
    id: 11, title: "Salade burrata, pêches & prosciutto", subtitle: "Estivale et juteuse",
    category: "Entrées", emoji: "🍑",
    gradient: "from-orange-200 via-pink-300 to-rose-400",
    accent: "#FFCBA4",
    prep: 12, cook: 0, total: 12, difficulty: 1, servings: 4, rating: 4,
    status: "totry", tags: ["Été", "Sans cuisson", "Sucré-salé"],
    description: "Pêches blanches grillées, burrata fondante, prosciutto crispy, basilic pourpre, miel de fleurs.",
    ingredients: [
      { name: "Pêches blanches mûres", qty: 4, unit: "pièces", aisle: "F&L", group: "Base" },
      { name: "Burrata", qty: 2, unit: "pièces", aisle: "Frais", group: "Base" },
      { name: "Prosciutto di Parma", qty: 120, unit: "g", aisle: "Frais", group: "Base" },
      { name: "Roquette", qty: 100, unit: "g", aisle: "F&L", group: "Base" },
      { name: "Miel de fleurs", qty: 2, unit: "c.à.s", aisle: "Épicerie", group: "Assaisonnement" },
      { name: "Vinaigre de xérès", qty: 1, unit: "c.à.s", aisle: "Épicerie", group: "Assaisonnement" },
    ],
    steps: [
      "Couper les pêches en quartiers, griller 1 min par face à la plancha.",
      "Disposer la roquette dans une grande assiette.",
      "Ajouter pêches grillées et burrata coupée en deux.",
      "Drapper le prosciutto par dessus.",
      "Émulsionner miel, vinaigre, huile d'olive et poivre.",
      "Arroser, ajouter basilic frais et fleur de sel."
    ]
  },
  {
    id: 12, title: "Margarita classique", subtitle: "Tequila & citron vert",
    category: "Boissons", emoji: "🍸",
    gradient: "from-lime-200 via-green-300 to-emerald-500",
    accent: "#B8D4A3",
    prep: 3, cook: 0, total: 3, difficulty: 1, servings: 1, rating: 5,
    status: "tested", tags: ["Cocktail", "Mexique", "Acidulé"],
    description: "Tequila blanche, triple sec, citron vert frais, croûte de sel. L'équilibre parfait.",
    ingredients: [
      { name: "Tequila blanco", qty: 5, unit: "cl", aisle: "Caves", group: "Base" },
      { name: "Triple sec / Cointreau", qty: 2, unit: "cl", aisle: "Caves", group: "Base" },
      { name: "Jus de citron vert frais", qty: 3, unit: "cl", aisle: "F&L", group: "Base" },
      { name: "Sirop d'agave", qty: 1, unit: "c.à.c", aisle: "Épicerie", group: "Base" },
      { name: "Fleur de sel", qty: 1, unit: "pincée", aisle: "Épicerie", group: "Service" },
    ],
    steps: [
      "Givrer le bord du verre avec citron vert et fleur de sel.",
      "Remplir un shaker de glaçons.",
      "Verser tequila, triple sec, jus de citron vert et sirop d'agave.",
      "Shaker énergiquement 15 secondes.",
      "Filtrer dans le verre givré (sans glace ou on the rocks).",
      "Garnir d'une fine rondelle de citron vert."
    ]
  },
];

const CATEGORIES = [
  { name: "Tout", emoji: "✨", count: 247 },
  { name: "Petit-déj", emoji: "🥐", count: 32 },
  { name: "Entrées", emoji: "🥗", count: 48 },
  { name: "Plats", emoji: "🍖", count: 67 },
  { name: "Desserts", emoji: "🍰", count: 54 },
  { name: "Boissons", emoji: "🍹", count: 28 },
  { name: "Apéros", emoji: "🧀", count: 18 },
];

// ============== HELPER COMPONENTS ==============

const Tag = ({ children, color = "raspberry" }) => {
  const colorMap = {
    raspberry: "bg-[#E63946]/10 text-[#B81E37] border-[#E63946]/20",
    honey: "bg-[#FFB627]/15 text-[#8B5A0E] border-[#FFB627]/30",
    mint: "bg-[#B8D4A3]/25 text-[#3A5A2F] border-[#B8D4A3]/40",
    wine: "bg-[#6B1E3F]/10 text-[#6B1E3F] border-[#6B1E3F]/20",
    magic: "bg-[#C77DFF]/15 text-[#7B2CBF] border-[#C77DFF]/30",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorMap[color]} transition-all hover:scale-105`}>
      {children}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    favorite: { icon: <Heart size={12} className="fill-current" />, label: "Favorite famille", color: "bg-[#E63946] text-white" },
    tested: { icon: <Check size={12} />, label: "Testée", color: "bg-[#B8D4A3] text-[#2A4A1F]" },
    totry: { icon: <Sparkles size={12} />, label: "À tester", color: "bg-[#FFB627] text-[#5C3D0A]" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${c.color} shadow-sm`}>
      {c.icon} {c.label}
    </span>
  );
};

// Sparkles scattered around an element
const SparkleField = ({ count = 5, area = 100 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${Math.random() * area}%`,
            left: `${Math.random() * area}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        >
          <Sparkles size={8 + Math.random() * 12} className="sparkle text-[#FFD700]" />
        </div>
      ))}
    </>
  );
};

// Floating dust particles background
const FloatingDust = ({ count = 18 }) => {
  const particles = useMemo(() =>
    [...Array(count)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 15,
      dx: (Math.random() - 0.5) * 80,
      size: 3 + Math.random() * 6,
    }))
  , [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="dust-particle"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--dx': `${p.dx}px`,
          }}
        />
      ))}
    </div>
  );
};

// Animated title that reveals letter by letter
const AnimatedTitle = ({ text, className = "", italicWord = null }) => {
  const renderWord = (word, wordIdx, startCharIdx) => {
    const isItalic = italicWord && word.toLowerCase() === italicWord.toLowerCase();
    return (
      <span key={wordIdx} className={isItalic ? "font-display-i gradient-animated" : ""}>
        {word.split('').map((char, charIdx) => {
          const totalIdx = startCharIdx + charIdx;
          return (
            <span
              key={charIdx}
              className="letter-rise"
              style={{ animationDelay: `${totalIdx * 0.03}s` }}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  const words = text.split(' ');
  let charCount = 0;
  return (
    <span className={className}>
      {words.map((word, i) => {
        const result = renderWord(word, i, charCount);
        charCount += word.length;
        return (
          <React.Fragment key={i}>
            {result}
            {i < words.length - 1 && <span> </span>}
          </React.Fragment>
        );
      })}
    </span>
  );
};

// Confetti burst on click
const useConfetti = () => {
  const [bursts, setBursts] = useState([]);
  const trigger = (x, y, emojis = ['🎉', '✨', '🍒', '⭐', '💫']) => {
    const id = Date.now();
    const newBurst = {
      id,
      x, y,
      pieces: [...Array(12)].map((_, i) => ({
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        tx: (Math.random() - 0.5) * 200,
        ty: -100 - Math.random() * 80,
        rot: (Math.random() - 0.5) * 360,
        delay: i * 30,
      })),
    };
    setBursts(b => [...b, newBurst]);
    setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 1500);
  };
  const render = () => (
    <>
      {bursts.map(b => (
        <div key={b.id} className="fixed pointer-events-none z-[9999]" style={{ left: b.x, top: b.y }}>
          {b.pieces.map((p, i) => (
            <span
              key={i}
              className="confetti-emoji text-2xl"
              style={{
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                '--rot': `${p.rot}deg`,
                animationDelay: `${p.delay}ms`,
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      ))}
    </>
  );
  return { trigger, render };
};

const RecipeCard = ({ recipe, onClick, index = 0, compact = false }) => {
  const [bookmarked, setBookmarked] = useState(recipe.status === 'favorite');

  return (
    <div
      onClick={onClick}
      className="card-recipe group cursor-pointer animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="card-inner relative overflow-hidden rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_25px_60px_-15px_rgba(230,57,70,0.35)] transition-all duration-500">
        <div className={`relative bg-gradient-to-br ${recipe.gradient} ${compact ? 'h-40' : 'h-56'} overflow-hidden`}>
          {/* Soft glow */}
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 50%)'
          }} />
          {/* Sparkles in card */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles size={14} className="sparkle text-white" style={{ animationDelay: '0s' }} />
          </div>
          <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles size={10} className="sparkle text-white" style={{ animationDelay: '0.7s' }} />
          </div>
          <div className="absolute bottom-12 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles size={12} className="sparkle text-white" style={{ animationDelay: '1.4s' }} />
          </div>
          {/* Emoji */}
          <div className={`absolute ${compact ? '-right-2 -bottom-4 text-7xl' : '-right-4 -bottom-6 text-9xl'} recipe-emoji group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700`}>
            {recipe.emoji}
          </div>
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <StatusBadge status={recipe.status} />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
            className="bookmark-btn absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center hover-wiggle"
          >
            <Bookmark size={16} className={bookmarked ? "fill-[#E63946] text-[#E63946]" : "text-[#2A1612]"} />
          </button>
        </div>
        <div className="bg-[#FEF1DC] p-4 relative">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-semibold leading-tight text-[#1A0F0A] truncate group-hover:text-[#E63946] transition-colors">
                {recipe.title}
              </h3>
              <p className="font-display-i text-xs text-[#6B1E3F]/70 mt-0.5 truncate">{recipe.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#2A1612]/60">
            <span className="flex items-center gap-1"><Clock size={12} />{recipe.total}min</span>
            <span className="flex items-center gap-1"><Flame size={12} />{'•'.repeat(recipe.difficulty)}</span>
            <span className="flex items-center gap-1 ml-auto">
              <Star size={12} className="fill-[#FFB627] text-[#FFB627]" />
              <span className="font-semibold text-[#2A1612]">{recipe.rating}.0</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
      active
        ? 'bg-[#1A0F0A] text-[#FFF6EC] shadow-lg shadow-black/20 scale-105'
        : 'text-[#1A0F0A]/70 hover:bg-[#1A0F0A]/5 hover:scale-105'
    }`}
  >
    {icon}
    <span>{label}</span>
    {badge > 0 && (
      <span className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center bg-[#E63946] text-white">
        {badge}
      </span>
    )}
  </button>
);

// Tambouille logo with animated steam
const Logo = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center gap-2.5 group">
    <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E63946] via-[#FF7A66] to-[#FFB627] flex items-center justify-center shadow-lg shadow-[#E63946]/30 group-hover:scale-110 group-hover:rotate-6 transition">
      <span className="text-2xl">🍲</span>
      {/* Steam */}
      <div className="absolute -top-1 left-2 text-[10px] opacity-60 bounce-soft">💨</div>
      <div className="absolute -top-2 right-1 text-[8px] opacity-50 bounce-soft" style={{ animationDelay: '0.5s' }}>💨</div>
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFB627]/40 to-transparent blur-lg -z-10 group-hover:blur-xl transition" />
    </div>
    <div>
      <div className="font-display text-xl font-bold leading-none flex items-center gap-1">
        Tambouille
        <Sparkles size={12} className="text-[#FFB627] sparkle" />
      </div>
      <div className="font-display-i text-[10px] text-[#6B1E3F]/60 leading-none mt-0.5">la cuisine qui pétille</div>
    </div>
  </button>
);

// ============== SCREENS ==============

const HomeScreen = ({ onSelectRecipe, onNavigate }) => {
  const featured = RECIPES[0];
  const recent = RECIPES.slice(1, 5);
  const favorites = RECIPES.filter(r => r.status === 'favorite').slice(0, 4);

  return (
    <div className="space-y-12 pb-24">
      {/* Hero */}
      <section className="relative animate-fade-up">
        <div className="relative bg-gradient-to-br from-[#FEF1DC] via-[#FBE9D0] to-[#FFCBA4] rounded-[2.5rem] p-8 md:p-12 overflow-hidden shimmer-overlay">
          {/* Background blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#FFB627]/50 to-[#E63946]/40 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-32 -left-10 w-72 h-72 rounded-full bg-gradient-to-br from-[#C77DFF]/30 to-[#FF7A66]/40 blur-3xl animate-float-slower" />

          {/* Scattered sparkles */}
          <div className="absolute top-8 right-1/3"><Sparkles size={20} className="sparkle text-[#FFB627]" style={{ animationDelay: '0.3s' }} /></div>
          <div className="absolute top-20 right-1/4"><Sparkles size={14} className="sparkle text-[#E63946]" style={{ animationDelay: '1s' }} /></div>
          <div className="absolute bottom-10 left-1/3"><Sparkles size={16} className="sparkle text-[#C77DFF]" style={{ animationDelay: '1.7s' }} /></div>
          <div className="absolute top-1/2 left-8"><Sparkles size={12} className="sparkle text-[#FFB627]" style={{ animationDelay: '2.2s' }} /></div>

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5 text-xs font-semibold text-[#6B1E3F]">
                <Wand2 size={14} className="text-[#C77DFF]" /> Bonjour Kalyra ✨
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-light leading-[1.05] text-[#1A0F0A]">
                <AnimatedTitle text="Qu'est-ce qu'on" />{' '}
                <AnimatedTitle text="mijote" italicWord="mijote" className="font-display-i font-semibold" />{' '}
                <AnimatedTitle text="aujourd'hui ?" />
              </h1>
              <p className="font-display-i text-lg text-[#2A1612]/70 mt-4 max-w-md animate-fade-up" style={{ animationDelay: '0.6s' }}>
                247 merveilles dans ta bibliothèque, des idées plein le frigo, et ce week-end c'est brunch.
              </p>
              <div className="mt-6 relative max-w-md animate-fade-up" style={{ animationDelay: '0.8s' }}>
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2A1612]/40" />
                <input
                  type="text"
                  placeholder="Cherche une recette, un ingrédient..."
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/80 backdrop-blur border border-white/60 text-sm font-medium placeholder:text-[#2A1612]/40 focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 transition"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Sparkles size={14} className="sparkle text-[#FFB627]" />
                </div>
              </div>
            </div>
            <div className="hidden md:block relative h-full min-h-[300px] animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Main emoji */}
                <div className="text-[200px] recipe-emoji wobble-emoji">🍝</div>
                {/* Orbiting emojis */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-20 h-20">
                    <div className="orbit-emoji text-5xl" style={{ animationDuration: '15s' }}>🍋</div>
                    <div className="orbit-emoji text-4xl" style={{ animationDuration: '18s', animationDelay: '-5s' }}>🍓</div>
                    <div className="orbit-emoji text-4xl" style={{ animationDuration: '20s', animationDelay: '-10s' }}>🌿</div>
                    <div className="orbit-emoji text-3xl" style={{ animationDuration: '17s', animationDelay: '-13s' }}>🧄</div>
                  </div>
                </div>
                {/* Sparkles around */}
                <div className="absolute top-0 left-1/4"><Sparkles size={24} className="sparkle text-[#FFD700] glow-pulse" /></div>
                <div className="absolute bottom-1/4 right-0"><Sparkles size={18} className="sparkle text-[#C77DFF]" style={{ animationDelay: '0.8s' }} /></div>
                <div className="absolute top-1/3 right-1/4"><Sparkles size={14} className="sparkle text-[#FFB627]" style={{ animationDelay: '1.5s' }} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl font-semibold text-[#1A0F0A]">
            Parcourir par <span className="font-display-i text-[#E63946]">envie</span>
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              className="flex-shrink-0 group bg-[#FEF1DC] hover:bg-white border border-[#1A0F0A]/5 rounded-2xl px-5 py-4 transition-all hover:shadow-xl hover:shadow-[#E63946]/10 hover:-translate-y-2 animate-fade-up relative overflow-hidden"
              style={{ animationDelay: `${i * 60 + 200}ms` }}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                <Sparkles size={10} className="sparkle text-[#FFB627]" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500">{cat.emoji}</span>
                <div className="text-left">
                  <div className="font-display font-semibold text-[#1A0F0A]">{cat.name}</div>
                  <div className="text-xs text-[#2A1612]/50">{cat.count} recettes</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-xs font-bold tracking-widest text-[#E63946] uppercase mb-1 flex items-center gap-2">
              <Sparkles size={10} className="sparkle" /> ✦ Coup de cœur du jour
            </div>
            <h2 className="font-display text-2xl font-semibold">
              <span className="font-display-i">L'incontournable</span> de la famille
            </h2>
          </div>
        </div>
        <div onClick={() => onSelectRecipe(featured)} className="cursor-pointer group">
          <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${featured.gradient} h-72 md:h-96 shadow-[0_20px_60px_-20px_rgba(230,57,70,0.4)] group-hover:shadow-[0_30px_80px_-20px_rgba(230,57,70,0.6)] transition-all duration-700`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* Sparkles around emoji */}
            <div className="absolute top-12 right-1/3"><Sparkles size={26} className="sparkle text-white glow-pulse" /></div>
            <div className="absolute top-1/2 right-1/4"><Sparkles size={18} className="sparkle text-[#FFD700]" style={{ animationDelay: '0.6s' }} /></div>
            <div className="absolute bottom-1/3 right-12"><Sparkles size={14} className="sparkle text-white" style={{ animationDelay: '1.2s' }} /></div>
            <div className="absolute -right-12 -bottom-16 text-[280px] md:text-[400px] recipe-emoji group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-1000">
              {featured.emoji}
            </div>
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={featured.status} />
                {featured.tags.slice(0, 2).map(t => (
                  <span key={t} className="glass-dark text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
              <div className="text-white max-w-lg">
                <p className="font-display-i text-sm opacity-90 mb-2">{featured.subtitle}</p>
                <h3 className="font-display text-3xl md:text-5xl font-semibold leading-tight mb-3 text-balance">
                  {featured.title}
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5"><Clock size={14} />{featured.total} min</span>
                  <span className="flex items-center gap-1.5"><Users size={14} />{featured.servings} pers.</span>
                  <span className="flex items-center gap-1.5"><Star size={14} className="fill-[#FFB627] text-[#FFB627]" />{featured.rating}.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent */}
      <section className="animate-fade-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl font-semibold">
            <span className="font-display-i text-[#6B1E3F]">Fraîchement</span> ajoutées
          </h2>
          <button onClick={() => onNavigate('library')} className="text-sm font-semibold text-[#E63946] flex items-center gap-1 hover:gap-2 transition-all">
            Tout voir <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recent.map((r, i) => (
            <RecipeCard key={r.id} recipe={r} onClick={() => onSelectRecipe(r)} index={i} />
          ))}
        </div>
      </section>

      {/* Family favorites */}
      <section className="animate-fade-up" style={{ animationDelay: '400ms' }}>
        <div className="bg-gradient-to-br from-[#6B1E3F] via-[#3C0C2A] to-[#1A0F0A] rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#E63946]/30 blur-3xl animate-float-slow" />
          <div className="absolute top-40 left-1/3 w-60 h-60 rounded-full bg-[#FFB627]/20 blur-3xl animate-float-slower" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-[#C77DFF]/20 blur-3xl drift-1" />

          {/* Magical sparkles */}
          <div className="absolute top-10 left-1/4"><Sparkles size={20} className="sparkle text-[#FFD700] glow-pulse" /></div>
          <div className="absolute top-1/3 right-12"><Sparkles size={14} className="sparkle text-[#FFB627]" style={{ animationDelay: '0.5s' }} /></div>
          <div className="absolute bottom-1/4 left-12"><Sparkles size={16} className="sparkle text-[#C77DFF]" style={{ animationDelay: '1.2s' }} /></div>
          <div className="absolute bottom-12 right-1/3"><Sparkles size={12} className="sparkle text-[#FFD700]" style={{ animationDelay: '2s' }} /></div>

          <div className="relative">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-xs font-bold tracking-widest text-[#FFB627] uppercase mb-2 flex items-center gap-2">
                  <Heart size={12} className="fill-current" /> Plébiscitées
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#FFF6EC]">
                  Les <span className="font-display-i text-[#FFB627]">chouchoutes</span> de la famille
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favorites.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} onClick={() => onSelectRecipe(r)} index={i} compact />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const LibraryScreen = ({ onSelectRecipe }) => {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const filtered = activeCategory === "Tout" ? RECIPES : RECIPES.filter(r => r.category === activeCategory);

  return (
    <div className="space-y-8 pb-24 animate-fade-up">
      <header className="relative">
        <div className="absolute -top-4 left-1/3"><Sparkles size={18} className="sparkle text-[#FFB627]" /></div>
        <div className="absolute top-12 right-12"><Sparkles size={14} className="sparkle text-[#C77DFF]" style={{ animationDelay: '0.8s' }} /></div>
        <div className="flex items-end justify-between mb-2 relative">
          <div>
            <div className="text-xs font-bold tracking-widest text-[#E63946] uppercase mb-2 flex items-center gap-2">
              <Sparkles size={10} className="sparkle" /> ✦ Encyclopédie gourmande
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight">
              <AnimatedTitle text="Toutes mes" />{' '}
              <AnimatedTitle text="merveilles" italicWord="merveilles" className="font-display-i font-semibold" />
            </h1>
            <p className="font-display-i text-lg text-[#2A1612]/60 mt-2">
              {RECIPES.length} pépites soigneusement collectées
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#1A0F0A]/10 bg-white hover:bg-[#1A0F0A]/5 transition font-semibold text-sm hover:scale-105">
            <Filter size={16} /> Filtres avancés
          </button>
        </div>
      </header>

      {/* Category pills */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
              activeCategory === cat.name
                ? 'bg-[#1A0F0A] text-[#FFF6EC] shadow-lg scale-105'
                : 'bg-[#FEF1DC] text-[#1A0F0A]/70 hover:bg-white border border-[#1A0F0A]/5 hover:scale-105'
            }`}
          >
            <span className={activeCategory === cat.name ? 'scale-125 inline-block' : 'inline-block'}>{cat.emoji}</span> {cat.name}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeCategory === cat.name ? 'bg-[#E63946]' : 'bg-[#1A0F0A]/10'}`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <Tag color="raspberry">⏱ Moins de 30 min</Tag>
        <Tag color="honey">🌱 Végétarien</Tag>
        <Tag color="mint">⭐ Favoris</Tag>
        <Tag color="wine">🍷 Pour recevoir</Tag>
        <Tag color="magic">✨ Magiques</Tag>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((r, i) => (
          <RecipeCard key={r.id} recipe={r} onClick={() => onSelectRecipe(r)} index={i} />
        ))}
      </div>
    </div>
  );
};

const RecipeDetailScreen = ({ recipe, onBack, onAddToCart, inCart }) => {
  const [portions, setPortions] = useState(recipe.servings);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [pulsing, setPulsing] = useState(false);
  const ratio = portions / recipe.servings;

  const adjustQty = (qty) => {
    const v = qty * ratio;
    return Number.isInteger(v) ? v : v.toFixed(v < 1 ? 2 : 1);
  };

  const triggerPulse = () => {
    setPulsing(true);
    setTimeout(() => setPulsing(false), 600);
  };

  const groupedIngredients = useMemo(() => {
    return recipe.ingredients.reduce((acc, ing) => {
      const g = ing.group || 'Tous';
      if (!acc[g]) acc[g] = [];
      acc[g].push(ing);
      return acc;
    }, {});
  }, [recipe]);

  return (
    <div className="pb-32 animate-fade-up">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 font-semibold text-sm hover:gap-3 transition-all">
        <ChevronLeft size={18} /> Retour à la bibliothèque
      </button>

      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${recipe.gradient} rounded-[2.5rem] p-8 md:p-12 h-80 md:h-96 overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)]`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Sparkles burst */}
        <div className="absolute top-12 right-1/2"><Sparkles size={28} className="sparkle text-white glow-pulse" /></div>
        <div className="absolute top-1/3 right-1/3"><Sparkles size={20} className="sparkle text-[#FFD700]" style={{ animationDelay: '0.5s' }} /></div>
        <div className="absolute bottom-1/3 right-12"><Sparkles size={16} className="sparkle text-white" style={{ animationDelay: '1s' }} /></div>
        <div className="absolute top-1/2 left-1/4"><Sparkles size={14} className="sparkle text-white" style={{ animationDelay: '1.5s' }} /></div>

        <div className="absolute -right-16 -bottom-20 text-[300px] md:text-[440px] recipe-emoji wobble-emoji" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}>
          {recipe.emoji}
        </div>
        <div className="relative h-full flex flex-col justify-between">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={recipe.status} />
            {recipe.tags.map(t => (
              <span key={t} className="glass-dark text-white text-[10px] font-bold px-3 py-1 rounded-full">{t}</span>
            ))}
          </div>
          <div className="text-white max-w-2xl">
            <p className="font-display-i text-base opacity-90 mb-2">{recipe.subtitle}</p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] text-balance">
              {recipe.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Meta + actions */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2 bg-[#FEF1DC] rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4"><Sparkles size={14} className="sparkle text-[#FFB627]" /></div>
          <p className="font-display-i text-lg text-[#1A0F0A]/80 leading-relaxed text-balance">
            {recipe.description}
          </p>
          <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#1A0F0A]/10">
            <div className="group">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A0F0A]/50 mb-1">Prépa</div>
              <div className="font-display text-2xl font-semibold group-hover:scale-110 transition origin-left">{recipe.prep}<span className="text-sm font-normal text-[#1A0F0A]/60"> min</span></div>
            </div>
            <div className="group">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A0F0A]/50 mb-1">Cuisson</div>
              <div className="font-display text-2xl font-semibold group-hover:scale-110 transition origin-left">{recipe.cook}<span className="text-sm font-normal text-[#1A0F0A]/60"> min</span></div>
            </div>
            <div className="group">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A0F0A]/50 mb-1">Difficulté</div>
              <div className="font-display text-2xl font-semibold text-[#E63946] group-hover:scale-110 transition origin-left">{'●'.repeat(recipe.difficulty)}<span className="text-[#1A0F0A]/20">{'●'.repeat(5-recipe.difficulty)}</span></div>
            </div>
            <div className="group">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A0F0A]/50 mb-1">Note</div>
              <div className="font-display text-2xl font-semibold flex items-center gap-1 group-hover:scale-110 transition origin-left">
                <Star size={20} className="fill-[#FFB627] text-[#FFB627]" />{recipe.rating}.0
              </div>
            </div>
          </div>
        </div>

        {/* Portions adjuster */}
        <div className="bg-gradient-to-br from-[#1A0F0A] to-[#3C0C2A] rounded-3xl p-6 md:p-8 text-[#FFF6EC] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#E63946]/30 blur-2xl animate-float-slow" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#C77DFF]/20 blur-2xl animate-float-slower" />
          <div className="absolute top-4 right-6"><Sparkles size={16} className="sparkle text-[#FFD700]" /></div>
          <div className="absolute bottom-12 right-4"><Sparkles size={12} className="sparkle text-[#FFB627]" style={{ animationDelay: '1s' }} /></div>

          <div className="relative">
            <div className="text-xs font-bold uppercase tracking-widest text-[#FFB627] mb-3 flex items-center gap-2">
              <Users size={14} /> Portions
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setPortions(Math.max(1, portions - 1)); triggerPulse(); }}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 flex items-center justify-center transition"
              >
                <Minus size={18} />
              </button>
              <div className="flex-1 text-center">
                <div className={`font-display text-5xl font-semibold transition ${pulsing ? 'scale-125' : ''}`}>{portions}</div>
                <div className="text-xs text-[#FFF6EC]/60 mt-1">personnes</div>
              </div>
              <button
                onClick={() => { setPortions(portions + 1); triggerPulse(); }}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 flex items-center justify-center transition"
              >
                <Plus size={18} />
              </button>
            </div>
            <button
              onClick={() => onAddToCart(recipe.id, portions)}
              className={`btn-primary mt-6 w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 ${inCart ? 'opacity-90' : ''} ${!inCart ? 'pulse-glow' : ''}`}
            >
              {inCart ? <><Check size={18} /> Dans le panier ✨</> : <><ShoppingBasket size={18} /> Ajouter au panier</>}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-[#1A0F0A]/10">
        {['ingredients', 'steps', 'notes'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-5 py-3 font-semibold text-sm relative transition ${activeTab === t ? 'text-[#E63946]' : 'text-[#1A0F0A]/50 hover:text-[#1A0F0A]'}`}
          >
            {t === 'ingredients' ? 'Ingrédients' : t === 'steps' ? 'Étapes' : 'Notes & Astuces'}
            {activeTab === t && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E63946] via-[#FFB627] to-[#E63946]" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'ingredients' && (
          <div className="grid md:grid-cols-2 gap-6 scale-in">
            {Object.entries(groupedIngredients).map(([group, items], gi) => (
              <div key={group} className="bg-[#FEF1DC] rounded-3xl p-6 hover:shadow-xl hover:shadow-[#E63946]/10 transition-all duration-500 animate-fade-up" style={{ animationDelay: `${gi * 100}ms` }}>
                <div className="font-display-i text-[#E63946] font-semibold mb-4 text-lg flex items-center gap-2">
                  Pour {group.toLowerCase()}
                  <Sparkles size={12} className="sparkle text-[#FFB627]" />
                </div>
                <ul className="space-y-3">
                  {items.map((ing, i) => (
                    <li key={i} className="flex items-baseline gap-3 pb-3 border-b border-[#1A0F0A]/5 last:border-0 hover:translate-x-1 transition">
                      <span className="font-display text-xl font-semibold text-[#1A0F0A] tabular-nums">
                        {adjustQty(ing.qty)}
                      </span>
                      <span className="text-sm text-[#1A0F0A]/60 font-medium">{ing.unit}</span>
                      <span className="flex-1 text-[#1A0F0A]">{ing.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-4 max-w-3xl scale-in">
            {recipe.steps.map((step, i) => (
              <div key={i} className="flex gap-5 p-6 bg-[#FEF1DC] rounded-3xl hover:bg-white transition group animate-fade-up hover:shadow-xl hover:shadow-[#E63946]/10" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex-shrink-0">
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#B81E37] flex items-center justify-center text-white font-display font-bold text-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition">
                    {i + 1}
                    <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition">
                      <Sparkles size={10} className="sparkle text-[#FFD700]" />
                    </div>
                  </div>
                </div>
                <p className="text-[#1A0F0A] leading-relaxed pt-2">{step}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4 max-w-3xl scale-in">
            <div className="bg-gradient-to-br from-[#FFB627]/10 to-[#EF8B30]/10 border border-[#FFB627]/30 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4"><Sparkles size={16} className="sparkle text-[#FFB627]" /></div>
              <div className="font-display-i text-[#8B5A0E] font-semibold mb-2 flex items-center gap-2">
                <Wand2 size={16} /> Astuce du chef
              </div>
              <p className="text-[#1A0F0A]/80 leading-relaxed">
                Pour une texture encore plus aérienne, séparer le mélange en deux : incorporer d'abord un tiers des blancs énergiquement pour détendre, puis le reste à la maryse, mouvements enveloppants.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#B8D4A3]/20 to-[#DDE8B8]/20 border border-[#B8D4A3]/30 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4"><Sparkles size={14} className="sparkle text-[#3A5A2F]" /></div>
              <div className="font-display-i text-[#3A5A2F] font-semibold mb-2 flex items-center gap-2">
                <Users size={16} /> Avis de la famille
              </div>
              <p className="text-[#1A0F0A]/80 leading-relaxed italic">
                "La meilleure que Mamie ait jamais faite. À refaire pour les anniversaires." — Papa, juin 2024
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CartScreen = ({ cartIds, cartPortions, onRemove, onPortionChange, onGenerate, onSelectRecipe }) => {
  const items = cartIds.map(id => RECIPES.find(r => r.id === id));
  const totalServings = cartIds.reduce((sum, id) => sum + (cartPortions[id] || 4), 0);
  const totalTime = items.reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="space-y-6 pb-24 animate-fade-up">
      <header className="relative">
        <div className="absolute -top-2 left-1/4"><Sparkles size={18} className="sparkle text-[#FFB627]" /></div>
        <div className="absolute top-8 right-12"><Sparkles size={14} className="sparkle text-[#E63946]" style={{ animationDelay: '0.6s' }} /></div>
        <div className="text-xs font-bold tracking-widest text-[#E63946] uppercase mb-2 flex items-center gap-2">
          <Sparkles size={10} className="sparkle" /> ✦ Sélection en cours
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-light">
          <AnimatedTitle text="Mon" />{' '}
          <AnimatedTitle text="chaudron" italicWord="chaudron" className="font-display-i font-semibold gradient-text" />{' '}
          <AnimatedTitle text="gourmand" />
        </h1>
        <p className="font-display-i text-[#1A0F0A]/60 mt-2">
          {items.length} merveilles • {totalServings} portions • {Math.round(totalTime/60)}h de cuisine
        </p>
      </header>

      {items.length === 0 ? (
        <div className="bg-[#FEF1DC] rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4"><Sparkles size={18} className="sparkle text-[#FFB627]" /></div>
          <div className="absolute bottom-1/4 right-1/4"><Sparkles size={14} className="sparkle text-[#E63946]" style={{ animationDelay: '0.5s' }} /></div>
          <div className="text-7xl mb-4 recipe-emoji wobble-emoji">🧺</div>
          <p className="font-display-i text-xl text-[#1A0F0A]/60">Ton chaudron est vide pour l'instant</p>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((r, i) => (
                <div key={r.id} className="bg-[#FEF1DC] rounded-3xl p-4 flex gap-4 group hover:bg-white transition-all hover:shadow-xl hover:shadow-[#E63946]/10 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div onClick={() => onSelectRecipe(r)} className={`cursor-pointer relative bg-gradient-to-br ${r.gradient} w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0`}>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"><Sparkles size={10} className="sparkle text-white" /></div>
                    <div className="absolute -right-2 -bottom-3 text-7xl recipe-emoji group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500">{r.emoji}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg font-semibold leading-tight truncate group-hover:text-[#E63946] transition">{r.title}</div>
                    <div className="font-display-i text-xs text-[#6B1E3F]/70 mt-0.5">{r.category}</div>
                    <div className="flex items-center gap-3 mt-3 text-xs text-[#1A0F0A]/60">
                      <span className="flex items-center gap-1"><Clock size={12} />{r.total}min</span>
                      <span className="flex items-center gap-1"><Flame size={12} />{'•'.repeat(r.difficulty)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-white rounded-full px-1 py-1">
                        <button onClick={() => onPortionChange(r.id, Math.max(1, (cartPortions[r.id] || 4) - 1))} className="w-7 h-7 rounded-full bg-[#1A0F0A]/5 hover:bg-[#1A0F0A]/10 hover:scale-110 flex items-center justify-center transition">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold tabular-nums min-w-[24px] text-center">{cartPortions[r.id] || 4}</span>
                        <button onClick={() => onPortionChange(r.id, (cartPortions[r.id] || 4) + 1)} className="w-7 h-7 rounded-full bg-[#1A0F0A]/5 hover:bg-[#1A0F0A]/10 hover:scale-110 flex items-center justify-center transition">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-xs text-[#1A0F0A]/50">portions</span>
                    </div>
                  </div>
                  <button onClick={() => onRemove(r.id)} className="self-start w-9 h-9 rounded-full hover:bg-[#E63946]/10 hover:scale-110 flex items-center justify-center transition text-[#1A0F0A]/40 hover:text-[#E63946]">
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary card */}
            <div className="lg:sticky lg:top-4 self-start">
              <div className="bg-gradient-to-br from-[#1A0F0A] via-[#3C0C2A] to-[#6B1E3F] rounded-3xl p-7 text-[#FFF6EC] relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#FFB627]/20 blur-3xl animate-float-slow" />
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#E63946]/30 blur-3xl animate-float-slower" />
                <div className="absolute top-1/2 right-0 w-32 h-32 rounded-full bg-[#C77DFF]/30 blur-3xl drift-2" />
                <div className="absolute top-6 right-8"><Sparkles size={18} className="sparkle text-[#FFD700] glow-pulse" /></div>
                <div className="absolute bottom-1/3 left-6"><Sparkles size={12} className="sparkle text-[#FFB627]" style={{ animationDelay: '1s' }} /></div>
                <div className="relative">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#FFB627] mb-3 flex items-center gap-2">
                    <Wand2 size={12} /> Récapitulatif magique
                  </div>
                  <h3 className="font-display text-3xl font-semibold leading-tight mb-6">
                    Prête pour <span className="font-display-i">les courses</span> ?
                  </h3>
                  <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                    <div className="flex justify-between"><span className="opacity-70">Recettes</span><span className="font-semibold">{items.length}</span></div>
                    <div className="flex justify-between"><span className="opacity-70">Portions totales</span><span className="font-semibold">{totalServings}</span></div>
                    <div className="flex justify-between"><span className="opacity-70">Ingrédients uniques</span><span className="font-semibold">~28</span></div>
                    <div className="flex justify-between"><span className="opacity-70">Temps cuisine</span><span className="font-semibold">{Math.round(totalTime/60)}h{totalTime%60}min</span></div>
                  </div>
                  <button onClick={onGenerate} className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFB627] to-[#FF7A66] hover:from-[#FFA200] hover:to-[#E63946] text-[#1A0F0A] font-bold flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:shadow-[#FFB627]/50 hover:scale-[1.02] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Wand2 size={18} /> Générer ma liste magique
                  </button>
                  <button className="mt-3 w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-[#FFF6EC] font-semibold flex items-center justify-center gap-2 text-sm transition hover:scale-[1.02]">
                    <Calendar size={16} /> Sauvegarder comme menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ShoppingScreen = ({ cartIds, cartPortions, onBack }) => {
  const shoppingList = useMemo(() => {
    const merged = {};
    cartIds.forEach(id => {
      const r = RECIPES.find(x => x.id === id);
      const ratio = (cartPortions[id] || r.servings) / r.servings;
      r.ingredients.forEach(ing => {
        const key = `${ing.name}|${ing.unit}`;
        if (!merged[key]) {
          merged[key] = { ...ing, qty: 0, recipes: [] };
        }
        merged[key].qty += ing.qty * ratio;
        merged[key].recipes.push(r.title);
      });
    });
    const byAisle = {};
    Object.values(merged).forEach(item => {
      if (!byAisle[item.aisle]) byAisle[item.aisle] = [];
      byAisle[item.aisle].push(item);
    });
    return byAisle;
  }, [cartIds, cartPortions]);

  const aisleConfig = {
    'F&L': { emoji: '🥬', label: 'Fruits & Légumes', color: 'from-[#B8D4A3] to-[#DDE8B8]', text: '#3A5A2F' },
    'Frais': { emoji: '🧀', label: 'Frais & Crémerie', color: 'from-[#FFCBA4] to-[#FEF1DC]', text: '#8B5A0E' },
    'Boucherie': { emoji: '🥩', label: 'Boucherie', color: 'from-[#E63946] to-[#FF7A66]', text: '#B81E37' },
    'Épicerie': { emoji: '🥫', label: 'Épicerie', color: 'from-[#FFB627] to-[#EF8B30]', text: '#8B5A0E' },
    'Caves': { emoji: '🍷', label: 'Caves & Spiritueux', color: 'from-[#6B1E3F] to-[#3C0C2A]', text: '#FFF6EC' },
  };

  const [checked, setChecked] = useState({});
  const [shaking, setShaking] = useState(null);
  const toggle = (key) => {
    setChecked(c => ({ ...c, [key]: !c[key] }));
    setShaking(key);
    setTimeout(() => setShaking(null), 500);
  };
  const totalItems = Object.values(shoppingList).flat().length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <div className="space-y-8 pb-24 animate-fade-up">
      <button onClick={onBack} className="flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all">
        <ChevronLeft size={18} /> Retour au chaudron
      </button>

      <header className="bg-gradient-to-br from-[#FEF1DC] via-[#FBE9D0] to-[#FFCBA4] rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#FFB627]/40 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-32 -left-20 w-60 h-60 rounded-full bg-[#E63946]/30 blur-3xl animate-float-slower" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-[#C77DFF]/20 blur-3xl drift-1" />

        <div className="absolute top-10 right-10"><Sparkles size={22} className="sparkle text-[#FFD700] glow-pulse" /></div>
        <div className="absolute top-1/2 left-12"><Sparkles size={16} className="sparkle text-[#E63946]" style={{ animationDelay: '0.7s' }} /></div>
        <div className="absolute bottom-12 right-1/3"><Sparkles size={14} className="sparkle text-[#C77DFF]" style={{ animationDelay: '1.3s' }} /></div>

        <div className="relative grid md:grid-cols-2 gap-6 items-end">
          <div>
            <div className="text-xs font-bold tracking-widest text-[#E63946] uppercase mb-2 flex items-center gap-2">
              <Wand2 size={12} /> ✦ Liste enchantée
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light leading-tight">
              <AnimatedTitle text="Cap" italicWord="cap" className="font-display-i font-semibold gradient-text" />{' '}
              <AnimatedTitle text="sur le supermarché 🛒" />
            </h1>
            <p className="font-display-i text-[#1A0F0A]/70 mt-3">
              {totalItems} ingrédients, organisés par rayon. Les identiques sont automatiquement fusionnés ✨
            </p>
            <div className="flex gap-2 mt-5">
              <button className="px-4 py-2.5 bg-[#1A0F0A] text-[#FFF6EC] rounded-2xl font-semibold text-sm flex items-center gap-2 hover:bg-[#3C0C2A] hover:scale-105 transition">
                <Printer size={14} /> Imprimer
              </button>
              <button className="px-4 py-2.5 bg-white/80 backdrop-blur rounded-2xl font-semibold text-sm flex items-center gap-2 hover:bg-white hover:scale-105 transition">
                <Share2 size={14} /> Partager
              </button>
            </div>
          </div>
          <div>
            <div className="bg-white/70 backdrop-blur rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-2 right-3"><Sparkles size={12} className="sparkle text-[#FFB627]" /></div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1A0F0A]/60">Progression</span>
                <span className="font-display text-2xl font-semibold">{checkedCount}<span className="text-base text-[#1A0F0A]/50">/{totalItems}</span></span>
              </div>
              <div className="h-3 bg-[#1A0F0A]/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#E63946] via-[#FFB627] to-[#B8D4A3] rounded-full transition-all duration-700 progress-glow" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 font-display-i text-sm text-[#1A0F0A]/60">
                {progress === 100 ? '🎉 Toutes les courses sont faites !' : `${Math.round(progress)}% des courses fait`}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-5">
        {Object.entries(shoppingList).map(([aisle, items], aisleIdx) => {
          const cfg = aisleConfig[aisle] || aisleConfig['Épicerie'];
          return (
            <div key={aisle} className="bg-[#FEF1DC] rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 animate-fade-up" style={{ animationDelay: `${aisleIdx * 100}ms` }}>
              <div className={`bg-gradient-to-r ${cfg.color} p-5 flex items-center gap-3 relative overflow-hidden`}>
                <div className="absolute top-2 right-4"><Sparkles size={12} className="sparkle text-white" /></div>
                <span className="text-3xl bounce-soft">{cfg.emoji}</span>
                <div>
                  <div className="font-display text-xl font-semibold" style={{ color: cfg.text }}>{cfg.label}</div>
                  <div className="text-xs font-semibold opacity-70" style={{ color: cfg.text }}>{items.length} articles</div>
                </div>
              </div>
              <ul className="p-3">
                {items.map((item, i) => {
                  const key = `${item.name}|${item.unit}`;
                  const isChecked = checked[key];
                  const isShaking = shaking === key;
                  const qtyDisplay = Number.isInteger(item.qty) ? item.qty : item.qty.toFixed(item.qty < 1 ? 2 : 1);
                  return (
                    <li
                      key={i}
                      onClick={() => toggle(key)}
                      className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${isChecked ? 'opacity-40' : 'hover:bg-white hover:scale-[1.02]'} ${isShaking ? 'shake-x' : ''}`}
                    >
                      <div className={`relative w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${isChecked ? 'bg-[#E63946] border-[#E63946] scale-110' : 'border-[#1A0F0A]/30 bg-white'}`}>
                        {isChecked && <Check size={14} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${isChecked ? 'line-through' : ''}`}>{item.name}</div>
                        {item.recipes.length > 1 && (
                          <div className="text-[10px] text-[#1A0F0A]/40 mt-0.5 flex items-center gap-1">
                            <Sparkles size={8} /> Fusionné pour {item.recipes.length} recettes
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-display text-lg font-semibold tabular-nums">{qtyDisplay}</span>
                        <span className="text-xs text-[#1A0F0A]/50 ml-1">{item.unit}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============== MAIN APP ==============

export default function TambouilleApp() {
  const [screen, setScreen] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [cartIds, setCartIds] = useState([1, 4, 6]);
  const [cartPortions, setCartPortions] = useState({ 1: 6, 4: 6, 6: 2 });
  const confetti = useConfetti();
  const cursorRef = useRef(null);

  // Magic cursor trail
  useEffect(() => {
    let lastTrail = 0;
    const colors = ['#FFD700', '#FFB627', '#E63946', '#C77DFF', '#FF7A66'];
    const handleMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX - 4}px`;
        cursorRef.current.style.top = `${e.clientY - 4}px`;
        cursorRef.current.style.opacity = '1';
      }
      // Spawn trail particles
      const now = Date.now();
      if (now - lastTrail > 50) {
        lastTrail = now;
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.style.left = `${e.clientX - 3 + (Math.random() - 0.5) * 8}px`;
        particle.style.top = `${e.clientY - 3 + (Math.random() - 0.5) * 8}px`;
        particle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleSelectRecipe = (r) => {
    setSelectedRecipe(r);
    setScreen('recipe');
  };

  const handleAddToCart = (id, portions, e) => {
    const wasInCart = cartIds.includes(id);
    if (!wasInCart) {
      setCartIds([...cartIds, id]);
      // Confetti at center of viewport
      confetti.trigger(window.innerWidth / 2, window.innerHeight / 2, ['🎉', '✨', '🍒', '⭐', '💫', '🌟']);
    }
    setCartPortions({ ...cartPortions, [id]: portions });
  };

  const handleRemoveFromCart = (id) => {
    setCartIds(cartIds.filter(x => x !== id));
    const newP = { ...cartPortions };
    delete newP[id];
    setCartPortions(newP);
  };

  const handlePortionChange = (id, p) => {
    setCartPortions({ ...cartPortions, [id]: p });
  };

  const handleGenerateShopping = () => {
    confetti.trigger(window.innerWidth / 2, window.innerHeight / 2, ['🛒', '✨', '💫', '🌟', '⭐']);
    setScreen('shopping');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-root min-h-screen relative overflow-x-hidden">
        {/* Magic cursor */}
        <div ref={cursorRef} className="magic-cursor glow-pulse" />

        {/* Floating gold dust */}
        <FloatingDust count={20} />

        {/* Decorative background blobs */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FFCBA4]/30 to-[#E63946]/15 blur-3xl pointer-events-none animate-float-slow" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#B8D4A3]/25 to-[#FFB627]/20 blur-3xl pointer-events-none animate-float-slower" />
        <div className="fixed top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#C77DFF]/15 to-[#FF7A66]/10 blur-3xl pointer-events-none drift-3" />

        {/* Confetti renderer */}
        {confetti.render()}

        {/* Top nav */}
        <header className="sticky top-0 z-40 glass border-b border-[#1A0F0A]/5">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
            <Logo onClick={() => setScreen('home')} />
            <div className="hidden md:flex items-center gap-1 ml-6 flex-1">
              <NavButton icon={<Home size={16} />} label="Accueil" active={screen === 'home'} onClick={() => setScreen('home')} />
              <NavButton icon={<BookOpen size={16} />} label="Bibliothèque" active={screen === 'library'} onClick={() => setScreen('library')} />
              <NavButton icon={<Calendar size={16} />} label="Menus" active={false} onClick={() => {}} />
              <NavButton icon={<TrendingUp size={16} />} label="Stats" active={false} onClick={() => {}} />
            </div>
            <button
              onClick={() => setScreen('cart')}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[#1A0F0A] text-[#FFF6EC] rounded-2xl font-semibold text-sm hover:bg-[#3C0C2A] hover:scale-105 transition shadow-lg shadow-black/20 relative"
            >
              <ShoppingBasket size={16} />
              <span className="hidden sm:inline">Chaudron</span>
              {cartIds.length > 0 && (
                <span className="bg-[#E63946] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pop-in pulse-glow">
                  {cartIds.length}
                </span>
              )}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6B1E3F] to-[#3C0C2A] flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-110 hover:rotate-6 transition relative">
              K
              <div className="absolute -top-1 -right-1"><Sparkles size={10} className="sparkle text-[#FFD700]" /></div>
            </div>
          </div>
          {/* Mobile nav */}
          <div className="md:hidden flex gap-1 px-4 pb-3 overflow-x-auto scrollbar-hide">
            <NavButton icon={<Home size={16} />} label="Accueil" active={screen === 'home'} onClick={() => setScreen('home')} />
            <NavButton icon={<BookOpen size={16} />} label="Recettes" active={screen === 'library'} onClick={() => setScreen('library')} />
            <NavButton icon={<Calendar size={16} />} label="Menus" active={false} onClick={() => {}} />
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 relative z-10">
          {screen === 'home' && <HomeScreen onSelectRecipe={handleSelectRecipe} onNavigate={setScreen} />}
          {screen === 'library' && <LibraryScreen onSelectRecipe={handleSelectRecipe} />}
          {screen === 'recipe' && selectedRecipe && (
            <RecipeDetailScreen
              recipe={selectedRecipe}
              onBack={() => setScreen('library')}
              onAddToCart={handleAddToCart}
              inCart={cartIds.includes(selectedRecipe.id)}
            />
          )}
          {screen === 'cart' && (
            <CartScreen
              cartIds={cartIds}
              cartPortions={cartPortions}
              onRemove={handleRemoveFromCart}
              onPortionChange={handlePortionChange}
              onGenerate={handleGenerateShopping}
              onSelectRecipe={handleSelectRecipe}
            />
          )}
          {screen === 'shopping' && (
            <ShoppingScreen
              cartIds={cartIds}
              cartPortions={cartPortions}
              onBack={() => setScreen('cart')}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-center relative">
          <div className="font-display-i text-sm text-[#1A0F0A]/40 flex items-center justify-center gap-2">
            <Sparkles size={12} className="sparkle text-[#FFB627]" />
            🍲 Tambouille · Mockup interactif · La cuisine qui pétille
            <Sparkles size={12} className="sparkle text-[#E63946]" style={{ animationDelay: '1s' }} />
          </div>
        </footer>
      </div>
    </>
  );
}
