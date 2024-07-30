<template>
  <v-app-bar
    :absolute="!$vuetify.breakpoint.xs"
    :fixed="$vuetify.breakpoint.xs"
    elevation="0"
    app
    color="#b2e5d600"
    :class="$vuetify.breakpoint.xs ? 'v-app-bar__white':''"
    :style="{ padding: '0 2.5%', 'z-index': '99999' }"
  >
    <v-app-bar-nav-icon @click="showMobileMenu()" v-if="$vuetify.breakpoint.width <= 1023"></v-app-bar-nav-icon>
    <v-toolbar-title class="font-weight-bold clickable" @click="redirectToHome"
      >Hungry Democracy</v-toolbar-title
    >
    <v-spacer />
    <no-ssr>
     <!-- desktop navigation  -->
     <div v-if="$vuetify.breakpoint.width > 1023" class="d-flex justify-between">
      <div v-for="item in menuItems" :key="item.title">
        <v-menu :close-on-content-click="false" open-on-hover bottom offset-y v-if="item.children">
          <template v-slot:activator="{ on }">
            <v-btn
              elevation="0"
              class=" mr-1"
              plain
              v-on="on"
            >
              {{item.title}}
            </v-btn>
          </template>
          <menu-tree :items="item.children" :depth="0"></menu-tree>
        </v-menu>
        <nuxt-link :to="{ path: `/recipe-type/${urlRewrite(item.title)}` }" v-else>
        <v-btn
          elevation="0"
          class="mr-1"
          plain
          
        >
          {{item.title}}
        </v-btn>
        </nuxt-link>
      </div>
     </div>
     
      <template v-if="uid">
        <v-btn
          class="mr-5 hidden-sm-and-down"
          small
          elevation="2"
          color="primary"
          large
          @click="openAddARecipeRoute"
        >
          <v-icon>mdi-plus</v-icon>
          Add Recipe
        </v-btn>
      </template>
      <template v-if="uid">
        <v-btn
          class="mr-5 hidden-md-and-up"
          elevation="1"
          icon
          color="primary"
          v-if="uid"
          @click="openAddARecipeRoute"
        >
          <v-icon>mdi-file-image-plus-outline</v-icon>
        </v-btn>
      </template>
      <template v-if="!uid">
        <v-btn
          min-width="120px"
          color="primary"
          elevation="0"
          class="font-weight-bold"
          large
          @click.stop="openForm"
          >Sign in
        </v-btn>
      </template>
      <div v-else class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar size="36px">
              <img
                v-bind="attrs"
                v-on="on"
                alt="hungry democracy profile placeholder"
                :src="profileImage !== '' ? profileImage : '/profile_placeholder.png?webp'"
              />
            </v-avatar>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title
                class="font-weight-bold"
                :style="{ cursor: 'pointer' }"
                @click="openUserName"
              >
                @{{ this.userName }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                :style="{ cursor: 'pointer' }"
                @click="openDraftRecipeRoute"
              >
                My Draft Recipes
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                :style="{ cursor: 'pointer' }"
                @click="openFavoriteRecipesRoute"
              >
                My Favorites
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                @click="logout2"
                :style="{ cursor: 'pointer' }"
              >
                Logout</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </no-ssr>

    <Auth :signInFormState="signInFormState" />
  </v-app-bar>
</template>

<script>
// import LoadingComponent from "@/components/utils/LoadingComponent.vue";
// import ErrorComponent from "@/components/utils/ErrorComponent.vue";
// const Auth = () => ({
//   component: import("@/components/auth/Auth.vue"),
//   loading: LoadingComponent,
//   error: ErrorComponent,
//   // The error component will be displayed if a timeout is
//   // provided and exceeded. Default: Infinity.
//   timeout: 3000,
// });
// import { create } from 'domain';
// import {getUser} from '../service/db.service'
export default {
  data(){
    return {
      image: '',
    }
  },
  props: ['menuItems'],
  components: {
    Auth: () =>
      import(/* webpackPrefetch: true */ "@/components/auth/Auth.vue"),
    MenuTree: () => import(/* webpackPrefetch: true */ "@/components/MenuTree.vue"),
  },
  watch: {
    group () {
      this.drawer = false
    },
    image(newVal, oldVal){
      this.image = newVal;
      console.log(newVal, oldVal, "WATCH")
    },

  },
  methods: {
    urlRewrite(val) {
        let result = val.split('/').join('&');
        result = result.split(' ').join('-');
        return result;
    },
    showMobileMenu() {
      this.$emit('showMobileMenu', true)
    },
    openForm: function () {
      this.$store.dispatch('userStore/openForm', null, { root: true })
    },
    logout2: async function () {
      await this.$store.dispatch('userStore/logout', null, { root: true })

      // If your logging out from a different screen (like add a recipe screen,
      // this will take you back to the home page after logout
      // TODO(This needs to be generalized as its true for any route. There needs to be a common place for
      // doing something like this)
      if (this.$route.name !== "index") {
        this.$router.push({
          name: "index",
          params: {
            messageText: "Logout Successful.",
          },
        });
      }
    },
    openUserName() {
      this.$router.push({
        name: "userName",
        params: {
          userName: this.userName,
        },
      });
    },
    openAddARecipeRoute() {
      this.$router.push(`/${this.userName}/new`);
    },
    openDraftRecipeRoute() {
      this.$router.push(`/${this.userName}/drafts`);
    },
    openFavoriteRecipesRoute() {
      this.$router.push(`/${this.userName}/favorites`);
    },
    redirectToHome() {
      this.$store.dispatch("searchStore/resetSearch", {});
      if (this.$route.name !== "index") {
        this.$router.push({ name: "index" });
      }
    },
  },

  computed: {
    uid: function () {
      return this.$store.getters['userStore/getUid']
    },
    userName: function () {
      return this.$store.getters['userStore/getUserName']
    },
    signInFormState: function () {
      return this.$store.getters['userStore/getSignInFormState']
    },
    profileImage() {
      return this.$store.getters['userStore/getUser'].profileImage
    }
  },
};
</script>

<style>
.v-app-bar__white {
  background-color: white !important;
}
a {
    text-decoration: unset;
}
</style>
