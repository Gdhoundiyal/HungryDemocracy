import {
  deleteImageUrlFromDB,
  deletePartialRecipeFromDrafts,
  loadAllCategoriesFromDb,
  loadAllCuisinesFromDb,
  loadAllToolsFromDb,
  saveRecipeToDb,
  updateRecipeToDb,
} from "@/service/db.service";

import { collection, doc } from "firebase/firestore";
import { db } from "../../firebase";
// // import { usersCollection } from '@/config/firebase';

function initialState() {
  return {
    allCategories: [],
    allCuisines: [],
    allTools: [],
    ingredients: [{}],
    ingredientSections: [{ name: "Main Section", ingredients: [{}] }],
    directions: [""],
    title: null,
    subTitle: null,
    desc: null,
    cookingTime: null,
    prepTime: null,
    serves: null,
    categories: [],
    cuisines: [],
    tools: [],
    images: null,
    imageUrls: [],
    updated: "1",
    isDraft: true,
    draftId: null,
    savingStatus: null,
    uploadingImage: false,
  };
}

export default {
  state: initialState,
  mutations: {
    ADD_INGREDIENT(state) {
      state.ingredients.push({});
    },
    ADD_EMPTY_INGREDIENT_IN_SECTION(state, sectionIndex) {
      state.ingredientSections[sectionIndex].ingredients.push({});
    },
    ADD_DIRECTION(state) {
      state.directions.push("");
    },
    ADD_AND_SAVE_INGREDIENT(state, { sectionIndex, currentIndex, ingredient }) {
      state.ingredientSections[sectionIndex].ingredients[currentIndex] =
        ingredient;
    },
    ADD_AND_SAVE_INGREDIENT_FOR_SECTION(
      state,
      { sectionIndex, currIndex, ingredient }
    ) {
      const section = state.ingredientSections[sectionIndex];
      const existingIngredients = section.ingredients;

      existingIngredients[currIndex] = ingredient;

      state.ingredientSections.splice(sectionIndex, 1, section);

      //state.ingredientSections[sectionIndex].ingredients[ingIndex] = ingredient;
    },
    ADD_AND_SAVE_NEW_SECTION(state, sectionName) {
      const newSection = { name: sectionName, ingredients: [{}] };
      state.ingredientSections.push(newSection);
    },
    ADD_AND_SAVE_DIRECTION(state, { index, directionText }) {
      state.directions[index] = directionText;
    },
    SAVE_COOKING_TIME(state, cookingTime) {
      state.cookingTime = cookingTime;
    },
    SAVE_PREP_TIME(state, prepTime) {
      state.prepTime = prepTime;
    },
    SAVE_SERVES(state, serves) {
      state.serves = serves;
    },
    UPDATE_ALL_CATEGORIES(state, results) {
      state.allCategories = results;
    },
    UPDATE_ALL_TOOLS(state, results) {
      state.allTools = results;
    },
    UPDATE_ALL_CUISINES(state, results) {
      state.allCuisines = results;
    },
    SAVE_PARTIAL_RECIPE(state, results) {
      const uid = JSON.parse(localStorage.getItem("user"))["uid"];
      const userDraftRef = doc(collection(doc(db, "users", uid), "drafts"));
      const draftObjId = userDraftRef.id;
      //  usersCollection.doc(uid).collection("drafts").doc().id;
      const currentDraftId = state["draftId"] || draftObjId;
      const key = Object.keys(results)[0];
      state[key] = results[key];
      state.draftId = currentDraftId;
    },
    SET_DRAFT_ID(state) {
      const uid = JSON.parse(localStorage.getItem("user"))["uid"];
      const userDraftRef = doc(collection(doc(db, "users", uid), "drafts"));
      state.draftId = userDraftRef.id;
    },
    SAVE_IMAGES(state, files) {
      state.images = files;
    },
    RESET_IMAGES(state) {
      state.images = [];
    },
    REMOVE_INGREDIENT(state, index) {
      state.updated = state.updated === "1" ? "2" : "1";
      if (state.ingredients.length > 1) {
        state.ingredients.splice(index, 1);
      }
    },
    REMOVE_SECTION_INGREDIENT(state, { sectionIndex, ingIndex }) {
      state.updated = state.updated === "1" ? "2" : "1";
      state.ingredientSections[sectionIndex].ingredients.splice(ingIndex, 1);
    },
    REMOVE_SECTION(state, index) {
      state.updated = state.updated === "1" ? "2" : "1";
      if (state.ingredientSections.length > 1) {
        state.ingredientSections.splice(index, 1);
      }
    },
    REMOVE_DIRECTION(state, index) {
      state.updated = state.updated === "1" ? "2" : "1";
      if (state.directions.length > 1) {
        state.directions.splice(index, 1);
      }
    },
    SAVE_CATEGORIES(state, categories) {
      state.categories = [];
      for (const obj of categories) {
        state.categories.push(obj);
      }
    },
    SAVE_CUISINES(state, cuisines) {
      state.cuisines = [];
      for (const obj of cuisines) {
        state.cuisines.push(obj);
      }
      //state.cuisines.push(cuisine);
    },
    SAVE_TOOLS(state, tools) {
      state.tools = [];
      for (const obj of tools) {
        state.tools.push(obj);
      }
      //state.tools.push(tool);
    },
    DELETE_IMAGE_URL(state, imageUrl) {
      state.imageUrls = state.imageUrls.filter(function (e) {
        return e !== imageUrl;
      });
    },
    SET_SAVE_STATUS(state, status) {
      state.savingStatus = status;
      state.images = [];
    },
    SET_IMAGE_UPLOADING(state, status) {
      state.uploadingImage = status;
    },
    reset(state) {
      // acquire initial state
      const s = initialState();
      Object.keys(s).forEach((key) => {
        state[key] = s[key];
      });
    },
  },
  actions: {
    async deleteImageUrl(context, { id, imageUrl, recipeProp }) {
      await deleteImageUrlFromDB(id, imageUrl, recipeProp);
      context.commit("DELETE_IMAGE_URL", imageUrl);
    },
    saveImageFiles(context, files) {
      context.commit("SAVE_IMAGES", files);
    },
    reset(context) {
      context.commit("reset");
    },
    async savePartialRecipeData(context, data) {
      //await saveDraftRecipeSingleField(context.rootState.userStore.uid, data);
      context.commit("SAVE_PARTIAL_RECIPE", data);
    },
    async addAndSaveIngredient(
      context,
      { sectionIndex, currIndex, ingredient }
    ) {
      //check if the current event was triggered again with the same data.
      const currSection = context.state.ingredientSections[sectionIndex];
      const currIngredient = currSection.ingredients[currIndex];

      if (
        currIngredient?.ingredient?.allNames ===
          ingredient?.ingredient?.allNames &&
        currIngredient?.unit === ingredient?.unit &&
        currIngredient?.quantity === ingredient?.quantity &&
        currIngredient?.notes === ingredient?.notes
      ) {
        return;
      }

      //await saveDraftRecipeSingleArrayField(context.rootState.userStore.uid, "ingredients", ingredient);
      context.commit("ADD_AND_SAVE_INGREDIENT_FOR_SECTION", {
        sectionIndex,
        currIndex,
        ingredient,
      });
    },
    async addAndSaveIngredientInSection(
      context,
      { sectionIndex, ingIndex, ingredient }
    ) {
      context.commit("ADD_AND_SAVE_INGREDIENT_FOR_SECTION", {
        sectionIndex,
        ingIndex,
        ingredient,
      });
    },
    async addAndSaveNewSection(context, sectionName) {
      context.commit("ADD_AND_SAVE_NEW_SECTION", sectionName);
    },
    addAndSaveDirection(context, { index, directionText }) {
      context.commit("ADD_AND_SAVE_DIRECTION", { index, directionText });
    },
    async loadAllCategories(context) {
      const results = await loadAllCategoriesFromDb();
      context.commit("UPDATE_ALL_CATEGORIES", results);
    },
    async loadAllCuisines(context) {
      const results = await loadAllCuisinesFromDb();
      context.commit("UPDATE_ALL_CUISINES", results);
    },
    async loadAllTools(context) {
      const results = await loadAllToolsFromDb();
      context.commit("UPDATE_ALL_TOOLS", results);
    },
    removeIngredient(context, index: number) {
      context.commit("REMOVE_INGREDIENT", index);
    },
    removeSection(context, index: number) {
      context.commit("REMOVE_SECTION", index);
    },
    removeSectionIngredient(context, { sectionIndex, ingIndex }) {
      context.commit("REMOVE_SECTION_INGREDIENT", { sectionIndex, ingIndex });
    },
    removeDirection(context, index: number) {
      context.commit("REMOVE_DIRECTION", index);
    },
    addDirection(context) {
      context.commit("ADD_DIRECTION");
    },
    addIngredient(context) {
      context.commit("ADD_INGREDIENT");
    },
    addEmptyIngredientInSection(context, sectionIndex) {
      context.commit("ADD_EMPTY_INGREDIENT_IN_SECTION", sectionIndex);
    },
    addNewUserSpecifiedIngredient(
      context,
      { sectionIndex, currentIndex, ingredient }
    ) {
      context.commit("ADD_AND_SAVE_INGREDIENT", {
        sectionIndex,
        currentIndex,
        ingredient,
      });
    },
    saveCookingTime(context, cookingTime: number) {
      context.commit("SAVE_COOKING_TIME", cookingTime);
    },
    savePrepTime(context, prepTime: number) {
      context.commit("SAVE_PREP_TIME", prepTime);
    },
    saveServes(context, serves: number) {
      context.commit("SAVE_SERVES", serves);
    },
    saveCategories(context, categories) {
      context.commit("SAVE_CATEGORIES", categories);
    },
    saveTools(context, tools) {
      context.commit("SAVE_TOOLS", tools);
    },
    saveCuisines(context, cuisines) {
      context.commit("SAVE_CUISINES", cuisines);
    },
    // this is used for editing a recipe
    convertRecipeToState(context, recipe) {
      if (!recipe) {
        return;
      }
      context.commit("reset");
      context.state.ingredientSections = recipe.ingredientSections;
      context.state.directions = recipe.directions;
      context.state.serves = recipe.serves;
      context.state.title = recipe.title;
      context.state.desc = recipe.desc;
      context.state.cookingTime = recipe.cookingTime;
      context.state.prepTime = recipe.prepTime;
      context.state.categories = recipe.categories;
      context.state.cuisines = recipe.cuisines;
      context.state.tools = recipe.tools;
      context.state.imageUrls = recipe.imageUrls;
      context.state.draftId = recipe.draftId;
      context.state.isDraft = recipe.isDraft;
    },
    async updateRecipe(context, recipeId) {
      const recipePartial = context.getters.getRecipeObj;
      // delete recipePartial['isDraft'];
      // delete recipePartial['draftId'];
      const userId = context.rootState.userStore.uid;
      await updateRecipeToDb(recipeId, recipePartial, userId);
      context.commit("reset");
    },
    async saveRecipe(context) {
      const recipePartial = context.getters.getRecipeObj;
      const recipeUserDetails = {
        authorFirstName: context.rootState.userStore.firstName,
        authorLastName: context.rootState.userStore.lastName,
        authorUid: context.rootState.userStore.uid,
        userName: context.rootState.userStore.userName,
      };

      const recipe = { ...recipePartial, ...recipeUserDetails };
      await saveRecipeToDb(recipe);
      context.commit("reset");
    },
    async deleteDraftRecipe(context, draftId) {
      await deletePartialRecipeFromDrafts(draftId);
    },
  },
  getters: {
    getRecipeObj: (state) => {
      return {
        ingredientSections: state.ingredientSections,
        directions: state.directions,
        serves: state.serves,
        title: state.title,
        desc: state.desc,
        cookingTime: state.cookingTime,
        prepTime: state.prepTime,
        categories: state.categories,
        cuisines: state.cuisines,
        tools: state.tools,
        images: state.images,
        imageUrls: state.imageUrls,
        isDraft: state.isDraft,
        draftId: state.draftId,
        savingStatus: state.savingStatus,
      };
    },
    getIngredientCount: (state) => {
      return state.ingredients.length;
    },
    getRecipeImageUrls: (state) => {
      return state.imageUrls;
    },
    getIngredientCountForSection: (state) => (sectionIndex) => {
      const length = state.ingredientSections[sectionIndex].ingredients.length;

      return length;
    },
    getImageUploadingStatus: (state) => {
      return state.uploadingImage;
    },
    getAddRecipeDirectionsCount: (state) => {
      return state.directions.length;
    },
    getSectionCount: (state) => {
      return state.ingredientSections.length;
    },
    getAllIngredientSections: (state) => {
      return state.ingredientSections;
    },
    getUpdates: (state) => {
      return state.updated;
    },
    getDraftRecipeTitle: (state) => {
      return state.title;
    },
    getDraftRecipeSubTitle: (state) => {
      return state.subTitle;
    },
    getDraftRecipeDesc: (state) => {
      return state.desc;
    },
    getSavingStatus: (state) => {
      return state.savingStatus;
    },
    getDraftRecipeIngredients: (state) => (sectionIndex) => {
      return state.ingredientSections[sectionIndex];
    },
    getDraftRecipeIngredientItemsForIndex: (state) => {
      return (sectionIndex, index) => {
        const ingredientAtIndex =
          state.ingredientSections[sectionIndex].ingredients[index];
        const flatResults = [];
        // TODO duplicate logic in service/search.js
        if (
          ingredientAtIndex &&
          ingredientAtIndex.ingredient &&
          ingredientAtIndex.ingredient.allNames
        ) {
          ingredientAtIndex.ingredient.allNames.forEach((item) => {
            flatResults.push({
              name: item,
              id: ingredientAtIndex.ingredient.objectID,
            });
          });
        }
        return flatResults;
      };
    },
    getDraftRecipeIngredientSelectForIndex: (state) => {
      return (sectionIndex, index) => {
        const ingredientAtIndex =
          state.ingredientSections[sectionIndex].ingredients[index];
        if (ingredientAtIndex?.choosenName) {
          return ingredientAtIndex.choosenName;
        }
        return "";
      };
    },
    getRecipeIngredientAtIndex: (state) => {
      return (sectionIndex, index) => {
        const ingredientAtIndex =
          state.ingredientSections[sectionIndex].ingredients[index];
        if (ingredientAtIndex?.choosenName) {
          return ingredientAtIndex;
        }
        return {};
      };
    },
    getDraftRecipeIngredientNotesForIndex: (state) => {
      return (sectionIndex, index) => {
        const ingredientAtIndex =
          state.ingredientSections[sectionIndex].ingredients[index];
        if (ingredientAtIndex?.notes) {
          return ingredientAtIndex.notes;
        }
        return "";
      };
    },
    getDraftRecipeIngredientQuantityForIndex: (state) => {
      return (sectionIndex, index) => {
        const ingredientAtIndex =
          state.ingredientSections[sectionIndex].ingredients[index];
        if (ingredientAtIndex?.quantity) {
          return ingredientAtIndex.quantity;
        }
        return null;
      };
    },
    getDraftRecipeIngredientUnitForIndex: (state) => {
      return (sectionIndex, index) => {
        const ingredientAtIndex =
          state.ingredientSections[sectionIndex].ingredients[index];
        if (ingredientAtIndex?.unit) {
          return ingredientAtIndex.unit;
        }
        return null;
      };
    },
    getDraftRecipeDirectionTextForIndex: (state) => {
      return (index) => {
        return state.directions[index];
      };
    },
    getDraftRecipeDirections: (state) => {
      return state.directions || [];
    },
    getAllCategories: (state) => {
      return state.allCategories.filter((cat) => Array.isArray(cat.allNames));
    },
    getAllCategoriesSorted: (state) => {
      const cats = state.allCategories.filter((cat) =>
        Array.isArray(cat.allNames)
      );
      return cats.sort((cat1, cat2) =>
        cat1.allNames[0] > cat2.allNames[0] ? 1 : -1
      );
    },
    getChoosenCategoryIndexes: (state, getters) => {
      const indexArr = [];
      getters.getAllCategoriesSorted.map((cat, index) => {
        state.categories.map((chosenCat) => {
          if (chosenCat.id == cat.id) {
            indexArr.push(index);
          }
        });
      });
      return indexArr;
    },
    getChoosenToolsIndexes: (state, getters) => {
      const indexArr = [];
      getters.getAllToolsSorted.map((cat, index) => {
        state.tools.map((chosenCat) => {
          if (chosenCat.id == cat.id) {
            indexArr.push(index);
          }
        });
      });
      return indexArr;
    },
    getChoosenCuisinesIndexes: (state, getters) => {
      const indexArr = [];
      getters.getAllCuisinesSorted.map((cat, index) => {
        state.cuisines.map((chosenCat) => {
          if (chosenCat.id == cat.id) {
            indexArr.push(index);
          }
        });
      });
      return indexArr;
    },
    getAllTools: (state) => {
      return state.allTools.filter((cat) => Array.isArray(cat.allNames));
    },
    getAllToolsSorted: (state) => {
      const tools = state.allTools.filter((cat) => Array.isArray(cat.allNames));
      return tools.sort((cat1, cat2) =>
        cat1.allNames[0] > cat2.allNames[0] ? 1 : -1
      );
    },
    getAllCuisines: (state) => {
      return state.allCuisines;
    },
    getAllCuisinesSorted: (state) => {
      const cuisines = state.allCuisines;
      return cuisines.sort((cat1, cat2) =>
        cat1.allNames[0] > cat2.allNames[0] ? 1 : -1
      );
    },
    getCookingTime: (state) => {
      return state.cookingTime;
    },
    getPrepTime: (state) => {
      return state.prepTime;
    },
    getServes: (state) => {
      return state.serves;
    },
    getSavedCategories: (state) => {
      return state.categories;
    },
    getSavedCuisines: (state) => {
      return state.cuisines;
    },
    getSavedTools: (state) => {
      return state.tools;
    },
  },
  namespaced: true,
};
