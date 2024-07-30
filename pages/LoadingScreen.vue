<template>
  <div id="loading__container">
    <h2 class="header">Hungry Democracy</h2>
    <div class="loader">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <p class="loading_text">Loading Recipes ...</p>
  </div>
</template>

<script scoped>
export default {
  layout: "loading",
};
</script>
<style>
#loading__container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  /*background-color: #42CC8C25;*/
}
.header {
  position: absolute;
  top: 30%;
  font-size: 2em;
}
.loading_text {
  position: absolute;
  bottom: 40%;
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

