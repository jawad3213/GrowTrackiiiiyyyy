<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Form Section -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-8 space-y-6 animate-fade-in">
      <!-- Logo -->
      <div class="flex justify-center mb-4 transform hover:scale-105 transition">
        <img src="@/assets/logo.png" alt="Logo" class="w-80 h-auto" />
      </div>

      <!-- Title -->
      <h2 class="text-3xl font-extrabold text-gray-800 drop-shadow-md">
        Log In
      </h2>

      <!-- Form -->
      <form class="w-full max-w-md space-y-4" @submit.prevent="handlelogin">
        <!-- Email Input -->
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-transform duration-200 hover:scale-[1.01]"
          />
        </div>

        <!-- Password Input -->
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            class="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-transform duration-200 hover:scale-[1.01]"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c2.063 0 3.97.786 5.452 2.048M16.24 16.24C14.758 17.514 12.85 18.3 10.787 18.3 6.31 18.3 2.519 15.357 1.245 11.3a9.963 9.963 0 012.258-3.45" />
            </svg>
          </button>
        </div>

        <!-- Remember & Forgot -->
        <div class="flex justify-between items-center text-sm">
          <label class="flex items-center space-x-2">
            <input v-model="RememberMe" type="checkbox" class="form-checkbox text-indigo-600" />
            <span class="text-gray-600">Remember me</span>
          </label>
          <router-link to="/forgotpass" class="text-indigo-600 hover:underline">
            Forgot Password?
          </router-link>
        </div>

        <!-- Error Message -->
        <transition name="fade">
          <div v-if="store.errorMsg" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            {{ store.errorMsg }}
          </div>
        </transition>

        <!-- Submit Button with Dynamic Loader -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-orange-400 text-white font-semibold text-sm hover:from-purple-700 hover:to-orange-500 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
        >
          <svg v-if="isSubmitting" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
            <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>{{ isSubmitting ? 'loging In...' : 'Log In' }}</span>
        </button>
      </form>
    </div>

    <!-- Illustration Section -->
    <div class="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-tr from-purple-50 to-orange-50 animate-slide-in-right">
      <img src="@/assets/Sign in-amico.svg" alt="Login Illustration" class="max-w-lg" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const store = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isSubmitting = ref(false);
const RememberMe = ref(false);


const togglePassword = () => (showPassword.value = !showPassword.value);

const handlelogin = async () => {
  isSubmitting.value = true;
  try {
    await store.Login(email.value, password.value, RememberMe.value);
    if (!store.errorMsg) {
      switch (store.Role) {
      case 'admin': router.push('/dashboard'); break;
      case 'student' : router.push('/dashstud'); break;
      case 'supervisor': router.push('/dashSupervisor'); break;
      case 'Professor' : router.push('/DashboardProf'); break;
      default:
        router.push('/login')
    }
    }
  } catch (err) {
    console.error('Login error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  if (store.isAuthenticated){
    switch (store.Role) {
      case 'admin': router.push('/dashboard'); break;
      case 'student' : router.push('/dashstud'); break;
      case 'supervisor': router.push('/dashSupervisor'); break;
      case 'Professor' : router.push('/DashboardProf'); break;
      default:
        router.push('/Login')
    }
}else{
  store.checkAuth();
}
  store.Clearstatus();
});
</script>

<style scoped>
@keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
.animate-slide-in-right { animation: slideInRight 0.8s ease-out both; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.8s ease-out both; }
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>