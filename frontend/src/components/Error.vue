<!-- src/views/Unauthorized401.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <!-- Card with slide‐down fade‐in, larger max width & padding -->
    <div
      class="bg-white rounded-3xl shadow-2xl p-16 md:flex md:items-center md:space-x-16 animate-slide-down-fade max-w-7xl w-full mx-4"
    >
      <!-- Illustration (scale‐in), expanded to max-w-lg -->
      <div class="md:w-1/2 flex justify-center mb-12 md:mb-0">
        <img
          src="@/assets/401.png"
          alt="Unauthorized Illustration"
          class="w-full max-w-lg animate-scale-in"
        />
      </div>

      <!-- Text content -->
      <div class="md:w-1/2 text-center md:text-left">
        <!-- Oversized “401” with pulse -->
        <h1 class="text-9xl font-extrabold text-red-500 mb-8 animate-pulse">
          401
        </h1>

        <!-- Larger subtitle -->
        <p class="text-4xl text-gray-800 mb-8">
          Unauthorized Access
        </p>

        <!-- Bigger description -->
        <p class="text-xl text-gray-600 mb-10">
          Sorry, you don’t have permission to view this page.
        </p>

        <!-- Extra‐large button to go home -->
        <router-link
          to="/"
          class="inline-block bg-red-500 text-white font-semibold 
                 px-10 py-5 rounded-full text-xl
                 hover:bg-red-600 transition transform hover:-translate-y-1 hover:shadow-2xl"
        >
          Go to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Unauthorized401",
};
</script>
<script setup>
import { useAuthStore } from '@/stores/auth';
import router from '@/routers';
const auth = useAuthStore()
auth.checkAuth();
if(!auth.errorMsg){
  router.push('/login')
}

</script>
<style>
/* ==================================================
   1) Slide‐down fade for the card (same as before)
   ================================================== */
@keyframes slide-down-fade {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-down-fade {
  animation: slide-down-fade 0.6s ease-out forwards;
}

/* ==================================================
   2) Scale‐in for the illustration image (same as before)
   ================================================== */
@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-scale-in {
  animation: scale-in 0.7s ease-out forwards;
}

/* Tailwind’s animate-pulse remains for the “401” */
</style>
