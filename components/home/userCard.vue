<template>
  <v-card color="#f7f7f7" elevation="0" class="mx-auto my-2">
  <nuxt-link :to="`/${user.userName}`">
      <v-card-title>
        <v-row justify="center">
          <v-avatar color="primary" size="110" class="mb-6 mt-6">
            <v-img :src="user.profileImage" v-if="user.profileImage"></v-img>
            <span class="white--text text-h5" v-else>{{
              user.firstName.charAt(0).toUpperCase() +
              user.lastName.charAt(0).toUpperCase()
            }}</span>
          </v-avatar>
        </v-row>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-row justify="center" class="mb-5">
          <h3 style="color: black;">{{ user.firstName + " " + user.lastName }}</h3>
        </v-row>
      </v-card-text>
    </nuxt-link>
  </v-card>
</template>

<script>
export default {
  name: "userCard",
  props: ["user"],
};
</script>

<style>
colr {
  color: #e7e4e4;
}
</style>