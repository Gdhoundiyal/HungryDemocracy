<template>
  <v-card elevation="0">
    <nuxt-link
      :to="`${recipe.relativeUrl}`"
    >
      <div style="position: relative">
        <!-- <v-img
          :src="recipe.imageUrls[0]"
          lazy-src="/placeholder.jpeg?webp"
          height="300"
          width="100%"
        ></v-img> -->
        <nuxt-img 
          :src="recipe.imageUrls && recipe.imageUrls.length ? recipe.imageUrls[0] : '/placeholder.jpeg?webp'" 
          :alt="'hungrydemocracy placeholder image'"
          class="images"
          loading="lazy"
        ></nuxt-img>
        
        <div class="recipeTitle">{{ recipe.title }}</div>
      </div>
    </nuxt-link>
    <v-card-title class="mt-3">
      <!-- <v-row> -->
      <nuxt-link :to="`/${recipe.userName}`">
        <v-row>
          <v-avatar size="30" class="mr-2">
            <v-img
              :src="
                user?.profileImage
                  ? user?.profileImage
                  : '/profile_placeholder.png?webp'
              "
            ></v-img>
          </v-avatar>
          <div class="recipeUsername">
            <div style="position: absolute; color: black;" class="text-wrap">
              {{ recipe.userName.split("-").join(" ") }}
            </div>
          </div>
        </v-row>
      </nuxt-link>
      <v-spacer></v-spacer>
      <v-row justify="end">
        <v-chip
          v-if="recipe.likesCount > 0"
          class="text-center chip-shadow font-weight-bold elevation-0 mx-0 mb-2 mr-1"
          text-color="primary"
          color="#42CC8C1D"
          small
        >
          &nbsp;<v-img width="14" src="/like.png" />&nbsp;{{
            recipe.likesCount
          }}
        </v-chip>
        <v-chip @click="uid ? addToFavorites() : openForm()" small class="mr-2 text-center chip-shadow font-weight-bold elevation-0" color="#42CC8C1D" text-color="primary">
          <v-icon size="20" color="primary" :left="isAlreadyAddedToFavourites">{{ isAlreadyAddedToFavourites ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
          <div v-if="favouriteCount > 0">{{ favouriteCount }}</div>
        </v-chip>
      </v-row>
      <!-- </v-row> -->
    </v-card-title>
  </v-card>
</template>

<script>
import { getUserByUserName, addToFavourites, isAlreadyAddedToFavourites } from "../../service/db.service";
export default {
  name: "RecipeTypesCards",
  props: ["recipe"],
  data() {
    return {
      user: null,
      isAlreadyAddedToFavourites: false,
      favouriteCount: 0,
      remove: true
    };
  },
  async mounted() {
    this.user = await getUserByUserName(this.recipe.userName);
    const recipeId = this.recipe.id ? this.recipe.id : this.recipe.objectID
    await this.isAddedToFavourites(recipeId)
  },
  methods: {
    async addToFavorites() {
      this.remove = !this.remove
      const recipeId = this.recipe.id ? this.recipe.id : this.recipe.objectID
      await addToFavourites(this.uid, recipeId, this.remove)
      await this.isAddedToFavourites(recipeId)
    },
    openForm(){
      this.$store.dispatch('userStore/openForm', null, { root: true })
    },
    async isAddedToFavourites(recipeId){
      const result = await isAlreadyAddedToFavourites(recipeId)
      if(result) {
        this.favouriteCount = result?.users?.length
        this.isAlreadyAddedToFavourite = result?.users?.includes(this.uid)
        this.remove = !(result?.users?.includes(this.uid))
      }
    }
  },
  computed: {
    uid: function () {
      return this.$store.getters['userStore/getUid']
    },
  },
  watch: {
    uid: {
      handler: async function () {
        const recipeId = this.recipe.id ? this.recipe.id : this.recipe.objectID
        if(this.uid) await this.isAddedToFavourites(recipeId);
        else this.isAlreadyAddedToFavourites = false;
      }
    }
  }
};
</script>

<style scoped>
.recipeTitle {
  position: absolute;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.98), transparent);
  color: #ffffff;
  min-height: 18%;
  padding: 0 10px;
  width: 100%;
}
.recipeUsername {
  font-size: 14px;
  font-weight: lighter;
  text-transform: capitalize;
}
.images{
  height: 300px;
  width: 100%;
  object-fit: cover;
}
</style>