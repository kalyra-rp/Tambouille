-- =============================================================
-- 🍲 TAMBOUILLE — Schéma de base de données Supabase (PostgreSQL)
-- =============================================================
-- À exécuter dans Supabase : SQL Editor → New query → coller → Run.
-- Conçu pour être exécuté en une fois. Ordre des tables respecté
-- pour les clés étrangères.
-- =============================================================

-- Extensions utiles
create extension if not exists "uuid-ossp";

-- =============================================================
-- ENUMS
-- =============================================================

-- Statut d'une recette
do $$ begin
  create type recipe_status as enum ('totry', 'tested', 'favorite', 'archived');
exception when duplicate_object then null; end $$;

-- Rôle d'une recette dans un menu
do $$ begin
  create type menu_role as enum ('aperitif', 'entree', 'plat', 'accompagnement', 'fromage', 'dessert', 'boisson', 'autre');
exception when duplicate_object then null; end $$;

-- État d'un item de liste de courses
do $$ begin
  create type shopping_state as enum ('todo', 'in_cart', 'have');
exception when duplicate_object then null; end $$;

-- Repas dans le planning
do $$ begin
  create type meal_slot as enum ('petit_dej', 'midi', 'gouter', 'soir');
exception when duplicate_object then null; end $$;

-- =============================================================
-- CATÉGORIES (arborescence auto-référente)
-- =============================================================
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text unique not null,
  emoji       text,
  parent_id   uuid references categories(id) on delete cascade,
  sort_order  int default 0,
  created_at  timestamptz default now()
);
create index if not exists idx_categories_parent on categories(parent_id);

-- =============================================================
-- TAGS transversaux (régimes, formats spéciaux…)
-- =============================================================
create table if not exists tags (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text unique not null,
  kind        text default 'general',  -- 'regime' | 'format' | 'general'
  color       text,
  created_at  timestamptz default now()
);

-- =============================================================
-- INGRÉDIENTS (référentiel global)
-- =============================================================
create table if not exists ingredients (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  aisle         text default 'Épicerie',  -- rayon: F&L, Frais, Boucherie, Épicerie, Caves, Surgelés, Boulangerie
  default_unit  text,                       -- g, ml, pièces, c.à.s…
  density       numeric,                    -- pour conversions g <-> ml (optionnel)
  allergens     text[],                     -- ex: {gluten, lactose}
  season_months int[],                      -- mois de disponibilité 1..12 (optionnel)
  created_at    timestamptz default now()
);
create unique index if not exists idx_ingredients_name on ingredients(lower(name));

-- =============================================================
-- RECETTES
-- =============================================================
create table if not exists recipes (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  subtitle      text,
  slug          text unique,
  description   text,
  emoji         text,                       -- emoji représentatif
  gradient      text,                       -- classe de dégradé (déco mockup)
  accent        text,                       -- couleur d'accent hex
  category_id   uuid references categories(id) on delete set null,

  prep_minutes  int default 0,
  cook_minutes  int default 0,
  rest_minutes  int default 0,
  -- total = colonne générée
  total_minutes int generated always as (coalesce(prep_minutes,0) + coalesce(cook_minutes,0) + coalesce(rest_minutes,0)) stored,

  servings      int default 4,              -- portions de base
  difficulty    int default 1 check (difficulty between 1 and 5),
  cost          int default 1 check (cost between 1 and 3), -- €, €€, €€€
  season        text,                       -- printemps/été/automne/hiver/toute l'année

  status        recipe_status default 'totry',
  rating        numeric check (rating >= 0 and rating <= 5),
  family_note   text,                       -- commentaire familial
  personal_note text,

  source_url    text,                       -- si trouvée sur internet
  source_name   text,                       -- nom de personne / livre
  photo_url     text,                       -- photo principale (Supabase Storage)
  gallery       text[],                     -- photos additionnelles

  times_cooked  int default 0,
  last_cooked_at timestamptz,

  owner_id      uuid references auth.users(id) on delete cascade,
  is_shared     boolean default true,       -- visible par la famille

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index if not exists idx_recipes_category on recipes(category_id);
create index if not exists idx_recipes_status on recipes(status);
create index if not exists idx_recipes_owner on recipes(owner_id);

-- =============================================================
-- LIAISON recette ↔ tags
-- =============================================================
create table if not exists recipe_tags (
  recipe_id  uuid references recipes(id) on delete cascade,
  tag_id     uuid references tags(id) on delete cascade,
  primary key (recipe_id, tag_id)
);

-- =============================================================
-- INGRÉDIENTS d'une recette (liaison avec quantités)
-- =============================================================
create table if not exists recipe_ingredients (
  id            uuid primary key default uuid_generate_v4(),
  recipe_id     uuid references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete restrict,
  quantity      numeric,                    -- quantité pour les portions de base
  unit          text,                       -- g, ml, pièces…
  prep_note     text,                       -- "haché fin", "en cubes"
  ingredient_group text default 'Base',     -- "Pour la pâte", "Pour la garniture"
  is_optional   boolean default false,
  sort_order    int default 0
);
create index if not exists idx_recipe_ingredients_recipe on recipe_ingredients(recipe_id);

-- =============================================================
-- ÉTAPES d'une recette
-- =============================================================
create table if not exists recipe_steps (
  id           uuid primary key default uuid_generate_v4(),
  recipe_id    uuid references recipes(id) on delete cascade,
  step_number  int not null,
  content      text not null,
  duration_minutes int,                     -- pour minuteur intégré
  temperature  text,                        -- ex "180°C"
  photo_url    text,
  step_group   text,                        -- "Préparer la pâte", "Cuisson"
  sort_order   int default 0
);
create index if not exists idx_recipe_steps_recipe on recipe_steps(recipe_id);

-- =============================================================
-- MENUS
-- =============================================================
create table if not exists menus (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  occasion     text,                        -- "Noël 2024", "Anniversaire maman"
  planned_date date,
  guests       int default 4,
  retro_note   text,                        -- bilan après l'événement
  owner_id     uuid references auth.users(id) on delete cascade,
  created_at   timestamptz default now()
);

create table if not exists menu_recipes (
  id          uuid primary key default uuid_generate_v4(),
  menu_id     uuid references menus(id) on delete cascade,
  recipe_id   uuid references recipes(id) on delete cascade,
  role        menu_role default 'plat',
  servings    int,                          -- portions voulues pour ce menu
  sort_order  int default 0
);
create index if not exists idx_menu_recipes_menu on menu_recipes(menu_id);

-- =============================================================
-- CHAUDRON (panier)
-- =============================================================
create table if not exists carts (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid references auth.users(id) on delete cascade,
  name        text default 'Mon chaudron',
  created_at  timestamptz default now()
);

create table if not exists cart_items (
  id          uuid primary key default uuid_generate_v4(),
  cart_id     uuid references carts(id) on delete cascade,
  recipe_id   uuid references recipes(id) on delete cascade,
  servings    int default 4,                -- portions voulues
  added_at    timestamptz default now()
);
create index if not exists idx_cart_items_cart on cart_items(cart_id);

-- =============================================================
-- LISTES DE COURSES (générées depuis un chaudron)
-- =============================================================
create table if not exists shopping_lists (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid references auth.users(id) on delete cascade,
  name        text default 'Liste de courses',
  source_cart_id uuid references carts(id) on delete set null,
  created_at  timestamptz default now()
);

create table if not exists shopping_list_items (
  id            uuid primary key default uuid_generate_v4(),
  list_id       uuid references shopping_lists(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete set null,
  name          text not null,              -- snapshot du nom (au cas où)
  quantity      numeric,                    -- quantité fusionnée
  unit          text,
  aisle         text,                       -- rayon (snapshot)
  state         shopping_state default 'todo',
  from_recipes  text[],                     -- titres des recettes concernées
  sort_order    int default 0
);
create index if not exists idx_shopping_items_list on shopping_list_items(list_id);

-- =============================================================
-- GARDE-MANGER
-- =============================================================
create table if not exists pantry_items (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid references auth.users(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  quantity      numeric,
  unit          text,
  expires_at    date,
  created_at    timestamptz default now()
);

-- =============================================================
-- PLANNING DES REPAS
-- =============================================================
create table if not exists meal_plan (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid references auth.users(id) on delete cascade,
  recipe_id   uuid references recipes(id) on delete cascade,
  plan_date   date not null,
  slot        meal_slot default 'soir',
  servings    int default 4,
  created_at  timestamptz default now()
);
create index if not exists idx_meal_plan_date on meal_plan(plan_date);

-- =============================================================
-- TRIGGER : mise à jour automatique de updated_at sur recipes
-- =============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_recipes_updated_at on recipes;
create trigger trg_recipes_updated_at
  before update on recipes
  for each row execute function set_updated_at();

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================
-- Active RLS sur les tables qui contiennent des données utilisateur.
-- Règle simple : un utilisateur voit/modifie ses propres données ET
-- les recettes/menus partagés (is_shared = true) en lecture.
-- À affiner selon le besoin famille exact.

alter table recipes enable row level security;
alter table menus enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table shopping_lists enable row level security;
alter table shopping_list_items enable row level security;
alter table pantry_items enable row level security;
alter table meal_plan enable row level security;

-- RECIPES : lecture si propriétaire OU partagé ; écriture si propriétaire
drop policy if exists "recipes_select" on recipes;
create policy "recipes_select" on recipes
  for select using (auth.uid() = owner_id or is_shared = true);

drop policy if exists "recipes_insert" on recipes;
create policy "recipes_insert" on recipes
  for insert with check (auth.uid() = owner_id);

drop policy if exists "recipes_update" on recipes;
create policy "recipes_update" on recipes
  for update using (auth.uid() = owner_id);

drop policy if exists "recipes_delete" on recipes;
create policy "recipes_delete" on recipes
  for delete using (auth.uid() = owner_id);

-- MENUS : propriétaire uniquement (ajuster si partage souhaité)
drop policy if exists "menus_all" on menus;
create policy "menus_all" on menus
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- CARTS
drop policy if exists "carts_all" on carts;
create policy "carts_all" on carts
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- CART ITEMS (via le chaudron du propriétaire)
drop policy if exists "cart_items_all" on cart_items;
create policy "cart_items_all" on cart_items
  for all using (
    exists (select 1 from carts c where c.id = cart_items.cart_id and c.owner_id = auth.uid())
  ) with check (
    exists (select 1 from carts c where c.id = cart_items.cart_id and c.owner_id = auth.uid())
  );

-- SHOPPING LISTS
drop policy if exists "shopping_lists_all" on shopping_lists;
create policy "shopping_lists_all" on shopping_lists
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "shopping_items_all" on shopping_list_items;
create policy "shopping_items_all" on shopping_list_items
  for all using (
    exists (select 1 from shopping_lists l where l.id = shopping_list_items.list_id and l.owner_id = auth.uid())
  ) with check (
    exists (select 1 from shopping_lists l where l.id = shopping_list_items.list_id and l.owner_id = auth.uid())
  );

-- PANTRY
drop policy if exists "pantry_all" on pantry_items;
create policy "pantry_all" on pantry_items
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- MEAL PLAN
drop policy if exists "meal_plan_all" on meal_plan;
create policy "meal_plan_all" on meal_plan
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Tables de référence (categories, tags, ingredients) : lecture publique,
-- écriture réservée (à gérer via service_role ou en interne).
alter table categories enable row level security;
alter table tags enable row level security;
alter table ingredients enable row level security;

drop policy if exists "categories_read" on categories;
create policy "categories_read" on categories for select using (true);
drop policy if exists "tags_read" on tags;
create policy "tags_read" on tags for select using (true);
drop policy if exists "ingredients_read" on ingredients;
create policy "ingredients_read" on ingredients for select using (true);

-- recipe_ingredients / recipe_steps / recipe_tags suivent l'accès à leur recette.
alter table recipe_ingredients enable row level security;
alter table recipe_steps enable row level security;
alter table recipe_tags enable row level security;

drop policy if exists "ri_read" on recipe_ingredients;
create policy "ri_read" on recipe_ingredients for select using (
  exists (select 1 from recipes r where r.id = recipe_ingredients.recipe_id and (r.is_shared = true or r.owner_id = auth.uid()))
);
drop policy if exists "ri_write" on recipe_ingredients;
create policy "ri_write" on recipe_ingredients for all using (
  exists (select 1 from recipes r where r.id = recipe_ingredients.recipe_id and r.owner_id = auth.uid())
) with check (
  exists (select 1 from recipes r where r.id = recipe_ingredients.recipe_id and r.owner_id = auth.uid())
);

drop policy if exists "rs_read" on recipe_steps;
create policy "rs_read" on recipe_steps for select using (
  exists (select 1 from recipes r where r.id = recipe_steps.recipe_id and (r.is_shared = true or r.owner_id = auth.uid()))
);
drop policy if exists "rs_write" on recipe_steps;
create policy "rs_write" on recipe_steps for all using (
  exists (select 1 from recipes r where r.id = recipe_steps.recipe_id and r.owner_id = auth.uid())
) with check (
  exists (select 1 from recipes r where r.id = recipe_steps.recipe_id and r.owner_id = auth.uid())
);

drop policy if exists "rt_read" on recipe_tags;
create policy "rt_read" on recipe_tags for select using (true);
drop policy if exists "rt_write" on recipe_tags;
create policy "rt_write" on recipe_tags for all using (
  exists (select 1 from recipes r where r.id = recipe_tags.recipe_id and r.owner_id = auth.uid())
) with check (
  exists (select 1 from recipes r where r.id = recipe_tags.recipe_id and r.owner_id = auth.uid())
);

-- =============================================================
-- SEED — Catégories principales (niveau 1)
-- =============================================================
insert into categories (name, slug, emoji, sort_order) values
  ('Petit-déjeuner & Brunch', 'petit-dej', '🥐', 1),
  ('Entrées & Apéritifs', 'entrees', '🥗', 2),
  ('Plats principaux', 'plats', '🍖', 3),
  ('Accompagnements', 'accompagnements', '🥘', 4),
  ('Fromages', 'fromages', '🧀', 5),
  ('Desserts', 'desserts', '🍰', 6),
  ('Boulangerie & Pâtes', 'boulangerie', '🍞', 7),
  ('Bases & Fondamentaux', 'bases', '🥫', 8),
  ('Conserves & Fermentations', 'conserves', '🥒', 9),
  ('Boissons', 'boissons', '🍹', 10),
  ('Menus & Occasions', 'menus', '📅', 11)
on conflict (slug) do nothing;

-- =============================================================
-- SEED — Tags transversaux
-- =============================================================
insert into tags (name, slug, kind, color) values
  ('Végétarien', 'vegetarien', 'regime', '#B8D4A3'),
  ('Vegan', 'vegan', 'regime', '#8FBF6F'),
  ('Sans gluten', 'sans-gluten', 'regime', '#FFB627'),
  ('Sans lactose', 'sans-lactose', 'regime', '#FFCBA4'),
  ('Keto / Low carb', 'keto', 'regime', '#E63946'),
  ('Healthy', 'healthy', 'regime', '#B8D4A3'),
  ('Batch cooking', 'batch-cooking', 'format', '#EF8B30'),
  ('Anti-gaspi', 'anti-gaspi', 'format', '#6B1E3F'),
  ('Moins de 30 min', 'rapide', 'format', '#FF7A66'),
  ('One-pot', 'one-pot', 'format', '#C77DFF'),
  ('Air fryer', 'air-fryer', 'format', '#FFB627'),
  ('Avec les enfants', 'enfants', 'format', '#FFCBA4')
on conflict (slug) do nothing;

-- =============================================================
-- SEED — Quelques ingrédients de référence (exemples)
-- =============================================================
insert into ingredients (name, aisle, default_unit, allergens) values
  ('Citrons jaunes bio', 'F&L', 'pièces', null),
  ('Œufs frais', 'Frais', 'pièces', '{oeuf}'),
  ('Sucre en poudre', 'Épicerie', 'g', null),
  ('Beurre doux', 'Frais', 'g', '{lactose}'),
  ('Farine T55', 'Épicerie', 'g', '{gluten}'),
  ('Mascarpone', 'Frais', 'g', '{lactose}'),
  ('Tomates anciennes', 'F&L', 'g', null),
  ('Burrata', 'Frais', 'pièces', '{lactose}'),
  ('Basilic frais', 'F&L', 'botte', null),
  ('Huile d''olive vierge extra', 'Épicerie', 'c.à.s', null)
on conflict do nothing;

-- =============================================================
-- FIN — Tambouille schema ✨
-- =============================================================
