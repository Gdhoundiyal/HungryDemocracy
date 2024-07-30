<template>
  <v-container
    fluid
    :style="{ width: '95%', margin: '0 auto' }"
    v-if="recipes.length"
  >
    <div class="text-h5 font-weight-bold pb-4 pl-2 sticky-title" style="top: 55px;">
      <nuxt-link
        :to="`recipe-type/${title.split(' ').join('-').split('/').join('%26')}`"
      >
        <span>{{ title }}</span>
        <span style="color: black;">Recipes</span>
      </nuxt-link>
    </div>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="(recipe, index) in recipes"
        :key="index"
        class="pl-5 pr-5"
      >
        <RecipeTypesCards :recipe="recipe" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecipeTypesCards from "./RecipeTypesCards.vue";

export default {
  name: "recipeTypesCard",
  props: ["title", "recipes"],
  components: { RecipeTypesCards },
};
</script>

<style>
</style>