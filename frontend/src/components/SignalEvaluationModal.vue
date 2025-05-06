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
      <form @submit.prevent="submitForm" class="space-y-5">

        <!-- Ligne 1 -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="font-medium text-sm text-gray-700">Reported By</label>
            <input v-model="form.reportedBy" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label class="font-medium text-sm text-gray-700">Reporter Role</label>
            <input v-model="form.reporterRole" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>

        <!-- Ligne 2 -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="font-medium text-sm text-gray-700">Reported User</label>
            <input v-model="form.reportedUser" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label class="font-medium text-sm text-gray-700">Reported User Role</label>
            <input v-model="form.reportedUserRole" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>

        <!-- Ligne 3 -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="font-medium text-sm text-gray-700">Submitted Date</label>
            <input v-model="form.submittedDate" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label class="font-medium text-sm text-gray-700">Type</label>
            <input v-model="form.type" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>

        <!-- Reason -->
        <div>
          <label class="font-medium text-sm text-gray-700">Reason *</label>
          <input v-model="form.reason" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
        </div>

        <!-- Commentaire -->
        <div>
          <label class="font-medium text-sm text-gray-700">Reporter Comment</label>
          <textarea v-model="form.comment" rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"></textarea>
        </div>

        <!-- Alertes -->
        <p v-if="formStore.error" class="text-red-500 text-sm animate-pulse">{{ formStore.error }}</p>
        <p v-if="formStore.success" class="text-green-500 text-sm animate-pulse">{{ formStore.success }}</p>

        <!-- Boutons d'action -->
        <div class="flex justify-between pt-4">
          <button type="button" @click="submitForm('rejected')"
            class="w-1/3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Rejected</button>
          <button type="button" @click="submitForm('approved')"
            class="w-1/3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">Approved</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useFormStore } from '@/stores/form'
import { useRouter } from 'vue-router' //  pour redirection

const props = defineProps({ signal: Object }) //definir une propriéte qui va recevoir des data depuis le composant parent signals
// dans le composant parent on  a l'objet signal qui va etre envoyer au fils 
const emit = defineEmits(['fermer']) 
const formStore = useFormStore()
const router = useRouter() //  pour naviguer

const form = ref({})
const errors = ref({})

//watch: dès que on reçois un nouveau signal ta copie (form.value) soit automatiquement mise à jour.
watch(() => props.signal, (newSignal) => {
  // Vue interdit de modifier une prop directement.
  form.value = { ...newSignal } // Copier les données du signal reçu dans form
  // on  peux maintenant faire : <input v-model="form.reportedBy" /> : on modifie la copie
}, { immediate: true })

function closeModal() {
  emit('fermer') //lorsque on a l'evt closeModal on envoi un evenement au parent pour fermer 
}

async function submitForm(decision) {
  const { valid, errors: formErrors } = formStore.validateForm(form.value, [
    'reportedBy', 'reporterRole', 'submittedDate', 'reportedUser', 'reason'
  ])
  if (!valid) {
    errors.value = formErrors
    return
  }

  form.value.status = decision //pou la stocker dans database

  await formStore.submitForm('/signal-evaluation', form.value, () => {
    if (decision === 'approved') {
      // Aller vers Solution.vue avec signalId dans l'URL pour savoir de quel signal s'agit la solution 
      router.push({
        name: 'Solution', 
        query: { signalId: form.value.id }//envoyer l'id du siganl
      })
    } else {
      closeModal()
    }
  })
}
</script>
