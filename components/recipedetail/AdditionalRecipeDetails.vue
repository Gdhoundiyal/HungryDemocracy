<template>
  <v-card
    min-height="215px"
    class="pa-4"
    rounded="lg"
    elevation="0"
    :style="{
      boxShadow: '0px 3px 6px #00000029 !important',
    }"
  >
    <v-row>
      <v-col cols="12" md="4" sm="12">
        <div style="width: 100%" class="d-flex justify-start align-center">
          <div class="pa-4">
            <v-avatar size="36px">
              <img src="/cooking_time.png?webp" alt="hungrydemocracy cooking time icon" />
            </v-avatar>
            <!-- <v-icon v-else x-large>mdi-timer-outline</v-icon>-->
          </div>
          <div>
            <div class="subtitle-1 font-weight-bold text-capitalize">
              Cooking Time
            </div>
            <div>
              <span
                class="text-h6 font-weight-bold mr-1"
                style="margin-top: -5px"
              >
                {{ recipe.cookingTime || "NA" }}</span
              ><span>min</span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <div style="width: 100%" class="d-flex justify-start align-center">
          <div class="pa-4">
            <v-avatar size="36px">
              <img src="/preparing_time.png?webp" alt="hungrydemocracy Prep time icon" />
            </v-avatar>
            <!--<v-icon x-large>mdi-knife</v-icon>-->
          </div>
          <div>
            <div class="subtitle-1 font-weight-bold text-capitalize">
              Prep Time
            </div>
            <div>
              <span
                class="text-h6 font-weight-bold mr-1"
                style="margin-top: -5px"
              >
                {{ recipe.prepTime || "NA" }} </span
              ><span>min</span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <div style="width: 100%" class="d-flex justify-start align-center">
          <div class="pa-4">
            <v-avatar size="36px">
              <img src="/servings.png?webp" alt="hungrydemocracy Serving icon" />
            </v-avatar>
          </div>
          <div>
            <div class="subtitle-1 font-weight-bold text-capitalize">
              Serves
            </div>
            <div>
              <span
                class="text-h6 font-weight-bold mr-1"
                style="margin-top: -5px"
              >
                {{ recipe.serves || "NA" }}
              </span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4" v-if="recipe.categories.length > 0">
        <div
          class="ml-md-4 ml-sm-0 pa-4 rounded-lg fill-height"
          style="background: #0000000b; min-height: 100px"
        >
          <div class="subtitle-1 font-weight-bold">Categories</div>
          <div>
            <span v-if="recipe.categories">
              <v-chip
                class="ma-1 chip-shadow"
                v-for="(category, index) in recipe.categories"
                :key="index"
                color="white"
              >
                <CustomIcon :name="category.allNames[0]" />
                {{ category.allNames[0] }}
              </v-chip>
            </span>
          </div>
        </div>
      </v-col>
      <v-col md="4" v-if="recipe.tools.length > 0">
        <div
          class="ml-md-4 ml-sm-0 pa-4 rounded-lg fill-height"
          style="background: #0000000b; min-height: 100px"
        >
          <div class="subtitle-1 font-weight-bold">Cooking tools used</div>
          <div>
            <span>
              <v-chip
                class="ma-1 chip-shadow"
                v-for="(tool, index) in recipe.tools"
                :key="index"
                color="white"
              >
                <CustomIcon :name="tool.allNames[0]" />
                {{ tool.allNames[0] }}
              </v-chip>
            </span>
          </div>
        </div>
      </v-col>
      <v-col md="4" v-if="recipe.cuisines.length > 0">
        <div
          class="ml-md-4 ml-sm-0 pa-4 rounded-lg fill-height"
          style="background: #0000000b; min-height: 100px"
        >
          <div class="subtitle-1 font-weight-bold">Cuisines</div>
          <div>
            <span v-if="recipe.cuisines">
              <v-chip
                class="ma-1 chip-shadow"
                v-for="(cuisine, index) in recipe.cuisines"
                :key="index"
                color="white"
              >
                <CustomIcon :name="cuisine.allNames[0]" />
                {{ cuisine.allNames[0] }}
              </v-chip>
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import CustomIcon from "../CustomIcon";

export default {
  name: "additional-recipe-details",
  components: { CustomIcon },
  props: {
    recipe: {
      type: Object,
    },
  },
};
</script>
