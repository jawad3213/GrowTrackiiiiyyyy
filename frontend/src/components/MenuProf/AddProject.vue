<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 font-inter">
      <div class="bg-white border-2 rounded-2xl shadow-xl w-full max-w-xl p-6 sm:p-8 border-purple-500">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl mb-2 font-bold text-gray-900">Add Project</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
  
        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
  
          <!-- Name + Sub -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">Name</label>
              <input v-model="form.name" type="text" placeholder="name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label class="font-semibold">How many Sub Group are there</label>
              <input v-model="form.subgroups" type="number" placeholder="Enter the number"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
  
          <!-- Dates -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input v-model="form.start_date" type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            <input v-model="form.end_date" type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>
  
          <!-- Level + Field -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Year of Studies*</label>
            <select v-model="form.level"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option disabled value="">-- Select --</option>
              <option>AP1</option>
              <option>AP2</option>
              <option>CI1</option>
              <option>CI2</option>
              <option>CI3</option>
            </select>
          </div>
          <div>
            <label class="font-semibold">Field*</label>
            <select v-model="form.field" :disabled="availableFields.length === 0"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option disabled value="">-- select field --</option>
              <option v-for="field in availableFields" :key="field">{{ field }}</option>
            </select>
          </div>
        </div>
  
          <!-- Admin Notes -->
          <div>
            <label class="font-semibold">Admin Notes</label>
            <textarea v-model="form.description" rows="4" placeholder="e.g. Notes or description..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
          </div>
  
          <!-- Groups Table -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="font-semibold">Groups</label>
            <div class="flex gap-2">
              <input v-model="newGroupName" placeholder="Group name"
                class="px-3 py-1 border border-gray-300 rounded text-sm w-32" />
              <input v-model="GroupMembers" placeholder="members"
                class="px-3 py-1 border border-gray-300 rounded text-sm w-32" />
              <button @click.prevent="addGroup"
                class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm">+ Create</button>
            </div>
          </div>
          <table class="w-full text-sm border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 text-left">Name</th>
                <th class="p-2 text-left">Members</th>
                <th class="p-2 text-left">MembersName</th>
                <th class="p-2 text-left">Option</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(group, index) in form.groups" :key="index" class="border-t border-gray-200">
                <td class="p-2">{{ group.name }}</td>
                <td class="p-2">{{ group.members }}</td>
                <td class="p-2"><ul class="list-disc ml-6">
                    <li v-for="(member, index) in members" :key="index">
                        {{ member }}
                    </li>
                    </ul>
                </td>
                <td class="p-2">
                <button @click="editProject(group)" class="text-blue-500 hover:text-blue-700">✏️</button>
                <button @click.prevent="removeGroup(index)"
                    class="text-red-500 hover:text-red-700">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 mt-4">
          <button type="button" @click="closeModal"
            class="border border-gray-400 px-4 py-2 rounded text-gray-700">Cancel</button>
          <button type="submit"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold">Save Project</button>
        </div>
        </form>
      </div>
    </div>
  </template>
  

 <script setup>
import { ref , onMounted , computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()


const isOpen = ref(true)





const fieldsByYear = {
  AP: ['TD1', 'TD2', 'TD3'],
  CI: ['GINF', 'GSEA', 'CYS', 'GSR', 'GINL']
}

const availableFields = computed(() => {
  if (form.value.level.startsWith('AP')) {
    return fieldsByYear.AP
  } else if (form.value.level.startsWith('CI')) {
    return fieldsByYear.CI
  }
  return []
})


// Formulaire
const form = ref({
  name: '',
  subgroups: '',
  start_date: '',
  end_date: '',
  description: '',
  level: '',
  field: '',
  groups: []
})

// Nom de groupe temporaire
const newGroupName = ref('')
const GroupMembers = ref()

// Ajouter un groupe
const addGroup = () => {
  if (!newGroupName.value.trim()) return

  form.value.groups.push({
    name: newGroupName.value.trim(),
    members: GroupMembers.value.trim()
  })

  newGroupName.value = ''
  GroupMembers.value = null
}

// Supprimer un groupe
const removeGroup = (index) => {
  form.value.groups.splice(index, 1)
}

// Réinitialiser formulaire
const resetForm = () => {
  form.value = {
    name: '',
    subgroups: '',
    start_date: '',
    end_date: '',
    description: '',
    level: '',
    field: '',
    groups: []
  }
  newGroupName.value = ''
}

// Fermer le modal
function closeModal() {
  isOpen.value = false
  router.push('/ProjectMang')
}

// Envoi à l'API
const submitForm = async () => {
  try {
    const payload = {
      ...form.value,
      subgroups: Number(form.value.subgroups), // conversion pour éviter erreur côté backend
    }

    if (projectId.value) {
      // Mode modification (UPDATE)
      await axios.put(`http://localhost:3001/projects/${projectId.value}`, payload)
    } else {
        // Mode création (CREATE)
    const response = await axios.post('http://localhost:3001/projects', payload)
    }
    router.push('/ProjectMang')
  } catch (error) {
    console.error('❌ Erreur lors de la création du projet :', error)

  }
}

//members
const members = ref([])

const fetchMembers = async () => {
  try {
    const response = await axios.get('http://localhost:3001/Members')
    members.value = response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error)

  }
}

const projectId = ref(null)


onMounted(async () => {
  projectId.value = route.query.id

  if (projectId.value) {
    try {
      const { data } = await axios.get(`http://localhost:3001/projects/${projectId.value}`)
      form.value = data
    } catch (error) {
      console.error('Erreur de chargement du projet à éditer :', error)
    }
  }
})


const editProject = (group) => {
  router.push({ path: '/AddMembers', query: { id: group.name } })
}



  </script>
  