<template>
  <v-container fluid :style="{ width: '95%', margin: '0 auto' }">
    <div class="text-h5 font-weight-bold pb-4 pl-2 sticky-title" style="top: 55px;">Recent Recipes</div>
    <SkeletonLoader v-if="this.getLoadingState" />
    <v-row v-else>
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="(recipe, index) in recentRecipes"
        :key="index"
        class="pl-5 pr-5"
      >
        <RecipeCard :recipe="recipe" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
import SkeletonLoader from "@/components/loaders/SkeletonLoader";

export default {
  data() {
    return {
      recentRecipes: [],
    };
  },
  props: ["fromPage"],
  components: {
    RecipeCard,
    SkeletonLoader,
  },
  computed: {
  getLoadingState() {
    return this.$store.getters['dbStore/getLoadingState'];
  },
  },
  async fetch() {
    await this.$store.dispatch('dbStore/loadRecentRecipes', null, { root: true });
    this.recentRecipes = this.$store.getters['dbStore/getRecentRecipes'];
    this.recentRecipes = this.recentRecipes.map(el=>{
        el.imageUrls = el.imageUrls.map(el=>{
          return el.split('&')[0]
        })
        return el;
    })
  },
  watch: {
    immediate: true,
    fromPage: function (newVal, oldVal) {
      if (newVal === "addRecipeSuccess") {
        this.$store.dispatch('dbStore/loadRecentRecipes', null, { root: true });
      }
    },
  },
};
</script>

<style></style>
