<template>
  <!-- Fond flou + centré -->
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-200/60 px-4 py-8 overflow-auto font-inter">
    <!-- Carte du formulaire -->
    <div class="bg-white rounded-2xl border-2 border-purple-500 shadow-2xl p-8 max-w-2xl w-full">

      <!-- Header -->
      <div class="flex justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Signal Evaluation Details</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
      </div>

      <!-- Form -->
      <form class="space-y-5">
        <!-- Ligne 1 -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="font-medium text-sm text-gray-700">Reported By</label>
            <input :value="signalData.reportedBy" readonly
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100" />
          </div>
          <div>
            <label class="font-medium text-sm text-gray-700">Reporter Role</label>
            <input :value="signalData.reporterRole" readonly
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100" />
          </div>
        </div>

        <!-- Ligne 2 -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="font-medium text-sm text-gray-700">Reported User</label>
            <input :value="signalData.reportedUser" readonly
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100" />
          </div>
          <div>
            <label class="font-medium text-sm text-gray-700">Reported User Role</label>
            <input :value="signalData.reportedUserRole" readonly
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100" />
          </div>
        </div>

        <!-- Ligne 3 -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="font-medium text-sm text-gray-700">Submitted Date</label>
            <input :value="signalData.submittedDate" readonly
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100" />
          </div>
          <div>
            <label class="font-medium text-sm text-gray-700">Type</label>
            <input :value="signalData.type" readonly
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100" />
          </div>
        </div>

        <!-- Reason -->
        <div>
          <label class="font-medium text-sm text-gray-700">Reason</label>
          <input :value="signalData.reason" readonly
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100" />
        </div>

        <!-- Commentaire -->
        <div>
          <label class="font-medium text-sm text-gray-700">Reporter Comment</label>
          <textarea :value="signalData.comment" readonly rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"></textarea>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-between pt-4">
          <button type="button" @click="goToRejection"
            class="w-1/3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Rejected</button>
          <button type="button" @click="goToSolution"
            class="w-1/3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">Approved</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const props = defineProps({ signal: Object })
const emit = defineEmits(['fermer'])
const router = useRouter()

const signalData = ref({})

// Charger les données du backend si besoin (par id)
async function fetchSignal() {
  if (props.signal && props.signal.id) {
    // Si le parent a déjà passé toutes les données, tu peux juste faire :
    // signalData.value = { ...props.signal }
    // Sinon, tu peux charger depuis l'API :
    const res = await api.get(`/signals/${props.signal.id}`)
    signalData.value = res.data
  }
}

// Mettre à jour quand la prop change
watch(() => props.signal, () => {
  if (props.signal) {
    fetchSignal()
  }
}, { immediate: true })

function closeModal() {
  emit('fermer')
}

function goToSolution() {
  emit('fermer')
  router.push({
    name: 'Solution',
    query: { signalId: signalData.value.id }
  })
}

function goToRejection() {
  emit('fermer')
  router.push({
    name: 'Rejection',
    query: { signalId: signalData.value.id }
  })
}
</script>
