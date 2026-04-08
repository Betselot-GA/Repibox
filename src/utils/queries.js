import axios from "axios";

/** TheMealDB — https://www.themealdb.com/api.php (test key "1" for development) */
const MEALDB_API_KEY = process.env.REACT_APP_MEALDB_API_KEY || "1";
const apiBase = `https://www.themealdb.com/api/json/v1/${MEALDB_API_KEY}`;

const BROWSE_LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

function mealsArray(data) {
  const m = data && data.meals;
  return Array.isArray(m) ? m : [];
}

export function parseTags(str) {
  if (!str || typeof str !== "string") return [];
  return str
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function mapMealToPost(meal) {
  const tagList = parseTags(meal.strTags);
  const bits = [meal.strCategory, meal.strArea].filter(Boolean);
  let description = bits.join(" · ");
  if (!description && meal.strInstructions) {
    const text = meal.strInstructions.replace(/\s+/g, " ").trim();
    description =
      text.length > 160 ? `${text.slice(0, 160)}…` : text;
  }
  const id = meal.idMeal;
  const url =
    (meal.strSource && meal.strSource.trim()) ||
    `https://www.themealdb.com/meal.php?i=${id}`;

  return {
    idMeal: id,
    post_title: meal.strMeal || "",
    post_description: description,
    post_img_url_src: meal.strMealThumb || "",
    post_url: url,
    post_tags: tagList,
  };
}

/** Minimal meal from filter.php (id, name, thumb only) */
export function mapFilterMealToPost(m) {
  return {
    idMeal: m.idMeal,
    post_title: m.strMeal || "",
    post_description: "View full recipe for details.",
    post_img_url_src: m.strMealThumb || "",
    post_url: `https://www.themealdb.com/meal.php?i=${m.idMeal}`,
    post_tags: [],
  };
}

export function parseMealIngredients(meal) {
  const rows = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && String(ing).trim()) {
      rows.push({
        ingredient: String(ing).trim(),
        measure: meas ? String(meas).trim() : "",
      });
    }
  }
  return rows;
}

export async function fetchMealById(id) {
  const res = await axios.get(`${apiBase}/lookup.php`, {
    params: { i: id },
  });
  const rows = mealsArray(res.data);
  return rows[0] || null;
}

async function filterByIngredient(i) {
  const res = await axios.get(`${apiBase}/filter.php`, { params: { i } });
  return mealsArray(res.data);
}

async function filterByCategory(c) {
  const res = await axios.get(`${apiBase}/filter.php`, { params: { c } });
  return mealsArray(res.data);
}

async function filterByArea(a) {
  const res = await axios.get(`${apiBase}/filter.php`, { params: { a } });
  return mealsArray(res.data);
}

function intersectById(lists) {
  if (lists.length === 0) return [];
  const [first, ...rest] = lists;
  if (!first.length) return [];
  let idMap = new Map(first.map((m) => [m.idMeal, m]));
  for (const list of rest) {
    const next = new Set((list || []).map((m) => m.idMeal));
    idMap = new Map(
      [...idMap].filter(([id]) => next.has(id))
    );
  }
  return [...idMap.values()];
}

const MAX_KEYWORD_LOOKUPS = 96;
const LOOKUP_CHUNK = 12;

function normalizeSearchLimit(limit) {
  const n = Number(limit);
  if (!Number.isFinite(n)) return 72;
  return Math.min(96, Math.max(12, Math.round(n / 12) * 12));
}

function normalizeFirstLetter(firstLetter) {
  const c = String(firstLetter || "")
    .trim()
    .toLowerCase()
    .slice(0, 1);
  if (c >= "a" && c <= "z") return c;
  return "";
}

function uniqueTokens(q) {
  const t = String(q)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 2);
  return [...new Set(t)];
}

function mealIngredientHaystack(meal) {
  const parts = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    if (ing && String(ing).trim()) {
      parts.push(String(ing).trim());
    }
  }
  return parts.join(" ").toLowerCase();
}

function mealHaystack(meal) {
  return [
    meal.strMeal,
    meal.strCategory,
    meal.strArea,
    meal.strTags || "",
    mealIngredientHaystack(meal),
  ]
    .join(" ")
    .toLowerCase();
}

/** Comma/semicolon-separated → normalized API ingredient keys (underscore, lower). */
function parseIngredientFilters(ingredientString) {
  const keys = String(ingredientString)
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\s+/g, "_").toLowerCase())
    .filter(Boolean);
  return [...new Set(keys)];
}

function mealMatchesWordTokens(meal, tokens) {
  if (!tokens.length) return true;
  const hay = mealHaystack(meal);
  return tokens.every((t) => hay.includes(t));
}

function mealMatchesTagFilters(meal, tagFilters) {
  if (!tagFilters.length) return true;
  const blob = (meal.strTags || "").toLowerCase();
  return tagFilters.every((t) => blob.includes(t));
}

async function searchByName(s) {
  const res = await axios.get(`${apiBase}/search.php`, {
    params: { s: String(s).trim() },
  });
  return mealsArray(res.data);
}

async function collectKeywordCandidateIds(
  qTrim,
  categories,
  areas,
  ingredientNames
) {
  const ids = [];
  const seen = new Set();
  const push = (list) => {
    for (const m of list) {
      if (m && m.idMeal && !seen.has(m.idMeal)) {
        seen.add(m.idMeal);
        ids.push(m.idMeal);
      }
    }
  };

  push(await searchByName(qTrim));

  const tokens = uniqueTokens(qTrim);
  for (const token of tokens) {
    push(await searchByName(token));
  }

  const usedCats = new Set();
  for (const token of tokens) {
    for (const c of categories) {
      const cl = c.toLowerCase();
      const tl = token.toLowerCase();
      if (cl.includes(tl) || tl.includes(cl)) {
        if (!usedCats.has(c)) {
          usedCats.add(c);
          push(await filterByCategory(c));
        }
      }
    }
  }

  const usedAreas = new Set();
  for (const token of tokens) {
    for (const a of areas) {
      const al = a.toLowerCase();
      const tl = token.toLowerCase();
      if (al.includes(tl) || tl.includes(al)) {
        if (!usedAreas.has(a)) {
          usedAreas.add(a);
          push(await filterByArea(a));
        }
      }
    }
  }

  const ingList = Array.isArray(ingredientNames) ? ingredientNames : [];
  const usedIngApi = new Set();
  for (const token of tokens) {
    if (token.length < 2) continue;
    const matches = [];
    for (const name of ingList) {
      const nl = String(name).toLowerCase();
      if (nl === token) matches.unshift(name);
      else if (
        token.length >= 3 &&
        (nl.includes(token) || token.includes(nl))
      ) {
        matches.push(name);
      }
    }
    const picks = matches.slice(0, 4);
    for (const name of picks) {
      const ingApi = String(name).replace(/\s+/g, "_").toLowerCase();
      if (!usedIngApi.has(ingApi)) {
        usedIngApi.add(ingApi);
        push(await filterByIngredient(ingApi));
      }
    }
    if (token.length >= 3) {
      const rawApi = token.replace(/\s+/g, "_").toLowerCase();
      if (!usedIngApi.has(rawApi)) {
        usedIngApi.add(rawApi);
        push(await filterByIngredient(rawApi));
      }
    }
  }

  return ids;
}

async function fetchMealsByIds(idList) {
  const out = [];
  for (let i = 0; i < idList.length; i += LOOKUP_CHUNK) {
    const chunk = idList.slice(i, i + LOOKUP_CHUNK);
    const meals = await Promise.all(chunk.map((id) => fetchMealById(id)));
    for (const m of meals) {
      if (m) out.push(m);
    }
  }
  return out;
}

/**
 * Search: structured filters (category / area / ingredient), optional keywords `q`
 * (matches name, tags, dish type, country), and optional `tags` (comma-separated, all must match).
 * @deprecated name — merged into q when q is empty
 */
export async function fetchAdvancedSearch({
  q = "",
  name = "",
  tags = "",
  category = "",
  area = "",
  ingredient = "",
  firstLetter = "",
  limit = 72,
}) {
  const limitNum = normalizeSearchLimit(limit);
  const letterCh = normalizeFirstLetter(firstLetter);

  const qTrim = String(q).trim() || String(name).trim();
  const tagFilters = String(tags)
    .split(/[,;]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const cat = String(category).trim();
  const ar = String(area).trim();
  const ingRaw = String(ingredient).trim();
  const ingKeys = parseIngredientFilters(ingRaw);

  const filterLists = [];
  for (const ingApi of ingKeys) {
    filterLists.push(await filterByIngredient(ingApi));
  }
  if (cat) filterLists.push(await filterByCategory(cat));
  if (ar) filterLists.push(await filterByArea(ar));

  const structuredMeals =
    filterLists.length > 0 ? intersectById(filterLists) : null;

  const wordTokens = uniqueTokens(qTrim);

  const needsFullMeals =
    Boolean(qTrim) || tagFilters.length > 0;

  const applyLetterToPosts = (posts) => {
    if (!letterCh) return posts;
    return posts.filter((p) =>
      (p.post_title || "").toLowerCase().startsWith(letterCh)
    );
  };

  if (!needsFullMeals && structuredMeals) {
    let posts = structuredMeals.map(mapFilterMealToPost);
    posts = applyLetterToPosts(posts);
    return posts.slice(0, limitNum);
  }

  if (!needsFullMeals && !structuredMeals && letterCh) {
    const res = await axios.get(`${apiBase}/search.php`, {
      params: { f: letterCh },
    });
    const meals = mealsArray(res.data);
    return meals.map(mapMealToPost).slice(0, limitNum);
  }

  if (!needsFullMeals && !structuredMeals) {
    return [];
  }

  let idOrder = [];

  if (qTrim) {
    const [catRows, areaRows, ingRows] = await Promise.all([
      fetchCategoryOptions(),
      fetchAreaOptions(),
      fetchIngredientOptions(),
    ]);
    idOrder = await collectKeywordCandidateIds(
      qTrim,
      catRows,
      areaRows,
      ingRows
    );
  } else if (tagFilters.length) {
    const seed = await searchByName(tagFilters[0]);
    const seen = new Set();
    for (const m of seed) {
      if (m && m.idMeal && !seen.has(m.idMeal)) {
        seen.add(m.idMeal);
        idOrder.push(m.idMeal);
      }
    }
  }

  if (structuredMeals) {
    const allowed = new Set(structuredMeals.map((m) => m.idMeal));
    idOrder = idOrder.filter((id) => allowed.has(id));
  }

  if (tagFilters.length && !qTrim && idOrder.length === 0 && structuredMeals) {
    idOrder = structuredMeals.map((m) => m.idMeal);
  }

  idOrder = idOrder.slice(
    0,
    Math.min(MAX_KEYWORD_LOOKUPS, Math.max(limitNum + 24, 48))
  );

  let fullMeals = await fetchMealsByIds(idOrder);

  if (!qTrim && tagFilters.length && fullMeals.length === 0) {
    if (structuredMeals && structuredMeals.length) {
      const cap = structuredMeals
        .map((m) => m.idMeal)
        .slice(0, MAX_KEYWORD_LOOKUPS);
      fullMeals = await fetchMealsByIds(cap);
    }
  }

  fullMeals = fullMeals.filter(
    (m) =>
      mealMatchesWordTokens(m, wordTokens) &&
      mealMatchesTagFilters(m, tagFilters)
  );

  if (letterCh) {
    fullMeals = fullMeals.filter((m) =>
      (m.strMeal || "").toLowerCase().startsWith(letterCh)
    );
  }

  return fullMeals.map(mapMealToPost).slice(0, limitNum);
}

export async function fetchCategoryOptions() {
  const res = await axios.get(`${apiBase}/list.php`, { params: { c: "list" } });
  const rows = mealsArray(res.data);
  return rows.map((r) => r.strCategory).filter(Boolean);
}

export async function fetchAreaOptions() {
  const res = await axios.get(`${apiBase}/list.php`, { params: { a: "list" } });
  const rows = mealsArray(res.data);
  return rows.map((r) => r.strArea).filter(Boolean);
}

export async function fetchIngredientOptions() {
  const res = await axios.get(`${apiBase}/list.php`, { params: { i: "list" } });
  const rows = mealsArray(res.data);
  return rows.map((r) => r.strIngredient).filter(Boolean);
}

function letterFromPageParam(pageParam) {
  if (pageParam == null) return "a";
  return String(pageParam).toLowerCase().slice(0, 1) || "a";
}

/** Browse: one page per first letter (a–z), mapped to existing infinite-query shape */
export async function fetchRecipes({ pageParam = null }) {
  const letter = letterFromPageParam(pageParam);
  const idx = BROWSE_LETTERS.indexOf(letter);
  const res = await axios.get(`${apiBase}/search.php`, {
    params: { f: letter },
  });
  const meals = mealsArray(res.data);
  const posts = meals.map(mapMealToPost);
  const nextLetter =
    idx >= 0 && idx < BROWSE_LETTERS.length - 1
      ? BROWSE_LETTERS[idx + 1]
      : undefined;

  return { posts, page: nextLetter };
}

/** @deprecated use fetchAdvancedSearch via search route — kept for compatibility */
export async function searchRecipes({ queryKey, pageParam = null }) {
  const q = (queryKey[1] || "").trim();
  if (!q) {
    return { posts: [], page: undefined };
  }
  if (pageParam != null) {
    return { posts: [], page: undefined };
  }

  const posts = await fetchAdvancedSearch({ q });
  return { posts, page: undefined };
}
