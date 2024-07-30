<template>
  <v-container fluid style="width: 95%; margin: 0 auto" v-if="!isLoading">
    <div class="top-background hidden-xs-only" style="height: 75px">
      <!-- <v-img height="140px" eager alt="hungrydemocracy top bar background image" :src="require('~/static/top_bar_bg.png')">
      </v-img> -->
    </div>
    <div style="position: relative" class="text-center mt-5" v-if="user">
      <v-avatar color="teal" size="75" class="mb-6 ml-2">
        <img
          :src="user?.profileImage"
          alt="Profile"
          v-if="user?.profileImage"
        />
        <span class="white--text text-h5" v-else>{{ initials }}</span>
        <label
          for="file-input"
          class="avatar__icon"
          v-if="user?.userName === userName && uid"
        >
          <v-icon color="white" @click="selectImage">mdi-camera</v-icon>
        </label>
        <input
          id="file-input"
          name="file-input"
          type="file"
          @change="selectImage"
          v-if="user?.userName === userName && uid"
        />
      </v-avatar>
      <v-row class="d-flex flex-column align-center mb-5">
        <v-col
          class="text-left"
          cols="6"
          v-if="user?.aboutMe && !showTextArea"
          >{{ user?.aboutMe }}</v-col
        >
        <v-btn
          depressed
          color="primary"
          dark
          width="15%"
          class="my-4"
          style="width: fit-content"
          @click="showTextArea = true"
          v-if="!showTextArea && uid && user?.userName === userName"
          >{{ this.aboutMe.trim() ? "Edit" : "Add" }} About Info</v-btn
        >
        <v-textarea
          solo
          name="input-7-4"
          label="Add about yourself"
          auto-grow
          class="aboutMe"
          v-model="aboutMe"
          :counter="240"
          v-if="showTextArea"
        ></v-textarea>
        <div class="v-text-field-btn">
          <v-btn text v-if="showTextArea" @click="closeTextArea" color="red"
            >Cancel</v-btn
          >
          <v-btn text v-if="showTextArea" color="primary" @click="saveDetails"
            >Save</v-btn
          >
        </div>
        <div class="text-center">
          <v-dialog v-model="dialog" width="500">
            <v-card>
              <Cropper
                class="cropper"
                :src="img"
                :stencil-props="{
                  handlers: {},
                  movable: false,
                  scalable: false,
                  aspectRatio: 1,
                }"
                :resize-image="{
                  adjustStencil: false,
                }"
                image-restriction="stencil"
                @change="cropImage"
              />
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="red" width="100" @click="closeCropper"
                  >Cancel</v-btn
                >
                <v-btn
                  depressed
                  color="primary"
                  width="100"
                  @click="uploadUserProfile"
                  :loading="isUploading"
                  :disabled="isUploading"
                  >Upload</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-row>
      <h1 class="text-h5 font-weight-bold">
        All Recipes by {{ user?.firstName }} {{ user?.lastName }}
      </h1>
      <div class="subtitle-2 font-weight-bold text--lighten-3">
        @ {{ user?.userName }}
      </div>
    </div>
    <div class="text-h5 font-weight-bold mt-5">Recipe Types</div>
    <v-row class="mt-2" justify="center">
      <v-card min-width="300px" elevation="0">
        <v-chip-group
          active-class="primary--text recipeTypesTags"
          class="recipeTypesTags"
          @change="getAllRecipeByRecipeTypes"
          v-model="selectedRecipeType"
        >
          <v-chip
            class="ma-1 chip-shadow"
            color="white"
            v-for="(val, i) in recipeTypeFacets"
            :key="i"
            >{{ val }}</v-chip
          >
        </v-chip-group>
      </v-card>
    </v-row>
    <div class="text-h5 font-weight-bold mt-5">Main Ingredients</div>
    <v-row class="mt-2" justify="center">
      <v-card min-width="300px" elevation="0">
        <v-chip-group
          active-class="primary--text recipeTypesTags"
          class="recipeTypesTags"
          @change="getAllRecipeByMainIngredient"
          v-model="selectedMainIngredient"
        >
          <v-chip
            class="ma-1 chip-shadow"
            color="white"
            v-for="(val, i) in mainIngredientFacets"
            :key="i"
            >{{ val.name }}</v-chip
          >
        </v-chip-group>
      </v-card>
    </v-row>
    <v-row class="pt-5">
      <v-col cols="12">
        <div class="text-h5 font-weight-bold">Top Recipes</div>
      </v-col>
      <v-col
        cols="12"
        sm="4"
        md="3"
        v-for="recipe in recipes"
        :key="recipe.objectID"
        class="pl-5 pr-5"
      >
        <RecipeCard :recipe="recipe" />
      </v-col>
    </v-row>
    <v-row v-if="totalPages > 1">
      <v-col>
        <div class="text-center">
        <v-pagination v-model="page" :length="totalPages" @input="paginate"></v-pagination>
        </div>
      </v-col>
    </v-row>
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
import RecipeCard from "@/components/RecipeCard.vue";
import {
  getUserByUserName,
  updateUserDetails,
  addProfileImage,
  getIngredientsName,
} from "../../service/db.service";
import { getFacets, getRecipes } from "../../service/search.service";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
export default {
  name: "userProfile",
  components: {
    RecipeCard,
    Cropper,
  },
  head() {
    return {
      title: `All Recipes of ${this.user?.userName}`,
      meta: [
        { charset: "utf-8" },
        {
          hid: "og:title",
          property: "og:title",
          content: `All Recipes of ${this.user?.userName}`,
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `${process.env.NUXT_ENV_BASE_URL}${this.$nuxt.$route.path}`,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: `Find all recipes of ${this.user?.userName} in detail at hungrydemocracy with ingredient, tools, prepration time, cooking time recommendations ...`,
        },
        // {
        //   hid: "og:image",
        //   property: "og:image",
        //   content: this.recipes?.imageUrls[0],
        // },
        {
          hid: "description",
          name: "description",
          content: `Find all recipes of ${this.user?.userName} in detail at hungrydemocracy with ingredient, tools, prepration time, cooking time recommendations ...`,
        },
        { hid: "og-type", property: "og:type", content: "website" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        {
          hid: "canonical",
          rel: "canonical",
          href: this.$nuxt.$route.query.ingredient ? `${process.env.NUXT_ENV_BASE_URL}${this.$nuxt.$route.path}?ingredient=${this.$nuxt.$route.query.ingredient}` : this.$nuxt.$route.query.page ? `${process.env.NUXT_ENV_BASE_URL}${this.$nuxt.$route.path}?page=${this.$nuxt.$route.query.page}` : this.$nuxt.$route.query.type ? `${process.env.NUXT_ENV_BASE_URL}${this.$nuxt.$route.path}?type=${this.$nuxt.$route.query.type}` : `${process.env.NUXT_ENV_BASE_URL}${this.$nuxt.$route.path}`,
        },
      ],
    };
  },
  data() {
    return {
      recipes: [],
      user: null,
      initials: null,
      isLoading: false,
      showTextArea: false,
      aboutMe: "",
      showAddEditBtn: false,
      img: null,
      dialog: false,
      croppedImage: null,
      isUploading: false,
      recipeTypeFacets: null,
      mainIngredientFacets: [],
      selectedRecipeType: null,
      selectedMainIngredient: null,
      totalPages: 0,
      page: 1,
    };
  },
  async fetch() {
    await this.init();
  },

  computed: {
    userName: function () {
      return this.$store.getters["userStore/getUserName"];
    },
    uid: function () {
      return this.$store.getters["userStore/getUid"];
    },
  },

  methods: {
    async init() {
      this.isLoading = true;
      const userName = this.$route.params.userName;
      this.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
      const result = await getFacets("both", "userPage", null, null, userName);
      this.recipeTypeFacets = Object.keys(result.facets.recipeTypes);
      const mainIngredientFacets = Object.keys(result.facets.mainIngredients);
      if(!this.$route.query.ingredient){
        mainIngredientFacets.map((facet) => {
          getIngredientsName(facet).then((snap) => {
            if (snap) {
              const ingredient = { id: facet, name: snap };
              this.mainIngredientFacets.push(JSON.parse(JSON.stringify(ingredient)));
            }
          }); 
        })
      }
      let results = null;
      if (this.$route.query.type) {
        this.selectedRecipeType = this.recipeTypeFacets.indexOf(this.$route.query.type.split("-").join(" "));
        results = await getRecipes(
          "both",
          "userPage",
          this.page - 1,
          this.recipeTypeFacets[this.selectedRecipeType],
          null,
          userName
        );
      } else if (this.$route.query.ingredient) {
        for(const facet of mainIngredientFacets){
          const facetName = await getIngredientsName(facet)
          if(facetName){
            const ingredient = { id: facet, name: facetName };
            this.mainIngredientFacets.push(JSON.parse(JSON.stringify(ingredient)));
          }
        }
        this.selectedMainIngredient = this.mainIngredientFacets.findIndex(i => i.name === this.$route.query.ingredient.split("-").join(" "));
        results = await getRecipes(
          "both",
          "userPage",
          this.page - 1,
          null,
          this.mainIngredientFacets[this.selectedMainIngredient].id,
          userName
        );
      } else {
        results = await getRecipes(
          "both",
          "userPage",
          this.page - 1,
          null,
          null,
          userName
        );
      }
      this.recipes = results.hits;
      this.totalPages = parseInt(results.nbPages);
      this.recipes = this.recipes.map((el) => {
        el.imageUrls = el.imageUrls.map((el) => {
          return el.split("&")[0];
        });
        return el;
      });
      this.user = await getUserByUserName(userName);
      this.showAddEditBtn = userName === this.userName;
      this.initials = this.user?.firstName.charAt(0) + this.user?.lastName.charAt(0);
      this.aboutMe = (await (this.user && this.user?.aboutMe)) ? this.user?.aboutMe : "";
      this.dialog = false;
      this.isLoading = false;
    },
    async saveDetails() {
      if (this.aboutMe.trim() && this.aboutMe.length <= 240) {
        await updateUserDetails({ aboutMe: this.aboutMe }, this.user?.uid);
        this.user = await getUserByUserName(this.userName);
        await this.init();
        this.closeTextArea();
      }
    },
    async selectImage(e) {
      this.dialog = true;
      let imgUrl = e.target.files[0];
      this.img = URL.createObjectURL(imgUrl);
    },
    async uploadUserProfile() {
      this.isUploading = true;
      let profileImage = await addProfileImage(this.user, this.croppedImage);
      await updateUserDetails({ profileImage: profileImage }, this.user?.uid);
      await this.$store.dispatch("userStore/updateProfile", profileImage);
      this.user = await getUserByUserName(this.userName);
      await this.init();
      this.isUploading = false;
    },
    async cropImage({ coordinates, canvas }) {
      const blob = await (await fetch(canvas.toDataURL())).blob();
      this.croppedImage = new File(
        [blob],
        `${coordinates.width * coordinates.height + coordinates.height}.png`,
        { type: "image/png", lastModified: new Date() }
      );
    },
    closeTextArea() {
      this.aboutMe = this.user && this.user?.aboutMe ? this.user?.aboutMe : "";
      this.showTextArea = false;
    },
    closeCropper() {
      this.dialog = false;
      this.croppedImage = null;
      this.img = null;
    },
    async getAllRecipeByRecipeTypes() {
      this.page = 1;
      this.selectedMainIngredient = undefined;
      if (this.selectedRecipeType !== undefined) {
        this.$router.push({
          path: `/${this.$route.params.userName}`,
          query: { type: this.recipeTypeFacets[this.selectedRecipeType].split(" ").join("-") },
        });
      } else {
        this.$router.push({
          path: `/${this.$route.params.userName}`
        });
      }
    },
    async getAllRecipeByMainIngredient() {
      this.page = 1;
      this.selectedRecipeType = undefined;
      if (this.selectedMainIngredient !== undefined) {
        this.$router.push({
          path: `/${this.$route.params.userName}`,
          query: { ingredient: this.mainIngredientFacets[this.selectedMainIngredient].name.split(" ").join("-") },
        });
      } else {
        this.$router.push({
          path: `/${this.$route.params.userName}`
        });
      }
    },
    paginate(){
      this.$router.push({
        path: `/${this.$route.params.userName}`,
        query: {page: this.page}
      })
    }
  },
  watch: {
    "$route.query.ingredient": {
      handler: async function (search) {
        if (search) {
          this.selectedMainIngredient = this.mainIngredientFacets.findIndex(
            (i) => i.name === search.split("-").join(" ")
          );
          const result = await getRecipes(
            "both",
            "userPage",
            this.page - 1,
            null,
            this.mainIngredientFacets[this.selectedMainIngredient].id,
            this.$route.params.userName
          );
          this.recipes = result.hits;
          this.totalPages = parseInt(result.nbPages);
        } else {
          this.selectedMainIngredient = undefined;
          this.selectedRecipeType = undefined;
          const result = await getRecipes(
            "both",
            "userPage",
            this.page - 1,
            null,
            null,
            this.$route.params.userName
          );
          this.recipes = result.hits;
          this.totalPages = parseInt(result.nbPages);
        }
      },
    },
    "$route.query.type": {
      handler: async function (search) {
        let result = null;
        if (search) {
          this.selectedRecipeType = this.recipeTypeFacets.indexOf(
            search.split("-").join(" ")
          );
          result = await getRecipes(
            "both",
            "userPage",
            this.page - 1,
            this.recipeTypeFacets[this.selectedRecipeType],
            null,
            this.$route.params.userName
          );
        } else {
          this.page = 1;
          this.selectedMainIngredient = undefined;
          this.selectedRecipeType = undefined;
          result = await getRecipes(
            "both",
            "userPage",
            this.page - 1,
            null,
            null,
            this.$route.params.userName
          );
        }
        this.recipes = result.hits;
        this.totalPages = parseInt(result.nbPages);
      },
    },
    "$route.query.page": {
      handler: async function (page) {
        let result = null;
        if (page) {
          this.page = parseInt(page);
          result = await getRecipes(
            "both",
            "userPage",
            this.page - 1,
            null,
            null,
            this.$route.params.userName
          );
        } else {
          this.page = 1;
          result = await getRecipes(
            "both",
            "userPage",
            this.page - 1,
            null,
            null,
            this.$route.params.userName
          );
        }
        this.selectedMainIngredient = undefined;
        this.selectedRecipeType = undefined;
        this.recipes = result.hits;
        this.totalPages = parseInt(result.nbPages);
      },
    },
  },
};
</script>
<style scoped>
.aboutMe {
  width: 50%;
}
.v-text-field-btn {
  width: 50%;
  display: flex;
  justify-content: flex-end;
}
.avatar__icon {
  width: 100%;
  position: absolute;
  top: 47px;
  background-color: black;
  opacity: 0.3;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  height: 28px;
}
#file-input {
  z-index: 9;
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
}

.cropper {
  height: 400px;
  width: 600px;
  background: white;
}
@media screen and (max-width: 600px) {
  .aboutMe {
    width: 90%;
  }
  .v-text-field-btn {
    width: 90%;
  }
}
</style>

