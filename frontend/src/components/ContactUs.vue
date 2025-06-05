<template>

    <!-- Header -->
    <Header />

    <!-- Main Container -->
    <div class="flex-1 max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <!-- Animated Illustration Card -->
        <div class="hidden lg:block animate-slide-in-left">
          <div
            class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
          >
            <img
              src="@/assets/Contact us-amico.svg"
              alt="login illustration"
              class="w-full h-auto"
            />
          </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white p-10 rounded-3xl shadow-2xl animate-fade-in-up">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Get In Touch</h2>
          <p class="text-gray-600 mb-8 text-lg">
            Our friendly team would love to hear from you.
          </p>

          <!-- Messages -->
          <transition name="fade">
            <p
              v-if="formStore.error"
              class="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-800 italic rounded-lg"
            >
              {{ formStore.error }}
            </p>
          </transition>
          <transition name="fade">
            <p
              v-if="formStore.success"
              class="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-800 italic rounded-lg"
            >
              {{ formStore.success }}
            </p>
          </transition>

          <!-- Form -->
          <form @submit.prevent="contactUs" class="space-y-6">
            <!-- First Name + Last Name -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="relative">
                <input
                  v-model="contactForm.FirstName"
                  type="text"
                  required
                  placeholder="First Name"
                  class="peer w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
                <span
                  class="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500 peer-focus:text-purple-600 transition-all"
                >
                  First Name
                </span>
                <span class="text-red-500 text-sm">{{ formStore.errors.FirstName }}</span>
              </div>
              <div class="relative">
                <input
                  v-model="contactForm.LastName"
                  type="text"
                  required
                  placeholder="Last Name"
                  class="peer w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
                <span
                  class="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500 peer-focus:text-purple-600 transition-all"
                >
                  Last Name
                </span>
                <span class="text-red-500 text-sm">{{ formStore.errors.LastName }}</span>
              </div>
            </div>

            <!-- Email -->
            <div class="relative">
              <input
                v-model="contactForm.Email"
                type="email"
                required
                placeholder="you@company.com"
                class="peer w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <span
                class="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500 peer-focus:text-purple-600 transition-all"
              >
                Email Address
              </span>
              <span class="text-red-500 text-sm">{{ formStore.errors.Email }}</span>
            </div>

            <!-- Phone Number -->
            <div class="relative">
              <input
                v-model="contactForm.Phone"
                type="tel"
                required
                placeholder="Phone Number"
                class="peer w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <span
                class="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500 peer-focus:text-purple-600 transition-all"
              >
                Phone Number
              </span>
              <span class="text-red-500 text-sm">{{ formStore.errors.Phone }}</span>
            </div>

            <!-- Message -->
            <div class="relative">
              <textarea
                v-model="contactForm.Message"
                rows="4"
                required
                placeholder="Your Message"
                class="peer w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none"
              ></textarea>
              <span
                class="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500 peer-focus:text-purple-600 transition-all"
              >
                Your Message
              </span>
              <span class="text-red-500 text-sm">{{ formStore.errors.Message }}</span>
            </div>

            <!-- Privacy Policy -->
            <label class="flex items-center space-x-2 text-sm">
              <input
                v-model="contactForm.agree"
                type="checkbox"
                required
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span class="text-gray-700 hover:text-purple-600 transition-colors">
                I agree to our friendly privacy policy
              </span>
            </label>

            <!-- Submit Button -->
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
  
</template>

<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
import { ref, watch, onMounted } from 'vue'
import { useFormStore } from '@/stores/form'
import { contactUsSchema } from '@/schemas/contactUs.schema'

const formStore = useFormStore()

const contactForm = ref({
  Email: '',
  FirstName: '',
  LastName: '',
  Phone: '',
  Message: '',
  agree: false
})

watch(
  contactForm,
  (newinfo) => localStorage.setItem('tempinfo', JSON.stringify(newinfo)),
  { deep: true }
)

onMounted(() => {
  const saved = localStorage.getItem('tempinfo')
  if (saved) {
    contactForm.value = JSON.parse(saved)
  }
})

async function contactUs() {
  try {
    const sanitizedData = formStore.sanitizeInputs(contactForm.value)
    const valid = await formStore.validateWithSchema(sanitizedData, contactUsSchema)
    if (valid) {
      await formStore.submitForm('/api/contactus/', sanitizedData)
      if (!formStore.errors) {
        // On success, clear the form and localStorage
        localStorage.removeItem('tempinfo')
        contactForm.value = {
          FirstName: '',
          LastName: '',
          Email: '',
          Phone: '',
          Message: '',
          agree: false
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

formStore.clearStatus()
</script>

<style scoped>
@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-slide-in-left {
  animation: slideInLeft 0.8s ease-out both;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out both;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
