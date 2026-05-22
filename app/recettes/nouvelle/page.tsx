"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import {
  createRecipe,
  type NewRecipePayload,
} from "./actions";
import { Card } from "@/components/Card";
import { Sparkle } from "@/components/Sparkle";
import {
  IngredientAutocomplete,
  type IngredientSuggestion,
} from "@/components/IngredientAutocomplete";

// =============================================================
// Types & helpers
// =============================================================

type Category = {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
};

type Status = "totry" | "tested" | "favorite";

type IngredientLine = {
  id: string;
  name: string;
  quantity: string; // string pour l'input ; parsé à la soumission
  unit: string;
  ingredient_group: string;
  is_optional: boolean;
};

type StepLine = {
  id: string;
  content: string;
  duration_minutes: string;
  step_group: string;
};

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function newIngredient(group = "Base"): IngredientLine {
  return {
    id: makeId(),
    name: "",
    quantity: "",
    unit: "",
    ingredient_group: group,
    is_optional: false,
  };
}

function newStep(group = ""): StepLine {
  return {
    id: makeId(),
    content: "",
    duration_minutes: "",
    step_group: group,
  };
}

const SECTIONS = [
  { id: "essentiel", emoji: "🍓", label: "L'essentiel" },
  { id: "temps", emoji: "⏱", label: "Temps" },
  { id: "photo", emoji: "📸", label: "Photo" },
  { id: "ingredients", emoji: "🧂", label: "Ingrédients" },
  { id: "etapes", emoji: "📜", label: "Étapes" },
  { id: "notes", emoji: "💌", label: "Notes" },
] as const;

const STATUS_OPTIONS: Array<{
  value: Status;
  label: string;
  emoji: string;
}> = [
  { value: "totry", label: "À tester", emoji: "✨" },
  { value: "tested", label: "Validée famille", emoji: "🍓" },
  { value: "favorite", label: "Chouchou", emoji: "❤️" },
];

const DIFFICULTY_OPTIONS = [
  { value: 1, label: "Très facile" },
  { value: 2, label: "Facile" },
  { value: 3, label: "Moyen" },
  { value: 4, label: "Difficile" },
  { value: 5, label: "Pro" },
];

const COST_OPTIONS = [
  { value: 1, label: "€" },
  { value: 2, label: "€€" },
  { value: 3, label: "€€€" },
];

// =============================================================
// Page
// =============================================================

export default function NouvelleRecettePage() {
  const router = useRouter();

  // --- State formulaire ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("totry");
  const [emoji, setEmoji] = useState("");
  const [description, setDescription] = useState("");

  const [prepMin, setPrepMin] = useState(0);
  const [cookMin, setCookMin] = useState(0);
  const [restMin, setRestMin] = useState(0);
  const [difficulty, setDifficulty] = useState(2);
  const [cost, setCost] = useState(2);
  const [servings, setServings] = useState(4);

  const [ingredients, setIngredients] = useState<IngredientLine[]>([
    newIngredient(),
  ]);
  const [steps, setSteps] = useState<StepLine[]>([newStep()]);

  const [personalNote, setPersonalNote] = useState("");
  const [familyNote, setFamilyNote] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceName, setSourceName] = useState("");

  // --- État de soumission ---
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);

  // --- Fetch catégories ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug, emoji")
        .order("sort_order", { ascending: true });
      if (!cancelled) setCategories(data ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Slug en aperçu ---
  const slugPreview = title.trim() ? slugify(title) : "";

  // --- Mutations ingrédients ---
  const addIngredient = () => {
    const lastGroup = ingredients[ingredients.length - 1]?.ingredient_group ?? "Base";
    setIngredients((prev) => [...prev, newIngredient(lastGroup)]);
  };
  const updateIngredient = (
    index: number,
    partial: Partial<IngredientLine>,
  ) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, ...partial } : ing)),
    );
  };
  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };
  const moveIngredient = (index: number, dir: -1 | 1) => {
    setIngredients((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  };

  // --- Mutations étapes ---
  const addStep = () => {
    const lastGroup = steps[steps.length - 1]?.step_group ?? "";
    setSteps((prev) => [...prev, newStep(lastGroup)]);
  };
  const updateStep = (index: number, partial: Partial<StepLine>) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...partial } : s)),
    );
  };
  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };
  const moveStep = (index: number, dir: -1 | 1) => {
    setSteps((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  };

  // --- Submit ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setTitleError(null);

    if (!title.trim()) {
      setTitleError("Donne un titre à ta recette ✨");
      document
        .getElementById("essentiel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (servings < 1) {
      setSubmitError("Il faut au moins 1 portion.");
      return;
    }

    setSubmitting(true);

    const payload: NewRecipePayload = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      description: description.trim() || null,
      emoji: emoji.trim() || null,
      category_id: categoryId,
      prep_minutes: prepMin,
      cook_minutes: cookMin,
      rest_minutes: restMin,
      servings,
      difficulty,
      cost,
      status,
      personal_note: personalNote.trim() || null,
      family_note: familyNote.trim() || null,
      source_url: sourceUrl.trim() || null,
      source_name: sourceName.trim() || null,
      ingredients: ingredients
        .filter((i) => i.name.trim())
        .map((i, idx) => ({
          name: i.name.trim(),
          quantity: i.quantity
            ? parseFloat(i.quantity.replace(",", ".")) || null
            : null,
          unit: i.unit.trim() || null,
          ingredient_group: i.ingredient_group.trim() || "Base",
          is_optional: i.is_optional,
          sort_order: idx,
        })),
      steps: steps
        .filter((s) => s.content.trim())
        .map((s, idx) => ({
          step_number: idx + 1,
          content: s.content.trim(),
          duration_minutes: s.duration_minutes
            ? parseInt(s.duration_minutes, 10) || null
            : null,
          step_group: s.step_group.trim() || null,
          sort_order: idx,
        })),
    };

    const result = await createRecipe(payload);

    if (result.ok) {
      router.refresh();
      router.push(`/recettes/${result.slug}`);
    } else {
      setSubmitError(result.error);
      setSubmitting(false);
    }
  };

  // =============================================================
  // Render
  // =============================================================
  return (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
      {/* En-tête + nav d'ancres */}
      <Card as="section" className="relative overflow-hidden">
        <Sparkle className="right-[10%] top-[14%]" size={26} delay={-0.3} />
        <Sparkle
          className="right-[24%] top-[28%]"
          size={18}
          delay={-1.2}
          glyph="✧"
          color="#ff9fc0"
        />

        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-[13px] py-[8px] text-[13px] font-black text-dark-rose">
          ✨ Nouvelle recette
        </span>
        <h1 className="m-0 font-display text-[clamp(36px,5vw,52px)] tracking-[-1px] text-chocolate">
          Ajoutons une recette au grimoire
        </h1>
        <p className="mt-2 max-w-[640px] font-semibold text-cocoa">
          Remplis ce que tu peux — seul le titre est obligatoire. Tu pourras
          peaufiner plus tard depuis la fiche. Le slug et les ingrédients
          inconnus se créent automatiquement.
        </p>

        <nav
          aria-label="Sections du formulaire"
          className="mt-5 flex flex-wrap gap-2"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="chip-pop bg-white text-cocoa no-underline"
            >
              <span aria-hidden>{s.emoji}</span> {s.label}
            </a>
          ))}
        </nav>
      </Card>

      {/* =============================================
          Section 1 — Essentiel
          ============================================= */}
      <Card as="section" id="essentiel" className="form-section-anchor">
        <SectionTitle emoji="🍓" title="L'essentiel" />

        <div className="grid gap-4">
          <div>
            <label htmlFor="title" className="form-label">
              Titre *
            </label>
            <input
              id="title"
              type="text"
              className={`form-input ${titleError ? "form-input--error" : ""}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tarte aux fraises de mémé"
              required
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? "title-error" : undefined}
            />
            {titleError && (
              <p
                id="title-error"
                className="form-help"
                style={{ color: "var(--cherry)" }}
              >
                {titleError}
              </p>
            )}
            {slugPreview && (
              <p className="form-help">
                URL :{" "}
                <code
                  className="rounded-full bg-vanilla px-2 py-[2px] text-[12px] font-bold text-dark-rose"
                >
                  /recettes/{slugPreview}
                </code>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="subtitle" className="form-label">
              Sous-titre
            </label>
            <input
              id="subtitle"
              type="text"
              className="form-input"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="La fraîcheur d'un été ensoleillé."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
            <div>
              <label htmlFor="category" className="form-label">
                Catégorie
              </label>
              <select
                id="category"
                className="form-select"
                value={categoryId ?? ""}
                onChange={(e) =>
                  setCategoryId(e.target.value || null)
                }
              >
                <option value="">— Aucune —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji ? `${c.emoji} ` : ""}
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="emoji" className="form-label">
                Emoji
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="emoji"
                  type="text"
                  className="form-input"
                  value={emoji}
                  onChange={(e) => {
                    // Limite à 1-2 caractères (1 emoji peut faire 2 code units)
                    const v = e.target.value;
                    if ([...v].length <= 2) setEmoji(v);
                  }}
                  placeholder="🍓"
                  maxLength={4}
                />
                {emoji && (
                  <span aria-hidden className="text-[36px]">
                    {emoji}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Statut</label>
            <PillToggle
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
              ariaLabel="Statut de la recette"
            />
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="L'histoire de cette recette, ce qu'elle évoque, qui l'a inspirée…"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* =============================================
          Section 2 — Temps & difficulté
          ============================================= */}
      <Card as="section" id="temps" className="form-section-anchor">
        <SectionTitle emoji="⏱" title="Temps & difficulté" />

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField
              label="Prépa (min)"
              value={prepMin}
              onChange={setPrepMin}
              min={0}
              max={999}
            />
            <NumberField
              label="Cuisson (min)"
              value={cookMin}
              onChange={setCookMin}
              min={0}
              max={999}
            />
            <NumberField
              label="Repos (min)"
              value={restMin}
              onChange={setRestMin}
              min={0}
              max={9999}
            />
          </div>

          <div>
            <label className="form-label">Difficulté</label>
            <PillToggle
              options={DIFFICULTY_OPTIONS}
              value={difficulty}
              onChange={setDifficulty}
              ariaLabel="Difficulté"
            />
          </div>

          <div>
            <label className="form-label">Coût</label>
            <PillToggle
              options={COST_OPTIONS}
              value={cost}
              onChange={setCost}
              ariaLabel="Coût"
            />
          </div>

          <div className="sm:max-w-[200px]">
            <NumberField
              label="Portions de base *"
              value={servings}
              onChange={setServings}
              min={1}
              max={99}
            />
            <p className="form-help">
              Ce sera la référence pour l&apos;ajusteur de portions.
            </p>
          </div>
        </div>
      </Card>

      {/* =============================================
          Section 3 — Photo (placeholder)
          ============================================= */}
      <Card as="section" id="photo" className="form-section-anchor">
        <SectionTitle emoji="📸" title="Photo" />

        <div
          className="grid place-items-center rounded-[28px] border-2 border-dashed py-10 text-center"
          style={{
            borderColor: "#f0d4cf",
            background:
              "linear-gradient(135deg, var(--vanilla), #ffedf2, #fff7d6)",
          }}
        >
          <div>
            <div className="placeholder-emoji mx-auto mb-3 text-[64px]">
              📸
            </div>
            <h3 className="m-0 mb-2 font-display text-2xl text-chocolate">
              Photo à venir
            </h3>
            <p className="mx-auto max-w-[420px] font-semibold text-cocoa">
              L&apos;upload de photo sera disponible bientôt. En attendant, ta
              recette héritera d&apos;un dégradé pop choisi automatiquement à
              partir de son titre.
            </p>
          </div>
        </div>
      </Card>

      {/* =============================================
          Section 4 — Ingrédients
          ============================================= */}
      <Card as="section" id="ingredients" className="form-section-anchor">
        <SectionTitle emoji="🧂" title="Ingrédients" />
        <p className="m-0 mb-4 font-semibold text-cocoa">
          Tape un nom — si l&apos;ingrédient existe déjà, il sera proposé. Sinon
          il sera créé à la soumission.
        </p>

        <div className="grid gap-4">
          {ingredients.map((ing, i) => (
            <div
              key={ing.id}
              className="rounded-[22px] p-4"
              style={{ background: "var(--vanilla)" }}
            >
              <div className="grid gap-3">
                <IngredientAutocomplete
                  value={ing.name}
                  onChange={(name) => updateIngredient(i, { name })}
                  onSelectExisting={(s: IngredientSuggestion) =>
                    updateIngredient(i, {
                      name: s.name,
                      unit: ing.unit || s.default_unit || "",
                    })
                  }
                />

                <div className="grid gap-3 sm:grid-cols-[120px_120px_1fr_auto]">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="form-input"
                    value={ing.quantity}
                    onChange={(e) =>
                      updateIngredient(i, { quantity: e.target.value })
                    }
                    placeholder="Qté"
                    aria-label="Quantité"
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={ing.unit}
                    onChange={(e) =>
                      updateIngredient(i, { unit: e.target.value })
                    }
                    placeholder="Unité"
                    aria-label="Unité"
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={ing.ingredient_group}
                    onChange={(e) =>
                      updateIngredient(i, {
                        ingredient_group: e.target.value,
                      })
                    }
                    placeholder="Groupe (ex: Pour la pâte)"
                    aria-label="Groupe"
                  />

                  <label className="flex items-center gap-2 text-[13px] font-bold text-cocoa">
                    <input
                      type="checkbox"
                      checked={ing.is_optional}
                      onChange={(e) =>
                        updateIngredient(i, {
                          is_optional: e.target.checked,
                        })
                      }
                      className="h-5 w-5 cursor-pointer accent-[var(--hot-pink)]"
                    />
                    Facultatif
                  </label>
                </div>

                <RowActions
                  index={i}
                  total={ingredients.length}
                  onMoveUp={() => moveIngredient(i, -1)}
                  onMoveDown={() => moveIngredient(i, 1)}
                  onRemove={() => removeIngredient(i)}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addIngredient}
            className="btn-pop btn-pop--secondary self-start"
          >
            + Ajouter un ingrédient
          </button>
        </div>
      </Card>

      {/* =============================================
          Section 5 — Étapes
          ============================================= */}
      <Card as="section" id="etapes" className="form-section-anchor">
        <SectionTitle emoji="📜" title="Étapes" />
        <p className="m-0 mb-4 font-semibold text-cocoa">
          Une étape par bloc — la numérotation se fait toute seule. Tu peux
          regrouper par section (« Préparer la pâte », « Cuisson »…).
        </p>

        <ol className="m-0 grid list-none gap-4 p-0">
          {steps.map((s, i) => (
            <li
              key={s.id}
              className="rounded-[22px] p-4"
              style={{ background: "var(--vanilla)" }}
            >
              <div className="flex gap-4">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-xl text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--butter), var(--orange), var(--hot-pink))",
                    boxShadow: "0 8px 20px rgba(155, 18, 63, 0.25)",
                  }}
                >
                  {i + 1}
                </div>

                <div className="flex-1 grid gap-3">
                  <input
                    type="text"
                    className="form-input"
                    value={s.step_group}
                    onChange={(e) =>
                      updateStep(i, { step_group: e.target.value })
                    }
                    placeholder="Groupe optionnel (ex: Préparer la pâte)"
                    aria-label="Groupe d'étapes"
                  />

                  <textarea
                    className="form-textarea"
                    value={s.content}
                    onChange={(e) =>
                      updateStep(i, { content: e.target.value })
                    }
                    placeholder="Décris l'étape avec gourmandise…"
                    rows={3}
                    aria-label={`Contenu de l'étape ${i + 1}`}
                  />

                  <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      value={s.duration_minutes}
                      onChange={(e) =>
                        updateStep(i, { duration_minutes: e.target.value })
                      }
                      placeholder="Durée (min)"
                      aria-label="Durée en minutes"
                    />
                    <RowActions
                      index={i}
                      total={steps.length}
                      onMoveUp={() => moveStep(i, -1)}
                      onMoveDown={() => moveStep(i, 1)}
                      onRemove={() => removeStep(i)}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={addStep}
          className="btn-pop btn-pop--secondary mt-4"
        >
          + Ajouter une étape
        </button>
      </Card>

      {/* =============================================
          Section 6 — Notes & Source
          ============================================= */}
      <Card as="section" id="notes" className="form-section-anchor">
        <SectionTitle emoji="💌" title="Notes & source" />

        <div className="grid gap-4">
          <div>
            <label htmlFor="personalNote" className="form-label">
              💡 Note perso / astuce
            </label>
            <textarea
              id="personalNote"
              className="form-textarea"
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Le petit secret, l'astuce qui change tout…"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="familyNote" className="form-label">
              💌 Avis famille
            </label>
            <textarea
              id="familyNote"
              className="form-textarea"
              value={familyNote}
              onChange={(e) => setFamilyNote(e.target.value)}
              placeholder="Ce qu'on en a pensé, qui adore, ce qu'on changerait…"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sourceUrl" className="form-label">
                Source — URL
              </label>
              <input
                id="sourceUrl"
                type="url"
                className="form-input"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div>
              <label htmlFor="sourceName" className="form-label">
                Source — Nom
              </label>
              <input
                id="sourceName"
                type="text"
                className="form-input"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="Livre Ottolenghi p.42"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* =============================================
          Submit
          ============================================= */}
      <Card>
        {submitError && (
          <div
            role="alert"
            className="mb-4 rounded-[18px] p-4 text-[14px] font-bold"
            style={{
              background: "linear-gradient(135deg, #ffd5d5, #ffe1ec)",
              color: "var(--wine-rose)",
              border: "2px solid var(--cherry)",
            }}
          >
            🪄 {submitError}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-[13px] font-semibold text-cocoa">
            Prête à faire pétiller ta recette dans le grimoire ?
          </p>
          <div className="flex gap-2">
            <Link
              href="/recettes"
              className="btn-pop btn-pop--secondary no-underline"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-pop btn-pop--primary disabled:opacity-60"
            >
              {submitting
                ? "✨ Création en cours…"
                : "🍒 Créer la recette"}
            </button>
          </div>
        </div>
      </Card>
    </form>
  );
}

// =============================================================
// Sous-composants inline
// =============================================================

function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <header className="mb-5 flex items-center gap-3">
      <span aria-hidden className="text-3xl">
        {emoji}
      </span>
      <h2 className="m-0 font-display text-[28px] text-chocolate">
        {title}
      </h2>
    </header>
  );
}

type PillToggleOption<T> = {
  value: T;
  label: string;
  emoji?: string;
};

function PillToggle<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: PillToggleOption<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`chip-pop cursor-pointer border-0 ${
              active ? "chip-hot text-white" : "bg-white text-cocoa"
            }`}
          >
            {opt.emoji && <span aria-hidden>{opt.emoji} </span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        className="form-input"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (Number.isNaN(n)) {
            onChange(min);
            return;
          }
          onChange(Math.max(min, Math.min(max, n)));
        }}
      />
    </div>
  );
}

function RowActions({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 self-end">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={index === 0}
        aria-label="Monter"
        className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-white text-lg font-bold text-dark-rose transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        style={{ boxShadow: "0 4px 10px rgba(155, 18, 63, 0.12)" }}
      >
        ↑
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={index === total - 1}
        aria-label="Descendre"
        className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-white text-lg font-bold text-dark-rose transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        style={{ boxShadow: "0 4px 10px rgba(155, 18, 63, 0.12)" }}
      >
        ↓
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Supprimer"
        className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-white text-lg font-bold text-cherry transition hover:scale-110"
        style={{ boxShadow: "0 4px 10px rgba(233, 38, 85, 0.18)" }}
      >
        ×
      </button>
    </div>
  );
}
