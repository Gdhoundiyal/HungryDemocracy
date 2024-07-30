<template>
  <div>
    <h1>Admin page</h1>
    <Recipe :recipeProp="recipe" v-if="this.rendered" />
    <v-container>
      <v-row>
        <v-col>
          <v-btn color="red" elevation="2" x-large>REJECT</v-btn>
        </v-col>

        <v-spacer></v-spacer>

        <v-col>
          <v-btn color="green" elevation="2" x-large>APPROVE</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapActions, mapGetters } = createNamespacedHelpers("dbStore");
import Recipe from "@/components/Recipe.vue";

export default {
  data() {
    return {
      recipe: null,
      rendered: false,
    };
  },
  components: {
    Recipe,
  },
  methods: {
    ...mapActions(["loadRecipeToBeReviewed"]),
  },
  async created() {
    const recipeArr = await this.loadRecipeToBeReviewed();
    this.recipe = recipeArr[0];
    this.rendered = true;
  },
};
</script>

<style></style>
