import { BiFoodMenu } from "react-icons/bi";
export default function headers(props) {
  return (
    <div>
      <nav id="header" className="w-full z-30 top-0 border-b border-gray-100/80 bg-white/95 py-1 backdrop-blur-sm">
        <div className="container mx-auto mt-0 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <label
            htmlFor="menu-toggle"
            className="-ml-1 block shrink-0 cursor-pointer md:hidden"
          >
            <svg
              className="fill-current text-gray-900"
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 20 20"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </label>
          <input className="hidden" type="checkbox" id="menu-toggle" />

          <div className="order-1 flex min-w-0 md:order-1">
            <a
              className="flex min-w-0 items-center text-lg font-bold tracking-wide text-gray-800 no-underline hover:no-underline sm:text-xl"
              href="/"
            >
              <BiFoodMenu className="mr-1 shrink-0" aria-hidden />
              <span className="truncate">Foodie</span>
            </a>
          </div>

          <div
            className="order-3 hidden w-full md:order-2 md:flex md:w-auto md:items-center"
            id="menu"
          >
            <nav className="w-full md:w-auto">
              <ul className="border-t border-gray-100 pt-4 text-base text-gray-700 md:flex md:items-center md:justify-end md:border-t-0 md:pt-0">
                <li>
                  <a
                    className="inline-block py-2.5 px-4 no-underline hover:text-black hover:underline md:py-2"
                    href="/#recipes"
                  >
                    Recipes
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </nav>
      {props.header && (
        <section className="carousel mx-auto flex w-full bg-nordic-gray-light bg-cover bg-right pt-10 pb-10 md:items-center md:pt-0 md:pb-0">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mt-4 flex w-full max-w-xl flex-col justify-center tracking-wide md:mt-0 lg:max-w-lg">
              <h1 className="my-2 text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl">
                Start cooking with Foodie
              </h1>
              <div className="mt-2 sm:mt-4">
                <a
                  href="/#recipes"
                  className="my-2 inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-600 sm:my-4 sm:text-base"
                >
                  Browse Recipes
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
