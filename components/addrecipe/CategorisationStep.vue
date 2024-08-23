<template>
  <v-container fluid>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <div
      :style="{
        width: $vuetify.breakpoint.smAndDown ? '100%' : '90%',
        margin: 'auto',
      }"
    >
      <v-tabs
        show-arrows
        grow
        color="primary"
        v-model="stepCount"
        background-color="transparent"
      >
        <v-tab>
          <div class="text-h6 font-weight-bold text-capitalize">Categories</div>
        </v-tab>
        <v-tab>
          <div class="text-h6 font-weight-bold text-capitalize">
            Cooking Tools
          </div>
        </v-tab>
        <v-tab>
          <div class="text-h6 font-weight-bold text-capitalize">Cuisines</div>
        </v-tab>
      </v-tabs>
      <v-divider></v-divider>
      <v-tabs-items class="mt-6 py-6" v-model="stepCount">
        <v-tab-item>
          <v-card
            elevation="0"
            outlined
            :recipeProp="recipeProp"
            class="mb-6 pa-4"
            min-height="250px"
          >
            <div
              :style="{
                width: $vuetify.breakpoint.smAndDown ? '100%' : '80%',
                margin: 'auto',
              }"
            >
              <v-chip-group
                class="d-flex overflow-y-auto justify-center"
                multiple
                column
                v-model="categoryIndexes"
                v-if="allMetaLoaded"
              >
                <v-chip
                  :style="{ width: '150px', height: '150px' }"
                  v-for="cat in getAllCategoriesSorted"
                  :key="cat.id"
                  class="my-2 mx-2 mx-md-4 chip-shadow pa-2 chip-select"
                  outlined
                  primary
                  active-class="primary"
                >
                  <div
                    :style="{ width: '150px' }"
                    class="
                      d-flex
                      pa-1
                      flex-column
                      align-center
                      justify-center
                      text-center
                    "
                  >
                    <CustomIcon :name="cat.allNames[0]" size="48" />
                    <div
                      class="
                        text-caption
                        font-weight-bold
                        text-wrap text-center
                      "
                    >
                      {{ cat.allNames[0] }}
                    </div>
                  </div>
                </v-chip>
              </v-chip-group>
            </div>
          </v-card>
          <div class="text-center mt-6 py-6 d-flex justify-center align-center">
            <v-btn class="px-6 px-md-12 ma-2" @click.stop="show = false"
              >Previous Step</v-btn
            >
            <v-btn class="px-6 px-md-12 ma-2" color="primary" @click="saveCat"
              >Next Step</v-btn
            >
          </div>
        </v-tab-item>
        <v-tab-item>
          <v-card elevation="0" outlined class="mb-12 pa-4" min-height="250px">
            <div
              :style="{
                width: $vuetify.breakpoint.smAndDown ? '100%' : '80%',
                margin: 'auto',
              }"
            >
              <v-chip-group
                class="d-flex overflow-y-auto"
                multiple
                column
                v-model="toolIndexes"
                v-if="allMetaLoaded"
              >
                <v-chip
                  :style="{ width: '150px', height: '150px' }"
                  v-for="tool in getAllToolsSorted"
                  :key="tool.id"
                  class="my-2 mx-2 mx-md-4 chip-shadow pa-2 chip-select"
                  outlined
                  primary
                  active-class="primary"
                >
                  <div
                    :style="{ width: '150px' }"
                    class="
                      d-flex
                      pa-1
                      flex-column
                      align-center
                      justify-center
                      text-center
                    "
                  >
                    <CustomIcon :name="tool.allNames[0]" size="48" />
                    <div
                      class="
                        mt-2
                        text-caption
                        font-weight-bold
                        text-wrap text-center
                      "
                    >
                      {{ tool.allNames[0] }}
                    </div>
                  </div>
                </v-chip>
              </v-chip-group>
            </div>
          </v-card>
          <div class="text-center mt-6 py-6 d-flex justify-center align-center">
            <v-btn class="px-6 px-md-12 ma-2" @click="stepCount = 0"
              >Previous Step</v-btn
            >
            <v-btn class="px-6 px-md-12 ma-2" color="primary" @click="saveTool"
              >Next Step</v-btn
            >
          </div>
        </v-tab-item>
        <v-tab-item>
          <v-card elevation="0" outlined class="mb-12 pa-4" min-height="250px">
            <div
              :style="{
                width: $vuetify.breakpoint.smAndDown ? '100%' : '80%',
                margin: 'auto',
              }"
            >
              <v-chip-group
                class="d-flex overflow-y-auto"
                multiple
                column
                v-model="cuisineIndexes"
                v-if="allMetaLoaded"
              >
                <v-chip
                  :style="{ width: '150px', height: '150px' }"
                  v-for="cuisine in getAllCuisinesSorted"
                  :key="cuisine.id"
                  class="my-2 mx-2 mx-md-4 chip-shadow pa-2 chip-select"
                  outlined
                  primary
                  active-class="primary"
                >
                  <div
                    :style="{ width: '150px' }"
                    class="
                      d-flex
                      pa-1
                      flex-column
                      align-center
                      justify-center
                      text-center
                    "
                  >
                    <CustomIcon :name="cuisine.allNames[0]" size="48" />
                    <div
                      class="
                        mt-2
                        text-caption
                        font-weight-bold
                        text-wrap text-center
                      "
                    >
                      {{ cuisine.allNames[0] }}
                    </div>
                  </div>
                </v-chip>
              </v-chip-group>
            </div>
          </v-card>
          <div v-if="errorMessage.length > 2">
            <div class="py-4 text-h6 error--text">{{ errorMessage }}</div>
          </div>

          <div class="text-center mt-6 py-6 d-flex justify-center align-center">
            <v-btn class="px-6 px-md-12 ma-2" @click="stepCount = 1"
              >Previous Step</v-btn
            >
            <v-btn
              class="px-6 px-md-12 ma-2"
              v-if="this.recipeProp.id"
              color="primary"
              @click="update"
              :disabled="loading"
            >
              Update Recipe
            </v-btn>
            <v-btn
              class="px-6"
              v-else
              color="primary"
              @click="submit"
              :disabled="loading"
            >
              Publish Recipe</v-btn
            >
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>

<script>
// https://stackoverflow.com/questions/48035310/open-a-vuetify-dialog-from-a-component-template-in-vuejs
import { createNamespacedHelpers } from "vuex";
import CustomIcon from "../CustomIcon";

const { mapActions, mapGetters } = createNamespacedHelpers("addRecipeStore");

export default {
  components: { CustomIcon },
  data() {
    return {
      stepCount: 0,
      dialog: true,
      value: Boolean,
      loading: false,
      categoryIndexes: [],
      toolIndexes: [],
      cuisineIndexes: [],
      allMetaLoaded: false,
      errorMessage: "",
    };
  },
  props: {
    recipeProp: {
      type: Object,
    },
  },
  methods: {
    ...mapActions([
      "loadAllCategories",
      "loadAllCuisines",
      "loadAllTools",
      "saveCategories",
      "saveTools",
      "saveCuisines",
      "saveRecipe",
      "updateRecipe",
    ]),
    saveCat() {
      this.processCategoriesAndSave();
      this.stepCount = 1;
    },
    saveTool() {
      this.processToolsAndSave();
      this.stepCount = 2;
    },
    onClickCuisines(cuisine) {
      this.saveCuisines(cuisine);
    },
    processCategoriesAndSave() {
      const choosenCats = this.categoryIndexes.map(
        (i) => this.getAllCategoriesSorted[i]
      );
      this.saveCategories(choosenCats);
    },
    processToolsAndSave() {
      const choosenTools = this.toolIndexes.map(
        (i) => this.getAllToolsSorted[i]
      );
      this.saveTools(choosenTools);
    },
    processCuisinesAndSave() {
      const cuisines = this.cuisineIndexes.map(
        (i) => this.getAllCuisinesSorted[i]
      );
      this.saveCuisines(cuisines);
    },
    async update() {
      this.loading = true;
      try {
        this.processCategoriesAndSave();
        this.processToolsAndSave();
        this.processCuisinesAndSave();
        await this.updateRecipe(this.recipeProp.id);
        this.dialog = false;
        this.loading = false;
        this.$router.push({
          name: "index",
          query: { from: "addRecipeSuccess" },
        });
      } catch (e) {
        this.loading = false;
        this.errorMessage = "Something went wrong. Try again.";
      }
    },
    async submit() {
      this.loading = true;
      try {
        this.processCategoriesAndSave();
        this.processToolsAndSave();
        this.processCuisinesAndSave();
        await this.saveRecipe();
        this.dialog = false;
        this.loading = false;
        this.$router.push({
          name: "index",
          query: { from: "addRecipeSuccess" },
        });
      } catch (e) {
        this.loading = false;
        this.errorMessage = "Something went wrong. Try again.";
      }
    },
    cancel() {
      this.dialog = false;
    },
  },
  async created() {
    await Promise.all([
      this.loadAllCategories(),
      this.loadAllCuisines(),
      this.loadAllTools(),
    ]);
    this.categoryIndexes = this.getChoosenCategoryIndexes;
    this.toolIndexes = this.getChoosenToolsIndexes;
    this.cuisineIndexes = this.getChoosenCuisinesIndexes;
    this.allMetaLoaded = true;
  },
  // mounted() {
  //   let arr = [];
  //   for (let i = 0; i < this.getAllCuisinesSorted.length; i++) {
  //     arr.push(this.getAllCuisinesSorted[i].allNames[0]);
  //   }
  // },
  computed: {
    ...mapGetters([
      "getAllCategoriesSorted",
      "getAllToolsSorted",
      "getAllCuisinesSorted",
      "getChoosenCategoryIndexes",
      "getChoosenToolsIndexes",
      "getChoosenCuisinesIndexes",
    ]),
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style>
.v-slide-group__content {
  justify-content: space-between;
  overflow: hidden;
  overflow-y: scroll;
  white-space: nowrap;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
}
.v-slide-group__content::-webkit-scrollbar {
  display: none;
}
</style>
