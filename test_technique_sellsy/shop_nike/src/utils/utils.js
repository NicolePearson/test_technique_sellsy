/**
 * Fonction qui permet de vérifier si un produit est valide.
 * Un produit est valide si au moins une de ses propriétés n'est pas vide.
 * @param product
 * @returns {boolean}
 */
export const isProductValid = (product) => {
    return Object.values(product).some(value => value !== "");
}
