import { Link } from "react-router-dom";
import { BiFoodMenu } from "react-icons/bi";

export default function footers() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t-4 border-emerald-500 bg-emerald-900 text-gray-100">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-14">
        <div
          className="grid grid-cols-1 gap-10 sm:gap-y-12 lg:grid-cols-[minmax(0,1.2fr)_auto_auto_minmax(0,1.25fr)] lg:items-stretch lg:gap-x-8 lg:gap-y-0 xl:gap-x-12"
        >
          {/* Brand */}
          <div className="min-w-0 lg:max-w-md">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-white no-underline transition hover:opacity-90"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-800 shadow-inner ring-1 ring-white/15">
                <BiFoodMenu className="text-xl text-emerald-300" aria-hidden />
              </span>
              <span className="text-xl font-bold tracking-tight">Foodie</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-300">
              Discover recipes, explore flavors, and cook with clear steps and
              ingredients—all in one place.
            </p>
          </div>

          {/* Explore — width follows link text */}
          <div className="min-w-0 w-max max-w-full shrink-0 border-t border-emerald-800/70 pt-8 lg:border-t-0 lg:pt-0.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-200 no-underline transition hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/#recipes"
                  className="text-gray-200 no-underline transition hover:text-white"
                >
                  Browse recipes
                </a>
              </li>
            </ul>
          </div>

          {/* Resources — data & docs (sits between Explore and Credits) */}
          <div className="min-w-0 w-max max-w-full shrink-0 border-t border-emerald-800/70 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0.5 xl:pl-10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="https://www.themealdb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 no-underline transition hover:text-white"
                >
                  TheMealDB
                </a>
              </li>
              <li>
                <a
                  href="https://www.themealdb.com/api.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 no-underline transition hover:text-white"
                >
                  API documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div className="min-w-0 border-t border-emerald-800/70 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0.5 xl:pl-10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
              Credits
            </h3>
            <p className="mt-4 break-words text-sm leading-6 text-gray-300">
              Recipe names, ingredients, and images come from TheMealDB—a free,
              community-run database.
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              See Resources for links and API details.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-emerald-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">
            © {year} Foodie. Made for home cooks everywhere.
          </p>
          <p className="text-xs text-gray-400">
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/betselot-getnet-2423561aa/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white no-underline hover:underline"
            >
              Betselot Getnet
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
