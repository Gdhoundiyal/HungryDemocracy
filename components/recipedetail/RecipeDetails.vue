<template>
  <v-row align="center">
    <v-col cols="8" sm="9" md="8">
      <h1 class="text-h5 font-weight-bold pl-2 text-capitalize">
        {{ this.recipe?.title?.toLowerCase() }}
      </h1>
      <h2
        v-if="this.recipe.desc"
        class="subtitle-1 pl-3 text-no-wrap overflow-hidden text-overflow-ellipsis"
      >
        {{ this.recipe.desc }}
      </h2>
    </v-col>
    <v-col cols="4" sm="3" md="2">
      <v-btn
        :loading="likeLoading"
        :style="{ pointerEvents: alreadyLiked ? 'none' : 'auto' }"
        class="ma-2 btn-hover"
        @click="uid ? likeRecipe(recipe.id) : openForm()"
        color="white"
      >
        <v-img v-if="alreadyLiked" src="/like.png?webp" alt="hungrydemocracy like icon" />
        <v-img v-else src="/like_outlined.png?webp" alt="hungrydemocracy outlined like icon" />
        &nbsp;&nbsp;{{ likesCount || this.recipe.likesCount }} likes
      </v-btn>
    </v-col>
    <v-col cols="4" sm="3" md="2">
      <v-btn @click="uid ? addToFavorites() : openForm()">
        <v-icon size="25" color="black" :left="isAlreadyAddedToFavourites">{{ isAlreadyAddedToFavourites ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        <span v-if="favouriteCount > 0">{{ favouriteCount }}</span>
      </v-btn>
    </v-col>
    <v-col
      v-if="
        uid === this.recipe.authorUid ||
        (this.isAdmin != null && this.isAdmin === true)
      "
      cols="12"
      sm="2"
      md="2"
    >
      <div @click="editRecipe">
        <v-btn elevation="0" tile color="primary" class="rounded-sm">
          <v-icon left> mdi-pencil</v-icon>
          Edit
        </v-btn>
      </div>
    </v-col>
    <v-col sm="12" class="pt-0" no-gutters>
      <div class="d-flex align-center px-3 justify-start">
        <v-avatar size="36px">
          <img
            v-if="this.recipe?.userName"
            alt="Hungrydemocracy User Avatar"
            :src="user?.profileImage ? user.profileImage :'/profile_placeholder.png?webp'"
          />
          <v-icon v-else v-text="A"></v-icon>
        </v-avatar>
        <nuxt-link :to="{ name: 'userName', params: { userName: recipe?.userName } }">
          <div class="subtitle-1 ml-4">
            @{{ this.recipe?.userName }}
          </div>
        </nuxt-link>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import {getUserByUserName, isAlreadyAddedToFavourites, addToFavourites} from '../../service/db.service'
export default {
  name: "recipe-details",
  props: {
    recipe: {
      type: Object,
    },
    likeLoading: {
      type: Boolean,
    },
    alreadyLiked: {
      type: Boolean,
    },
    likeRecipe: {
      type: Function,
    },
    editRecipe: {
      type: Function,
    },
    uid: {
      type: String,
    },
    likesCount: {
      type: Number,
    },
  },
  data(){
    return{
      user: null,
      isAlreadyAddedToFavourites: false,
      favouriteCount: 0,
      remove: true
    }
  },
  methods: {
    openForm(){
      this.$store.dispatch('userStore/openForm', null, { root: true })
    },
    async addToFavorites() {
      this.remove = !this.remove
      const recipeId = this.recipe.id ? this.recipe.id : this.recipe.objectID
      await addToFavourites(this.uid, recipeId, this.remove)
      await this.isAddedToFavourites(recipeId)
    },
    async isAddedToFavourites(recipeId){
      const result = await isAlreadyAddedToFavourites(recipeId)
      this.favouriteCount = result?.users?.length
      this.isAlreadyAddedToFavourites = result?.users?.includes(this.uid)
    },
  },
  async mounted() {
    if(this.recipe?.userName) {
      this.user = await getUserByUserName(this.recipe?.userName);
    }
    const recipeId = this.recipe.id ? this.recipe.id : this.recipe.objectID
    await this.isAddedToFavourites(recipeId)
  },
  computed: {
    isAdmin: function () {
      return this.$store.getters['userStore/getIsAdmin']
    }
  },
};
</script>

<style scoped>
a {
  color: #000000DE !important;
  text-decoration: unset;
}
</style>
