//Vue.js 3
import { createApp } from 'vue'
import App from './App.vue'

// Vuetify 3
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

//Axios
import axios from 'axios'
import VueAxios from 'vue-axios'

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)
app.use(vuetify, VueAxios, axios)
app.mount('#app')
