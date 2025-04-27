<script setup>
/* import { onMounted} from 'vue';
import { useAuthStore} from './stores/auth';
const store = useAuthStore();
onMounted(async ()=> {await store.fetchUser()}) //on fait appelle a fetchUser dés que l'application est montée */
</script>

<template>
  <div>
    <router-view/>
  </div>

</template>