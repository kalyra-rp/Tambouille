# 🍲 Tambouille — Spécifications du projet

> **À lire en premier par Claude Code.** Vision complète, architecture, fonctionnalités et design system de l'application Tambouille. Référence pour toute la génération de code. Le design a été consolidé à partir de deux mockups : la **direction visuelle pop/fun** est désormais la référence officielle (voir §7).

---

## 1. Vision

**Tambouille** est une application web personnelle et familiale de gestion de recettes — une « encyclopédie gourmande » qui pétille. Elle permet de :

- Cataloguer toutes ses recettes (trouvées sur internet, à tester, validées en famille).
- Les organiser par catégories riches (de l'entrée au dessert en passant par les boissons et les idées de menus).
- Ajuster les portions et recalculer automatiquement les quantités.
- Ajouter des recettes à un « **chaudron** » (panier) pour générer une **liste de courses fusionnée** et organisée par rayon.
- Composer et sauvegarder des menus complets.
- À terme : importer une recette automatiquement depuis une URL.

**Utilisateur principal :** usage perso + famille (quelques comptes max, pas une plateforme grand public).

---

## 2. Personnalité & ton

Tambouille a une **vraie voix** : drôle, complice, gourmande, un brin magique et impertinente. C'est ce qui la rend mémorable. À conserver dans tous les textes d'interface.

**Direction de ton :** « la sorcellerie, mais avec du bacon ». Des micro-textes joueurs plutôt que corporate.

Exemples du registre à garder (réutilisables / à décliner) :
- Hero : « Qu'est-ce qu'on mijote aujourd'hui ? »
- Sous-titre : « Explore tes recettes, prépare tes menus et transforme tes envies en liste de courses en quelques clics. »
- Collections : « Des raccourcis pour cuisiner sans partir en expédition dans le Mordor du frigo. »
- Soir de semaine : « Rapide, gourmand, pas de crise existentielle. »
- Courses : « Fusion automatique + classement par rayon. Le chaos part faire un tour. »
- États vides, boutons, confirmations : toujours une pointe d'humour gourmand.

> ⚠️ Garder l'humour **léger et inclusif**, jamais au détriment de la clarté : un bouton doit rester compréhensible au premier coup d'œil.

---

## 3. Stack technique

| Couche | Techno | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | TypeScript, déjà initialisé |
| Styling | **Tailwind CSS v4** | palette en variables CSS + `@theme inline` |
| Icônes | **lucide-react** | + emojis food en décoration |
| Base de données | **Supabase** (PostgreSQL) | voir `schema.sql` |
| Auth | **Supabase Auth** | login email famille |
| Stockage photos | **Supabase Storage** | bucket `recipe-photos` |
| Déploiement | **Vercel** | déploiement auto depuis GitHub |
| Polices | voir §7 (Typographie) | déjà câblées via `next/font` |
| Import URL (phase 3) | **API Anthropic (Claude)** | extraction structurée depuis une page web |

---

## 4. Architecture des catégories

Hiérarchie à 2 niveaux (catégorie parente → sous-catégorie). Stockée dans `categories` (auto-référente via `parent_id`).

```
🥐 PETIT-DÉJEUNER & BRUNCH
   Viennoiseries · Pancakes/gaufres/crêpes · Œufs · Bowls · Pains perdus · Brunch salé

🥗 ENTRÉES & APÉRITIFS
   Soupes & veloutés · Salades composées · Salades simples · Tapas · Tartines/toasts
   Verrines · Charcuterie & planches · Œufs en entrée · Quiches/tartes salées · Bouchées chaudes

🍖 PLATS PRINCIPAUX
   Viandes (Bœuf, Veau, Porc, Agneau, Volaille, Gibier, Abats)
   Poissons & fruits de mer (Poissons blancs, gras, Crustacés, Coquillages, Céphalopodes)
   Végétarien · Vegan · Pâtes · Riz & risottos · Légumineuses · Gratins & lasagnes
   Pizzas · Burgers & sandwichs chauds · Mijotés · Au four · Wok & sautés · Grillades/BBQ
   Plats du monde (Italie, Asie, Inde, Maghreb/Moyen-Orient, Mexique, Amérique du Sud, Europe du Nord, Afrique)

🥘 ACCOMPAGNEMENTS
   Légumes · Purées · Gratins de légumes · Féculents · Salades d'accompagnement · Pains

🧀 FROMAGES
   Plateaux · Recettes au fromage fondu · Préparations maison

🍰 DESSERTS
   Gâteaux · Tartes & tartelettes · Entremets & mousses · Verrines sucrées · Crèmes & flans
   Glaces/sorbets · Biscuits & petits fours · Chocolat · Confiseries · Fruits
   Desserts à la cuillère · Pâtisserie française · Pâtisserie du monde · Desserts express

🍞 BOULANGERIE & PÂTES
   Pains · Brioches · Pâtes maison · Pâte brisée/sablée/sucrée · Feuilletée · Pizza · Choux

🥫 BASES & FONDAMENTAUX
   Sauces froides · Sauces chaudes · Sauces du monde · Bouillons & fonds · Marinades
   Condiments maison · Beurres composés · Épices & mélanges maison

🥒 CONSERVES & FERMENTATIONS
   Confitures & gelées · Pickles & lacto-fermentés · Conserves salées · Sirops · Liqueurs

🍹 BOISSONS
   Cocktails avec alcool · Mocktails · Vins chauds & punchs · Smoothies & milkshakes
   Jus pressés · Limonades & sodas maison · Thés glacés · Boissons chaudes · Cafés · Fermentées

📅 MENUS & OCCASIONS
   Menus quotidiens (rapide semaine, équilibré, enfants) · Week-end
   Fêtes (Noël, Nouvel An, Pâques, Halloween, St-Valentin, Fête des mères/pères, Anniversaires)
   Brunchs & goûters · Apéros dînatoires · Buffets froids · Pique-niques · BBQ
   Repas de famille · Dîners romantiques · Meal prep
```

**Tags transversaux** (table `tags`, car cumulables sur une recette) :
```
🎯 RÉGIMES : Végétarien · Vegan · Sans gluten · Sans lactose · Sans œuf · Sans noix
            IG bas · Faible sodium · Keto/low carb · Méditerranéen · Anti-inflammatoire · Hyperprotéiné · Healthy
🍱 FORMATS : Batch cooking · Lunchbox · Anti-gaspi · 1 ingrédient star · < 5 ingrédients · < 30 min
            One-pot/one-pan · Au robot · Air fryer · À cuisiner avec les enfants
```

---

## 5. Modèle de données (détail complet dans `schema.sql`)

- **recipes** — la recette (titre, description, temps, difficulté, portions, statut, note, source, photo…).
- **ingredients** — référentiel global (nom, rayon, unité par défaut, allergènes, saisonnalité).
- **recipe_ingredients** — liaison recette ↔ ingrédient (quantité, unité, groupe, optionnel).
- **recipe_steps** — étapes numérotées.
- **categories** — arborescence hiérarchique auto-référente.
- **tags** + **recipe_tags** — tags transversaux.
- **menus** + **menu_recipes** — menus composés (recettes + rôle).
- **carts** + **cart_items** — le chaudron (sélection + portions désirées).
- **shopping_lists** + **shopping_list_items** — listes générées (ingrédients fusionnés, état coché).
- **pantry_items** — garde-manger.
- **meal_plan** — planning hebdomadaire.

Statuts d'une recette : `totry` (à tester), `tested` (testée), `favorite` (favorite / chouchou famille), `archived`.

---

## 6. Fonctionnalités (par ordre de priorité)

### MVP (phase 1)
1. **Accueil** : hero + chaudron du jour + collections + aperçu recettes/chaudron/courses (voir layout §7).
2. **Bibliothèque (Recettes)** : grille de cartes avec photo, filtres par catégorie/tag (chips), recherche, statuts.
3. **Fiche recette** : lecture complète, onglets Ingrédients / Étapes / Notes, **ajusteur de portions** qui recalcule les quantités en live.
4. **Création / édition** d'une recette (formulaire riche : ingrédients groupés, étapes, photo, tags, statut).
5. **Chaudron (panier)** : ajout de recettes avec choix des portions.
6. **Courses (liste)** : génération depuis le chaudron, **fusion des ingrédients identiques** (même nom + même unité → quantités additionnées), **regroupement par rayon**, items cochables.

### Phase 2
7. **Menus** : composer (entrée + plat + dessert + boisson), sauvegarder, réutiliser, ajouter tout un menu au chaudron.
8. **Auth famille** : plusieurs comptes, notes/avis par membre (« Chouchous »).
9. **Upload photos** vers Supabase Storage.
10. **Garde-manger** : stock maison.

### Phase 3
11. **Import URL** via API Claude : coller un lien → extraction structurée → preview → valider.
12. **Filtre « que cuisiner avec ce que j'ai ? »** (croisement garde-manger).
13. **Planning des repas** (calendrier hebdo).
14. **Stats** (recette la plus cuisinée, catégorie favorite…).

---

## 7. Design system « Tambouille » — DIRECTION POP / FUN 🎨

> Ambiance officielle : **pop, fun, animée, très colorée, pétillante et sexy**. Assumée, joyeuse, gourmande. Pas de sobriété timide — on ose la couleur et le mouvement.

### Layout (référence)
- **Navigation principale en SIDEBAR verticale** à gauche (sticky), pas en barre du haut.
  - Sections : 🏠 Accueil · 📚 Recettes · 🍲 Chaudron · 🛒 Courses · 🎉 Menus · ❤️ Chouchous · 🧂 Garde-manger.
  - En bas de la sidebar : une **carte d'action gradient** (« X recettes dans le chaudron → Générer ✨ »).
- Sur **mobile** (< 1180px) : sidebar masquée, remplacée par une **top-bar** avec logo + bouton menu.
- Contenu en cartes arrondies « glassmorphism » sur fond chaud dégradé.
- **Accueil** = hero large + panneau « chaudron du jour » + bande de collections + grille recettes à gauche / pile Chaudron+Courses à droite (montre le flow signature d'un coup d'œil).

### Photos
- Les recettes affichent de **vraies photos** (pas seulement des emojis). Pour les mockups : Unsplash. Pour la vraie app : upload utilisateur → Supabase Storage (`recipe-photos`).
- Conserver des **emojis food en décoration** (flottants dans le hero, badges, accents) pour le côté fun.

### Palette (variables CSS) — tons pop & gourmands
```css
--cream:      #FFF3DF;   /* fond chaud clair */
--cream-2:    #FFE8BF;
--vanilla:    #FFF9EF;   /* fonds de cartes internes */
--cherry:     #E92655;   /* rouge cerise punchy */
--dark-rose:  #9B123F;
--wine-rose:  #5A0828;   /* fonds très sombres / hero overlay */
--raspberry:  #FF5C8A;   /* rose framboise */
--hot-pink:   #FF2F7D;   /* rose vif signature */
--orange:     #FF7A2F;   /* orange pop */
--butter:     #FFD447;   /* jaune beurre / doré */
--mint:       #69D8A6;   /* vert frais (validé / succès) */
--basil:      #15996B;
--chocolate:  #3D1F19;   /* texte principal */
--cocoa:      #6F3D30;   /* texte secondaire */
--gold:       #FFD447;   /* étincelles */
```
Dégradés signature (boutons, logo, cartes d'accent) :
`linear-gradient(135deg, butter → orange → hot-pink → wine-rose)` avec animation de position (gradientPulse).

### Typographie
- **Titres / display : Baloo 2** (rond, joueur, bubble) — pour les gros titres, le logo, les headers de section.
- **Corps : Inter** (lisible, moderne) — pour le texte courant, métadonnées, boutons.
- Titres en poids très gras (700-800), letter-spacing serré sur les très gros titres.

### Identité visuelle
- Logo : bulle gradient avec **🍲** qui **wiggle** (rotation douce) + nom **Tambouille** sur 1-2 lignes + tagline (« la cuisine qui pétille » / « Pop Kitchen »).
- Vocabulaire produit : panier = **Chaudron** · liste de courses = **Courses magiques** · favoris = **Chouchous**.
- Coins **très arrondis** (border-radius 18-42px selon l'élément).
- Boutons **pill** (entièrement arrondis) avec effet de **brillance qui balaie** au survol (shine).
- Chips de filtre colorés (hot/mint/butter…).

### Animations (signature pop & magique)
Le mouvement fait partie de l'ADN. À implémenter proprement (CSS d'abord ; Framer Motion possible pour les interactions complexes) :
- **Fond vivant** : motif à pois sucré qui dérive (sugarDrift) + halos colorés type lava-lamp en fond flouté.
- **Emojis flottants** dans le hero (floaty : translation + rotation douce).
- **Cartes** : léger lift + rotation au survol, ombres colorées qui s'intensifient.
- **Boutons** : shine qui balaie + lift au survol.
- **Logo** : wiggle + gradient animé.
- **Étincelles ✦✧** scintillantes (sparkleDance) disséminées sur le hero et les zones clés.
- **Cartes flottantes** (cardFloat) pour le panneau hero.
- **Confettis d'emojis** 🎉✨🍒 à l'ajout au chaudron et à la génération de liste.
- **(Bonus)** curseur à traînée de particules dorées + titres révélés lettre par lettre (issus du 1er mockup, à reprendre si perf OK).
- **Toujours respecter `prefers-reduced-motion`** : couper les animations pour les utilisateurs qui le demandent (déjà présent dans le mockup HTML — à conserver).

> **Mockups de référence fournis :** `marmite_magique_mockup_pop_sexy.html` (layout sidebar + ton + palette pop = **référence principale**, malgré son ancien nom de fichier) et `RecipeApp.jsx` (animations magiques poussées + ajusteur de portions + fusion liste = **référence pour les interactions**). Fusionner : layout & ambiance du HTML, richesse d'interactions du JSX. **Le nom retenu est « Tambouille » partout.**

---

## 8. Logique métier importante

### Ajustement des portions
`quantité affichée = quantité_base × (portions_voulues / portions_base)`. Arrondir intelligemment (entiers pour les pièces, 1-2 décimales sinon).

### Fusion de la liste de courses
1. Pour chaque recette du chaudron, appliquer le ratio de portions à chaque ingrédient.
2. Fusionner par clé `(nom_ingredient, unité)` → additionner les quantités.
3. Regrouper par rayon (`aisle`).
4. (Phase 3) soustraire ce qui est déjà au garde-manger.

### Rayons de supermarché
`F&L` (Fruits & Légumes) · `Frais` (Crémerie) · `Boucherie` · `Épicerie` · `Caves` (Spiritueux) · `Surgelés` · `Boulangerie` · `Hygiène/Maison`.

---

## 9. Conventions de code

- **TypeScript** partout. Composants fonctionnels + hooks.
- Dossiers : `app/` (routes), `components/`, `lib/` (client Supabase, helpers), `types/`.
- Client Supabase centralisé dans `lib/supabase.ts`.
- Variables d'environnement dans `.env.local` (jamais commit) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, et côté serveur `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` (phase 3).
- Palette + tokens déjà dans `globals.css` (Tailwind v4 `@theme inline`) — **mettre à jour** avec la palette pop ci-dessus si l'ancienne (framboise/miel) y figure encore.
- Commits clairs, atomiques, en français (voir `CLAUDE.md`).

---

## 10. Premiers pas suggérés pour Claude Code

1. ✅ Setup Next.js déjà fait.
2. **Mettre à jour la palette et les polices** selon §7 (Baloo 2 + Inter, palette pop) si le setup initial utilisait Fraunces/DM Sans + framboise/miel.
3. Créer `lib/supabase.ts` + `.env.local` (template).
4. Construire le **layout avec sidebar** (+ top-bar mobile) selon §7.
5. Porter l'**Accueil** (hero + chaudron du jour + collections + grille/pile) en s'appuyant sur le mockup HTML.
6. Brancher les données Supabase (lire les recettes depuis la DB).
7. Implémenter l'**ajusteur de portions** + la **fusion de liste de courses**.

---

*Document de référence — Tambouille · La cuisine qui pétille 🍲✨ · Direction : Pop / Fun / Sexy*
