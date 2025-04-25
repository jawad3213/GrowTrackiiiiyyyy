

<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'

/* import { onMounted} from 'vue';
import { useAuthStore} from './stores/auth';
const store = useAuthStore();
onMounted(async ()=> {await store.fetchUser()}) //on fait appelle a fetchUser dés que l'application est montée */
</script>