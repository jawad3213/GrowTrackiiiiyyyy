<template>
  <div class="min-h-screen flex">
    <!-- Form Section -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-8">
      
      <div v-if="store.load" class="text-gray-500 text-center mt-2 text-sm">
            Loading...
      </div>

      <!-- Logo -->
      <div class="flex justify-center mb-8 ">
        <img src="@/assets/logo.png" alt="Logo"  />
      </div>

      

      <!-- Title -->
      <h2 class="text-3xl font-bold mb-8 text-gray-800">Log In</h2>

      

      <!-- Form -->
      <form class="w-full max-w-sm" @submit.prevent="handlelogin">
        
        <!-- Email -->
        <div class="mb-4">
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        <!-- Password -->
        <div class="mb-4 relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            class="w-full px-4 py-3 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button type="button" @click="togglePassword" class="absolute inset-y-0 right-3 flex items-center text-gray-500">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c2.063 0 3.97.786 5.452 2.048M16.24 16.24C14.758 17.514 12.85 18.3 10.787 18.3 6.31 18.3 2.519 15.357 1.245 11.3a9.963 9.963 0 012.258-3.45" />
            </svg>
          </button>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex justify-between items-center mb-6 text-sm">
          <label class="flex items-center space-x-2">
            <input type="checkbox" class="form-checkbox text-purple-600" />
            <span class="text-gray-600">Remember me</span>
          </label>
          <router-link to="/forgotpass" class="text-orange-500 hover:underline">
            Forgot Password?
          </router-link>
        </div>
          
        <div class="px-2 mt-4">

        <div v-if="!!store.errorMsg" class="bg-red-200 px-6 py-4  my-4 rounded-md text-lg flex items-center mx-auto max-w-lg">
                      <svg viewBox="0 0 24 24" class="text-red-600 w-5 h-5 mr-3">
                        <path fill="currentColor"
                          d="M11.983,0a12.206,...Z"></path>
                      </svg>
                      <span class="text-red-800"> {{store.errorMsg}} </span>
                    </div>
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 to-orange-400 text-white font-semibold hover:from-purple-700 hover:to-orange-500 transition-all"
        >
          Sign In
        </button>
      </form>
    </div>

    <!-- Illustration Section -->
    <div class="hidden lg:flex w-1/2 items-center justify-center bg-gray-50">
      <img src="@/assets/Sign in-amico.svg" alt="Login Illustration" class="max-w-xl" />
    </div>
  </div>
</template>

<script setup>
import { ref , onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const store = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handlelogin = async () => {
  try {
    await store.Login(email.value, password.value)
    if (!store.errorMsg) {
      router.push('/dashboard')
    }
  } catch (err) {
    console.error('Erreur lors de la connexion :', err)
  }
}

onMounted(() => {
    if(store.isAuthenticated){ //à répeter
        router.push('/dashboard');
    }
    store.Clearstatus();
});


</script>
