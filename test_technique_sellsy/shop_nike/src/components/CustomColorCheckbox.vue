<template>
  <!-- Checkbox customisé pour pouvoir avoir une représentation rond avec la couleur correspondante -->
  <div class="color-checkbox">
    <div class="circle" :style="{ backgroundColor: colorHex }" :class="{ checked: isChecked, 'whiteCheckmark': isChecked && colorName === 'Blanc' }" @click="toggleCheckbox">
      <v-icon v-if="isChecked" :class="checkmarkClass">mdi-check</v-icon>
    </div>
    <div class="color-name">{{ colorName }}</div>
  </div>
</template>

<script>
export default {
  name: "CustomColorCheckbox",
  /**
   * Props du composant
   */
  props: {
    colorName: String,
    colorHex: String,
    isChecked: Boolean,
  },
  computed: {
    /**
     * Retourne la classe à appliquer
     * place un icon à l'intérieur du cercle lorsque la checkbox est cochée
     * par défaut l'icon est blanc, sauf pour la couleur blanche où il est noir
     * @returns {{"black-checkmark": boolean, checkmark: boolean}}
     */
    checkmarkClass() {
      return {
        'checkmark': true,
        'black-checkmark': this.isChecked && this.colorName === 'Blanc',
      };
    },
  },
  methods: {
    /**
     * Permet de changer l'état de la checkbox
     */
    toggleCheckbox() {
      this.$emit('update:checked', !this.isChecked);  // On émet un évènement pour mettre à jour la checkbox
    },
  },
}
</script>

<style scoped>
.color-checkbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
}

.circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  border: 1px solid #ccc;
  margin-bottom: 4px;
}

.checkmark {
  color: white;
  font-size: 16px;
}

.black-checkmark {
  color: black;
}

.color-name {
  font-size: 14px;
}
</style>
