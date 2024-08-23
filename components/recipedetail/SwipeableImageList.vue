<template>
  <div>
    <swiper
      v-if="this.recipe.imageUrls.length > 0"
      class="swiper"
      :options="swiperOption"
    >
      <swiper-slide
        v-for="(img, index) in this.recipe.imageUrls"
        :key="index"
        class="clickable"
      >
        <!-- <v-img
          @click.stop="handleDialog"
          style="border-radius: 3px"
          height="350"
          lazy-src="/placeholder.jpeg?webp"
          :alt="recipe ? recipe.title : 'hungrydemocarcy placeholder image'"
          :src="img"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img> -->
        <nuxt-img 
          :src="img" 
          :alt="recipe ? recipe.title : 'hungrydemocarcy placeholder image'"
          class="images"
          loading="lazy"
          @click.stop="handleDialog"
        ></nuxt-img>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div v-else>
      <v-img
        alt="Hungrydemocracy placeholder image"
        class="clickable"
        style="border-radius: 3px"
        height="350"
        src="/placeholder.jpeg?webp"
      >
      </v-img>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "swipeable-recipe-image",
  props: {
    recipe: {
      type: Object,
    },
    handleDialog: {
      type: Function,
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data: function () {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
    };
  },
};
</script>

<style scoped>
  .images{
    height: 350px;
    width: 100%;
    object-fit: cover;
  }
</style>
