// Import de la librairie Axios.
import axios from "axios";

// Import des fonctions utilitaires.
import {isProductValid} from "@/utils/utils";

/**
 * Crée une instance d'Axios avec une configuration de base.
 * @type {axios.AxiosInstance}
 */
const instance = axios.create({
    baseURL: '/data',
    timeout: 10000,
});

/**
 * Récupère les données du fichier JSON et retourne un objet contenant les données, le statut, le message, les headers et la configuration.
 * @returns {Promise<{headers: axios.RawAxiosResponseHeaders | axios.AxiosResponseHeaders, data: *, statusText: string, config: axios.InternalAxiosRequestConfig<any>, status: number}|{filteredData: *[]}>}
 */
export const fetchData = async () => {
    try{
        // Récupère les données du fichier JSON.
        const response = await instance.get('/produits.json');
        // Filtre les produits pour ne garder que ceux qui sont valides.
        const filteredData = response.data.filter(product => isProductValid(product));
        return {
            data: filteredData,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: response.config,
        };
    }catch(error){
        console.error('Error fetching data:', error);
        return { filteredData: [] };
    }

}

/**
 * Récupère les données du fichier JSON et retourne un tableau contenant les sexes (distinct).
 * @returns {Promise<{uniqueSexes: any[]}|{uniqueSexes: *[]}>}
 */
export const fetchUniqueSexes = async () => {
    try {
        const response = await instance.get('/produits.json');
        const products = response.data.filter(product => isProductValid(product));
        const uniqueSexes = Array.from(new Set(products.map(product => product.sexe)));
        return { uniqueSexes };
    } catch (error) {
        console.error('Error fetching unique sexes:', error);
        return { uniqueSexes: [] };
    }
}

/**
 * Récupère les données du fichier JSON et retourne un tableau contenant les sports (distinct).
 * @returns {Promise<{uniqueSports: any[]}|{uniqueSports: *[]}>}
 */
export const fetchUniqueSports = async () => {
    try {
        const response = await instance.get('/produits.json');
        const products = response.data.filter(product => isProductValid(product));
        const uniqueSports = Array.from(new Set(products.map(product => product.sport)));
        return { uniqueSports };
    } catch (error) {
        console.error('Error fetching unique sports:', error);
        return { uniqueSports: [] };
    }
}