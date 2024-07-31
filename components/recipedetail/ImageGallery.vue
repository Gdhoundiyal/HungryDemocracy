<template>
  <v-sheet
    transition="fade-transition"
    role="dialog"
    :style="{ display: this.dialog ? 'block' : 'none' }"
    class="image-gallery"
  >
    <v-card dark class="fill-height">
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide v-for="(img, index) in this.images" :key="index">
          <div
            :style="{ height: '85vh', width: '90%', margin: 'auto' }"
            class="mt-12"
          >
            <!-- <v-img
              height="85vh"
              contain
              style="border-radius: 3px"
              eager
              alt="hungrydemocracy recipe image"
              :src="img.href"
            >
            <div class="d-flex justify-space-between">
              <div class="image-title-bar" :style="{ maxWidth: '250px' }">
                <div class="px-3 text-h5 text--white font-weight-bold">
                  {{ img.title }}
                </div>
                <div class="d-flex align-center px-3">
                  <div class="subtitle-1">@{{ img.description }}</div>
                </div>
              </div>
              <v-btn
                elevation="1"
                large
                color="white"
                icon
                @click.stop="handleDialog"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-img> -->
            <div style="position: relative" class="d-flex justify-center">
              <div
                class="image-title-bar"
                :style="{ maxWidth: '250px', position: 'absolute', left: 0 }"
              >
                <div class="px-3 text-h5 text--white font-weight-bold">
                  {{ img.title }}
                </div>
                <div class="d-flex align-center px-3">
                  <div class="subtitle-1">@{{ img.description }}</div>
                </div>
              </div>
              <div :style="{ position: 'absolute', right: '0' }">
                <v-btn
                  elevation="1"
                  large
                  color="white"
                  icon
                  @click.stop="handleDialog"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <nuxt-img
                :src="img.href"
                :alt="'hungrydemocracy placeholder image'"
                class="images"
                loading="lazy"
                :placeholder="!img.href ? '/placeholder.jpeg?webp' : ''"
              >
              </nuxt-img>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </v-card>
  </v-sheet>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "recipe-image-gallery",
  props: {
    images: {
      type: Array,
    },
    dialog: {
      type: Boolean,
    },
    handleDialog: {
      type: Function,
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },

  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
};
</script>

<style scoped>
.image-gallery {
  margin: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 400;
}
.images {
  height: 85vh;
  /* width: 60%; */
  object-fit: contain;
}
</style>
