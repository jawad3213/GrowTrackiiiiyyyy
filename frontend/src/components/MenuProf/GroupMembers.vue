<!-- src/views/GroupMembers.vue -->
<template>
  <ProfLayout>
    <div class="p-6 dark:bg-[#121212] min-h-screen">
      <div class="flex items-center mb-6">
        <button
          @click="$router.back()"
          class="mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          ← Back
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Members of Group {{ idGroup }}
        </h1>
      </div>

      <!-- Loader while fetching members -->
      <div v-if="loading" class="flex justify-center items-center h-40">
        <div
          class="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <!-- Table of members -->
      <div v-else class="overflow-x-auto">
        <table class="w-full table-auto text-sm bg-white dark:bg-gray-900 rounded shadow">
          <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th class="text-left p-3">Student ID</th>
              <th class="text-left p-3">Full Name</th>
              <th class="text-left p-3">CNE</th>
              <th class="text-left p-3">Last Evaluation</th>
              <th class="text-left p-3">ISP</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="member in members"
              :key="member.student_id"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ member.student_id }}</td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ member.full_name }}</td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ member.cne }}</td>
              <td class="p-3 text-gray-700 dark:text-gray-300">
                {{ member.last_evaluation === null ? 'N/A' : member.last_evaluation }}
              </td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ member.isp || 'N/A' }}</td>
            </tr>
            <tr v-if="members.length === 0">
              <td colspan="5" class="p-3 text-center text-gray-500 dark:text-gray-400">
                This group has no members.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ProfLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';
import ProfLayout from '../layout/ProfLayout.vue';

const route = useRoute();

// 1) Read the route param “id_group”
const idGroup = route.params.id_group;

const members = ref([]);
const loading = ref(true);

const fetchMembers = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    // 2) Call the API with the group ID
    const response = await api.get(
      `/api/prof_project_management/all_member/${idGroup}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // response.data.result is an array of member objects
    members.value = response.data.result;
  } catch (error) {
    console.error('Erreur lors du chargement des membres :', error);
    members.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMembers();
});
</script>

<style>
/* No changes to default styling; adjust as needed */
</style>
