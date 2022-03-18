import { BiFoodMenu, BiUser } from "react-icons/bi";
import { AiOutlineChrome } from "react-icons/ai";
export default function headers(props) {
  return (
    <div>
      <nav id="header" className="w-full z-30 top-0 py-1">
        <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-6 py-3">
          <label for="menu-toggle" className="cursor-pointer md:hidden block">
            <svg
              className="fill-current text-gray-900"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <title>menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </label>
          <input className="hidden" type="checkbox" id="menu-toggle" />

          <div
            className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1"
            id="menu"
          >
            <nav>
              <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                <li>
                  <a
                    className="inline-block no-underline hover:text-black hover:underline py-2 px-4"
                    href="/"
                  >
                    Recipes
                  </a>
                </li>
                <li>
                  <a
                    className="inline-block no-underline hover:text-black hover:underline py-2 px-4"
                    href="https://www.linkedin.com/in/betselot-getnet-2423561aa/"
                  >
                    About
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="order-1 md:order-2">
            <a
              className="flex items-center tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl "
              href="/"
            >
              <BiFoodMenu className="mr-1" />
              Repibox
            </a>
          </div>

          <div
            className="order-2 md:order-3 flex items-center"
            id="nav-content"
          >
            <a className="inline-block no-underline hover:text-black" href="/">
              <BiUser size={30} />
            </a>

            <a
              className="pl-3 inline-block no-underline hover:text-black"
              href="https://chrome.google.com/webstore/detail/repibox-recipe-viewer-ext/nbgpmjdmplldckdiolbacdflmebgnoij    "
            >
              <div className="flex flex-row gap-1 px-2 bg-red-900 py-1 rounded-lg text-white">
                <AiOutlineChrome size={25} />
                Add extension
              </div>
            </a>
          </div>
        </div>
      </nav>
      {props.header && (
        <section className="w-full mx-auto bg-nordic-gray-light flex pt-12 md:pt-0 md:items-center bg-cover bg-right carousel">
          <div className="container mx-auto">
            <div className="flex flex-col w-full lg:w-1/2 justify-center items-start  px-6 tracking-wide mt-10">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg my-2">
                Start cooking with Repibox
              </h1>
              <div className="flex flex-row gap-4">
                <a
                  href="/#recipes"
                  className="my-4 text-white font-bold bg-red-900 px-5 py-3 rounded-xl hover:bg-red-800"
                >
                  Browse Recipes
                </a>

                <a
                  href="https://chrome.google.com/webstore/detail/repibox-recipe-viewer-ext/nbgpmjdmplldckdiolbacdflmebgnoij"
                  className="my-4 text-white font-bold bg-transparent border-2 border-white  hover:border-red-800 hover:text-gray-300 px-5 py-3 rounded-xl"
                >
                  Add Extension
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
