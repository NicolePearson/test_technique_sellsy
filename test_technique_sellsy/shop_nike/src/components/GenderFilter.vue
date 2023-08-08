<template>
  <v-container class="py-0">
    <!-- Affichage en mode mobile/tablette -->
    <v-card class="elevation-0" v-if="xs || sm">
      <v-card-title class="pl-0 text-left font-weight-bold">
        {{ cardTitle }}
      </v-card-title>
      <v-card-text>
        <v-checkbox
            v-for="gender in genders"
            :key="gender.label"
            class="label-opacity"
            :label="gender.label"
            hide-details
            density="compact"
            :model-value="gender.checked"
            @change="updateGender(gender);"
        ></v-checkbox>
        <v-divider class="mt-5"></v-divider>
      </v-card-text>
    </v-card>
    <!-- Affichage en mode grand écran -->
    <v-card class="elevation-0" v-else>
      <v-divider class="d-none d-md-block"></v-divider>
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
              v-for="gender in genders"
              :key="gender.label"
              class="label-opacity"
              :label="gender.label"
              hide-details
              density="compact"
              :model-value="gender.checked"
              @change="updateGender(gender);"
          ></v-checkbox>
          <v-divider class="mt-5"></v-divider>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
// Import de la fonction fetchUniqueSexes depuis le fichier axios_api.js
import {fetchUniqueSexes} from "@/services/api/axios_api";

// Import de la fonction useDisplay depuis vuetify pour les breakpoints
import { useDisplay } from 'vuetify'

export default {
  name: "GenderFilter",
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
   * @returns {{show: boolean, genders: *[]}}
   */
  data : () => ({
    show: false,
    genders: [],
  }),
  methods: {
    /**
     * Méthode qui permet de filtrer les produits en fonction du sexe
     * @param products
     * @returns {*}
     */
    filterByGender(products) {
      // Si aucun sexe n'est sélectionné, on retourne tous les produits
      if (this.checkedGendersCount === 0) {
        return products;
      }

      // Récupère les labels sexes sélectionnés (en minuscule pour éviter les problèmes de casses)
      const selectedGenderLabels = this.genders
          .filter(gender => gender.checked)
          .map(gender => gender.label.toLowerCase());

      // retourne les produits filtrés selon le filtre sexe sélectionné
      return products.filter(product => {
        return selectedGenderLabels.includes(product.sexe.toLowerCase());
      });
    },
    /**
     * Permet de changer l'état de la checkbox et d'envoyer les données au composant parent
     * @param gender
     */
    updateGender(gender) {
      gender.checked = !gender.checked; // Change l'état de la checkbox
      this.$emit('update:genders', this.genders); // Envoie les données au composant parent
      this.$emit('update:products', this.filterByGender(this.products));  // Envoie les données au composant parent
    },
    /**
     * Permet de réinitialiser les checkbox de sexe
     */
    resetCheckedGenders() {
      // Pour chaque sexe, on décoche la checkbox
      this.genders.forEach(gender => {
        gender.checked = false;
      });
    }
  },
  computed: {
    /**
     * Permet de compter le nombre de checkbox de sexe coché
     * Ce nombre est utilisé pour afficher le nombre de checkbox coché dans le titre du composant
     * @returns {number}
     */
    checkedGendersCount() {
      // Retourne le nombre de checkbox de sexe coché
      return this.genders.filter(gender => gender.checked).length;
    },
    /**
     * Méthode qui gère le titre du composant
     * @returns {string}
     */
    cardTitle() {
      if (this.checkedGendersCount === 0) { // Si aucun sexe n'est sélectionné, on affiche "Sexe"
        return "Sexe";
      } else {  // Sinon on affiche "Sexe (nombre de sexes sélectionnés)"
        return `Sexe (${this.checkedGendersCount})`;
      }
    },
  },
  /**
   * Récupère les données JSON
   * @returns {Promise<void>}
   */
  async mounted() {
    try {
      const response = await fetchUniqueSexes();
      this.genders = response.uniqueSexes.map(gender => ({
        label: gender,
        checked: false,
      }));
    } catch (error) {
      console.error('Error fetching unique sexes:', error);
    }
  },
}
</script>

<style scoped>

.label-opacity :deep(.v-label ){
  opacity: 1;
}

</style>