<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 via-pink-500 to-orange-400 px-4 font-inter">
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-10 text-center min-h-[500px] flex flex-col justify-center">
      
      <!-- Titre -->
      <h1 class="text-3xl font-bold text-gray-800 mb-4 ">Forgotten your password?</h1>

      <!-- Sous-titre -->
      <p class="text-gray-600 text-lg mb-6">
        There is nothing to worry about, we'll send you a message to help you reset your password.
      </p>

      <!-- Formulaire -->
      <form @submit.prevent="forgot" class="space-y-6">
        <div class="text-left">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
          <input
            v-model="emailres"
            type="email"
            placeholder="Enter your email address"
            class="w-full px-4 py-3 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          >

          <!-- Message d'erreur -->
          <p v-if="store.errorMsg" class="text-red-600 text-sm mt-2 animate-fade-in">
            {{store.errorMsg}}
          </p>
        </div>

        <!-- Bouton avec animation -->
        <button
          type="submit"
          :disabled="store.load"
          class="w-full py-3 text-lg font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-orange-400 hover:from-purple-700 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="store.load">Sending...</span>
          <span v-else>Send Reset Link</span>
        </button>
      </form>


    </div>
  </div>
</template>
  



<script setup>
import {ref , onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const store = useAuthStore();
const emailres = ref('');
const router = useRouter();

async function forgot() {
    await store.forgotPassword(emailres.value)
    if(store.errorMsg === null){
        router.push('/login');
    }
};

onMounted(() => {
    if(store. isAuthenticated){ //à répeter
        router.push('/');
    }
    store.Clearstatus();
});

</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
</style>
