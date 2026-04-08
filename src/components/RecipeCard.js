import { Link } from "react-router-dom";
import ShareRecipeButton from "./ShareRecipeButton";

export default function RecipeCard(props) {
  const to = `/recipe/${props.post.idMeal}`;
  return (
    <article className="flex h-full min-h-0 flex-col rounded-2xl border border-emerald-100/90 bg-white/95 p-4 shadow-sm shadow-emerald-900/[0.06] ring-1 ring-black/[0.04] transition-shadow duration-200 hover:shadow-md hover:shadow-emerald-900/10">
      <Link
        to={to}
        className="group shrink-0 overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      >
        <img
          className="h-44 w-full object-cover shadow-inner transition-transform duration-200 group-hover:scale-[1.02] sm:h-48 md:h-52"
          src={props.post.post_img_url_src}
          alt=""
        />
      </Link>
      <div className="flex shrink-0 items-start justify-between gap-2 pt-3">
        <Link
          to={to}
          className="min-w-0 flex-1 no-underline text-inherit hover:text-emerald-800"
        >
          <p className="text-[0.95rem] font-medium leading-snug sm:text-base">
            {props.post.post_title}
          </p>
        </Link>
        <ShareRecipeButton
          title={props.post.post_title}
          recipeId={props.post.idMeal}
        />
      </div>
      <Link
        to={to}
        className="group mt-3 flex min-h-0 flex-1 flex-col no-underline text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:mt-4"
      >
        <p className="text-sm leading-relaxed text-gray-600">
          {props.post.post_description}
        </p>
        {Array.isArray(props.post.post_tags) &&
          props.post.post_tags.length > 0 && (
            <ul className="mt-2 flex list-none flex-wrap gap-1.5 p-0">
              {props.post.post_tags.slice(0, 5).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-900"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        <div className="mt-auto w-full rounded-xl border-2 border-emerald-600 bg-emerald-50/50 px-4 py-2.5 text-center text-sm font-bold text-emerald-900 group-hover:border-emerald-500 group-hover:bg-emerald-50 sm:py-2">
          View Recipe
        </div>
      </Link>
    </article>
  );
}
