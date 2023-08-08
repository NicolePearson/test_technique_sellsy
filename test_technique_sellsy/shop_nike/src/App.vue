<template>
  <v-container>
    <v-row>
      <v-col cols="10">
        <!-- Titre dynamique qui change en fonction des filtres appliqués -->
        <PageTitle :checkedGenders="selectedGenders" :checkedSports="selectedSports" :checkedColors="selectedColors"
                   :checkedPriceRanges="selectedPriceRanges" :products="filteredProducts"/>
      </v-col>
      <v-col cols="2">
        <!-- Bouton pour ouvrir les filtres en mode mobile et tablette -->
        <div class="d-md-none d-flex justify-end">
          <v-btn @click="toggleFilterPanel" variant="plain" icon class="icon-opacity">
            <v-icon icon="mdi-tune" size="x-large"/>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <!-- Affichage en mode mobile et tablette -->
    <div v-if="xs || sm">
      <transition name="filter-slide">
        <div class="filter-panel" v-show="isFilterPanelVisible">
          <!-- Bouton pour fermer les filtres -->
          <div class="close-button-container">
            <v-btn icon @click="toggleFilterPanel" variant="plain" class="icon-opacity">
              <v-icon icon="mdi-close-circle" size="x-large"/>
            </v-btn>
          </div>
          <GenderFilter
              @update:genders="updateSelectedGenders"
              @update:products="applyFilters"
              :products="filteredProducts"
              ref="genderFilter"
          />
          <PriceFilter
              @update:priceRanges="updateSelectedPriceRanges"
              @update:products="applyFilters"
              :products="filteredProducts"
              ref="priceFilter"
          />
          <ColorFilter
              @update:colors="updateSelectedColors"
              @update:products="applyFilters"
              @set-selected-colors="setSelectedColors"
              :products="filteredProducts"
              ref="colorFilter"
          />
          <SportFilter
              @update:sports="updateSelectedSports"
              @update:products="applyFilters"
              :products="filteredProducts"
              ref="sportFilter"
          />
          <!-- Boutons effacer et appliquer pour le mode mobile/tablette -->
          <div class="mobile-filter-buttons d-flex justify-space-around">
            <!-- Bouton effacer qui affiche le nombre de filtres appliqués -->
            <v-btn @click="clearFilters" variant="outlined" rounded="xl" class="custom-button">
              Effacer{{ totalCheckedFilters > 0 ? ' (' + totalCheckedFilters + ')' : '' }}
            </v-btn>
            <!-- Bouton appliquer qui referme la sélection des filtres et affiche le résultat -->
            <v-btn @click="applyFiltersAndClosePanel" variant="outlined" rounded="xl"
                   class="custom-button black-button">
              Appliquer
            </v-btn>
          </div>
        </div>
      </transition>
      <ProductDisplay :products="filteredProducts"/>
    </div>
    <!-- Affichage en mode grand écran -->
    <v-row v-else>
      <v-col cols="3">
        <GenderFilter @update:genders="updateSelectedGenders" @update:products="applyFilters"
                      :products="filteredProducts" ref="genderFilter"/>
        <PriceFilter @update:priceRanges="updateSelectedPriceRanges" @update:products="applyFilters"
                     :products="filteredProducts" ref="priceFilter"/>
        <ColorFilter @update:colors="updateSelectedColors" @update:products="applyFilters"
                     :products="filteredProducts"
                     ref="colorFilter"/>
        <SportFilter @update:sports="updateSelectedSports" @update:products="applyFilters"
                     :products="filteredProducts"
                     ref="sportFilter"/>
      </v-col>
      <v-col cols="9">
        <ProductDisplay :products="filteredProducts"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Icons Material Design
import '@mdi/font/css/materialdesignicons.css'

// Import du fichier axios_api.js
import {fetchData} from "@/services/api/axios_api"

// Composant Vuetify pour les breakpoints
import {useDisplay} from 'vuetify'

// Import des composants
import ProductDisplay from './components/ProductDisplay.vue'
import GenderFilter from './components/GenderFilter.vue'
import PriceFilter from './components/PriceFilter.vue'
import ColorFilter from "@/components/ColorFilter"
import SportFilter from "@/components/SportFilter"
import PageTitle from "@/components/PageTitle"

export default {
  name: 'App',
  components: {
    ProductDisplay,
    GenderFilter,
    PriceFilter,
    ColorFilter,
    SportFilter,
    PageTitle
  },
  icons: {
    defaultSet: 'mdi'
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
   * Initialisation des variables
   * @returns {{selectedSports: *[], selectedPriceRanges: *[], selectedColors: *[], selectedGenders: *[], filteredProducts: *[], isFilterPanelVisible: boolean}}
   */
  data() {
    return {
      filteredProducts: [],
      selectedGenders: [],
      selectedSports: [],
      selectedColors: [],
      selectedPriceRanges: [],
      isFilterPanelVisible: false,
    };
  },
  methods: {
    updateSelectedGenders(selectedGenders) {
      this.selectedGenders = selectedGenders;
    },
    updateSelectedSports(selectedSports) {
      this.selectedSports = selectedSports;
    },
    updateSelectedColors(selectedColors) {
      this.selectedColors = selectedColors;
    },
    updateSelectedPriceRanges(selectedPriceRanges) {
      this.selectedPriceRanges = selectedPriceRanges;
    },
    /**
     * Méthode qui permet d'appliquer les différents filtres.
     */
    applyFilters() {
      // récupère les produits filtrés par le composant GenderFilter
      const filteredByGender = this.$refs.genderFilter.filterByGender(this.products);
      // récupère les produits filtrés par le composant PriceFilter
      const filteredByPrice = this.$refs.priceFilter.filterByPrice(filteredByGender);
      // récupère les produits filtrés par le composant ColorFilter
      const filteredByColor = this.$refs.colorFilter.filterByColor(filteredByPrice);
      // récupère les produits filtrés par le composant SportFilter
      const filteredBySport = this.$refs.sportFilter.filterBySport(filteredByColor);
      // Affecte les produits filtrés à la variable filteredProducts pour l'affichage des résultats
      this.filteredProducts = filteredBySport;
    },
    /**
     * Méthode qui permet d'afficher ou de cacher le panneau de filtres en mode mobile et tablette
     */
    toggleFilterPanel() {
      this.isFilterPanelVisible = !this.isFilterPanelVisible;
    },
    /**
     * Méthode qui permet de réinitialiser les filtres
     */
    clearFilters() {
      this.filteredProducts = this.products;  // réinitialise les données

      // réinitialise les variables
      this.selectedGenders = [];
      this.selectedSports = [];
      this.selectedColors = [];
      this.selectedPriceRanges = [];

      // réinitialise les filtres dans chaque composant
      this.$refs.genderFilter.resetCheckedGenders();
      this.$refs.priceFilter.resetCheckedPrices();
      this.$refs.colorFilter.resetCheckedColors();
      this.$refs.sportFilter.resetCheckedSports();

    },
    /**
     * Méthode qui permet d'appliquer les filtres et de fermer le panneau de filtres en mode mobile et tablette
     */
    applyFiltersAndClosePanel() {
      this.applyFilters(); // applique les filtres
      this.isFilterPanelVisible = false; // referme l'affichage des filtres
    },
    /**
     * Méthode qui permet de récupérer les couleurs sélectionnées
     * @param newValue
     */
    setSelectedColors (newValue) {
      this.selectedColors = newValue; // affecte les couleurs sélectionnées à la variable selectedColors
    },
  },
  computed: {
    /**
     * Méthode qui retourne le nombre de filtres sélectionnés dans le composant GenderFilter
     * @returns {number}
     */
    totalCheckedGenders() {
      let total = 0;  // initialise la variable total à 0
      // parcours le tableau selectedGenders pour compter le nombre de filtres sélectionnés
      this.selectedGenders.forEach(gender => {
        if(gender.checked === true){  // si le filtre est sélectionné
          total++;  // incrémente la variable total
        }
      })
      return total;
    },
    /**
     * Méthode qui retourne le nombre de filtres sélectionnés dans le composant PriceFilter
     * @returns {number}
     */
    totalCheckedPriceRanges() {
      let total = 0;
      this.selectedPriceRanges.forEach(priceRange => {
        if(priceRange.checked === true){
          total++;
        }
      })
      return total;
    },
    /**
     * Méthode qui retourne le nombre de filtres sélectionnés dans le composant ColorFilter
     * @returns {number}
     */
    totalCheckedColors() {
      let total = 0;
      this.selectedColors.forEach(() => {
        total++;
      })
      return total;
    },
    /**
     * Méthode qui retourne le nombre de filtres sélectionnés dans le composant SportFilter
     * @returns {number}
     */
    totalCheckedSports() {
      let total = 0;
      this.selectedSports.forEach(sport => {
        if(sport.checked === true){
          total++;
        }
      })
      return total;
    },
    /**
     * Méthode qui retourne le nombre total de filtres sélectionnés.
     * Utilisé pour afficher le nombre de filtres sélectionnés dans le bouton "Effacer"
     * @returns {number}
     */
    totalCheckedFilters() {
      return (
          this.totalCheckedGenders +
          this.totalCheckedSports +
          this.totalCheckedColors +
          this.totalCheckedPriceRanges
      );
    },
  },
  /**
   * Méthode qui permet de récupérer les données depuis le fichier JSON
   * @returns {Promise<void>}
   */
  async mounted() {
    try {
      const response = await fetchData();
      this.products = response.data;
      this.filteredProducts = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
}
</script>

<style>

.v-btn.icon-opacity.v-btn--variant-plain {
  opacity: 1;
}

.v-btn.custom-button {
  text-transform: capitalize;
  padding-left: 40px;
  padding-right: 40px;
}

.v-btn.black-button {
  color: #fff;
  background-color: #000;
}

/* Media query pour écran avec largeur inférieur à 960 */
@media (max-width: 959px) {

  .filter-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 1;
    overflow-y: auto;
  }

  .mobile-filter-buttons {
    padding: 10px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .close-button-container {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: flex-end;
    z-index: 2;
    max-height: 0;
  }
}

</style>
