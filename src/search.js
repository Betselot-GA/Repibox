/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchAdvancedSearch } from "./utils/queries.js";
import RecipeCard from "./components/RecipeCard";
import Headers from "./components/Header.js";
import Footers from "./components/Footer.js";
import RecipeSearchPanel from "./components/RecipeSearchPanel.js";

const PAGE_SHELL =
  "min-h-screen bg-gradient-to-b from-emerald-50/95 via-white to-slate-50/90";
const PAGE_INNER =
  "w-full max-w-[1600px] mx-auto px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-10";

const RECIPE_GRID =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-8";

function sortPosts(posts, sort) {
  if (!posts || posts.length === 0) return posts || [];
  if (sort === "name-asc") {
    return [...posts].sort((a, b) =>
      (a.post_title || "").localeCompare(b.post_title || "", undefined, {
        sensitivity: "base",
      })
    );
  }
  if (sort === "name-desc") {
    return [...posts].sort((a, b) =>
      (b.post_title || "").localeCompare(a.post_title || "", undefined, {
        sensitivity: "base",
      })
    );
  }
  return posts;
}

function hasLetterParam(letterRaw) {
  const L = (letterRaw || "").trim().toLowerCase().slice(0, 1);
  return L >= "a" && L <= "z";
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || searchParams.get("name") || "";
  const tags = searchParams.get("tags") || "";
  const category = searchParams.get("category") || "";
  const area = searchParams.get("area") || "";
  const ingredient = searchParams.get("ingredient") || "";
  const letterRaw = searchParams.get("letter") || "";
  const sort = searchParams.get("sort") || "relevance";
  const limit = searchParams.get("limit") || "72";

  const hasSearch = Boolean(
    q.trim() ||
      tags.trim() ||
      category ||
      area ||
      ingredient.trim() ||
      hasLetterParam(letterRaw)
  );

  const { data: posts = [], status, error } = useQuery(
    ["search", q, tags, category, area, ingredient, letterRaw, limit],
    () =>
      fetchAdvancedSearch({
        q,
        tags,
        category,
        area,
        ingredient,
        firstLetter: letterRaw,
        limit,
      }),
    { enabled: hasSearch }
  );

  const sortedPosts = useMemo(
    () => sortPosts(posts, sort),
    [posts, sort]
  );

  const resultCount = sortedPosts.length;
  const showEmpty = hasSearch && status === "success" && resultCount === 0;
  const loading = hasSearch && status === "loading";

  const sortLabel =
    sort === "name-asc"
      ? "Name A–Z"
      : sort === "name-desc"
      ? "Name Z–A"
      : "Relevance";

  return (
    <>
      <Headers header={false} />
      <section className={PAGE_SHELL}>
        <div className={PAGE_INNER}>
          <nav
            className="mb-10 w-full border-b border-emerald-100/90 pb-8"
            aria-label="Search"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className="text-lg font-bold uppercase tracking-wide text-gray-800 sm:text-xl"
                    id="recipes"
                  >
                    {loading ? (
                      "Searching…"
                    ) : hasSearch ? (
                      <>
                        <span className="text-gray-900">{resultCount}</span>{" "}
                        <span className="font-semibold text-gray-600">
                          {resultCount === 1 ? "result" : "results"}
                        </span>
                      </>
                    ) : (
                      "Search recipes"
                    )}
                  </p>
                  {hasSearch && (
                    <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
                      {q && <span>Keywords: &ldquo;{q}&rdquo;. </span>}
                      {tags && <span>Tags: {tags}. </span>}
                      {category && <span>Type: {category}. </span>}
                      {area && <span>Country: {area}. </span>}
                      {ingredient && (
                        <span>Ingredients: {ingredient}. </span>
                      )}
                      {hasLetterParam(letterRaw) && (
                        <span>
                          First letter:{" "}
                          {(letterRaw || "").trim().slice(0, 1).toUpperCase()}
                          .{" "}
                        </span>
                      )}
                      <span>Order: {sortLabel}. </span>
                      <span>Showing up to {limit}.</span>
                    </p>
                  )}
                </div>
              </div>
              <RecipeSearchPanel
                initialQ={q}
                initialTags={tags}
                initialCategory={category}
                initialArea={area}
                initialIngredient={ingredient}
                initialLetter={letterRaw}
                initialSort={sort}
                initialLimit={limit}
                expandAdvancedWhenDirty
              />
            </div>
          </nav>

          {!hasSearch && (
            <div className="mx-auto max-w-2xl py-16 text-center text-gray-600">
              <p className="text-base leading-relaxed">
                Use the bar above for names, tags, cuisines, and ingredients—or
                open{" "}
                <span className="font-semibold text-emerald-800">
                  Advanced search
                </span>{" "}
                for category, country, first letter, main ingredient, sort, and
                how many results to load.
              </p>
            </div>
          )}

          {hasSearch && status === "error" && (
            <div className="mx-auto max-w-lg px-4 py-12 text-center">
              <p className="text-base text-gray-700">
                Something went wrong. Try again in a moment.
              </p>
              <p className="mt-2 text-sm text-red-600">{error?.message}</p>
            </div>
          )}

          {loading && (
            <div className="mx-auto max-w-lg px-4 py-16 text-center">
              <p className="text-lg font-semibold text-gray-700">
                Loading recipes…
              </p>
            </div>
          )}

          {showEmpty && (
            <div className="mx-auto max-w-lg py-12 text-center text-gray-600">
              <p className="text-base font-medium text-gray-800">
                No recipes matched your search.
              </p>
              <p className="mt-2 text-sm">
                Try fewer keywords, another dish type or country, relax tag
                filters, or raise the max results in advanced options.
              </p>
            </div>
          )}

          {hasSearch && status === "success" && resultCount > 0 && (
            <div className={RECIPE_GRID}>
              {sortedPosts.map((recipe) => (
                <RecipeCard key={recipe.idMeal} post={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footers />
    </>
  );
}
