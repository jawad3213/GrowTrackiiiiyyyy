<template>
  <div class="min-h-screen bg-white font-inter">
    <Header />

    <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center font-inter">
      
      <!-- Illustration -->
      <div class="flex-1 bg-purple-100 text-center hidden lg:flex">
  <div class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
    <img src="@\assets\Contact us-amico.svg" alt="login illustration" />
  </div>
</div>

      <!-- Formulaire -->
      <div>
        <h2 class="text-4xl font-bold text-gray-900 mb-2">Get In Touch</h2>
        <p class="text-gray-600 mb-6 text-lg">Our friendly team would love to hear from you.</p>

        <!-- Messages -->
        <p v-if="store.successmsg" class="text-green-600 italic mb-3">{{ store.successmsg }}</p>
        <p v-if="store.errormsg" class="text-red-600 italic mb-3">{{ store.errormsg }}</p>

        <!-- Form -->
        <form @submit.prevent="contactUs" class="space-y-4">
          <!-- Prénom + Nom -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
              <input
              class="w-full px-8 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="text" v-model="info.FirstN" placeholder="First name" required/>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
              <input
              class="w-full px-8 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="text" v-model="info.LastN" placeholder="Last name" required/>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input class="w-full px-8 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="emal" v-model="info.email" placeholder="you@company.com" required /> 
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input class="w-full px-8 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="tel" v-model="info.phone" placeholder="Phone Number" required/> 
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Message</label>
            <textarea  class="w-full px-8 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="text" v-model="info.msg" placeholder="your message here" required ></textarea>
          </div>

          <!-- Politique -->
          <div class="flex items-start text-sm text-gray-700 mt-4">
            <input type="checkbox" id="policy" v-model="info.agree" class="mt-1 mr-2" />
            <label for="policy" class="text-sm text-blue-600 hover:underline cursor-pointer">
              You agree to our friendly privacy policy
            </label>
          </div>

          <!-- Bouton -->
          <button
            type="submit"
            class="w-full py-3 mt-4 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-orange-400 hover:from-purple-700 hover:to-orange-500 transition text-lg">
            Send message
          </button>
        </form>
      </div>
    </div>
  </div>


  <footer class="bg-gradient-to-r from-[#692CF3] to-[#F97316] text-white py-6 px-4">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
    
    <!-- Logo -->
    <div class="flex items-center space-x-2">
      <img src="../assets/logo3.jpg" alt="Logo" class="w-50 h-10 object-contain" />

    </div>

    
    <div class="flex space-x-8 justify-center gap-4 text-lg font-medium">
      <span>© Copyright 2025 GrowTrack</span>
      <router-link to="/AboutUs" class="hover:underline">About Us</router-link>
      <router-link to="/ContactUs" class="hover:underline">Contact Us</router-link>
      <router-link to="/Teachers" class="hover:underline">Teachers</router-link>
      <router-link to="/Students" class="hover:underline">Students</router-link>
      <router-link to="/" class="hover:underline">Home</router-link>
    </div>

    
    <div class="flex space-x-4">
      <a href="https://x.com/i/flow/login"><img src="../assets/twitter.png" alt="Twitter" class="w-6 h-6" /></a>
      <a href="https://fr-fr.facebook.com/login/web/"><img src="../assets/facebook.png" alt="Facebook" class="w-6 h-6" /></a>
      <a href="https://www.instagram.com/?flo=true"><img src="../assets/instagram.png" alt="Instagram" class="w-6 h-6" /></a>
    </div>

  </div>
</footer>

</template>



<script setup>
import Header from './Header.vue'
import { useContactStore } from '@/stores/contact'
import { ref,watch,onMounted } from 'vue'

const store = useContactStore()

const info = ref({
    FirstN: '',
    LastN: '',
    email: '',
    phone: '',
    msg: '',
    agree: false
})

watch(info , (newinfo)=> localStorage.setItem('tempinfo',JSON.stringify(newinfo)), {deep : true})
//utiliser pour permettre le stockege des info méme aprés rechargement , deep car info est un objet
//une fois les données sont dans localstorege on les restaure auto aprés rechargement

onMounted(() => {
    const saved = localStorage.getItem('tempinfo')
    if (saved) {
        info.value = JSON.parse(saved)
    }
})

//remove info from localstorage after sending msg
async function contactUs() {
    await store.sendMsg(info.value)
    if(store.successmsg){
        localStorage.removeItem('tempinfo')
        info.value ={ //nettoyer les inputs
            FirstN: '',
            LastN: '',
            email: '',
            phone: '',
            msg: '',
            agree: false
        }
    }
}
</script>
