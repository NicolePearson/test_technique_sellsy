<template>
  <v-container class="py-0">
    <!-- Affichage en mode mobile/tablette -->
    <v-card class="elevation-0" v-if="xs || sm">
      <v-card-title class="pl-0 text-left font-weight-bold">
        {{ cardTitle }}
      </v-card-title>
      <v-card-text>
        <v-checkbox
            class="label-opacity"
            v-for="(checkbox, index) in checkboxes"
            :key="index"
            :label="checkbox.label"
            v-model="checkbox.checked"
            :model-value="checkbox.checked"
            hide-details
            density="compact"
            @change="updatePriceRange(index)"
        ></v-checkbox>
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
          <v-checkbox
              class="label-opacity"
              v-for="(checkbox, index) in checkboxes"
              :key="index"
              :label="checkbox.label"
              v-model="checkbox.checked"
              :model-value="checkbox.checked"
              hide-details
              density="compact"
              @change="updatePriceRange(index)"
          ></v-checkbox>
          <v-divider class="mt-5"></v-divider>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
// Import de la fonction useDisplay depuis vuetify pour les breakpoints
import { useDisplay } from 'vuetify'

export default {
  name: "PriceFilter",
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
   * Définition des variables du composant
   * @returns {{checkboxes: [{minPrice: number, checked: boolean, label: string, maxPrice: number},{minPrice: number, checked: boolean, label: string, maxPrice: number},{minPrice: number, checked: boolean, label: string, maxPrice: number},{minPrice: number, checked: boolean, label: string, maxPrice: number}], show: boolean}}
   */
  data: () => ({
    show: false,
    // Liste des checkboxes avec leur label, leur prix minimum et maximum et leur état (non cochée par défaut)
    checkboxes: [
      {label: "Moins de €50", minPrice: 0, maxPrice: 50, checked: false},
      {label: "€50 - €100", minPrice: 50, maxPrice: 100, checked: false},
      {label: "€100 - €150", minPrice: 100, maxPrice: 150, checked: false},
      {label: "Plus de €150", minPrice: 150, maxPrice: Infinity, checked: false},
    ],
  }),
  methods: {
    /**
     * Permet de filtrer les produits en fonction des tranches de prix sélectionnées
     * @param filteredProducts
     * @returns {*}
     */
    filterByPrice(filteredProducts) {

      // Récupère les tranches de prix sélectionnées
      const selectedPriceRanges = this.checkboxes.filter(cb => cb.checked);
      // Si aucune tranche de prix n'est sélectionnée, on retourne tous les produits
      if (selectedPriceRanges.length === 0) {
        return filteredProducts;
      }

      // Filtre les produits en fonction des tranches de prix sélectionnées
      return filteredProducts.filter(product => {
        const productPrice = parseFloat(product.prix.replace(",", ".").replace(" €", ""));  // On remplace la virgule par un point et on retire le symbole € pour le convertir en nombre décimal
        return selectedPriceRanges.some(range => {
          return productPrice >= range.minPrice && productPrice <= range.maxPrice;  // On vérifie que le prix du produit est compris dans la tranche de prix des filtres sélectionnés
        });
      });
    },
    /**
     * Permet de mettre à jour les tranches de prix sélectionnées
     */
    updatePriceRange() {
      this.$emit('update:priceRanges', this.checkboxes);  // On émet un événement pour mettre à jour les tranches de prix sélectionnées dans le composant parent
      this.$emit('update:products', this.filterByPrice(this.products)); // On émet un événement pour mettre à jour les produits affichés dans le composant parent
    },
    /**
     * Permet de réinitialiser les tranches de prix sélectionnées en décochant toutes les checkboxes
     */
    resetCheckedPrices() {
      this.checkboxes.forEach(cb => {
        cb.checked = false
      });
    },
  },
  computed: {
    /**
     * Permet de définir le titre du composant en fonction du nombre de filtres de prix sélectionné
     * @returns {string}
     */
    cardTitle() {
      const checkedCount = this.checkboxes.filter(cb => cb.checked).length; // On compte le nombre checkboxes cochées
      if (checkedCount === 0) { // Si aucune checkbox n'est cochée, on affiche "Rechercher par prix"
        return "Rechercher par prix";
      } else {  // Sinon on affiche "Rechercher par prix (nombre de filtres cochés)"
        return `Rechercher par prix (${checkedCount})`;
      }
    },
  },
}
</script>

<style scoped>

.label-opacity :deep(.v-label ) {
  opacity: 1;
}

</style>