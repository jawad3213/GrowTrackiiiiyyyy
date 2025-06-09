<!-- src/views/AddOrEditCoach.vue -->
<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800/70 backdrop-blur-sm flex items-center justify-center z-50 font-inter"
  >
    <!-- Form Container -->
    <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Coach' : 'Add Coach' }}
        </h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">
          &times;
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-5">
        <!-- Full Name + CIN -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Full Name *</label>
            <input
              v-model="coach.full_name"
              type="text"
              placeholder="Full name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="text-red-500 text-sm">{{ formStore.errors.full_name }}</span>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">CIN *</label>
            <input
              v-model="coach.cin"
              type="text"
              :disabled="isEditMode"
              placeholder="e.g. K00000"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="text-red-500 text-sm">{{ formStore.errors.cin }}</span>
          </div>
        </div>

        <!-- Email + Password (only in Create mode) -->
        <div v-if="!isEditMode">
          <div>
            <label class="text-sm font-medium text-gray-700">Email *</label>
            <input
              v-model="coach.email"
              type="email"
              placeholder="example@gmail.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="text-red-500 text-sm">{{ formStore.errors.email }}</span>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Password *</label>
            <input
              v-model="coach.pass"
              type="password"
              placeholder="Enter a secure password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="text-red-500 text-sm">{{ formStore.errors.pass }}</span>
          </div>
          <div class="w-full">
            <button
              type="button"
              @click="generatePassword"
              class="w-full py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-orange-400 hover:from-purple-700 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Password
            </button>
          </div>
        </div>

        <!-- Field -->
        <div>
          <label class="text-sm font-medium text-gray-700">Field *</label>
          <input
            v-model="coach.field"
            type="text"
            placeholder="Field"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span class="text-red-500 text-sm">{{ formStore.errors.field }}</span>
        </div>

        <!-- Admin Notes -->
        <div>
          <label class="text-sm font-medium text-gray-700">Admin Notes</label>
          <textarea
            v-model="coach.note"
            rows="3"
            placeholder="e.g. Joined last month..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
          <span class="text-red-500 text-sm">{{ formStore.errors.note }}</span>
        </div>

        <!-- API Error / Success Messages -->
        <p v-if="formStore.error" class="text-red-500 text-sm animate-pulse">{{ formStore.error }}</p>
        <p v-if="formStore.success" class="text-green-500 text-sm animate-pulse">{{ formStore.success }}</p>

        <!-- Buttons -->
        <div class="flex justify-end gap-4 pt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="formStore.loading"
            class="px-6 py-2 font-semibold text-white rounded-md
                   bg-gradient-to-r from-purple-600 to-purple-500
                   hover:from-purple-700 hover:to-purple-600
                   transition-all duration-300 transform hover:scale-105
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="formStore.loading">Loading...</span>
            <span v-else>{{ isEditMode ? 'Save Changes' : 'Confirm' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFormStore } from '@/stores/form'
import axios from 'axios'
import api from '@/services/api'
import coachSchema from '@/schemas/Coach.schema'

const router = useRouter()
const route = useRoute()
const formStore = useFormStore()

// On détermine le mode : si un param "coachId" est présent, c'est l'édition
const isEditMode = Boolean(route.params.coachId)
const coachId = route.params.coachId || ''

// Etat pour afficher/masquer la modale
const isOpen = ref(true)

// Objet coach et sauvegarde des données initiales pour l’édition partielle
const coach = reactive({
  full_name: '',
  cin: '',
  email: '',
  pass: '',
  field: '',
  note: ''
})
const OriginalData = reactive({})
const UpdatedData = reactive({})

/**
 * Fonction pour générer un mot de passe aléatoire (via une API publique)
 * (uniquement en mode création)
 */
async function generatePassword() {
  try {
    const res = await axios.get('https://api.genratr.com/?length=16&uppercase&lowercase&numbers')
    coach.pass = res.data.password
  } catch (error) {
    console.error('Error generating password:', error)
  }
}

/**
 * Récupère le coach existant si on est en mode édition
 */
const fetchCoach = async () => {
  try {
    const res = await api.get(`/admin/coachs/${coachId}`)
    const data = res.data.data
    // On remplit les champs réactifs
    coach.full_name = data.full_name
    coach.cin       = data.cin
    coach.field     = data.field
    coach.note      = data.note
    // On stocke la version originale dans OriginalData
    OriginalData.full_name = data.full_name
    OriginalData.cin       = data.cin
    OriginalData.field     = data.field
    OriginalData.note      = data.note
  } catch (error) {
    console.error('Erreur lors du chargement du coach :', error)
    // Si l’ID est invalide ou que l’API renvoie 404, on ferme la modale
    closeModal()
  }
}

/**
 * Ferme la modale et redirige vers la liste des coaches
 */
function closeModal() {
  isOpen.value = false
  router.push('/Coach')
}

/**
 * Soumission du formulaire :
 * - Si on crée : on envoie tous les champs obligatoires
 * - Si on édite : on n’envoie que les champs qui ont changé (mise à jour partielle)
 */
async function submitForm() {
  formStore.clearStatus()

  if (!isEditMode) {
    // ===== Mode Création =====
    try {
      // On prépare les données à envoyer
      const sanitizedData = formStore.sanitizeInputs({
        full_name: coach.full_name,
        cin:       coach.cin,
        email:     coach.email,
        pass:      coach.pass,
        field:     coach.field,
        note:      coach.note
      })
      // Valide tout le schéma
      const valid = await formStore.validateWithSchema(sanitizedData, coachSchema)
      if (!valid) return

      // On utilise formStore.submitForm pour bénéficier de la gestion d’état (loading, errors, success)
      await formStore.submitForm('/admin/coachs/create', sanitizedData)
      if (!formStore.errors) {
        formStore.clearStatus()
        router.push('/Coach')
      }
    } catch (error) {
      console.error('Erreur lors de la création du coach :', error)
    }

  } else {
    // ===== Mode Édition =====
    try {
      // On détecte quels champs ont été modifiés par rapport à OriginalData
      for (const key in coach) {
        if (coach[key] !== OriginalData[key]) {
          UpdatedData[key] = coach[key]
        }
      }
      // Si rien n’a changé, on ferme simplement la modale
      if (Object.keys(UpdatedData).length === 0) {
        closeModal()
        return
      }

      // On nettoie les données à envoyer
      const sanitizedPartialData = formStore.sanitizeInputs({ ...UpdatedData })
      // On génère un schéma partiel basé sur les clés modifiées
      const partialSchema = coachSchema.pick(Object.keys(UpdatedData))
      const valid = await formStore.validateWithSchema(sanitizedPartialData, partialSchema)
      if (!valid) return

      // Appel PATCH / PUT vers l’API pour mettre à jour uniquement les champs modifiés
      // Ici on suppose que votre backend accepte PUT /admin/coachs/:id avec body partiel.
      await api.put(`/admin/coachs/${coachId}`, sanitizedPartialData)

      formStore.success = 'Coach mis à jour avec succès.'
      // On laisse un instant pour afficher le message puis on ferme la modale
      setTimeout(() => {
        formStore.clearStatus()
        closeModal()
      }, 800)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du coach :', error)
      formStore.error = error.response?.data?.message || 'Une erreur est survenue pendant la mise à jour.'
    }
  }
}

onMounted(async () => {
  formStore.clearStatus()
  if (isEditMode) {
    await fetchCoach()
  }
})
</script>
