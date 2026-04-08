/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { fetchRecipes } from "./utils/queries.js";
import RecipeCard from "./components/RecipeCard";
import RecipeSearchPanel from "./components/RecipeSearchPanel.js";

const PAGE_SHELL =
  "min-h-screen bg-gradient-to-b from-emerald-50/95 via-white to-slate-50/90";
const PAGE_INNER =
  "w-full max-w-[1600px] mx-auto px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-10";

const RECIPE_GRID =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-8";

export default function recipes() {
  const { ref, inView } = useInView();
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery("recipes", fetchRecipes, {
    getNextPageParam: (lastPage) => lastPage.page ?? undefined,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <section className={PAGE_SHELL}>
      <div className={PAGE_INNER}>
        <nav
          className="mb-10 w-full border-b border-emerald-100/90 pb-8"
          aria-label="Recipe search"
        >
          <div className="flex flex-col gap-6">
            <a
              className="w-fit text-lg font-bold uppercase tracking-wide text-gray-800 no-underline hover:text-emerald-800 sm:text-xl"
              href="/"
              id="recipes"
            >
              Recipes
            </a>
            <RecipeSearchPanel />
          </div>
        </nav>

        {status === "loading" ? (
          <div className="mx-auto max-w-lg px-4 py-16 text-center min-h-[40vh] flex flex-col justify-center">
            <p className="text-lg font-semibold text-gray-700">
              Loading recipes…
            </p>
          </div>
        ) : status === "error" ? (
          <div className="mx-auto max-w-lg px-4 py-12 text-center">
            <p className="text-base text-gray-700">
              Something went wrong. Refresh the page and try again.
            </p>
            <p className="mt-2 text-sm text-red-600">{error.message}</p>
          </div>
        ) : (
          <>
            <div className={RECIPE_GRID}>
              {data.pages.flatMap((page) =>
                page.posts.map((recipe) => (
                  <RecipeCard key={recipe.idMeal} post={recipe} />
                ))
              )}
            </div>
            <div className="mt-12 flex w-full justify-center px-2 sm:mt-16">
              <button
                ref={ref}
                type="button"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className="w-full max-w-md rounded-xl border-2 border-emerald-700 bg-emerald-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isFetchingNextPage
                  ? "Loading more…"
                  : hasNextPage
                  ? "Load more"
                  : "No more recipes"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
