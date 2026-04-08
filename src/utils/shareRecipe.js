export async function shareRecipe({ title, url, text }) {
  const payload = {
    title: title || "Recipe",
    text: text || "Check out this recipe on Foodie",
    url,
  };

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(payload);
      return;
    } catch (err) {
      if (err && err.name === "AbortError") return;
    }
  }

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      window.alert("Link copied to clipboard.");
      return;
    }
  } catch {
    /* fall through */
  }

  window.prompt("Copy this link:", url);
}
