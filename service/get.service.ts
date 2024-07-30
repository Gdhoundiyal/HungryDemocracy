import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebase";
export const getService = {
  getRecipes,
};
async function getRecipes() {
  const q = query(collection(db, "recipes"));

  const querySnapshot = await getDocs(q);

  // });
  let recipes = [];
  querySnapshot.forEach((doc) => {
    recipes.push(doc.data());
  });
  return recipes;
}
