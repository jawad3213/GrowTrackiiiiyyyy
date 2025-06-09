<template>
  <div v-if="showBanner" class="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg border-t border-gray-200 z-50">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
      <div class="flex-1">
        <h2 class="text-lg font-semibold mb-2">We value your privacy</h2>
        <p class="text-gray-600 text-sm">
          We use cookies to enhance your browsing experience and make it as smooth as possible.
          By clicking "Accept", you consent to our use of cookies.
        </p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="rejectCookies"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded transition"
        >
          Reject
        </button>
        <button 
          @click="acceptCookies"
          class="bg-purple-500 orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded border transition"
        >
          Accept
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showBanner = ref(false);


const acceptCookies = () => {
  localStorage.setItem('cookiesAccepted', 'true');
  document.cookie = 'cookiesAccepted=true; path=/; max-age=31536000'; // 1 year expiration
  showBanner.value = false;
};

const rejectCookies = () => {
  localStorage.setItem('cookiesAccepted', 'false');
  showBanner.value = false;
};

onMounted(() => {
  if (localStorage.getItem('cookiesAccepted') === null) {
    showBanner.value = true;
  }
});
</script>

<style scoped>
.cookie-banner {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

button {
  transition: background-color 0.2s ease;
}
</style>