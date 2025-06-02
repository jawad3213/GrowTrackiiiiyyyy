<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-white/[0.03] font-sans dark:border-gray-800">
      
      <!-- Main -->
      <main class="flex-1 flex flex-col">

        <!-- Barre de recherche -->
        <div class="flex items-center justify-between p-6 border border-gray-300 dark:border-gray-700 rounded-md">
          <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              class="w-full outline-none text-gray-700 dark:text-white dark:bg-transparent"
            />
            <button class="ml-2 text-purple-500 dark:text-purple-300">🔍</button>
          </div>
          <router-link
            to="/AddSkill"
            class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-20 rounded-md inline-block text-center">
            + Add Skill
          </router-link>
        </div>
        <!-- Affichageeee -->
        <div v-if="skills.length > 0" class="p-6 overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="py-3 px-4 text-left text-sm font-semibold">Skill Name</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Description</th>
                <th class="py-3 px-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="skill in AllSkills"
                :key="skill.skill_name"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >  
                <td class="py-3 px-4">{{ skill.skill_name }}</td>   
                <td class="py-3 px-4">{{ skill.description_skill }}</td>
                <!-- <td class="py-3 px-4">{{new Date(student.date_add).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'  })}}</td> -->
                <td class="py-3 px-4 flex justify-center space-x-2">
                  <router-link :to="`/AddSkill/${skill.skill_name}`" @click="FormStore.SelectedSkill = skill" class="text-blue-500 hover:text-blue-700">✏️</router-link>
                  <router-link :to="`/DeleteSkill/${skill.skill_name}`" class="text-red-500 hover:text-red-700">🗑️</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- No Data -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 py-12">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No skills defined</p>
          <p class="mb-6">
            You haven’t set up any soft skills yet.<br />
            Create skills and indicators to build your custom evaluation framework.
          </p>
          <router-link
            to="/AddSkill"
            class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-20 rounded-md inline-block text-center">
            + Add Skill
          </router-link>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 text-gray-600 dark:text-gray-300">
          <span>Page 1 of 10</span>
          <div class="flex items-center space-x-2">
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md">Previous</button>
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md">Next</button>
          </div>
        </div>
      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, onMounted,computed} from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'
import { useFormStore } from '@/stores/form'
import api from '@/services/api'
const skills=ref([{}])
const FormStore = useFormStore();
const router = useRouter()

// function navigate(link) {
//   if (link.path) {
//     router.push(link.path)
//   }
// }
 const AllSkills = computed(() => {
  const all = skills.value
  return all
 })

const fetchSkills = async () => {
  try {
    const res = await api.get('/admin/skills')
    skills.value = res.data.data;
    console.log(res.data.data)
  } catch (err) {
    console.log('Something went wrong while trying to fetch the skills!' ,err)
  }
  
}
onMounted(async()=>{
  fetchSkills()
})
</script>