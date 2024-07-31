<template>
  <v-container
    v-if="this.recipe"
    fluid
    :style="{ width: '95%', margin: '0 auto' }"
  >
    <!-- <script v-html="jsonld" type="application/ld+json"></script> -->
    <div class="top-background hidden-xs-only" :style="{ height: '250px' }">
      <div :style="{ height: '250px' }"></div>
      <div :style="{ height: '250px', position: 'absolute', top: '0px' }">
        <v-img
          eager
          alt="hungrydemocracy top bar background"
          src="/top_bar_bg.png"
          :style="{ minWidth: '100vw' }"
        ></v-img>
      </div>
    </div>
    <div style="position: relative">
      <v-row class="pl-5">
        <v-btn icon @click="goBack" class="text--black">
          <v-icon large class="text--black">mdi-chevron-left</v-icon>
        </v-btn>
      </v-row>
      <v-row class="mt-5">
        <v-col sm="12" md="3" class="pl-5 pr-5" cols="12">
          <SwipeableImages :handleDialog="handleDialog" :recipe="this.recipe" />
        </v-col>
        <v-col cols="12" sm="12" md="9">
          <RecipeDetail
            :alreadyLiked="alreadyLiked"
            :editRecipe="this.editRecipe"
            :recipe="this.recipe"
            :likeLoading="likeLoading"
            :likeRecipe="this.likeRecipe"
            :uid="this.uid"
            :likesCount="+this.likes"
          />
          <v-row class="mt-4">
            <v-col cols="12">
              <AdditionalImageDetails :recipe="this.recipe" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="mt-5">
        <v-col sm="4" md="3" cols="12">
          <RecipeIngredients :recipe="this.recipe" />
        </v-col>
        <v-col sm="8" md="9" :style="{ paddingBottom: '200px' }" cols="12">
          <CookingInstructions :recipe="this.recipe" />
        </v-col>
      </v-row>
      <ImageGallery
        :images="images"
        :dialog="dialog"
        :handleDialog="handleDialog"
      />
    </div>
  </v-container>
  <v-container
    v-else
    fluid
    class="align-center d-flex justify-center fill-height"
    :style="{ height: '90vh' }"
  >
    <v-progress-circular size="50" color="primary" indeterminate />
  </v-container>
</template>

<script>
import { getRecipeFromUrlName } from "@/service/db.service";
import { doesUserLikeRecipe, likeRecipe } from "../service/db.service";
import ImageGallery from "./recipedetail/ImageGallery";
import SwipeableImages from "./recipedetail/SwipeableImageList";
import AdditionalImageDetails from "./recipedetail/AdditionalRecipeDetails";
import RecipeDetail from "./recipedetail/RecipeDetails";
import RecipeIngredients from "./recipedetail/IngredientDetails";
import CookingInstructions from "./recipedetail/CookingInstructions";

export default {
  metaInfo() {
    return {
      title: this.recipe?.title,
      meta: [
        { charset: "utf-8" },
        { name: "description", content: this.recipe?.desc },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    };
  },
  props: {
    recipeProp: {
      type: Object,
    },
  },
  components: {
    ImageGallery,
    SwipeableImages,
    AdditionalImageDetails,
    RecipeDetail,
    RecipeIngredients,
    CookingInstructions,
  },
  data: function () {
    // mutating a prop directly is an anti pattern. That the reason a recipe was created which is assigned to recipeProp
    return {
      recipe: this.recipeProp,
      images: [],
      alreadyLiked: false,
      likeLoading: true,
      likes: 0,
      jsonld: {},
      dialog: false,
    };
  },
  async mounted() {
    if (this.$props.recipeProp) {
      // this recipe was clicked from an existing recipe link and since router passes it as props, the data is already available
      this.recipe = this.$props.recipeProp;
      this.likes = this.recipe.likesCount || 0;
    } else {
      // this was rendered from a url directly (say from bookmarks). This needs to be fetched from the db using the url
      try {
        this.recipe = await getRecipeFromUrlName(
          this.$route.params.recipeUrlName,
          this.$route.params.userName
        );
        if (!this.recipe) {
          this.$router.push({
            name: "pageNotFound",
          });
        }
      } catch (e) {
        this.$router.push({
          name: "pageNotFound",
        });
      }
    }

    this.recipe?.imageUrls.forEach((imageUrl) =>
      this.images.push({
        title: this.recipe.title,
        description: `by ${this.recipe.userName}`,
        href: imageUrl,
      })
    );

    this.likeLoading = true;
    this.alreadyLiked = await doesUserLikeRecipe(this.uid, this.recipe.id);
    this.likeLoading = false;

    const catSimepleNames = [];
    this.recipe?.categories.forEach((category) =>
      catSimepleNames.push(category?.allNames[0])
    );

    const cuisinesSimpleNames = [];
    this.recipe?.cuisines.forEach((cuisine) =>
      cuisinesSimpleNames.push(cuisine?.allNames[0])
    );

    const simpleIngredientNames = [];
    this.recipe?.ingredientSections.forEach((section) =>
      section?.ingredients.forEach((ingredient) =>
        simpleIngredientNames.push(
          `${
            ingredient?.quantity +
            " " +
            ingredient?.unit +
            " " +
            ingredient?.choosenName
          }`
        )
      )
    );

    const recipeInstructions = [];
    this.recipe?.directions.forEach((direction) =>
      recipeInstructions.push({
        "@type": "HowToStep",
        text: direction,
      })
    );

    this.jsonld = {
      "@context": "https://schema.org/",
      "@type": "Recipe",
      name: this.recipe?.title,
      image: this.recipe?.imageUrls,
      author: {
        "@type": "Person",
        name: this.recipe?.userName,
      },
      datePublished: this.recipe?.createdAt?.toDate(),
      description: this.recipe?.desc,
      prepTime: `PT${this.recipe?.prepTime}M`,
      cookTime: `PT${this.recipe?.cookingTime}M`,
      totalTime: `PT${this.recipe?.prepTime + this.recipe?.cookingTime}M`,
      keywords: catSimepleNames,
      recipeYield: `${this.recipe?.serves}`,
      recipeCategory: catSimepleNames.length > 0 ? catSimepleNames[0] : "",
      recipeCuisine:
        cuisinesSimpleNames.length > 0 ? cuisinesSimpleNames[0] : "",
      recipeIngredient: simpleIngredientNames,
      recipeInstructions: recipeInstructions,
    };
  },
  computed: {
    uid: function () {
      return this.$store.getters['userStore/getUid']
    },
    userName: function () {
      return this.$store.getters['userStore/getUserName']
    },
    disableLikeButton: function () {
      return this.alreadyLiked || this.likeLoading;
    },
  },
  methods: {
    async likeRecipe(recipeId) {
      if (this.uid && !this.alreadyLiked) {
        this.likeLoading = true;
        await likeRecipe(this.uid, this.recipe.id || recipeId);
        this.likeLoading = false;
        this.alreadyLiked = true;
        this.likes = +this.likes + 1;
      } else {
      }
    },
    editRecipe() {
      this.$router.push({
        name: "EditARecipe",
        params: {
          recipeProp: this.recipe,
        },
      });
    },
    handleDialog() {
      this.dialog = !this.dialog;
    },
    goBack() {
      this.$router.push({
        name: "index",
      });
    },
  },
};
</script>

<style></style>
