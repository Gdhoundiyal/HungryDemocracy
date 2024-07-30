<template>
  <v-app>
    <!-- navigation drawer for mobile  -->
    <v-navigation-drawer v-model="drawer" fixed top temporary>
      <menu-tree :items="items" :depth="0" abs></menu-tree>
    </v-navigation-drawer>

    <NavBar :menuItems="items" @showMobileMenu="showDrawer" />
    <v-main>
      <v-container :style="{ maxWidth: '1440px', margin: 'auto' }">
        <Nuxt />
      </v-container>
      <div class="offline">
        <template v-if="!$nuxt.isOnline">
          <v-alert type="error" icon="i">
            You seem to be offline connect to try internet and Try again.
          </v-alert>
        </template>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
// import { VOffline } from 'v-offline';

export default {
  name: "App",
  metaInfo: {
    title: "Globalizing homecooked recipes ",
    titleTemplate: "%s | Hungrydemocracy.com",
    htmlAttrs: {
      lang: "en-US",
    },
  },
  components: {
    NavBar,
    MenuTree: () =>
      import(/* webpackPrefetch: true */ "@/components/MenuTree.vue"),
  },
  data() {
    return {
      drawer: false,
      items: [
        {
          title: "Curry",
          active: false,
          children: [
            {
              title: "Vegetable Curry",
              active: false,
              children: [
                {
                  title: "Paneer Curry",
                },
                {
                  title: "Dal / Lentil Curry",
                },
                {
                  title: "Rasam",
                },
                {
                  title: "Sambar",
                },
                {
                  title: "Yogurt Curry",
                },
              ],
            },
            {
              title: "Non Veg Curry",
              active: false,
              children: [
                {
                  title: "Egg Curry",
                },
                {
                  title: "Fish Curry",
                },
                {
                  title: "Chicken Curry",
                },
              ],
            },
          ],
        },
        {
          title: "Rice",
          active: false,
          children: [
            {
              title: "Vegeterian Rice",
              active: false,
              children: [
                {
                  title: "Pulao",
                },
                {
                  title: "Indian Flavored Rice",
                },
                {
                  title: "Khichdi / Lentil Rice",
                },
              ],
            },
            {
              title: "Non Vegeterian Rice",
              active: false,
              children: [
                {
                  title: "Biriyani",
                },
              ],
            },
          ],
        },
        {
          title: "Side Dish",
          active: false,
          children: [
            {
              title: "Non Vegetarian Side Dish",
              active: false,
              children: [
                {
                  title: "Fish Dry",
                },
                {
                  title: "Chicken Dry",
                },
                {
                  title: "Egg Dry",
                },
              ],
            },
            {
              title: "Vegetable Side Dish",
              active: false,
              children: [
                {
                  title: "Paneer Dry",
                },
                {
                  title: "Chutney",
                },
              ],
            },
            {
              title: "Yogurt Side Dish",
            },
          ],
        },
        {
          title: "Bread",
          active: false,
          children: [
            {
              title: "Chapati",
            },
            {
              title: "Roti",
            },
          ],
        },
        {
          title: "Idli",
        },
        {
          title: "Dosa",
          active: false,
          children: [
            {
              title: "Appam",
            },
          ],
        },
        {
          title: "Snacks",
          active: false,
          children: [
            {
              title: "Chaat",
            },
            {
              title: "Fritter / Pakoda",
            },
          ],
        },
        {
          title: "Dessert",
          active: false,
          children: [
            {
              title: "Laddu",
            },
            {
              title: "Payasam / Kheer",
            },
          ],
        },
        {
          title: "Sandwich",
        },
        {
          title: "Soup",
        },
      ],
    };
  },
  methods: {
    showDrawer(val) {
      this.drawer = val;
    },
  },
};
</script>
<style>
.offline {
  z-index: 9999;
  position: fixed;
  bottom: 25px;
  left: 25px;
}
.v-navigation-drawer {
  z-index: 10000;
}
</style>
