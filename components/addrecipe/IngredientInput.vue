<template>
  <v-row align="start" class="pb-4">
    <v-col cols="12" md="5" sm="12">
      <v-autocomplete
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        flat
        :autofocus="+index > 0 && !select"
        outlined
        :hide-details="!(this.customIngredient && this.customIngredient.new)"
        label="Search for your ingredient"
        solo
        item-text="name"
        item-value="objectID"
        :rules="ingredientRules"
        @change="saveIngredient"
        @blur="saveIngredient"
        validate-on-blur
        persistent-hint
        :hint="
          this.customIngredient && this.customIngredient.new && this.getIsAdmin
            ? 'Ingredient Pending Review'
            : ' '
        "
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title v-if="search && !loading">
              <span class="hidden-xs-only">Add new ingredient</span>&nbsp;
              <strong>{{ search }}</strong
              >&nbsp;&nbsp;
              <v-btn small @click="addNewIngredient" color="primary">
                <v-icon x-small>mdi-plus</v-icon>
                Add
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col cols="6" md="1" sm="6">
      <v-text-field
        v-model="quantity"
        label="qty"
        outlined
        :rules="quantityRules"
        @change="saveIngredient"
      ></v-text-field>
    </v-col>
    <v-col cols="6" sm="6" md="2">
      <v-select
        v-model="unit"
        item-text="name"
        item-value="name"
        :items="unitList"
        outlined
        :clearable="false"
        :rules="unitRules"
        @change="saveIngredient"
        validate-on-blur
        label="Unit"
      ></v-select>
    </v-col>
    <v-col cols="12" md="3" sm="12">
      <v-text-field
        v-model="notes"
        value="notes"
        label="notes"
        outlined
        @change="saveIngredient"
      />
    </v-col>
    <v-col cols="12" md="1" sm="12" class="pt-0 pt-md-6">
      <v-btn text color="red" @click="deleteIngredient"> Remove</v-btn>
    </v-col>
    <v-col
      cols="12"
      v-if="message && message.length > 2"
      style="margin-top: -40px"
    >
      <div class="text-caption error--text">{{ this.message }}</div>
    </v-col>
    <v-col
      cols="12"
      v-if="
        this.index === this.getIngredientCountForSection(this.sectionIndex) - 1
      "
      sm="12"
    >
      <v-btn color="primary" @click="addIngredient">+ Add Ingredient</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapActions: searchStoreActions } =
  createNamespacedHelpers("searchStore");
const { mapActions: addRecipeStoreActions, mapGetters: addRecipeStoreGetters } =
  createNamespacedHelpers("addRecipeStore");
const { mapGetters: userStoreGetters } = createNamespacedHelpers("userStore");

export default {
  props: {
    index: Number,
    sectionIndex: Number,
  },
  data() {
    return {
      loading: false,
      items: [],
      rawItems: [],
      search: null,
      select: null,
      customIngredient: {},
      rules: {
        required: (value) => !!value || "Required.",
      },
      quantity: null,
      unit: null,
      notes: null,
      quantityRules: [
        (v) => !!v || "Quantity is required",
        (v) =>
          /\d+([/.]\d+)?/.test(v) ||
          "Quantity only accepts numbers, fractions (like 1/2) or decimals(like 0.5)",
      ],
      unitRules: [(v) => !!v || "Unit is required"],
      ingredientRules: [(v) => !!v || "Ingredient is required"],
      message: " ",
    };
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  computed: {
    ...addRecipeStoreGetters([
      "getDraftRecipeIngredientItemsForIndex",
      "getDraftRecipeIngredientSelectForIndex",
      "getDraftRecipeIngredientQuantityForIndex",
      "getDraftRecipeIngredientUnitForIndex",
      "getDraftRecipeIngredientNotesForIndex",
      "getIngredientCountForSection",
      "getRecipeIngredientAtIndex",
    ]),
    ...userStoreGetters(["getIsAdmin"]),
    unitList() {
      return [
        { name: "gms" },
        { name: "handful" },
        { name: "tsp" },
        { name: "tbsp" },
        { name: "unit/count" },
        { name: "cup" },
        { name: "bunch" },
        { name: "pinch" },
        { name: "inch" },
        { name: "serving" },
        { name: "spoon" },
        { name: "oz" },
        { name: "lb" },
        { name: "sprig" },
      ];
    },
  },
  mounted() {
    this.select = this.getDraftRecipeIngredientSelectForIndex(
      this.sectionIndex,
      this.index
    );
    this.customIngredient = this.getRecipeIngredientAtIndex(
      this.sectionIndex,
      this.index
    ).ingredient;
    this.items = this.getDraftRecipeIngredientItemsForIndex(
      this.sectionIndex,
      this.index
    );
    this.quantity = this.getDraftRecipeIngredientQuantityForIndex(
      this.sectionIndex,
      this.index
    );

    const unit = this.getDraftRecipeIngredientUnitForIndex(
      this.sectionIndex,
      this.index
    );

    this.unit = unit ? unit : { name: "unit/count" };
    this.notes = this.getDraftRecipeIngredientNotesForIndex(
      this.sectionIndex,
      this.index
    );

    if (this.customIngredient && !this.customIngredient?.objectID) {
      this.message = `Error saving above ingredient- '${this.select}'. Please Try again.`;
    }
  },
  methods: {
    addNewIngredient() {
      if (this.search && this.search.length < 3) {
        return;
      }
      const ingredient = {
        new: true,
        choosenName: this.search,
        allNames: [this.search],
        name: this.search,
        id: Date.now(),
        typeAndCat: this.search,
        ingredient: {
          allNames: [this.search],
          objectID: this.search,
          new: true,
          choosenName: this.search,
        },
      };
      if (
        ingredient &&
        ingredient.ingredient &&
        ingredient.ingredient.objectID.length > 0
      ) {
        this.items.push(ingredient);
        this.select = ingredient.allNames[0];
        this.customIngredient = ingredient.ingredient;
        const sectionIndex = this.$props.sectionIndex;
        const currentIndex = this.$props.index;
        this.addNewUserSpecifiedIngredient({
          sectionIndex,
          currentIndex,
          ingredient,
        });
        this.message = " ";
      } else {
        this.message = "An Error occurred trying to save. Try again";
      }
    },
    addIngredient() {
      const sectionIndex = this.$props.sectionIndex;
      const index = this.$props.index;
      this.addEmptyIngredientInSection(sectionIndex);
    },
    ...searchStoreActions(["performAutoCompleteSearchIngredients"]),
    ...addRecipeStoreActions([
      "addAndSaveIngredient",
      "addEmptyIngredientInSection",
      "removeSectionIngredient",
      "addNewUserSpecifiedIngredient",
    ]),
    deleteIngredient() {
      const sectionIndex = this.$props.sectionIndex;
      const ingIndex = this.$props.index;
      this.removeSectionIngredient({ sectionIndex, ingIndex });
      this.message = " ";
    },
    async querySelections(v) {
      this.loading = true;
      const results = await this.performAutoCompleteSearchIngredients(v);
      this.items = results.flatResults;
      this.rawItems = results.rawResults;
      this.loading = false;
    },
    async saveIngredient() {
      let custom = false;
      let rawIngredient = null;
      if (this.select) {
        this.rawItems.map((item) => {
          if (item.allNames.includes(this.select)) {
            rawIngredient = item;
          }
        });
      }
      let rawIngredientSubset = {};
      if (rawIngredient != null) {
        //TODO This is really bad code. Please fix when you know how to.
        const { allNames, objectID, ...partialObject } = rawIngredient;
        rawIngredientSubset = { allNames, objectID, new: false };
      }
      const unitAfterChoosing = this.unit.name ? this.unit.name : this.unit;
      if (
        this.customIngredient &&
        this.customIngredient.choosenName &&
        this.select === this.customIngredient.choosenName
      ) {
        custom = true;
        rawIngredientSubset = this.customIngredient;
      }
      const ingredient = {
        quantity: this.quantity,
        unit: unitAfterChoosing,
        ingredient: rawIngredientSubset,
        choosenName:
          custom && this.search && this.search.length > 2
            ? this.search
            : this.select,
        notes: this.notes,
        new: custom,
      };
      if (
        ingredient &&
        ingredient.ingredient &&
        ingredient.ingredient.objectID?.length > 0
      ) {
        const currIndex = this.index;
        const sectionIndex = this.sectionIndex;
        await this.addAndSaveIngredient({
          sectionIndex,
          currIndex,
          ingredient,
        });
        this.message = " ";
      } else {
        this.message = "An Error occurred trying to save. Try again";
      }
    },
  },
};
</script>

<style></style>
