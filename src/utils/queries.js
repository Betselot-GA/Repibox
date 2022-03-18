import axios from "axios";

const apiEndpoint = "https://www.larecipe.com/api/";

//fetch recipes from the api with infinite scroll
export async function fetchRecipes({ pageParam = null }) {
  let res;
  if (pageParam == null) {
    res = await axios.get(apiEndpoint + "recipes");
  } else {
    res = await axios.get(apiEndpoint + "recipes?page=" + pageParam);
  }
  return res.data;
}

//search recipes 
export async function searchRecipes({queryKey, pageParam = null}) {
  const q = queryKey[1];
  let res;

  if(pageParam == null) {
    res = await axios.get(apiEndpoint + "recipes?search=" + q);
  } else{
    res = await axios.get(apiEndpoint + "recipes?search="+ q + "&&page=" + pageParam);
  }

  return res.data;
}