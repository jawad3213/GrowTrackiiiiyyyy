<template>
  <div class="min-h-screen bg-gray-50 font-inter flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Main Container -->
    <div class="flex-1 max-w-6xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <!-- Animated Illustration Card -->
        <div class="hidden lg:block animate-slide-in-left">
          <div class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
            <img src="@/assets/Contact us-amico.svg" alt="Contact illustration" class="w-full h-auto" />
          </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white p-10 rounded-3xl shadow-2xl animate-fade-in-up">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Get in Touch</h2>
          <p class="text-gray-600 mb-8">Our friendly team would love to hear from you. Fill out the form and we’ll be in touch!</p>

          <!-- Feedback Messages -->
          <transition name="fade">
            <p v-if="store.successmsg" class="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-800 italic rounded-lg">
              {{ store.successmsg }}
            </p>
          </transition>
          <transition name="fade">
            <p v-if="store.errormsg" class="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-800 italic rounded-lg">
              {{ store.errormsg }}
            </p>
          </transition>

          <form @submit.prevent="contactUs" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="relative">
                <input
                  v-model="info.FirstN"
                  type="text"
                  required
                  class="peer w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  placeholder="First Name"
                />
                <span class="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500 peer-focus:text-purple-600 transition-all">First Name</span>
              </div>
              <div class="relative">
                <input
                  v-model="info.LastN"
                  type="text"
                  required
                  class="peer w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  placeholder="Last Name"
                />
                <span class="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500 peer-focus:text-purple-600 transition-all">Last Name</span>
              </div>
            </div>

            <div class="relative">
              <input
                v-model="info.email"
                type="email"
                required
                class="peer w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                placeholder="Email Address"
              />
              <span class="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500 peer-focus:text-purple-600 transition-all">Email Address</span>
            </div>

            <div class="relative">
              <input
                v-model="info.phone"
                type="tel"
                required
                class="peer w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                placeholder="Phone Number"
              />
              <span class="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500 peer-focus:text-purple-600 transition-all">Phone Number</span>
            </div>

            <div class="relative">
              <textarea
                v-model="info.msg"
                rows="4"
                required
                class="peer w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none"
                placeholder="Your Message"
              ></textarea>
              <span class="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500 peer-focus:text-purple-600 transition-all">Your Message</span>
            </div>

            <label class="flex items-center space-x-2 text-sm">
              <input
                v-model="info.agree"
                type="checkbox"
                required
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span class="text-gray-700 hover:text-purple-600 transition-colors">I agree to the privacy policy</span>
            </label>

            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-purple-600 to-orange-400 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
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


<style scoped>
@keyframes slideInLeft {
  0% { opacity: 0; transform: translateX(-50px); }
  100% { opacity: 1; transform: translateX(0); }
}
.animate-slide-in-left { animation: slideInLeft 0.8s ease-out both; }

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out both; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>