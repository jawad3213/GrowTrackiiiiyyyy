import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './routers'

const app = createApp(App)

app.component('apexchart', VueApexCharts)

app.use(createPinia())
app.use(router)

app.mount('#app')
