<template>
    <div>
      <div>Step - {{ index + 1 }}</div>
      <div class="d-flex flex-wrap gap-5">
        <div
          v-for="(element, value) in discription"
          :key="value"
          :id="value + 1"
          class="font-weight-regular text-h6"
        >
        <div v-if="ingredients?.some(el => el.text == element)" @mouseenter="tooltip(element)" class="font-italic text-decoration-underline">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div class="d-flex">
                <CustomIcon :name="sideIcon(element)"/>
                <span v-bind="attrs" v-on="on">
                  {{ element }}
                </span>
              </div>
              </template>
              <span class="text-white d-flex">
                <CustomIcon :name="tooltipData.choosenName" />
                <span class="d-flex flex-column">
                  {{ tooltipData.choosenName }}
                  <span>
                    {{ tooltipData.quantity }} {{ tooltipData.unit }} 
                    {{ tooltipData.notes }}
                  </span>
                 </span>
              </span>
            </v-tooltip>
          </div>
          <div v-else>
            {{ element }}
          </div>
        </div>
      </div>
    </div>

  </template>
  <script>
  import IngredientCard from "./IngredientCard.vue";
  import CustomIcon from "../CustomIcon.vue";
  export default {
    components: { CustomIcon,IngredientCard },
    data() {
      return {
        show: true,
        icon: "",
        discription: [],
        tooltipData : {
          choosenName: '',
          quantity: '',
          unit: "",
          notes: ''
        },
      };
    },
    props: {
      recipeSteps: {
        type: Object,
        required: true,
      },
      ingredients: {
        type: Array,
        required: false,
      },
      index: {
        type: Number,
        required: false,
      },
      ingredientSection : {
        type : Array,
        required : true,
      }
    },
    computed: {
      highlightedIngredients() {
        return this.ingredients?.map((item) => item.text);
      },
    },
    mounted() {

        let pattern = new RegExp(
          `(?:${this.highlightedIngredients?.join("|")})|\\S+`,
          "g"
        );
        this.discription = this.recipeSteps.additionalText.match(pattern);
    },
    methods : {
      tooltip(element){
      const item = this.ingredients?.find((el)=>el.text === element)
      const id = item.id;
      let data = {}  
      this.ingredientSection?.map((ing)=>{
          if(ing.ingredients){
            ing.ingredients?.map((ings)=>{
              if(ings.ingredient.objectID === id) data = ings;
            })
          }
        })
        this.tooltipData.choosenName = data.choosenName;
        this.tooltipData.quantity = item.quantity ? item.quantity : data.quantity;
        this.tooltipData.unit = item.unit ? item.unit : data.unit;
        this.tooltipData.notes = data.notes;
      },
      sideIcon (element) {
        const item = this.ingredients?.find((el)=>el.text === element)
        const id = item.id;
        let name = ''  
        this.ingredientSection?.map((ing)=>{
            if(ing.ingredients){
              ing.ingredients?.map((ings)=>{
                if(ings.ingredient.objectID === id) name = ings.choosenName;
              })
            }
          })
          return name;
      }
    }
  };
  </script>
  <style scoped>
  .gap-5{
    gap: 5px;
  }
  </style>
  