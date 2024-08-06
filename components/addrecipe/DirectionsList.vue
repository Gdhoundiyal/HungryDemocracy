<template>
  <v-container>
    <DirectionsInput v-for='(item, index) in this.getAddRecipeDirectionsCount' :key='index' :index='index' />
  </v-container>
</template>

<script>
import DirectionsInput from '@/components/addrecipe/DirectionsInput';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers('addRecipeStore');

export default {
  components: {
    DirectionsInput
  },
  computed: {
    ...mapGetters(['getAddRecipeDirectionsCount'])
  }
};
</script>

<style></style>
