import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import {useAuthStore} from '@/stores/auth'

import App from './App.vue'
import router from './routers'

async function start() {
    const app = createApp(App);
    const pinia = createPinia();
    app.component('apexchart', VueApexCharts)

    app.use(pinia);
    app.use(router);

    const auth = useAuthStore();
    await auth.checkAuth();
    console.log(auth.Role)
    console.log(auth.ID)

  
    app.mount('#app');
  }
  
start();