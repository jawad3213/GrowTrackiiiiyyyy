<!-- src/views/SignalModal.vue -->
<template>
  <!-- Fond flou + carte centrée -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-200/60 px-4 py-8 overflow-auto font-inter"
  >
    <div class="bg-white rounded-2xl border-2 border-purple-500 shadow-2xl p-8 max-w-2xl w-full">
      <!-- Loader affiché tant que isLoading est à true -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <!-- Cercle en rotation Tailwind -->
        <div
          class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"
          aria-label="Loading signals..."
        ></div>
        <span class="mt-4 text-gray-700 text-sm">Chargement...</span>
      </div>

      <!-- Contenu réel du formulaire une fois les données chargées -->
      <div v-else>
        <!-- Header -->
        <div class="flex justify-between mb-6">
          <!-- On affiche l’ID venant de l’URL (route.params.id) -->
          <h2 class="text-xl font-bold text-gray-900">
            Signal #{{ route.params.id }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">
            &times;
          </button>
        </div>

        <!-- Contenu du formulaire (lecture seule) -->
        <form class="space-y-5">
          <!-- Ligne 1 : Reported By + Reporter Role -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="font-medium text-sm text-gray-700">Reported By</label>
              <input
                :value="signalData.reported_by || ''"
                readonly
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
              />
            </div>
            <div>
              <label class="font-medium text-sm text-gray-700">Reporter Role</label>
              <input
                :value="signalData.reporter_role || ''"
                readonly
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
              />
            </div>
          </div>

          <!-- Ligne 2 : Reported User + Reported User Role -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="font-medium text-sm text-gray-700">Reported User</label>
              <input
                :value="signalData.reported_user || ''"
                readonly
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
              />
            </div>
            <div>
              <label class="font-medium text-sm text-gray-700">Reported User Role</label>
              <input
                :value="signalData.reported_role || ''"
                readonly
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
              />
            </div>
          </div>

          <!-- Ligne 3 : Submitted Date + Type (fixe) -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="font-medium text-sm text-gray-700">Submitted Date</label>
              <input
                :value="formatDate(signalData.submitted_date) || ''"
                readonly
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
              />
            </div>
            
          </div>

          <!-- Reason -->
          <div>
             <textarea
       readonly
         rows="4"
         cols="50"
         class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 resize-none"
       >{{ signalData.reason === null ? 'Null' : signalData.reason }}</textarea>
          </div>

          <!-- Boutons d’action -->
          <div class="flex justify-between pt-4">
            <button
              type="button"
              @click="goToRejection"
              class="w-1/3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Rejected
            </button>
            <button
              type="button"
              @click="goToSolution"
              class="w-1/3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Approved
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

// 1. On récupère la route active pour en extraire l’ID
const route = useRoute()
const router = useRouter()

// 2. signalData contiendra les données de l’API
const signalData = ref({})

// 3. isLoading = true tant que le fetch n’est pas terminé
const isLoading = ref(true)

/**
 * Helper pour formater la date en un format lisible (facultatif)
 */
function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

/**
 * 4. fetchSignal() : appelle l’API pour récupérer le signal par ID
 */
async function fetchSignal() {
  try {
    const id = route.params.id
    const res = await api.get(`/admin/signals/review/${id}`)
    signalData.value = res.data.data
  } catch (err) {
    console.error('Erreur fetchSignal :', err)
  } finally {
    // on arrête le loader même en cas d’erreur
    isLoading.value = false
  }
}

// 5. On déclenche fetchSignal() dès que le composant est monté
onMounted(fetchSignal)

/**
 * 6. Fermer la modal → revenir à la liste (/signals)
 */
function closeModal() {
  router.back()
}

/**
 * 7. Redirections vers les pages "Solution" et "Rejection"
 */
function goToSolution() {
  router.push({
    name: 'Solution',
    params: { id: route.params.id }
  })
}

function goToRejection() {
  router.push({
    name: 'Rejection',
    params: { id: route.params.id }
  })
}
</script>

<style scoped>
/* Si vous souhaitez enlever l’arrière-plan flou, retirez `backdrop-blur-sm bg-gray-200/60` */
</style>
