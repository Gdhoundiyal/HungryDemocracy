<template>
  <div class="mt-5">
    <div v-for="(recipes, index) in recipesList" :key="index" class="mb-5">
    <div class="sticky-title text-h5 font-weight-bold pb-4 pl-2" v-if="recipes.for">
      More Recipes {{recipes.type === 'main-ingredient' ? 'with ' : 'of type ' }} 
      <span v-if="recipes.type === 'recipe-type'">
        <nuxt-link :to="{ path: `/recipe-type/${urlRewrite(recipes.for)}` }">
          {{ recipes.for }}
        </nuxt-link>
      </span>
      <span v-else>
        <nuxt-link :to="`/ingredient/${recipes.for.split(' ').join('-')}`">
          {{ recipes.for }}
        </nuxt-link>
      </span>
    </div>
    <SkeletonLoader v-if="!recipesList.length" />
    <v-row v-else>
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="(recipe, index) in recipes.result"
        :key="index"
        class="pl-5 pr-5"
      >
        <RecipeCard :recipe="recipe" />
      </v-col>
    </v-row>
    </div>
  </div>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
import SkeletonLoader from "@/components/loaders/SkeletonLoader";

export default {
  props: ['recipeList'],
  data() {
    return {
      recipesList: this.recipeList,
    };
  },
  components: {
    RecipeCard,
    SkeletonLoader,
  },
  // computed: {
  //   getLoadingState: function () {
  //     return this.$store.getters['dbStore/getLoadingState']
  //   }
  // },
  watch: {
    immediate: true,
    recipeList: function (newVal, oldVal) {
      if(newVal) {
        this.recipesList = this.recipeList;
      }
    }
  },
  methods: {
    urlRewrite(val) {
      let result = val.split('/').join('&');
      result = result.split(' ').join('-');
      return result;
    }
  }
};
</script>

<style scoped>
a {
  color: #42CC8C !important;
  text-decoration: unset;
}
</style>
