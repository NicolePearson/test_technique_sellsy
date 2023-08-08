<template>
  <v-container class="py-0">
    <!-- Affichage en mode mobile/tablette -->
    <v-card class="elevation-0" v-if="xs || sm">
      <v-card-title class="pl-0 text-left font-weight-bold">
        {{ cardTitle }}
      </v-card-title>
      <v-card-text>
        <v-container class="py-0">
          <v-row no-gutters>
            <v-col
                v-for="(hex, color) in colors"
                :key="color"
                cols="4"
                class="px-0"
            >
              <CustomColorCheckbox
                  :color-name="color"
                  :color-hex="hex"
                  :is-checked="this.colorsChecked[color]"
                  @update:checked="updateSelectedColors(color)"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-divider class="mt-5"></v-divider>
      </v-card-text>
    </v-card>
    <!-- Affichage en mode grand écran -->
    <v-card class="elevation-0" v-else>
      <v-card-actions class="px-0">
        <v-card-text class="pl-0 text-left font-weight-bold">
          {{ cardTitle }}
        </v-card-text>
        <v-spacer></v-spacer>
        <v-btn
            :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="show = !show"
            max-width="20"
            max-height="20"
            class="px-0"
        ></v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="show">
          <v-container class="py-0">
            <v-row no-gutters>
              <v-col
                  v-for="(hex, color) in colors"
                  :key="color"
                  cols="4"
                  class="px-0"
              >
                <CustomColorCheckbox
                    :color-name="color"
                    :color-hex="hex"
                    :is-checked="selectedColors.includes(color)"
                    @update:checked="updateSelectedColors(color)"
                />
              </v-col>
            </v-row>
          </v-container>
          <v-divider class="mt-5"></v-divider>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
// Import du composant CustomColorCheckbox qui est utilisé dans le template
import CustomColorCheckbox from "@/components/CustomColorCheckbox";

// Import de la fonction useDisplay depuis vuetify pour les breakpoints
import { useDisplay } from 'vuetify'

export default {
  name: "ColorFilter",
  components: {
    CustomColorCheckbox,
  },
  /**
   * Props du composant
   */
  props: {
    products: {
      type: Array,
      required: true
    },
  },
  /**
   * Permet de définir les variables sm et xs qui permettent de gérer l'affichage en mode mobile et tablette
   * @returns {{sm: Ref<boolean>, xs: Ref<boolean>}}
   */
  setup() {
    const {sm, xs} = useDisplay()
    return {sm, xs}
  },
  /**
   * Variables du composant
   * @returns {{show: boolean, selectedColors: *[], colorsChecked: {bleu: boolean, gris: boolean, jaune: boolean, vert: boolean, noir: boolean, rose: boolean, blanc: boolean, rouge: boolean}, colors: {Rouge: string, Gris: string, Jaune: string, Bleu: string, Blanc: string, Vert: string, Rose: string, Noir: string}}}
   */
  data: () => ({
    show: false,
    //Définition des valeurs hexadécimal des couleurs
    colors: {
      Noir: "#000000",
      Rouge: "#e70000",
      Blanc: "#FFFFFF",
      Jaune: "#FFD700",
      Vert: "#01a801",
      Bleu: "#3392ff",
      Rose: "#fa81ff",
      Gris: "#808080",
    },
    selectedColors: [],
    colorsChecked: {
      noir: false,
      rouge: false,
      blanc: false,
      jaune: false,
      vert: false,
      bleu: false,
      rose: false,
      gris: false,
    },
  }),
  computed: {
    /**
     * Permet de compter le nombre de couleurs sélectionnées
     * @returns {number}
     */
    checkedColorsCount() {
      return this.selectedColors.length;
    },
    /**
     * Permet de définir le titre du composant en fonction du nombre de couleurs sélectionnées
     * @returns {string}
     */
    cardTitle() {
      if (this.checkedColorsCount === 0) {  // Si aucune couleur n'est sélectionnée on affiche "Couleur"
        return "Couleur";
      } else {  // Sinon on affiche "Couleur (nombre de couleurs sélectionnées)"
        return `Couleur (${this.checkedColorsCount})`;
      }
    },
  },
  methods: {
    /**
     * Permet de filtrer les produits en fonction des couleurs sélectionnées
     * @param products
     * @returns {*}
     */
    filterByColor(products) {
      // Si aucune couleur n'est sélectionnée on retourne tous les produits
      if (this.checkedColorsCount === 0) {
        return products;
      }
      // Sinon on retourne les produits dont la couleur est présente dans le tableau selectedColors
      return products.filter(product => {
        const productColors = product.couleur.split(',').map(color => color.trim().toLowerCase());
        const selectedColorsLower = this.selectedColors.map(color => color.toLowerCase());
        return productColors.some(color => selectedColorsLower.includes(color));
      });
    },
    /**
     * Permet de mettre à jour les couleurs sélectionnées
     * @param color
     */
    updateSelectedColors(color) {
      // Si la couleur est déjà sélectionnée on la retire du tableau selectedColors et on met à jour la variable colorsChecked
      if (this.selectedColors.includes(color)) {
        this.selectedColors = this.selectedColors.filter(c => c !== color);
        this.colorsChecked[color] = false;

      } else {  // Sinon on l'ajoute au tableau selectedColors et on met à jour la variable colorsChecked
        this.selectedColors.push(color);
        this.colorsChecked[color] = true;
      }

      this.$emit('setSelectedColors', this.selectedColors); // On émet un évènement pour mettre à jour la variable selectedColors dans le composant parent
      this.$emit('update:colors', this.selectedColors); // On émet un évènement pour mettre à jour la variable colors dans le composant parent
      this.$emit('update:products', this.filterByColor(this.products)); // On émet un évènement pour mettre à jour la variable products dans le composant parent
    },
    /**
     * Permet de réinitialiser les couleurs sélectionnées
     */
    resetCheckedColors() {
      // On met à jour la variable colorsChecked pour toutes les couleurs
      this.selectedColors.forEach(color => {
        this.colorsChecked[color] = false
      });
      this.selectedColors = []; // On vide le tableau selectedColors
      this.$emit('setSelectedColors', this.selectedColors); // On émet un évènement pour mettre à jour la variable selectedColors dans le composant parent
    },
  },
}
</script>

<style scoped></style>