import Vue from "vue";
import Vuex from "vuex";
// import { createStore } from "vuex";
import addRecipeStore from "@/store/modules/addRecipeStore";
import searchStore from "@/store/modules/searchStore";
import userStore from "@/store/modules/userStore";
import dbStore from "@/store/modules/dbStore";
// import createPersistedState from "vuex-persistedstate";
import { saveRecipeAsDraft } from "@/store/saveDraft";

Vue.use(Vuex);

// @ts-ignore
export default () =>
  new Vuex.Store({
    modules: {
      searchStore,
      userStore,
      addRecipeStore,
      dbStore,
    },
    plugins: [
      saveRecipeAsDraft,
      // createPersistedState({
      //   storage: process.client ? window.sessionStorage : null,
      // }),
    ],
    actions: {
      clearAll({ commit }) {
        sessionStorage.clear();
        commit("addRecipeStore/reset");
        commit("searchStore/reset");
        commit("userStore/reset");
        commit("dbStore/reset");
      },
    },
  });
