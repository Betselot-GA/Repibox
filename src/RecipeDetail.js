import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { BiArrowBack } from "react-icons/bi";
import {
  fetchMealById,
  parseMealIngredients,
  parseTags,
} from "./utils/queries.js";
import Headers from "./components/Header.js";
import Footers from "./components/Footer.js";
import ShareRecipeButton from "./components/ShareRecipeButton.js";

function youtubeEmbedUrl(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

/** Turn API instruction blob into readable steps */
function instructionSteps(text) {
  if (!text || !String(text).trim()) return [];
  const t = String(text).replace(/\r\n/g, "\n").trim();
  const doubleBreak = t.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
  if (doubleBreak.length > 1) return doubleBreak;
  const numbered = t
    .split(/(?=\n\d+[.)]\s)/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (numbered.length > 1) return numbered;
  return [t];
}

function LoadingRecipe() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true">
      <div className="h-9 w-48 rounded-lg bg-emerald-100/80" />
      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="h-52 rounded-2xl bg-emerald-100/80 sm:h-60 lg:h-auto lg:min-h-[12rem]" />
        <div className="flex min-h-[12rem] flex-col space-y-3 lg:h-auto">
          <div className="h-7 w-40 rounded bg-emerald-100/80" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-4 w-full rounded bg-gray-100" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-7 w-36 rounded bg-emerald-100/80" />
        <div className="h-24 w-full rounded-xl bg-gray-100" />
        <div className="h-24 w-full rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function RecipeDetail() {
  const { id } = useParams();
  const { status, data: meal, error } = useQuery(
    ["meal", id],
    () => fetchMealById(id),
    { enabled: Boolean(id) }
  );

  const embed = meal ? youtubeEmbedUrl(meal.strYoutube) : null;
  const ingredients = meal ? parseMealIngredients(meal) : [];
  const steps = meal ? instructionSteps(meal.strInstructions) : [];
  const detailTags = meal ? parseTags(meal.strTags) : [];

  return (
    <>
      <Headers header={false} />
      <article className="min-h-screen bg-gradient-to-b from-emerald-50/90 via-white to-gray-50/80">
        <div className="container mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            <BiArrowBack className="text-lg" aria-hidden />
            Back to recipes
          </Link>

          {status === "loading" && <LoadingRecipe />}

          {status === "error" && (
            <div className="rounded-2xl border border-red-100 bg-red-50/80 px-6 py-8 text-center">
              <p className="font-semibold text-red-900">Something went wrong</p>
              <p className="mt-2 text-sm text-red-800/90">
                {error?.message || "Could not load this recipe."}
              </p>
              <Link
                to="/"
                className="mt-6 inline-block rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                Go home
              </Link>
            </div>
          )}

          {status === "success" && !meal && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-lg font-medium text-gray-800">
                Recipe not found.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block text-emerald-700 hover:underline"
              >
                Browse all recipes
              </Link>
            </div>
          )}

          {meal && (
            <>
              <header className="mb-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <h1 className="min-w-0 flex-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                    {meal.strMeal}
                  </h1>
                  <ShareRecipeButton
                    variant="pill"
                    title={meal.strMeal}
                    recipeId={id}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {meal.strCategory && (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-900">
                      {meal.strCategory}
                    </span>
                  )}
                  {meal.strArea && (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                      {meal.strArea}
                    </span>
                  )}
                  {detailTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
                <div className="flex min-h-0 lg:col-span-5 lg:h-full lg:flex-col">
                  {meal.strMealThumb && (
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-emerald-100/80 bg-white shadow-lg shadow-emerald-900/5 ring-1 ring-black/5">
                      <img
                        src={meal.strMealThumb}
                        alt={meal.strMeal || "Recipe"}
                        className="h-52 w-full object-cover sm:h-60 lg:h-full lg:min-h-0 lg:flex-1"
                      />
                    </div>
                  )}
                </div>

                <div className="flex min-h-0 lg:col-span-7 lg:h-full lg:flex-col">
                  <section className="flex h-full min-h-0 flex-1 flex-col rounded-2xl border border-emerald-100 bg-white p-6 shadow-md shadow-emerald-900/5 sm:p-8">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm text-white">
                        {ingredients.length}
                      </span>
                      Ingredients
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Gather everything before you start cooking.
                    </p>
                    <ul className="mt-6 divide-y divide-gray-100">
                      {ingredients.map((row, i) => (
                        <li
                          key={i}
                          className="flex flex-col gap-0.5 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:gap-4"
                        >
                          <span className="shrink-0 text-sm font-medium tabular-nums text-emerald-700 sm:w-28">
                            {row.measure || "—"}
                          </span>
                          <span className="min-w-0 break-words text-[0.95rem] leading-snug text-gray-800">
                            {row.ingredient}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              {embed && (
                <div className="mt-10 w-full sm:mt-12 lg:mt-14">
                  <section
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-xl"
                    aria-labelledby="recipe-video-heading"
                  >
                    <div className="border-b border-white/10 bg-gray-950 px-4 py-3 sm:px-5 sm:py-3.5">
                      <h2
                        id="recipe-video-heading"
                        className="text-sm font-semibold text-white sm:text-base"
                      >
                        Watch how it&apos;s made
                      </h2>
                    </div>
                    <div className="aspect-video w-full">
                      <iframe
                        title="Recipe video"
                        src={embed}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </section>
                </div>
              )}

              <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-10">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Instructions
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Follow each step for best results.
                </p>
                <ol className="mt-8 space-y-6">
                  {steps.map((step, index) => (
                    <li key={index} className="flex gap-4 sm:gap-5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5 text-[0.95rem] leading-relaxed text-gray-800 sm:text-base sm:leading-7">
                        {step}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {meal.strSource && meal.strSource.trim() && (
                <footer className="mt-10 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-emerald-800/80">
                    Original recipe
                  </p>
                  <a
                    href={meal.strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 break-all text-sm font-medium text-emerald-700 hover:underline"
                  >
                    {meal.strSource}
                  </a>
                </footer>
              )}
            </>
          )}
        </div>
      </article>
      <Footers />
    </>
  );
}
