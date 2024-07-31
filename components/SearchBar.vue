<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="9" class="pa-md-3">
        <v-row class="search-box-background">
          <v-col :cols="$vuetify.breakpoint.mdAndUp ? 10 : 12" class="pr-0">
            <v-combobox
              cache-items
              :items="results"
              filled
              solo
              return-object
              @change="submitSearch"
              no-data-text=""
              ref="select"
              eager
              background-color="#fff"
              class="no-elevation"
              :multiple="allowMultipleSearch"
            >
              <template v-slot:selection="{ attrs, item, parent, selected }" v-if="allowMultipleSearch">
                <v-chip
                  v-if="item === Object(item)"
                  v-bind="attrs"
                  :input-value="selected"
                  label
                  small
                >
                  <span class="pr-2">
                    {{ item.name }}
                  </span>
                  <v-icon>{{ item.icon }}</v-icon>
                  <v-icon small @click="parent.selectItem(item)">
                    $delete
                  </v-icon>
                </v-chip>
              </template>
              <template slot="item" slot-scope="data">
                {{ data.item.type }}: <span class="cb-item">{{data.item.name}}</span> <v-spacer/><v-icon size="20">{{ data.item.icon }}</v-icon>
              </template>
            </v-combobox>
          </v-col>
          <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="2" class="pl-0 pr-4">
            <v-btn
              width="100%"
              @click="submitSearch"
              x-large
              class="mx-t-16"
              color="primary"
              >Search
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          v-if="$vuetify.breakpoint.smAndDown && searchResults > 0 && !noResult"
          class="justify-end"
        >
        
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-dialog
        :value="showFilters"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-row justify="center">
            <v-col cols="10" class="pt-12">
              <div class="d-flex justify-space-between align-center">
                <div class="text-h5 font-weight-bold">Filters</div>
                <v-btn icon @click="showFilters = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="11" class="py-6">
              <RecipeFacetGroup />
            </v-col>
            <v-col cols="10" class="text-center">
              <v-btn
                width="100%"
                @click="submitSearch"
                class="mx-t-16"
                color="primary"
              >
                Apply Search
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import RecipeFacetGroup from "@/components/RecipeFacetsGroup";

export default {
  data() {
    return {
      search: null,
      results: [],
      loading: false,
      selected: null,
      showFilters: false,
      noResult: true,
      allowMultipleSearch: false,
    };
  },
  components: { RecipeFacetGroup },
  methods: {
    async submitSearch(val) {
      if(val?.type === 'recipe_types') {
        window.open(`https://www.hungrydemocracy.com/recipe-type/${val?.name.split(' ').join('-')}`)
        return;
      }
      if (val?.type === "ingredients") {
        this.allowMultipleSearch = true;
        this.selected = [];
        this.selected.push(val);
      }
      
      if (val?.length === 0) {
        const facets = this.facets;
        const value = null
        this.allowMultipleSearch = false;
        this.selected = null;
        this.$router.push("/");
        await this.performSearch({ value, facets });
        return;
      }

      this.$refs.select.isMenuActive = false;
      const facets = this.facets;
      this.showFilters = false;

      let query = "";
      let filter = null
      if (val && this.selected?.length) {
        filter = 'type:recipes AND ingredientSections.ingredients.ingredient.objectID:'
        for (let index = 0; index < this.selected.length - 1; index++) {
          query = query.concat(`${this.selected[index].name}`, "&");
          filter = filter.concat(`"${this.selected[index].id}"`, ' AND ingredientSections.ingredients.ingredient.objectID:')
        }
        query = query.concat(`${this.selected[this.selected.length - 1].name}`);
        filter = filter.concat(`"${this.selected[this.selected.length-1].id}"`)
      } else {
        query = val?.name.trim().replaceAll(" ", "-");
      }
      await this.performSearch({ val, facets, filter });

      if (val && typeof val === "object") {
        this.$router.push({
          name: "index",
          query: { q: query.split(" ").join("-") },
        });
      } else if (val && typeof val === "string") {
        this.$router.push({
          name: "index",
          query: { q: val },
        });
      } else {
        this.$router.push("/");
      }

      // if (!val.typeAndCat) {
      //   this.$router.replace({ name: 'Home', query: { q: val } });
      // } else {
      //   this.$router.replace({ name: 'Home', query: { q: val.typeAndCat } });
      // }
    },
    async performAutoCompleteSearch(val) {
      return await this.$store.dispatch("searchStore/performAutoCompleteSearch", val, { root: true });
    },
    async performSearch(val) {
      await this.$store.dispatch("searchStore/performSearch", val, {root: true});
    },
  },
  computed: {
    facets: function () {
      return this.$store.getters["searchStore/getFacets"];
    },
    searchTerm: function () {
      return this.$store.getters["searchStore/getSearchTerm"];
    },
    searchResults: function () {
      return this.$store.getters["searchStore/getSearchResultsLength"];
    },
  },
  async fetch() {
    if (this.$route.query && this.$route.query.q) {
      const searchQuery = this.$route?.query?.q?.replaceAll("-", " ");
      const results = await this.performAutoCompleteSearch(searchQuery);
      if (results === undefined || results.length === 0) {
        this.noResult = true;
      } else {
        this.noResult = false;
        this.results = results;
      }
      const searchAutoComplete = this.results.find(
        (el) => el.name === searchQuery
      );
      this.selected = searchAutoComplete ? searchAutoComplete : searchQuery;
      await this.submitSearch(this.selected);
    }
  },
  watch: {
    async search(val) {
      this.loading = true;
      const results = await this.performAutoCompleteSearch(val);
      if (results === undefined || results.length === 0) {
        this.noResult = true;
      } else {
        this.noResult = false;
        this.results = results;
      }
      this.loading = false;
    },
    select() {
      setTimeout(() => {
        this.$refs.select.isMenuActive = false;
      }, 50);
    },
  },
};
</script>

<style></style>
