<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <!-- Main -->
      <main class="flex-1 flex flex-col">

        <!-- Header + Add Button -->
        <div
          class="flex items-center justify-between p-6 mb-4
                 bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700
                 rounded-md shadow-sm"
        >
          <h1
            class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-gray-100"
          >
            <span>Skills</span>
            <span
              class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full
                     dark:bg-purple-200/10 dark:text-purple-300"
            >
              {{ skills.length }} skills
            </span>
          </h1>

          <router-link to="/AddSkill">
            <button
              class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold
                     px-6 py-2 rounded-md
                     transform hover:scale-105 hover:shadow-lg
                     transition-transform duration-200"
            >
              + Add Skill
            </button>
          </router-link>
        </div>

        <!-- Loader -->
        <div v-if="isLoading" class="flex-1 flex justify-center items-center py-20">
          <div
            class="w-16 h-16 border-4 border-purple-600 border-t-transparent
                   rounded-full animate-spin"
            aria-label="Loading skills..."
          ></div>
        </div>

        <!-- Skills Table (once loaded) -->
        <div v-else-if="skills.length > 0" class="p-6 overflow-x-auto">
          <div
            class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700
                   shadow-md bg-white dark:bg-gray-800"
          >
            <table class="min-w-full">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th
                    class="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                  >
                    Skill Name
                  </th>
                  <th
                    class="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                  >
                    Description
                  </th>
                  <th
                    class="py-3 px-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-300"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="skill in skills"
                  :key="skill.skill_name"
                  class="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700
                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
                    {{ skill.skill_name }}
                  </td>
                  <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
                    {{ skill.description_skill }}
                  </td>
                  <td class="py-3 px-4 flex justify-center space-x-4">
                    <router-link
                      :to="`/AddSkill/${skill.skill_name}`"
                      @click="FormStore.SelectedSkill = skill"
                      class="text-blue-500 hover:text-blue-700
                             transform hover:scale-110 transition-transform duration-150"
                      aria-label="Edit skill"
                    >
                     <svg xmlns="http://www.w3.org/2000/svg"
                         height="24px" viewBox="0 -960 960 960"
                         width="24px" fill="currentColor">
                      <path
                        d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                      />
                    </svg>
                    </router-link>
                    <router-link
                      :to="`/DeleteSkill/${skill.skill_name}`"
                      class="text-red-500 hover:text-red-700
                             transform hover:scale-110 transition-transform duration-150"
                      aria-label="Delete skill"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- No Data -->
        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center text-center
                 text-gray-600 dark:text-gray-300 py-12"
        >
          <div class="text-6xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No skills defined</p>
          <p class="mb-6">
            You haven’t set up any soft skills yet.<br />
            Create skills and indicators to build your custom evaluation framework.
          </p>
          <router-link
            to="/AddSkill"
            class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-8 rounded-md
                   transform hover:scale-105 hover:shadow-lg transition-transform duration-200"
          >
            + Add Skill
          </router-link>
        </div>

        <!-- (Optional) Pagination, etc. -->
      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useFormStore } from '@/stores/form'
import api from '@/services/api'

const FormStore = useFormStore()
const skills = ref([])
const isLoading = ref(true)

const fetchSkills = async () => {
  try {
    const res = await api.get('/admin/skills')
    skills.value = res.data.data
  } catch (err) {
    console.error('Something went wrong while fetching skills!', err)
    skills.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchSkills)
</script>
