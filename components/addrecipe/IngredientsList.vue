<template>
  <v-container>
    <IngredientInput
      v-for='(item, index) in this.getIngredientCountForSection(sectionIndex)'
      :key='index'
      :index='index'
      :sectionIndex='sectionIndex'
    />
  </v-container>
</template>

<script>
import IngredientInput from '@/components/addrecipe/IngredientInput';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers('addRecipeStore');

export default {
  props: {
    sectionIndex: Number
  },
  components: {
    IngredientInput
  },
  computed: {
    ...mapGetters(['getIngredientCountForSection'])
  }
};
</script>

<style></style>
