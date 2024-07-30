import debounce from "lodash/debounce";
import {
  savePartialRecipeToDrafts,
  strToSeoFriendlyUrl,
  uploadImagesToStorage,
} from "@/service/db.service";

const draftStore = {
  // Debounced save never be called more than once per 1.5second
  // or less than once every three seconds (when there are changes to save) Can be adjusted
  saveDraft: debounce(
    async function (content, callback) {
      //TODO: Remove un necessary state values from being saved

      await savePartialRecipeToDrafts(content);
      callback();
    },
    1500,
    { maxWait: 3600 }
  ),
};

export const saveRecipeAsDraft = function (store) {
  // Every time the state changes, check the mutation type and save
  store.subscribe(async function (mutation, state) {
    if (
      mutation.type.startsWith("addRecipeStore/") &&
      mutation.type != "addRecipeStore/reset" &&
      mutation.type != "addRecipeStore/SET_SAVE_STATUS" &&
      mutation.type != "addRecipeStore/RESET_IMAGE" &&
      mutation.type != "addRecipeStore/SET_IMAGE_UPLOADING" &&
      mutation.type != "addRecipeStore/SAVE_CATEGORIES" &&
      mutation.type != "addRecipeStore/SAVE_TOOLS" &&
      mutation.type != "addRecipeStore/SAVE_CUISINES"
    ) {
      const recipeState = state.addRecipeStore;

      if (!recipeState.draftId && !recipeState.isDraft === false) {
        return;
      }
      // Add Draft id if draft id is missing
      if (!recipeState.draftId) {
        store.commit("addRecipeStore/SET_DRAFT_ID");
      }
      const userState = state.userStore;
      const recipeUrlName = strToSeoFriendlyUrl(recipeState.title || "");
      recipeState.relativeUrl = "/" + userState.userName + "/" + recipeUrlName;
      recipeState.recipeUrlName = recipeUrlName;
      let imageUrls = recipeState.imageUrls;
      if (recipeState.images && recipeState.images.length > 0) {
        const recipeObj = { ...recipeState, userName: userState.userName };
        store.commit("addRecipeStore/SET_IMAGE_UPLOADING", true);
        imageUrls = await uploadImagesToStorage(recipeObj);
        if (!imageUrls && imageUrls !== "error") {
          imageUrls = [];
        }
        if (imageUrls === "error") {
          store.commit(
            "addRecipeStore/SET_SAVE_STATUS",
            "Error uploading image"
          );
        }
        store.commit("addRecipeStore/SET_IMAGE_UPLOADING", false);
      }
      const recipe = {
        ingredientSections: recipeState.ingredientSections,
        directions: recipeState.directions,
        serves: recipeState.serves,
        title: recipeState.title,
        desc: recipeState.desc,
        cookingTime: recipeState.cookingTime,
        prepTime: recipeState.prepTime,
        categories: recipeState.categories,
        cuisines: recipeState.cuisines,
        tools: recipeState.tools,
        imageUrls: imageUrls,
        draftId: recipeState.draftId,
        authorFirstName: userState.firstName,
        authorLastName: userState.lastName,
        authorUid: userState.uid,
        userName: userState.userName,
      };
      store.commit(
        "addRecipeStore/SET_SAVE_STATUS",
        "Saving changes to draft..."
      );
      draftStore.saveDraft(recipe, function () {
        store.commit(
          "addRecipeStore/SET_SAVE_STATUS",
          "Changes saved to draft."
        );
        setTimeout(function () {
          store.commit("addRecipeStore/SET_SAVE_STATUS", null);
        }, 5000);
      });
      return;
    }
  });
};
