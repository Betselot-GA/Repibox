import { AiOutlineShareAlt } from "react-icons/ai";
import { shareRecipe } from "../utils/shareRecipe";

export default function ShareRecipeButton({
  title,
  recipeId,
  iconSize = 24,
  variant = "icon",
  stopNavigation = false,
}) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/recipe/${recipeId}`
      : `/recipe/${recipeId}`;

  const handleClick = (e) => {
    if (stopNavigation) {
      e.preventDefault();
      e.stopPropagation();
    }
    shareRecipe({ title, url });
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 sm:w-auto"
        aria-label="Share recipe"
      >
        <AiOutlineShareAlt className="text-lg" aria-hidden />
        Share
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex shrink-0 items-center justify-center rounded-full p-1.5 text-gray-500 transition hover:bg-emerald-50 hover:text-emerald-700"
      aria-label="Share recipe"
    >
      <AiOutlineShareAlt size={iconSize} aria-hidden />
    </button>
  );
}
