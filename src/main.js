import { createApp } from 'vue'
import App from './App.vue'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Styles
import 'primeicons/primeicons.css'
import './assets/style.css'

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})

app.mount('#app')