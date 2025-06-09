<template>
  <transition name="fade-scale">
    <div
      v-if="true"
      class="fixed inset-0 flex items-center justify-center overflow-y-auto z-50 font-inter"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-gray-400/40 backdrop-blur-[8px]"
        @click="close"
        aria-hidden="true"
      ></div>

      <!-- Dialog panel -->
      <div
        class="
          relative
          bg-white border-2 rounded-2xl shadow-xl
          w-full max-w-[600px] max-h-[80vh] overflow-y-auto
          p-6 sm:p-8
          border-t-2 border-purple-500
          transform transition-transform duration-300
        "
      >
        <!-- Loader -->
        <div v-if="isLoading" class="flex justify-center items-center h-40">
          <div
            class="w-10 h-10 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"
          ></div>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              View Evaluation Details
            </h2>
            <button
              @click="close"
              class="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-2xl font-bold transition-colors duration-200"
            >
              &times;
            </button>
          </div>

          <!-- Grid Skills -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div
              v-for="(skill, index) in skills"
              :key="index"
              class="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 shadow-sm opacity-0 animate-slide-up-fade"
              :style="{ 'animation-delay': `${index * 80}ms` }"
            >
              <span class="text-lg font-medium text-gray-800 dark:text-gray-200">
                {{ skill.skill_name }}
              </span>
              <span class="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {{ skill.note_skill }}/5
              </span>
            </div>
          </div>

          <!-- Commentaire -->
          <div class="mb-6">
            <label
              class="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Description Given:
            </label>
            <textarea
              v-model="feedbackComment"
              rows="4"
              readonly
              class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Button -->
          <button
            @click="close"
            class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const id_evaluation = route.query.id || route.params.id_evaluation

const skills = ref([])
const feedbackComment = ref('')
const isLoading = ref(true)

const fetchEvaluation = async () => {
  isLoading.value = true
  try {
    const res = await api.get(
      `/api/prof_evaluation_history/view_evaluation/${id_evaluation}`
    )
    skills.value = res.data.result || []
    feedbackComment.value = res.data.comment[0]?.comment_evaluation || ''
  } catch (error) {
    console.error("Erreur lors du chargement de l'évaluation:", error)
    alert('Erreur lors du chargement des données. Veuillez réessayer.')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchEvaluation)

const close = () => {
  router.back()
}
</script>

<style scoped>
@keyframes slide-up-fade {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up-fade {
  animation: slide-up-fade 0.4s ease-out forwards;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>
