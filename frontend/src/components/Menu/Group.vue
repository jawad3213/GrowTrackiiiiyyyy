<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-white/[0.03] font-sans dark:border-gray-800">
      
      <!-- Main -->
      <main class="flex-1 flex flex-col">

        <!-- Barre de recherche -->
        <div class="flex items-center justify-between p-6 border border-gray-300 dark:border-gray-700 rounded-md">
          
          <router-link to="/AddField">
            <button class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-2.5 px-9 rounded-md">
              + Add Group/Field
            </button>
          </router-link>
          
        </div>
         <!-- Affichageeee -->
        <div v-if="groups.length > 0" class="p-6 overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="py-3 px-4 text-left text-sm font-semibold">Field Name</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Description</th>
                <th class="py-3 px-4 text-center text-sm font-semibold">Number of classes</th>
                <th class="py-3 px-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="group in groups"
                :key="group.field"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >  
                <td class="py-3 px-4">{{ group.field }}</td>   
                <td class="py-3 px-4">{{ group.description}}</td>
                <td class="py-3 px-4">{{ group['number of classes'] }}</td>
                <!-- <td class="py-3 px-4">{{new Date(student.date_add).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'  })}}</td> -->
                <td class="py-3 px-4 flex justify-center space-x-2">
                  <router-link :to="`/AddField/${group.field}`" @click="FormStore.SelectedObj = skill" class="text-blue-500 hover:text-blue-700">✏️</router-link>
                  <router-link :to="`/DeleteField/${group.field}`" class="text-red-500 hover:text-red-700">🗑️</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- No Data -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 py-12">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No groups or fields configured</p>
          <p class="mb-6">
            Set up fields or academic tracks to better segment your platform.
          </p>
          <router-link to="/AddField">
            <button class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-20 rounded-md">
              + Add Group/Field
            </button>
          </router-link>
        </div>

        <!-- Pagination -->
        

      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import AdminLayout from '../layout/AdminLayout.vue'
import {ref, onBeforeMount} from 'vue'
import { useRouter } from 'vue-router'
import { useFormStore } from '@/stores/form'
import api from '@/services/api'
const groups=ref([{}])
const FormStore = useFormStore()
const router = useRouter()


const fetchGroup = async () => {
  try {
    const res = await api.get('/admin/class')
    groups.value = res.data.data;
    console.log(groups.value)
  } catch (err) {
    console.log('Something went wrong while trying to fetch the Groups!' ,err)
  }
  
}
onBeforeMount(async()=>{
  fetchGroup()
})
</script>