<template>
  <v-container>
    <v-row align="start" justify="space-around">
      <v-col cols="12" sm="12" md="1">
        <div class="text-h6 font-weight-bold">Step {{ +index + 1 }}</div>
      </v-col>
      <v-col cols="12" sm="10" md="10">
        <v-textarea
          label="Add a recipe step"
          auto-grow
          outlined
          :autofocus="+index > 0 && !directionText"
          v-model="directionText"
          @input="updateDirectionText"
          :rules="directionRules"
          :append-icon="isFirefox == true ? null : dictationIcon"
          @click:append="dictation"
          rows="4"
        ></v-textarea>
      </v-col>
      <v-col cols="12" sm="2" md="1">
        <v-btn text color="red" @click="deleteDirection"> Remove</v-btn>
      </v-col>
      <v-col cols="12" sm="2" md="1" />
      <v-col
        v-if="this.index === this.getAddRecipeDirectionsCount - 1"
        sm="10"
        md="11"
      >
        <v-btn color="primary" @click="addDirection">+ Add Direction</v-btn>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12">
        <v-divider />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    index: Number,
  },
  data() {
    return {
      directionText: "",
      directionRules: [(v) => !!v || "Direction is required"],
      dictationIcon: "mdi-microphone",
      listening: false,
      recognition: null,
      isFirefox: false,
    };
  },
  methods: {
    addDirection() {
      this.$store.dispatch('addRecipeStore/addDirection', null, { root:true });
    },
    dictation() {
      if (!isFirefox) {
        if (!this.listening) {
          this.listening = true;
          this.directionText = "listening..";
          this.dictationIcon = "mdi-stop-circle";

          if (process.client) this.recognition.start();

          const onResult = (event) => {
            const result = [];
            for (const res of event.results) {
              if (res.isFinal) {
                this.listening = false;
                this.dictationIcon = "mdi-microphone";
                if (process.client) this.recognition.stop();
              }
              result.push(res[0].transcript);
            }
            this.directionText = result;
            this.updateDirectionText();
          };

          if (process.client) {
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.addEventListener(
              "result",
              this.processDictationResult
            );
          }
          // this.listening = false;
          // this.dictationIcon = "mdi-microphone";
        } else {
          if (process.client) this.recognition.stop();
          this.listening = false;
          this.dictationIcon = "mdi-microphone";
        }
      }
    },
    deleteDirection() {
      this.$store.dispatch('addRecipeStore/removeDirection', this.index, { root:true });
    },
    processDictationResult(event) {
      const result = [];
      for (const res of event.results) {
        if (res.isFinal) {
          this.listening = false;
          this.dictationIcon = "mdi-microphone";
          if (process.client) this.recognition.stop();
        }
        result.push(res[0].transcript);
      }
      if (result) {
        this.directionText = result.join("");
        this.updateDirectionText();
      }
    },
    updateDirectionText() {
      const index = this.index;
      const directionText = this.directionText;
      this.$store.dispatch('addRecipeStore/addAndSaveDirection', { index, directionText }, { root:true });
    },
  },
  computed: {
    getAddRecipeDirectionsCount() {
      return this.$store.getters['addRecipeStore/getAddRecipeDirectionsCount'];
    }
  },
  mounted() {
    this.directionText = this.$store.getters['addRecipeStore/getDraftRecipeDirectionTextForIndex'](this.index);
    // this.directionText = this.getDraftRecipeDirectionTextForIndex(this.index);
    if (process.client) {
      if (navigator.userAgent.indexOf("Firefox") == -1) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
      } else {
        this.isFirefox = true;
      }
    }
  },
};
</script>

<style></style>
