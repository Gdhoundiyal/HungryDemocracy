<template>
  <v-row>
    <v-col
      v-for="(el, idx) in Array.apply(null, Array(8)).map(function (x, i) {
        return i;
      })"
      cols="12"
      sm="6"
      md="3"
      :key="idx"
      class="pb-4 pt-4"
    >
      <!-- <v-card
        class="mx-auto my-2"
        rounded="lg"
        elevation="0"
        :style="{ boxShadow: '0px 3px 6px #00000029 !important' }"
      > -->
        <v-skeleton-loader height="475px" type="card-avatar, article">
        </v-skeleton-loader>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "recipe-card-skeleton-loader",
  props: {
    isLoading: {
      type: Boolean,
    },
  },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
};
</script>

<style></style>
