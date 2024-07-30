<template>
  <v-card
    class="mx-auto my-2"
    rounded="lg"
    elevation="0"
    :style="{ boxShadow: '0px 3px 6px #00000029 !important' }"
  >
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>
    <nuxt-link :to="
      isDraft ? 
      { name: 'draft-update-draftId', params: { recipeProp: this.recipe, isDraft: true, draftId: this.recipe.draftId } } : 
      { name: 'userName-recipeUrlName', params: { userName: this.recipe.userName, recipeUrlName: this.recipe.recipeUrlName, recipeProp: this.recipe, isDraft: false } }">
      <div>
        <!-- <v-img
          style="border-radius: 10px 10px 0 0"
          height="250"
          lazy-src="/placeholder.jpeg?webp"
          transition="img-transition"
          :alt="(recipe && recipe.imageUrls && recipe.imageUrls.length > 0) ? recipe.title : 'Hungry democracy placeholder image'"
          :src="
            recipe.imageUrls && recipe.imageUrls.length > 0
              ? recipe.imageUrls[0]
              : '/img/placeholder.jpeg?webp'
          "
        >
          <template
            v-if="recipe.imageUrls && recipe.imageUrls.length > 0"
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
          :src="recipe.imageUrls && recipe.imageUrls.length ? recipe.imageUrls[0] : '/img/placeholder.jpeg?webp'" 
          :alt="'hungrydemocracy placeholder image'"
          class="images"
          loading="lazy"
          :placeholder="!recipe.imageUrls && !recipe.imageUrls.length ? '/img/placeholder.jpeg?webp' : ''"
        ></nuxt-img>
      </div>
    </nuxt-link>
    <div class="d-flex justify-space-between align-center"> 
      <v-card-title
        class="text-wrap py-2 text-capitalize d-block"
        :style="{ cursor: 'pointer', textOverflow: 'ellipsis' }"
        >
        <nuxt-link :to="
          isDraft ? 
          { name: 'draft-update-draftId', params: { recipeProp: this.recipe, isDraft: true, draftId: this.recipe.draftId } } : 
          { name: 'userName-recipeUrlName', params: { userName: this.recipe.userName, recipeUrlName: this.recipe.recipeUrlName, recipeProp: this.recipe, isDraft: false } }">
            {{ recipe?.title && recipe?.title?.toLowerCase() }}
        </nuxt-link>
      </v-card-title>
      <div v-if="!isDraft" class="d-flex">
        <v-chip
          v-if="+recipe.likesCount > 0"
          class="mr-2 text-center chip-shadow font-weight-bold elevation-0"
          text-color="primary"
          color="#42CC8C1D"
        >
          {{ recipe.likesCount }}&nbsp;<v-img
            alt="hungrydemocracy like icon"
            width="14"
            src="/like.png?webp"
          />&nbsp;
        </v-chip>
        <v-spacer></v-spacer>
        <v-chip @click="uid ? addToFavorites() : openForm()" class="mr-2 text-center chip-shadow font-weight-bold elevation-0" color="#42CC8C1D" text-color="primary">
          <v-icon size="25" color="primary" :left="isAlreadyAddedToFavourite">{{ isAlreadyAddedToFavourite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
          <div v-if="favouriteCount > 0">{{ favouriteCount }}</div>
        </v-chip>
      </div>
    </div>
    <v-card-subtitle
      v-if="!isDraft"
      class="text-no-wrap pt-1"
      :style="{
        cursor: 'pointer',
        minHeight: '42px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }"
      >{{ recipe.desc }}
    </v-card-subtitle>
    <v-card-subtitle v-else class="text-right">
      <v-chip class="error white--text"> Draft Recipe</v-chip>
    </v-card-subtitle>
    <v-divider class="mx-4"></v-divider>
    <nuxt-link :to="{ name: 'userName', params: { userName: recipe.userName } }">
      <v-row
        v-if="!isDraft"
        align="center"
        class="spacer pa-3"
        no-gutters
        style="cursor: pointer"
      >
        <v-col cols="2">
          <v-avatar size="36px" color="#42CC8C">
            <img
              v-if="recipe.userName"
              alt="hungrydemocracy profile placeholder"
              :src="userDetails?.profileImage ? userDetails.profileImage : '/profile_placeholder.png?webp'"
            />
            <span v-else class="white--text text-h5">A</span>
          </v-avatar>
        </v-col>
        <v-col sm="10" md="10"> @{{ recipe.userName }}</v-col>
      </v-row>
    </nuxt-link>
    <div style="height: 130px; overflow: hidden" class="pa-1">
      <span v-if="tags">
        <v-chip
          class="ma-1 chip-shadow"
          v-for="(tag, index) in tags.slice(0, 5)"
          :key="index"
          color="white"
        >
          <CustomIcon :name="tag.allNames[0]" />
          {{ tag.allNames[0] }}
        </v-chip>
      </span>
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <span v-if="tags.length > 5" v-bind="attrs" v-on="on">
            <v-chip class="ma-1 chip-shadow" color="white">
              +{{ tags.length - 5 }} more
            </v-chip>
          </span>
        </template>
        <v-list>
          <v-list-item
            v-for="(tag, index) in tags.slice(5, 100)"
            :key="index"
          >
            <v-chip class="ma-1 chip-shadow" color="white">
              <CustomIcon :name="tag.allNames[0]" />
              {{ tag.allNames[0] }}
            </v-chip>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-card>
</template>

<script>
import CustomIcon from "@/components/CustomIcon";
import {getUserByUserName, addToFavourites, isAlreadyAddedToFavourites} from "../service/db.service"
export default {
  name: "recipe-list-card",
  props: ["recipe", "isDraft"],
  components: {
    CustomIcon,
  },
  data() {
    return {
      tags: [],
      show: false,
      userDetails: null,
      isAlreadyAddedToFavourite: false,
      favouriteCount: 0,
      remove: true
    };
  },
  async mounted() {
    if (this.recipe.categories) {
      this.tags = this.tags.concat(this.recipe.categories);
    }
    if (this.recipe.cuisines) {
      this.tags = this.tags.concat(this.recipe.cuisines);
    }
    if (this.recipe.tools) {
      this.tags = this.tags.concat(this.recipe.tools);
    }
    if(this.recipe?.userName) {
      this.userDetails = await getUserByUserName(this.recipe.userName);
    }
    const recipeId = this.recipe.id ? this.recipe.id : this.recipe.objectID
    await this.isAddedToFavourites(recipeId)
  },
  methods: {
    async addToFavorites() {
      this.remove = !this.remove
      const recipeId = this.recipe.id ? this.recipe.id : this.recipe.objectID
      await addToFavourites(this.uid, recipeId, this.remove)
      await this.isAddedToFavourites(recipeId)
      if(this.recipe && this.recipe.isFavSection) {
        this.$emit('loadFavorites')
      }
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
    watch: {
      uid: {
        handler: async function () {
          const recipeId = this.recipe.id ? this.recipe.id : this.recipe.objectID
          if(this.uid) await this.isAddedToFavourites(recipeId);
          else this.isAlreadyAddedToFavourite = false;
        }
      }
    }
  }
};
</script>

<style scoped>
a {
  color: #000000DE !important;
  text-decoration: unset;
}
.v-card__title {
  word-break: normal; /* maybe !important  */
}
.images{
  height: 250px;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  object-fit: cover;
}
</style>
