<template>
  <nav class="relative overflow-hidden">
    <!-- Animated Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-r from-[#692CF3] to-[#F97316] animate-gradient bg-[length:300%_300%]"></div>
    <!-- Organic Blob Accent -->
    <div class="absolute -top-10 -right-20 w-72 h-72 bg-white/20 rounded-full mix-blend-overlay animate-blob"></div>

    <div class="relative container mx-auto px-4 py-2 flex items-center justify-between z-10">
      <!-- Logo (Left) -->
      <router-link
        to="/"
        class="flex items-center bg-white p-1 rounded-full shadow-md transform transition hover:scale-110"
      >
        <img src="@/assets/logo.png" alt="Logo" class="w-40 h-auto" />
      </router-link>

      <!-- Nav Links (Center) -->
      <ul class="hidden lg:flex mx-auto space-x-6 text-lg font-medium text-white">
        <li v-for="link in links" :key="link.name">
          <router-link
            :to="link.to"
            class="relative group px-3 py-1 transform transition duration-200 hover:scale-110"
          >
            <span class="relative">
              {{ link.name }}
              <!-- Active & Hover indicator -->
              <span
                class="absolute left-1/2 -bottom-1 h-0.5 bg-white transform -translate-x-1/2 transition-all duration-300"
                :class="route.path === link.to ? 'w-8' : 'w-0 group-hover:w-8'"
              ></span>
            </span>
          </router-link>
        </li>
      </ul>

      <!-- Login + Toggle (Right) -->
      <div class="flex items-center space-x-4">
        <router-link
          to="/Login"
          class="py-2 px-6 bg-white text-[#692CF3] text-lg font-semibold rounded-full transform transition hover:scale-110 hover:bg-gray-100"
        >
          Log In
        </router-link>

        <button
          @click="isOpen = !isOpen"
          class="lg:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="fade">
      <div v-if="isOpen" class="lg:hidden bg-white/90 backdrop-blur-md px-4 py-2">
        <ul class="space-y-2">
          <li v-for="link in links" :key="link.name">
            <router-link
              :to="link.to"
              class="block text-gray-800 font-medium transform transition hover:scale-105 hover:bg-gray-100 hover:rounded"
              @click="isOpen = false"
            >
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const isOpen = ref(false)
const route = useRoute()

const links = [
  { name: 'Home', to: '/' },
  { name: 'Professors', to: '/Teachers' },
  { name: 'Students', to: '/Students' },
  { name: 'Our Team', to: '/OurTeam' },
  { name: 'Contact us', to: '/ContactUs' } 
]
</script>

<style scoped>
@keyframes gradientBg {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient { animation: gradientBg 8s ease infinite; }

@keyframes blob {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(-20px, 10px) scale(1.1); }
  66% { transform: translate(20px, -20px) scale(0.9); }
}
.animate-blob { animation: blob 12s infinite ease-in-out; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>