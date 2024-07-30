import {
  autoCompleteSearch,
  submitSearch,
  autoCompleteSearchIngredients,
} from "@/service/search.service";
import Vue from "vue";

function initialState() {
  return {
    searchTerm: "",
    autoCompleteSearchResults: {},
    searchResults: [],
    facets: [],
    cuisineFacets: [],
    toolsFacets: [],
    ingredientsFacets: [],
    categoryFacets: [],
    isLoading: true,
  };
}

export default {
  state: initialState,
  mutations: {
    UPDATE_FACETS(state, { type, value }) {
      if (type === "cuisine") {
        Vue.set(state, "cuisineFacets", [...value]);
      }
      if (type === "category") {
        Vue.set(state, "categoryFacets", [...value]);
      }
      if (type === "tool") {
        Vue.set(state, "toolsFacets", [...value]);
      }
      if (type === "ingredient") {
        Vue.set(state, "ingredientsFacets", [...value]);
      }

      const updatedCuisineFacets = state.cuisineFacets.map((item) => {
        return `cuisines.allNames:${item}`;
      });

      const updatedCategoryFacets = state.categoryFacets.map((item) => {
        return `categories.allNames:${item}`;
      });

      const updatedToolsFacets = state.toolsFacets.map((item) => {
        return `tools.allNames:${item}`;
      });

      const updatedIngredientsFacets = state.ingredientsFacets.map((item) => {
        return `ingredientSections.ingredients.choosenName:${item}`;
      });

      Vue.set(state, "facets", [
        ...updatedCuisineFacets,
        ...updatedCategoryFacets,
        ...updatedToolsFacets,
        ...updatedIngredientsFacets,
      ]);
    },
    UPDATE_SEARCH_TERM(state, newSearchTerm) {
      state.searchTerm = newSearchTerm;
    },
    UPDATE_AUTOCOMPLETE_SEARCH_RESULTS(state, results) {
      state.autoCompleteSearchResults = results;
    },
    UPDATE_SEARCH_RESULTS(state, results) {
      state.searchResults = results;
    },
    reset(state) {
      // acquire initial state
      const s = initialState();
      Object.keys(s).forEach((key) => {
        state[key] = s[key];
      });
      state.isLoading = false;
    },
    RESET_SEARCH_STATE(state) {
      const s = initialState();
      Object.keys(s).forEach((key) => {
        state[key] = s[key];
      });
      state.isLoading = false;
    },
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    updateFacets(context, { type, value }) {
      context.commit("UPDATE_FACETS", { type, value });
    },
    resetSearch(context) {
      context.commit("RESET_SEARCH_STATE");
    },
    async performAutoCompleteSearch(context, newSearchTerm) {
      context.commit("UPDATE_SEARCH_TERM", newSearchTerm);
      const results = await autoCompleteSearch(context.state.searchTerm);
      context.commit("UPDATE_AUTOCOMPLETE_SEARCH_RESULTS", results);
      return results;
    },
    async performSearch(context, { val, facets, filter }) {
      let results = null
      if (filter) results = await submitSearch(val, facets, filter);
      else results = await submitSearch(val, facets, undefined);
      context.commit("UPDATE_SEARCH_RESULTS", results);
    },
    async performAutoCompleteSearchIngredients(context, searchTerm) {
      return await autoCompleteSearchIngredients(searchTerm);
    },
  },
  getters: {
    getSearchTerm: (state) => {
      return state.searchTerm;
    },
    getFacets: (state) => {
      return state.facets;
    },
    getCuisineFacets: (state) => {
      return state.cuisineFacets;
    },
    getCategoryFacets: (state) => {
      return state.categoryFacets;
    },
    getToolsFacets: (state) => {
      return state.toolsFacets;
    },
    getIngredientFacets: (state) => {
      return state.ingredientsFacets;
    },
    getAutoCompleteSearchResults: (state) => {
      return state.autoCompleteSearchResults;
    },
    getSearchResults: (state) => {
      return state.searchResults?.hits;
    },
    getSearchResultsLength: (state) => {
      return state.searchResults?.hits?.length;
    },
    getFacetsResults: (state) => {
      return state.searchResults.facets;
    },
    getToolsFacetsResults: (state) => {
      if (state.searchResults && state.searchResults.facets) {
        return state.searchResults?.facets["tools.allNames"];
      }
    },
    getIngredientsFacetsResults: (state) => {
      if (state.searchResults && state.searchResults.facets) {
        return state.searchResults?.facets[
          "ingredientSections.ingredients.choosenName"
        ];
      }
    },
    getCategoriesFacetsResults: (state) => {
      if (state.searchResults && state.searchResults.facets) {
        return state.searchResults?.facets["categories.allNames"];
      }
    },
    getCuisinesFacetsResults: (state) => {
      if (state.searchResults && state.searchResults.facets) {
        return state.searchResults?.facets["cuisines.allNames"];
      }
    },
  },
  namespaced: true,
};
