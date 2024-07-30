<template>
  <v-container fluid>
    <div class="top-background hidden-xs-only">
      <!-- <v-img height="140px" eager alt="hungrydemocracy top bar background image" :src="require('~/static/top_bar_bg.png')">
      </v-img> -->
    </div>
    <v-row align="center" justify="space-around">
      <v-col cols="12">
        <Searchbar />
      </v-col>
    </v-row>

    <!-- Top Recipe Types -->
    <v-container>
      <v-row class="mt-2" justify="center">
        <v-col>
          <v-card min-width="300px" elevation="0" class="recipeTypesTags">
            <v-chip
              class="ma-1 chip-shadow"
              color="white"
              v-for="(val, i) in recipeTypeTags"
              :key="i"
              :to="`recipe-type/${val.allNames[0].split(' ').join('-').split('/').join('%26')}`"
              >{{ val.allNames[0] }}</v-chip
            >
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-row style="margin-top: 24px" align="center" justify="space-around">
      <RecipeResults v-if="this.getSearchResultsLength" />
      <!-- <div v-if="searchZeroResults">No Results</div> -->
      <RecipeFollowers
        v-else
        :fromPage="this.fromPage"
        :homeRecipes="homeRecipes"
        :topPicksUsers="topPicksUsers"
        @addToFavorites="addToFavorites"
      />
    </v-row>

    <v-row style="margin-top: 24px" align="center" justify="space-around">
      <v-container fluid :style="{ width: '95%', margin: '0 auto' }">
      <div class="sticky-title text-h5 font-weight-bold pb-4 pl-2" style="top: 55px;" v-if="users.length">Top Users</div>
        <!-- Top Users -->
        <v-row v-if="users.length">
          <v-col
            cols="12"
            sm="6"
            md="3"
            v-for="(user, index) in users"
            :key="index"
            class="pl-5 pr-5"
          >
            <user-card :user="user" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col
            cols="12"
            sm="6"
            md="3"
            v-for="(el, idx) in Array.apply(null, Array(4)).map(function (x, i) {
              return i;
            })"
            :key="idx"
            class="pl-5 pr-5"
          >
            <v-card color="#f7f7f7" class="mx-auto my-2" elevation="0">
              <v-card-title>
                <v-row justify="center">
                  <v-avatar size="110" class="mb-6 mt-6">
                    <v-img lazy-src="/placeholder.jpeg?webp"></v-img>
                  </v-avatar>
                </v-row>
              </v-card-title>
              <v-card-text class="mt-5">
                <v-skeleton-loader type="text"></v-skeleton-loader>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-row>

    <!-- RecipeTypes -->
    <div v-if="recipeTypeModules.length">
      <v-row
        v-for="(val, i) in recipeTypeModules"
        :key="i"
        style="margin-top: 24px"
        align="center"
        justify="center"
      >
        <RecipeTypes :title="val.type" :recipes="val.data" />
      </v-row>
    </div>
    <div v-else>
      <div
        v-for="(el, idx) in Array.apply(null, Array(7)).map(function (x, i) {
          return i;
        })"
        :key="idx"
      >
        <RecipesSkeletonLoader />
      </div>
    </div>

    <!-- Recipes of people you follow component -->
    <v-row style="margin-top: 24px" align="center" justify="space-around">
      <RecipeList :fromPage="this.fromPage" />
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close</v-btn
        >
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
// import { getService } from "../service/get.service";
import Searchbar from "@/components/SearchBar.vue";
import RecipeResults from "@/components/RecipeResults.vue";
import { createNamespacedHelpers } from "vuex";
import RecipeList from "@/components/home/RecipeList.vue";
import RecipeFollowers from "@/components/home/RecipeFollowers.vue";
import { getRecipesFollowers, getUser, addToFavourites, isAlreadyAddedToFavourites } from "../service/db.service";
import UserCard from "~/components/home/userCard.vue";
import RecipeTypes from "~/components/home/recipeTypes.vue";
import RecipesSkeletonLoader from "../components/home/RecipesSkeletonLoader.vue";

const { mapActions, mapGetters } = createNamespacedHelpers("searchStore");

export default {
  name: "Home",
  data() {
    return {
      snackbar: false,
      text: "Recipe published successfully !",
      timeout: 5000,
      fromPage: "",
      homeRecipes: [],
      recipeTypeTags: [],
      users: [],
      recipeTypeModules: [],
      topPicksUsers: []
    };
  },

  components: {
    Searchbar,
    RecipeResults,
    RecipeList,
    RecipeFollowers,
    UserCard,
    RecipeTypes,
    RecipesSkeletonLoader,
  },
  async fetch() {
    this.fromPage = "";
    if (this.$route.query.from === "addRecipeSuccess") {
      this.snackbar = true;
      this.fromPage = "addRecipeSuccess";
    }
    if (this.$route.params.messageText) {
      this.text = this.$route.params.messageText;
      this.snackbar = true;
    }
    if (this.$route.params.action) {
      this.resetSearch();
    }
    // await this.$store.dispatch("dbStore/loadRecipesFollowers", null, {
    //   root: true,
    // });
    const homePage = await getRecipesFollowers();
    await this.loadHomePageRecipes(homePage)
    this.recipeTypeTags = homePage.recipesTags;
    this.users = homePage.users;
    this.recipeTypeModules = homePage.recipeModules;
  },
  computed: {
    ...mapGetters(["getSearchResultsLength"]),
    // getHomeRecipes() {
    //   return this.$store.getters["dbStore/getHomeRecipes"];
    // },
    uid: function () {
      return this.$store.getters['userStore/getUid']
    },
  },
  methods: {
    ...mapActions(["resetSearch"]),
    async isAddedToFavourites(recipeId){
      let favouriteCount = 0
      let isAlreadyAddedToFavourite = false
      let remove = false
      const result = await isAlreadyAddedToFavourites(recipeId)
      if(result) {
        favouriteCount = result?.users?.length
        isAlreadyAddedToFavourite = result?.users?.includes(this.uid)
        remove = result?.users?.includes(this.uid)
      }
      return {favouriteCount, isAlreadyAddedToFavourite, remove}
    },
    async addToFavorites(index) {
      if(this.uid){
        const recipeId = this.homeRecipes[index].id
        const remove = this.homeRecipes[index].remove
        await addToFavourites(this.uid, recipeId, remove)
        const result = await this.isAddedToFavourites(recipeId)
        this.homeRecipes[index].isAlreadyAddedToFavourite = result.isAlreadyAddedToFavourite
        this.homeRecipes[index].favouriteCount = result.favouriteCount
        this.homeRecipes[index].remove = result.remove
      }
      else{
        this.openForm();
      }
    },
    openForm(){
      this.$store.dispatch('userStore/openForm', null, { root: true })
    },
    async loadHomePageRecipes(homePage) {
      for(const element of homePage.homePage){
        const result = await getUser(element.authorUid)
        this.topPicksUsers.push(result);
        const favResult = await this.isAddedToFavourites(element.id)
        element.imageUrls = element.imageUrls.map((el) => {
          return el.split("&")[0];
        })
        this.homeRecipes.push({...element, ...favResult})
      }
    }
  },
};
</script>
<style scoped>
.recipeTypesTags {
  overflow: hidden;
  overflow-x: scroll;
  white-space: nowrap;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
}

.recipeTypesTags::-webkit-scrollbar {
  display: none;
}
</style>
