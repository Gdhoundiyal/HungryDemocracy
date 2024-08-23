<template>
  <div class="mt-5">
    <div 
      v-for="directionInstruction in recipe.directionInstructions"
      :key="directionInstruction.id"
    >
      <v-card
        elevation="1"
        class="mb-3"
        v-if="directionInstruction.type !== 'Keep Aside' && directionInstruction.type != 'Eat With'"
      >
        <v-card-title class="text-h6 text-uppercase">
          <div>
            <span class="font-weight-bold">
              {{ getTitle(directionInstruction) }}
            </span>
            <div class="spl-line"></div>
            <div class="mt-3" v-if="directionInstruction.timeInMins">
              <v-icon color="green darken-2"> mdi-clock-outline </v-icon>
              <span class="text-subtitle-2 font-weight-normal"
                >{{ directionInstruction.timeInMins }} min</span
              >
            </div>
          </div>
        </v-card-title>
        <v-card-text class="text-h6 font-weight-bold text--primary">
          <v-row>
            <v-col cols="12" md="4" class="order-last order-md-first d-none d-sm-block">
              <v-row no-gutters>
                <v-col
                  v-for="(ingredient, index) in getIngredientsInvolveInSteps(
                    directionInstruction.options
                  )"
                  :key="index"
                  cols="6"
                  md="12"
                >
                  <v-list> 
                    <IngredientCard :ingredient="ingredient" />
                  </v-list>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="1" class="order-2 order-md-0 d-none d-sm-block">
              <v-divider :vertical="isVertical" class="mx-4" />
            </v-col>
            <v-col cols="12" md="7">
              <div>
                <div
                  v-for="(step, index) in directionInstruction.options"
                  :key="index"
                  class="mb-4"
                >
                  <RecipeSteps :recipe-steps="step" :ingredients="directionInstruction.highlightedIngredient" :index="index" :ingredientSection="recipe.ingredientSections"/>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import IngredientCard from "./IngredientCard.vue";
import RecipeSteps from "./RecipeSteps.vue";
export default {
  components: { IngredientCard,RecipeSteps },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      allIngredients: [],
      ingredientsInvolveInStep: [],
      queries : ['text']
    };
  },
  created() {
    this.recipe.ingredientSections.forEach((section) => {
      if (section.ingredients) {
        this.allIngredients = this.allIngredients.concat(section.ingredients);
      }
    });
  },
  computed: {
    isVertical() {
      return !(this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs);
    },
  },
  methods: {
    getIngredientsInvolveInSteps(steps) {
      const ings = [];
      steps.forEach((step) => {
        const ingredientsInvolveInStep = Array.isArray(step.ingredientId)
          ? step.ingredientId
          : [step.ingredientId];

        ingredientsInvolveInStep.forEach((id) => {
          if (id) {
            const ing = this.allIngredients.find(
              ({ ingredient }) => ingredient.objectID === id
            );
            if (ing) {
              ings.push(ing);
            }
          }
        });
      });
      return ings;
    },
    getTitle(direction) {
      const title = direction.title
      const type = direction.type

      if(title == type) {
        return title
      }

      if(title.includes(type)) {
        return `${type} - ${title.replace(type, '').replace('-', '')}`
      }

      return `${type} - ${title}`
    }
  },
};
</script>