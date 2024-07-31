<template>
  <v-img
    :alt="name ? `hungry democracy ${name} icon` : 'hungrydemocracy default icon'"
    :src="getImage(iconName)"
    :width="size || 18"
    class="mr-2"
    contain
  />
</template>
<script>
export default {
  name: "custom-icon",
  props: {
    name: {
      type: String,
    },
    src: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  methods: {
    getImage(name){
      try {
        return require(`../static/img/icons/${name}.svg`)
      } catch (error) {
        return require('../static/img/icons/default.png')        
      }
    }
  },
  computed: {
    iconName: function () {
      if (this.src) {
        return this.src;
      } else {
        const name = this.name
          ? this.name?.toLowerCase().trim().split(" ").join("_")
          : null;
        // if (pn) {
        //   return `/img/icons/${pn}.svg?webp`;
        // }
        if(name) return name
        else return `/img/icons/default.png`
      }
    },
  },
};
</script>

<style></style>
