import {
  getAllDraftRecipes,
  getRecentRecipesFromDB,
  getRecipesToBeReviewed,
  getRecipesFollowers,
} from "@/service/db.service";

function initialState() {
  return {
    homeRecipes: [],
    recentRecipes: [],
    draftRecipes: [],
    isLoading: true,
  };
}

export default {
  state: initialState,
  mutations: {
    UPDATE_HOME_RECIPES(state, recipes) {
      state.homeRecipes = []
      recipes.forEach((docs)=>
        state.homeRecipes.push(docs)
      );
    },
    UPDATE_RECENT_RECIPES(state, recipes) {
      state.recentRecipes = recipes;
    },
    UPDATE_DRAFT_RECIPES(state, recipes) {
      state.draftRecipes = recipes;
    },
    UPDATE_LOADING(state, loading) {
      state.isLoading = loading;
    },
    reset(state) {
      state.draftRecipes = [];
    },
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async loadRecentRecipes(context) {
      context.commit("UPDATE_LOADING", true);
      const recipes = await getRecentRecipesFromDB();
      context.commit("UPDATE_RECENT_RECIPES", recipes);
      context.commit("UPDATE_LOADING", false);
      return recipes;
    },
    // HOME PAGE RECIPES OF YOU FOLLOWS
    async loadRecipesFollowers(context) {
      context.commit("UPDATE_LOADING", true);
      const homeRecipes = await getRecipesFollowers();
      context.commit("UPDATE_HOME_RECIPES", homeRecipes);
      context.commit("UPDATE_LOADING", false);
      return homeRecipes;
    },
    async loadRecipeToBeReviewed(context) {
      const results = await getRecipesToBeReviewed();
      return results;
    },
    async loadDraftRecipes(context) {
      const uid = JSON.parse(localStorage.getItem("user"))["uid"];
      context.commit("UPDATE_LOADING", true);
      const draftRecipes = await getAllDraftRecipes(uid);
      context.commit("UPDATE_DRAFT_RECIPES", draftRecipes);
      context.commit("UPDATE_LOADING", false);
      return draftRecipes;
    },
  },
  getters: {
    getHomeRecipes: (state) => {
      return state.homeRecipes;
    },
    getRecentRecipes: (state) => {
      return state.recentRecipes;
    },
    getLoadingState: (state) => {
      return state.isLoading;
    },
    getDraftRecipes: (state) => {
      return state.draftRecipes;
    },
  },
  namespaced: true,
};
