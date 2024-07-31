<template>
  <v-timeline
    dense
    clipped
    align-top
    class='mt-3'
    :style="$vuetify.breakpoint.smAndDown ? { marginLeft: '-32px' } : {}"
  >
    <v-timeline-item
      fill-dot
      v-for='(direction, index) in this.recipe.directions'
      color='#42CC8C'
      large
      icon='mdi-silverware-clean'
      :key='index'
      class='mb-3'
    >
      <div class='pt-1 text-h6 font-weight-bold text-capitalize text-primary-color'>Step&nbsp;{{ +index + 1 }}</div>
      <div class='subtitle-1 text-wrap text--primary mt-2 pr-md-5'>{{ direction }}</div>
    </v-timeline-item>
  </v-timeline>
</template>
<script>
export default {
  name: 'recipe-ingredient-details',
  props: {
    recipe: {
      type: Object
    }
  },
};
</script>
