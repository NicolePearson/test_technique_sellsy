<template>
  <h1 class="text-left">{{ pageTitle }}</h1>
</template>

<script>
export default {
  name: "PageTitle",
  /**
   * Props du composant PageTitle
   */
  props: {
    products: {
      type: Array,
    },
    checkedGenders: {
      type: Array,
    },
    checkedSports: {
      type: Array,
    },
    checkedColors: {
      type: Array,
    },
    checkedPriceRanges: {
      type: Array,
    },
  },
  computed: {
    /**
     * retourne le titre de la page en fonction des filtres appliqués
     * @returns {string}
     */
    pageTitle() {
      // Récupère les labels des filtres cochés pour le filtre sexe
      const checkedGendersLabels = this.checkedGenders
          .filter(gender => gender.checked)
          .map(gender => gender.label);

      // Récupère les labels des filtres cochés pour le filtre prix
      const checkedPriceRangesLabels = this.checkedPriceRanges
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.label);

      // Récupère les labels des filtres cochés pour le filtre couleur
      const checkedColorsLabels = this.checkedColors;

      // Récupère les labels des filtres cochés pour le filtre sport
      const checkedSportsLabels = this.checkedSports
          .filter(sport => sport.checked)
          .map(sport => sport.label);

      // Concatène les labels des filtres cochés
      const labels = [...checkedGendersLabels, ...checkedSportsLabels, ...checkedColorsLabels, ...checkedPriceRangesLabels];

      // Récupère le nombre de résultats de la recherche
      const numberOfResults = this.products.length;

      if (labels.length === 0) {  // Si aucun filtre n'est appliqué
        return `Nouveautés (${numberOfResults})`;
      } else {  // Si au moins un filtre est appliqué
        return `Nouveautés ${labels.join(', ')} (${numberOfResults})`;
      }
    },
  },
}
</script>

<style scoped></style>