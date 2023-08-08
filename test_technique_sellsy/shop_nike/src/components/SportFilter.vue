<template>
  <v-container class="py-0">
    <!-- Affichage en mode mobile/tablette -->
    <v-card class="elevation-0 mb-5" v-if="xs || sm">
      <v-card-title class="pl-0 text-left font-weight-bold">
        {{ cardTitle }}
      </v-card-title>
      <v-card-text>
        <v-checkbox
            v-for="sport in sports"
            :key="sport.label"
            class="label-opacity"
            :label="sport.label"
            hide-details
            density="compact"
            :model-value="sport.checked"
            @change="updateSport(sport)"
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
              v-for="sport in sports"
              :key="sport.label"
              class="label-opacity"
              :label="sport.label"
              hide-details
              density="compact"
              :model-value="sport.checked"
              @change="updateSport(sport)"
          ></v-checkbox>
          <v-divider class="mt-5"></v-divider>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
//Import de la méthode fetchUniqueSports depuis le fichier axios_api.js
import {fetchUniqueSports} from "@/services/api/axios_api";

// Import de la fonction useDisplay depuis vuetify pour les breakpoints
import { useDisplay } from 'vuetify'

export default {
  name: "SportFilter",
  /**
   * Props du composant
   */
  props: {
    products: {
      type: Array,
      required: true
    }
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
   * @returns {{sports: *[], show: boolean}}
   */
  data: () => ({
    show: false,
    sports: [],
  }),
  methods: {
    /**
     * Méthode qui filtre les produits en fonction des sports sélectionnés
     * @param products
     * @returns {*}
     */
    filterBySport(products) {
      // Si aucun sport n'est sélectionné, on retourne la liste complète des produits
      if (this.checkedSportsCount === 0) {
        return products;
      }

      // Récupère les labels des sports sélectionnés (en minuscule pour éviter les problèmes de casses)
      const selectedSportLabels = this.sports
          .filter(sport => sport.checked)
          .map(sport => sport.label.toLowerCase());

      // Retourne les produits dont le sport est dans la liste des sports sélectionnés
      return products.filter(product => {
        return selectedSportLabels.includes(product.sport.toLowerCase());
      });
    },
    /**
     * Méthode qui met à jour la liste des sports sélectionnés et changer l'état du checkbox
     * @param sport
     */
    updateSport(sport) {
      sport.checked = !sport.checked; // Change l'état du checkbox
      this.$emit('update:sports', this.sports); // Met à jour la liste des sports sélectionnés et l'envoie au composant parent
      this.$emit('update:products', this.filterBySport(this.products)); // Met à jour la liste des produits filtrés et l'envoie au composant parent
    },
    /**
     * Méthode qui permet de décocher tous les checkboxes du filtre sport
     */
    resetCheckedSports() {
      this.sports.forEach(sport => {
        sport.checked = false
      });
    },
  },
  computed: {
    /**
     * Méthode qui permet de compter le nombre de checkboxes/sports sélectionnés
     * @returns {number}
     */
    checkedSportsCount() {
      return this.sports.filter(sport => sport.checked).length;
    },
    /**
     * Méthode qui permet de définir le titre du filtre sport en fonction du nombre de checkboxes/sports sélectionnés
     * @returns {string}
     */
    cardTitle() {
      if (this.checkedSportsCount === 0) {  // Si aucun sport n'est sélectionné, on affiche uniquement "Sport"
        return "Sport";
      } else {  // Sinon on affiche "Sport (nombre de sports sélectionnés)"
        return `Sport (${this.checkedSportsCount})`;
      }
    },
  },
  /**
   * Méthode qui permet de récupérer la liste des sports depuis le fichier JSON
   * @returns {Promise<void>}
   */
  async mounted() {
    try {
      const response = await fetchUniqueSports();
      this.sports = response.uniqueSports.map(sport => ({
        label: sport,
        checked: false,
      }));
    } catch (error) {
      console.error('Error fetching unique sports:', error);
    }
  },
}
</script>

<style scoped>

.label-opacity :deep(.v-label ) {
  opacity: 1;
}

</style>