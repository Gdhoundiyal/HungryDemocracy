<template>
  <v-container fluid :style="{ width: '95%', margin: '0 auto' }">
    <div class="sticky-title text-h5 font-weight-bold pb-4 pl-2" style="top: 55px;">Top Picks</div>
    <v-row class="pl-2 pr-2" v-if="this.homeRecipes?.length > 0">
      <!-- left side block -->
      <v-col cols="12" md="5">
        <v-card class="recipe-card-box sticky-div">
          <!-- <v-img
          lazy-src="/placeholder.jpeg?webp"
          :alt="this.homeRecipes ? 'hungrydemocracy top pics recipe image' : 'hungrydemocracy placeholder image'"
          :src="
              this.homeRecipes[0]?.imageUrls?.length > 0 &&
              this.homeRecipes[0]?.imageUrls
                ? this.homeRecipes[0]?.imageUrls[0]
                : '/placeholder.jpeg?webp'
            "
            @click="openHomeRecipe(homeRecipes[0])"
            :style="{ cursor: 'pointer' }"
            >
            <template
              v-if="homeRecipes[0]?.imageUrls && homeRecipes[0]?.imageUrls?.length > 0"
              v-slot:placeholder
            >
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
            </v-img> -->
            <nuxt-img 
              :src="this.homeRecipes[0]?.imageUrls?.length > 0 && this.homeRecipes[0]?.imageUrls ? this.homeRecipes[0]?.imageUrls[0] : '/placeholder.jpeg?webp'" 
              :alt="this.homeRecipes ? 'hungrydemocracy top pics recipe image' : 'hungrydemocracy placeholder image'"
              class="leftSideImage"
              loading="lazy"
              @click="openHomeRecipe(homeRecipes[0])"
              :placeholder="!homeRecipes[0]?.imageUrls && !homeRecipes[0]?.imageUrls.length ? '/placeholder.jpeg?webp' : ''"
            ></nuxt-img>
          <div class="d-flex justify-space-between card-title-wrp">
            <v-card-title
              class="m-none text-wrap py-2 text-capitalize overflow-hidden"
              @click="openHomeRecipe(homeRecipes[0])"
              :style="{ cursor: 'pointer' }"
            >
              {{ this.homeRecipes[0]?.title ? this.homeRecipes[0]?.title : "" }}
            </v-card-title>
            <v-card-title
              class="flex item-center d-none m-show"
              @click="openUserName(homeRecipes[0])"
              :style="{ cursor: 'pointer' }"
            >
              <v-avatar class="mr-2" size="36">
                <img alt="hungry democracy user avatar" :src="this.topPicksUsers[0]?.profileImage ? this.topPicksUsers[0]?.profileImage : 'profile_placeholder.png'" />
              </v-avatar>
              <v-card-text class="user-title">
                {{
                  this.homeRecipes[0]?.userName
                    ? this.homeRecipes[0]?.userName
                    : ""
                }}
              </v-card-text>
            </v-card-title>
            <div class="d-flex flex-column">
              <v-chip
              v-if="this.homeRecipes[0]?.likesCount > 0"
              class="text-center chip-shadow font-weight-bold elevation-0 mx-4 my-4"
              text-color="primary"
              color="#42CC8C1D"
            >
              {{ this.homeRecipes[0]?.likesCount }} &nbsp;
              <v-img width="14" src="/like.png" alt="hungrydemocracy like icon" />&nbsp;
            </v-chip>
              <v-chip @click="addToFavorites(0)" class="text-center chip-shadow font-weight-bold elevation-0 mx-4 mb-1" color="#42CC8C1D" text-color="primary">
                <v-icon size="25" color="primary" :left="this.homeRecipes[0]?.isAlreadyAddedToFavourites">{{ this.homeRecipes[0]?.isAlreadyAddedToFavourites ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                <div v-if="this.homeRecipes[0]?.favouriteCount > 0">{{ this.homeRecipes[0]?.favouriteCount }}</div>
              </v-chip>
            </div>
          </div>
          <!-- responsiveness mobile view -->
          <v-card-title
            class="des-none text-no-wrap py-2 text-capitalize overflow-hidden"
            @click="openHomeRecipe(homeRecipes[0])"
            :style="{ cursor: 'pointer' }"
          >
            {{ this.homeRecipes[0]?.title ? this.homeRecipes[0]?.title : "" }}
          </v-card-title>
          <v-card-text class="py-0 ellips-content">
            {{
              this.homeRecipes[0]?.cuisines?.length && this.homeRecipes[0]?.cuisines[0]?.description?.length > 0
                ? this.homeRecipes[0]?.cuisines[0]?.description
                : ""
            }}
          </v-card-text>
          <v-card-title
            class="flex item-center none-mobile"
            @click="openUserName(homeRecipes[0])"
            :style="{ cursor: 'pointer' }"
          >
            <v-avatar class="mr-2" size="36">
              <img alt="hungry democracy user avatar" :src="this.topPicksUsers[0]?.profileImage ? this.topPicksUsers[0]?.profileImage : 'profile_placeholder.png'" />
            </v-avatar>
            <v-card-text class="user-title">
              @{{
                this.homeRecipes[0]?.userName ? this.homeRecipes[0]?.userName : ""
              }}
            </v-card-text>
          </v-card-title>
          <v-card-text>
            <v-chip-group>
              <v-chip class="ma-1 chip-shadow" color="white">
                <v-img width="14" src="/breakfast.png" alt="hungrydemocracy breakfast icon" class="mr-2"/>Breakfast</v-chip
              >
              <v-chip class="ma-1 chip-shadow" color="white">
                <v-img width="14" src="/snack.png" alt="hungrydemocracy snacks icon" class="mr-2"/>Snacks</v-chip
              >
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- right side block -->
      <v-col cols="12" md="7">
        <div class="list-card-wrp">
          <!-- left card 1 -->
          <v-card class="recipe-card-box recipe-card-item">
            <!-- <v-img
              lazy-src="/placeholder.jpeg?webp"
              :alt="homeRecipes ? 'hungrydemocracy top pics recipe image' : 'hungrydemocracy placeholder image'"
              :src="
                homeRecipes[1]?.imageUrls?.length > 0 &&
                homeRecipes[1]?.imageUrls
                  ? homeRecipes[1]?.imageUrls[0]
                  : '/placeholder.jpeg?webp'
              "
              @click="openHomeRecipe(homeRecipes[1])"
              :style="{ cursor: 'pointer' }"
              contain
            >
            <template
              v-if="homeRecipes[1]?.imageUrls && homeRecipes[1]?.imageUrls?.length > 0"
              v-slot:placeholder
            >
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
            </v-img> -->
            <nuxt-img 
              :src="this.homeRecipes[1]?.imageUrls?.length > 0 && this.homeRecipes[1]?.imageUrls ? this.homeRecipes[1]?.imageUrls[0] : '/placeholder.jpeg?webp'" 
              :alt="this.homeRecipes ? 'hungrydemocracy top pics recipe image' : 'hungrydemocracy placeholder image'"
              class="rightSideImage"
              loading="lazy"
              @click="openHomeRecipe(homeRecipes[1])"
              :placeholder="!homeRecipes[1]?.imageUrls && !homeRecipes[1]?.imageUrls.length ? '/placeholder.jpeg?webp' : ''"
            ></nuxt-img>
            <div>
              <div class="d-flex justify-space-between card-title-wrp">
                <v-card-title
                  class="pt-0 pb-2 text-no-wrap py-2 text-capitalize overflow-hidden"
                  @click="openHomeRecipe(homeRecipes[1])"
                  :style="{ cursor: 'pointer' }"
                >
                  {{
                    this.homeRecipes[1]?.title ? this.homeRecipes[1]?.title : ""
                  }}
                </v-card-title>
                <div class="d-flex flex-column">
                  <v-chip
                    v-if="this.homeRecipes[1]?.likesCount > 0"
                    class="text-center chip-shadow font-weight-bold elevation-0 mx-4 mb-1"
                    text-color="primary"
                    color="#42CC8C1D"
                  >
                    {{ this.homeRecipes[1]?.likesCount }} &nbsp;<v-img
                      alt="hungrydemocracy like icon"
                      width="14"
                      src="/like.png"
                    />&nbsp;
                  </v-chip>
                  <v-chip @click="addToFavorites(1)" class="text-center chip-shadow font-weight-bold elevation-0 mx-4 mb-1" color="#42CC8C1D" text-color="primary">
                    <v-icon size="25" color="primary" :left="this.homeRecipes[1]?.isAlreadyAddedToFavourites">{{ this.homeRecipes[1]?.isAlreadyAddedToFavourites ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                    <div v-if="this.homeRecipes[1]?.favouriteCount > 0">{{ this.homeRecipes[1]?.favouriteCount }}</div>
                  </v-chip>
                </div>
              </div>
              <v-card-text class="py-0 ellips-content">
                {{
                  this.homeRecipes[1]?.cuisines?.length && this.homeRecipes[1]?.cuisines[0]?.description?.length > 0
                    ? this.homeRecipes[1]?.cuisines[0]?.description
                    : ""
                }}
              </v-card-text>
              <v-card-title
                class="flex item-center spcing-m"
                @click="openUserName(homeRecipes[1])"
                :style="{ cursor: 'pointer' }"
              >
                <v-avatar class="mr-2" size="36">
                  <img alt="hungry democracy user avatar" :src="this.topPicksUsers[1]?.profileImage ? this.topPicksUsers[1]?.profileImage : 'profile_placeholder.png'" />
                </v-avatar>
                <v-card-text class="user-title">
                  @{{
                    this.homeRecipes[1]?.userName
                      ? this.homeRecipes[1]?.userName
                      : ""
                  }}
                </v-card-text>
              </v-card-title>
              <v-card-text>
                <v-chip-group>
                  <v-chip class="ma-1 chip-shadow" color="white">
                    <v-img width="14" src="/breakfast.png" alt="hungrydemocracy breakfast icon" class="mr-2"/>Breakfast</v-chip
                  >
                  <v-chip class="ma-1 chip-shadow" color="white">
                    <v-img width="14" src="/snack.png" alt="hungrydemocracy snacks icon" class="mr-2"/>Snacks</v-chip
                  >
                </v-chip-group>
              </v-card-text>
            </div>
          </v-card>

          <!-- left card 2 -->
          <v-card class="recipe-card-box recipe-card-item">
            <!-- <v-img
              lazy-src="/placeholder.jpeg?webp"
              :alt="homeRecipes ? 'hungrydemocracy top pics recipe image' : 'hungrydemocracy placeholder image'"
              :src="
                homeRecipes[2]?.imageUrls?.length > 0 &&
                homeRecipes[2]?.imageUrls
                  ? homeRecipes[2]?.imageUrls[0]
                  : '/placeholder.jpeg?webp'
              "
              @click="openHomeRecipe(homeRecipes[2])"
              :style="{ cursor: 'pointer' }"
              contain
            >
            <template
              v-if="homeRecipes[2]?.imageUrls && homeRecipes[2]?.imageUrls?.length > 0"
              v-slot:placeholder
            >
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
            </v-img> -->
            <nuxt-img 
              :src="this.homeRecipes[2]?.imageUrls?.length > 0 && this.homeRecipes[2]?.imageUrls ? this.homeRecipes[2]?.imageUrls[0] : '/placeholder.jpeg?webp'" 
              :alt="this.homeRecipes ? 'hungrydemocracy top pics recipe image' : 'hungrydemocracy placeholder image'"
              class="rightSideImage"
              loading="lazy"
              @click="openHomeRecipe(homeRecipes[2])"
              :placeholder="!homeRecipes[2]?.imageUrls && !homeRecipes[2]?.imageUrls.length ? '/placeholder.jpeg?webp' : ''"
            ></nuxt-img>
            <div>
              <div class="d-flex justify-space-between card-title-wrp">
                <v-card-title
                  class="pt-0 pb-2 text-no-wrap py-2 text-capitalize overflow-hidden"
                  @click="openHomeRecipe(homeRecipes[2])"
                  :style="{ cursor: 'pointer' }"
                >
                  {{
                    this.homeRecipes[2]?.title ? this.homeRecipes[2]?.title : ""
                  }}
                </v-card-title>
                <div class="d-flex flex-column">
                  <v-chip
                    v-if="this.homeRecipes[2]?.likesCount > 0"
                    class="text-center chip-shadow font-weight-bold elevation-0 mx-4 mb-1"
                    text-color="primary"
                    color="#42CC8C1D"
                  >
                    {{ this.homeRecipes[2]?.likesCount }} &nbsp;<v-img
                      alt="hungrydemocracy like icon"
                      width="14"
                      src="/like.png"
                    />&nbsp;
                  </v-chip>
                  <v-chip @click="addToFavorites(2)" class="text-center chip-shadow font-weight-bold elevation-0 mx-4 mb-1" color="#42CC8C1D" text-color="primary">
                      <v-icon size="25" color="primary" :left="this.homeRecipes[2]?.isAlreadyAddedToFavourites">{{ this.homeRecipes[2]?.isAlreadyAddedToFavourites ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                      <div v-if="this.homeRecipes[2]?.favouriteCount > 0">{{ this.homeRecipes[2]?.favouriteCount }}</div>
                  </v-chip>
                </div>
              </div>
              <v-card-text class="py-0 ellips-content">
                {{
                  this.homeRecipes[2]?.cuisines?.length && this.homeRecipes[2]?.cuisines[0]?.description?.length > 0
                    ? this.homeRecipes[2]?.cuisines[0]?.description
                    : ""
                }}
              </v-card-text>
              <v-card-title
                class="flex item-center spcing-m"
                @click="openUserName(homeRecipes[2])"
                :style="{ cursor: 'pointer' }"
              >
                <v-avatar class="mr-2" size="36">
                  <img alt="hungry democracy user avatar" :src="this.topPicksUsers[2]?.profileImage ? this.topPicksUsers[2]?.profileImage : 'profile_placeholder.png'" />
                </v-avatar>
                <v-card-text class="user-title">
                  @{{
                    this.homeRecipes[2]?.userName
                      ? this.homeRecipes[2]?.userName
                      : ""
                  }}
                </v-card-text>
              </v-card-title>
              <v-card-text>
                <v-chip-group>
                  <v-chip class="ma-1 chip-shadow" color="white">
                    <v-img width="14" src="/breakfast.png" alt="hungry democracy breakfast avatar" class="mr-2"/>Breakfast</v-chip
                  >
                  <v-chip class="ma-1 chip-shadow" color="white">
                    <v-img width="14" src="/snack.png" alt="hungry democracy snacks avatar" class="mr-2"/>Snacks</v-chip
                  >
                </v-chip-group>
              </v-card-text>
            </div>
          </v-card>

          <!-- left card 3 -->
          <v-card class="recipe-card-box recipe-card-item">
            <!-- <v-img
              lazy-src="/placeholder.jpeg?webp"
              :alt="homeRecipes ? 'hungrydemocracy top pics recipe image' : 'hungrydemocracy placeholder image'"
              :src="
                homeRecipes[3]?.imageUrls?.length > 0 &&
                homeRecipes[3]?.imageUrls
                  ? homeRecipes[3]?.imageUrls[0]
                  : '/placeholder.jpeg?webp'
              "
              @click="openHomeRecipe(homeRecipes[3])"
              :style="{ cursor: 'pointer' }"
             >
             <template
              v-if="homeRecipes[3]?.imageUrls && homeRecipes[3]?.imageUrls?.length > 0"
              v-slot:placeholder
            >
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
             </v-img> -->
             <nuxt-img 
              :src="this.homeRecipes[3]?.imageUrls?.length > 0 && this.homeRecipes[3]?.imageUrls ? this.homeRecipes[3]?.imageUrls[0] : '/placeholder.jpeg?webp'" 
              :alt="this.homeRecipes ? 'hungrydemocracy top pics recipe image' : 'hungrydemocracy placeholder image'"
              class="rightSideImage"
              loading="lazy"
              @click="openHomeRecipe(homeRecipes[3])"
              :placeholder="!homeRecipes[3]?.imageUrls && !homeRecipes[3]?.imageUrls.length ? '/placeholder.jpeg?webp' : ''"
            ></nuxt-img>
            <div>
              <div class="d-flex justify-space-between card-title-wrp">
                <v-card-title
                  class="pt-0 pb-2 text-no-wrap py-2 text-capitalize overflow-hidden"
                  @click="openHomeRecipe(homeRecipes[3])"
                  :style="{ cursor: 'pointer' }"
                >
                  {{
                    this.homeRecipes[3]?.title ? this.homeRecipes[3]?.title : ""
                  }}
                </v-card-title>
                <div class="d-flex flex-column">
                  <v-chip
                    v-if="this.homeRecipes[3]?.likesCount > 0"
                    class="text-center chip-shadow font-weight-bold elevation-0 mx-4 mb-1"
                    text-color="primary"
                    color="#42CC8C1D"
                  >
                    {{ this.homeRecipes[3]?.likesCount }} &nbsp;<v-img
                      width="14"
                      src="/like.png"
                    />&nbsp;
                  </v-chip>
                  <v-chip @click="addToFavorites(3)" class="text-center chip-shadow font-weight-bold elevation-0 mx-4 mb-1" color="#42CC8C1D" text-color="primary">
                      <v-icon size="25" color="primary" :left="this.homeRecipes[3]?.isAlreadyAddedToFavourites">{{ this.homeRecipes[3]?.isAlreadyAddedToFavourites ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                      <div v-if="this.homeRecipes[3]?.favouriteCount > 0">{{ this.homeRecipes[3]?.favouriteCount }}</div>
                  </v-chip>
                </div>
              </div>
              <v-card-text class="py-0 ellips-content">
                {{
                  this.homeRecipes[3]?.cuisines?.length && this.homeRecipes[3]?.cuisines[0]?.description?.length > 0
                    ? this.homeRecipes[3]?.cuisines[0]?.description
                    : ""
                }}
              </v-card-text>
              <v-card-title
                class="flex item-center spcing-m"
                @click="openUserName(homeRecipes[3])"
                :style="{ cursor: 'pointer' }"
              >
                <v-avatar class="mr-2" size="36">
                  <img alt="hungry democracy user avatar" :src="this.topPicksUsers[3]?.profileImage ? this.topPicksUsers[3]?.profileImage : 'profile_placeholder.png'" />
                </v-avatar>
                <v-card-text class="user-title">
                  @{{
                    this.homeRecipes[3]?.userName
                      ? this.homeRecipes[3]?.userName
                      : ""
                  }}
                </v-card-text>
              </v-card-title>
              <v-card-text>
                <v-chip-group>
                  <v-chip class="ma-1 chip-shadow" color="white">
                    <v-img width="14" src="/breakfast.png" alt="hungrydemocracy breakfast avatar" class="mr-2"/>Breakfast</v-chip
                  >
                  <v-chip class="ma-1 chip-shadow" color="white">
                    <v-img width="14" src="/snack.png" alt="hungrydemocracy snacks avatar" class="mr-2"/>Snacks</v-chip
                  >
                </v-chip-group>
              </v-card-text>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="5">
        <v-skeleton-loader type="card-avatar, article"></v-skeleton-loader>
      </v-col>
      <v-col cols="12" md="7">
        <div class="list-card-wrp">
          <v-skeleton-loader type="card-avatar" height="150" class="mb-4"></v-skeleton-loader>
          <v-skeleton-loader type="card-avatar" height="150" class="mb-4"></v-skeleton-loader>
          <v-skeleton-loader type="card-avatar" height="150" class="mb-4"></v-skeleton-loader>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
export default {
  data() {
    return {
      users: [],
    };
  },
  props: ["recipe", "isDraft", "fromPage", "homeRecipes", "topPicksUsers"],
  components: {
    RecipeCard,
  },
  methods: {
    async loadRecipesFollowers() {
      await this.$store.dispatch('dbStore/loadRecipesFollowers', null, { root:true });
    },
    openHomeRecipe(data) {
      this.$router.push({
        name: "userName-recipeUrlName",
        params: {
          userName: data.userName,
          recipeUrlName: data.recipeUrlName,
          recipeProp: data,
          isDraft: false,
        },
      });
    },
    openUserName(data) {
      this.$router.push({
        name: "userName",
        params: {
          userName: data.userName,
        },
      });
    },
    addToFavorites(index) {
      this.$emit('addToFavorites', index)
    }
  },
  computed: {
    getRecipes() {
      return this.$store.getters['dbStore/getHomeRecipes']
    },
  },
  // async fetch() {
  //   await this.loadRecipesFollowers();
  //   this.homeRecipes = this.getRecipes
  //   this.homeRecipes = this.homeRecipes.map(el=>{
  //       el.imageUrls = el.imageUrls.map(el=>{
  //         return el.split('&')[0]
  //       })
  //       return el;
  //   })
  // },
  watch: {
    immediate: true,
    fromPage: function (newVal, oldVal) {
      if (newVal === "addRecipeSuccess") {
        this.loadRecipesFollowers();
      }
    },
  },
};
</script>

<style scoped>
  .leftSideImage{
    width: 100%;
    height: 400px;
    cursor: pointer;
    object-fit: cover;
    aspect-ratio: 16/9;
  }
  .rightSideImage{
    width: 254px;
    height: 200px;
    object-fit: cover;
    cursor: pointer;
    aspect-ratio: 16/9;
  }
  
  @media screen and (max-width: 767px){
    .rightSideImage{
      width: 100%;
    }
  }
</style>
