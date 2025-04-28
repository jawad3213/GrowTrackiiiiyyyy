<template>
    <footer class="bg-gradient-to-r from-[#692CF3] to-[#F97316] text-white py-6 px-4 border-t-4 border-orange-500 shadow-inner">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Logo & Copyright -->
        <div class="flex items-center space-x-4">
          <a href="/" class="bg-white rounded-md p-2 hover:bg-gray-100 transition">
            <img src="@/assets/logo3.jpg" alt="GrowTrack Logo" class="h-10 w-auto" />
          </a>
          <span class="text-sm opacity-90">
            © Copyright {{ year }} GrowTrack
          </span>
        </div>
  
        <!-- Navigation Links with Scale Hover -->
        <nav class="flex flex-wrap justify-center space-x-6 font-medium text-sm">
          <router-link
            to="/AboutUs"
            class="inline-block transform transition-transform duration-200 hover:scale-110"
          >
            About Us
          </router-link>
          <router-link
            to="/ContactUs"
            class="inline-block transform transition-transform duration-200 hover:scale-110"
          >
            Contact Us
          </router-link>
          <router-link
            to="/Teachers"
            class="inline-block transform transition-transform duration-200 hover:scale-110"
          >
            Professors
          </router-link>
          <router-link
            to="/Students"
            class="inline-block transform transition-transform duration-200 hover:scale-110"
          >
            Students
          </router-link>
          <router-link
            to="/"
            class="inline-block transform transition-transform duration-200 hover:scale-110"
          >
            Home
          </router-link>
        </nav>
  
        <!-- Divider & Social Icons -->
        <div class="flex items-center space-x-4">
          <!-- Vertical Dotted Divider -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v.01M12 12v.01M12 18v.01" />
          </svg>
  
          <!-- Social Icons -->
          <a href="https://twitter.com" target="_blank" rel="noopener" class="transform hover:scale-110 transition-transform">
            <img src="@/assets/twitter.png" alt="Twitter" class="h-6 w-6" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener" class="transform hover:scale-110 transition-transform">
            <img src="@/assets/facebook.png" alt="Facebook" class="h-6 w-6" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener" class="transform hover:scale-110 transition-transform">
            <img src="@/assets/instagram.png" alt="Instagram" class="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const year = new Date().getFullYear();
  </script>
  
  <style scoped>
  footer {
    /* Subtle inner shadow for depth */
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.2);
  }
  </style>