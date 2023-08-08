<template>
  <v-container class="pt-0">
    <v-row>
      <v-col
          v-for="product in products"
          :key="product.article"
          cols="6"
          sm="6"
          md="4"
      >
        <v-card class="rounded-0 elevation-0">
          <v-img :src="getImageUrl(product.photo)" aspect-ratio="1" cover>
            <!-- Product Image -->
          </v-img>
          <v-card-title class="text-h6 font-weight-bold text-left pl-0 pb-0">
            {{ product.article }}
          </v-card-title>
          <v-card-text class="text-left text-medium-emphasis pl-0 py-0">
            {{ getGender(product.sexe) }}
          </v-card-text>
          <v-card-text class="text-left text-medium-emphasis pl-0 py-0">
            1 Couleur
          </v-card-text>
          <v-card-text class="text-left font-weight-bold pl-0">
            {{ product.prix }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'ProductDisplay',
  /**
   * Props du composant.
   */
  props:{
    products: {
      type: Array,
      required: true,
    },
  },
  /**
   * Méthodes du composant.
   */
  methods: {
    /**
     * Retourne l'URL de l'image.
     * Permet d'afficher l'image du produit dans le template.
     * @param photoFileName
     * @returns {string}
     */
    getImageUrl(photoFileName) {
      return `/images/${photoFileName}`;
    },
    /**
     * Retourne le sexe des chaussures.
     * Affichage du text dans le template variable selon le sexe.
     * @param gender
     * @returns {string}
     */
    getGender(gender) {
      if (gender === 'Femme') {
        return 'Chaussures pour Femme';
      } else if (gender === 'Homme') {
        return 'Chaussures pour Homme';
      } else {
        return 'Chaussures';
      }
    }
  }
};
</script>

<style scoped></style>
