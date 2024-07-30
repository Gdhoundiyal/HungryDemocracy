<template>
  <v-list-item class="align-start">
    <v-list-item-avatar>
      <CustomIcon :name="ingredient.choosenName" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title
        class="text-capitalize text-wrap"
        v-html="ingredient.choosenName"
      ></v-list-item-title>
      <v-list-item-subtitle class="text-wrap">
        {{ ingredient.quantity && ingredient.quantity?.toString() + " " }}
        {{ ingredient.unit ? ingredient.unit.toString() : "" }}<br />
        <div class="pt-2">{{ ingredient.notes }}</div>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import CustomIcon from "../CustomIcon.vue";
export default {
  components: { CustomIcon },
  props: {
    ingredient: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style></style>
