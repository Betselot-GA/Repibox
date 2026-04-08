import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { AiOutlineSearch } from "react-icons/ai";
import {
  fetchCategoryOptions,
  fetchAreaOptions,
  fetchIngredientOptions,
} from "../utils/queries.js";

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const LIMIT_OPTIONS = [24, 36, 48, 72, 96];
const SORT_OPTIONS = [
  { value: "relevance", label: "Sort: relevance" },
  { value: "name-asc", label: "Sort: name A–Z" },
  { value: "name-desc", label: "Sort: name Z–A" },
];

export default function RecipeSearchPanel({
  initialQ = "",
  initialTags = "",
  initialCategory = "",
  initialArea = "",
  initialIngredient = "",
  initialLetter = "",
  initialSort = "relevance",
  initialLimit = "72",
  /** @deprecated use initialQ */
  initialName = "",
  expandAdvancedWhenDirty = false,
}) {
  const navigate = useNavigate();
  const seedQ = initialQ || initialName;
  const [q, setQ] = useState(seedQ);
  const [tags, setTags] = useState(initialTags);
  const [category, setCategory] = useState(initialCategory);
  const [area, setArea] = useState(initialArea);
  const [ingredient, setIngredient] = useState(initialIngredient);
  const [letter, setLetter] = useState(() =>
    (initialLetter || "").trim().toLowerCase().slice(0, 1)
  );
  const [sort, setSort] = useState(initialSort || "relevance");
  const [limit, setLimit] = useState(String(initialLimit || "72"));
  const [showAdvanced, setShowAdvanced] = useState(() =>
    expandAdvancedWhenDirty
      ? Boolean(
          initialTags ||
            initialCategory ||
            initialArea ||
            initialIngredient ||
            /^[a-z]$/i.test((initialLetter || "").trim()) ||
            (initialSort && initialSort !== "relevance") ||
            (initialLimit && String(initialLimit) !== "72")
        )
      : false
  );

  const { data: categories = [] } = useQuery(
    ["mealdb", "categories"],
    fetchCategoryOptions,
    { staleTime: 1000 * 60 * 60 * 24 }
  );
  const { data: areas = [] } = useQuery(
    ["mealdb", "areas"],
    fetchAreaOptions,
    { staleTime: 1000 * 60 * 60 * 24 }
  );
  const { data: ingredients = [] } = useQuery(
    ["mealdb", "ingredients"],
    fetchIngredientOptions,
    { staleTime: 1000 * 60 * 60 * 24 }
  );

  useEffect(() => {
    const nextQ = initialQ || initialName;
    setQ(nextQ);
    setTags(initialTags);
    setCategory(initialCategory);
    setArea(initialArea);
    setIngredient(initialIngredient);
    setLetter((initialLetter || "").trim().toLowerCase().slice(0, 1));
    setSort(initialSort || "relevance");
    setLimit(String(initialLimit || "72"));
    if (
      expandAdvancedWhenDirty &&
      (initialTags ||
        initialCategory ||
        initialArea ||
        initialIngredient ||
        /^[a-z]$/i.test((initialLetter || "").trim()) ||
        (initialSort && initialSort !== "relevance") ||
        (initialLimit && String(initialLimit) !== "72"))
    ) {
      setShowAdvanced(true);
    }
  }, [
    initialQ,
    initialName,
    initialTags,
    initialCategory,
    initialArea,
    initialIngredient,
    initialLetter,
    initialSort,
    initialLimit,
    expandAdvancedWhenDirty,
  ]);

  const hasNonDefaultSortOrLimit =
    (sort && sort !== "relevance") || (limit && String(limit) !== "72");

  const submit = (e) => {
    e.preventDefault();
    const kw = q.trim();
    const tagStr = tags.trim();
    const c = category.trim();
    const a = area.trim();
    const i = ingredient.trim();
    const L = letter.trim().toLowerCase().slice(0, 1);
    const letterOk = L >= "a" && L <= "z";
    if (
      !kw &&
      !tagStr &&
      !c &&
      !a &&
      !i &&
      !letterOk &&
      !hasNonDefaultSortOrLimit
    ) {
      return;
    }
    const params = new URLSearchParams();
    if (kw) params.set("q", kw);
    if (tagStr) params.set("tags", tagStr);
    if (c) params.set("category", c);
    if (a) params.set("area", a);
    if (i) params.set("ingredient", i);
    if (letterOk) params.set("letter", L);
    if (sort && sort !== "relevance") params.set("sort", sort);
    if (limit && limit !== "72") params.set("limit", limit);
    navigate({ pathname: "/search", search: params.toString() });
  };

  const hasLetter = letter.trim().length === 1 && /^[a-z]$/i.test(letter);
  const hasCriterion =
    q.trim() ||
    tags.trim() ||
    category ||
    area ||
    ingredient.trim() ||
    hasLetter ||
    hasNonDefaultSortOrLimit;

  return (
    <form
      onSubmit={submit}
      className="w-full space-y-4"
      aria-label="Search recipes"
    >
      <div className="flex w-full flex-col gap-0 sm:flex-row sm:items-stretch">
        <input
          type="text"
          name="q"
          className="min-w-0 flex-1 rounded-xl border-2 border-emerald-200/90 bg-white px-4 py-3.5 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 sm:rounded-r-none sm:py-3"
          placeholder="Search by name, ingredients, tags, dish type, or country…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!hasCriterion}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/15 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-l-none sm:border-l-0 sm:py-3"
          aria-label="Search"
        >
          <AiOutlineSearch size={22} className="shrink-0" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          className="text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline"
          aria-expanded={showAdvanced}
          onClick={() => setShowAdvanced((v) => !v)}
        >
          {showAdvanced ? "Hide advanced search" : "Advanced search"}
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 gap-4 rounded-2xl border-2 border-emerald-100/90 bg-white/90 p-4 shadow-sm shadow-emerald-900/5 sm:p-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="block text-sm font-medium text-gray-700 xl:col-span-3">
            Tags
            <input
              type="text"
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
              placeholder="e.g. spicy, vegetarian — comma-separated; all must match"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              autoComplete="off"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Dish type (category)
            <select
              key={`category-${categories.length}`}
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Any category</option>
              {category && !categories.includes(category) && (
                <option value={category}>{category}</option>
              )}
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Country / region
            <select
              key={`area-${areas.length}`}
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">Any country</option>
              {area && !areas.includes(area) && (
                <option value={area}>{area}</option>
              )}
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            First letter of name
            <select
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
              value={
                letter.length === 1 && /^[a-z]$/i.test(letter)
                  ? letter.toLowerCase()
                  : ""
              }
              onChange={(e) => setLetter(e.target.value || "")}
            >
              <option value="">Any letter</option>
              {LETTERS.map((ch) => (
                <option key={ch} value={ch}>
                  {ch.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700 md:col-span-2 xl:col-span-3">
            Ingredients
            <input
              type="text"
              list="ingredient-suggestions"
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
              placeholder="e.g. chicken, garlic, tomato — separate with commas"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              autoComplete="off"
            />
            <datalist id="ingredient-suggestions">
              {ingredients.map((ing) => (
                <option key={ing} value={ing} />
              ))}
            </datalist>
            <span className="mt-1 block text-xs text-gray-500">
              Each ingredient narrows results (recipes that include all of them).
              The main search box also matches ingredient lists on each recipe.
            </span>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Result order
            <select
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Max results
            <select
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            >
              {LIMIT_OPTIONS.map((n) => (
                <option key={n} value={String(n)}>
                  Up to {n} recipes
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-3 border-t border-emerald-100/80 pt-2 md:col-span-2 xl:col-span-3">
            <button
              type="submit"
              disabled={!hasCriterion}
              className="w-full rounded-xl border-2 border-emerald-700 bg-emerald-700 px-5 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply search / Update results
            </button>
            <p className="text-center text-xs text-gray-500 sm:text-left">
              Uses the same search as the bar above—handy when you are filling
              in filters here.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
