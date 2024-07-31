<template>
  <div>
    <div class='text-h6 font-weight-bold text-spl-underline text-uppercase'>Ingredients</div>
    <div class='spl-line' />
    <v-card rounded='lg' class='pa-4 mt-6'>
      <template v-for='section in recipe.ingredientSections'>
        <div :key='section.name'>
          <div class='subtitle-1 font-weight-bold'>{{ section.name }}</div>
          <v-list two-line>
            <template v-for='item in section.ingredients'>
              <IngredientCard :ingredient="item" :key="item.choosenName" />
            </template>
          </v-list>
        </div>
      </template>
    </v-card>
  </div>
</template>
<script>
import IngredientCard from './IngredientCard.vue';
export default {
  name: 'recipe-ingredient-details',
  components: { IngredientCard },
  props: {
    recipe: {
      type: Object
    }
  },
  computed: {
    isAdmin: function () {
      return this.$store.getters['userStore/getIsAdmin']
    }
  },
};
</script>
