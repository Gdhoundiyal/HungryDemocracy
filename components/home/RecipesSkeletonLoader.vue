<template>
  <v-row style="margin-top: 24px" align="center" justify="center">
    <v-container fluid :style="{ width: '95%', margin: '0 auto' }">
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="3"
          class="pl-5 pr-5"
          v-for="(el, idx) in Array.apply(null, Array(4)).map(function (x, i) {
            return i;
          })"
          :key="idx"
        >
          <v-card elevation="0" class="mx-auto my-2">
            <v-skeleton-loader type="card"></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>
  
  <script>
export default {};
</script>
  
  <style>
</style>