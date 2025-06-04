<template>
  <ProfLayout>
    <div class="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <!-- Header -->
      <div class="flex items-center mb-6">
        <div class="flex items-center space-x-2">
          <button @click="goBack" class="text-2xl text-black hover:text-gray-700">←</button>
          <h2 class="text-lg font-semibold text-gray-900">{{ project?.name_project }}</h2>
        </div>
        <div class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full">
          {{ project?.team_count }} groupes
        </div>
      </div>

      <!-- Groups Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th class="p-3 text-left">Name of Group</th>
              <th class="p-3 text-left">Number of Members</th>
              <th class="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="group in groups"
              :key="group.id_group"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition duration-150 ease-in-out"
            >
              <td class="p-3">
                <div class="font-medium">{{ group.name }}</div>
              </td>
              <td class="p-3">{{ group.member_count || 0 }}</td>
              <td class="p-3 flex space-x-2">
                <button @click="confirmDelete(group.id_group)" class="text-[#F97316] pr-15 text-lg font-bold">Delete</button>
                <button @click="viewMembers(group.id_group)" class="text-indigo-600 hover:underline">View Members</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Members Table -->
      <div v-if="members.length" class="mt-8">
        <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Group Members</h2>
        <table class="min-w-full text-sm border divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th class="p-3 text-left">Full Name</th>
              <th class="p-3 text-left">CNE</th>
              <th class="p-3 text-left">Last Evaluation</th>
              <th class="p-3 text-left">Status</th>
              <th class="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.cne" class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="p-3">{{ member.name || 'Unknown' }}</td>
              <td class="p-3">{{ member.cne }}</td>
              <td class="p-3">{{ member.lastEvaluation || 'N/A' }}</td>
              <td class="p-3">
                <span :class="member.status === 'submitted' ? 'text-green-600' : 'text-red-500'">
                  {{ member.status || 'N/A' }}
                </span>
              </td>
              <td class="p-3">
                <button class="text-purple-600 hover:underline">New Evaluation</button>
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
import { useRoute, useRouter } from 'vue-router';
import ProfLayout from '../layout/ProfLayout.vue';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();
const project = ref(null);
const groups = ref([]);
const members = ref([]);

const fetchProject = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/prof_project_management/all_project', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const projects = response.data.result || [];
    project.value = projects.find((p) => p.id_project === parseInt(route.query.id));
    if (!project.value) {
      console.error('Project not found');
      return;
    }
    await fetchGroups();
  } catch (error) {
    console.error('Erreur de récupération:', error);
  
  }
};

const fetchGroups = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/prof_project_management/all_group/${route.query.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    groups.value = (response.data.result || []).map(g => ({
      id_group: g.id_team,
      name: g.team_name,
      member_count: g.number_of_member
    }));
  } catch (error) {
    console.error('Erreur de récupération des groupes:', error);
    groups.value = [];
  }
};

const goBack = () => router.back();

const confirmDelete = async (id_group) => {
  if (confirm('Voulez-vous vraiment supprimer ce groupe ?')) {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/prof_project_management/delete_group/${id_group}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      groups.value = groups.value.filter((g) => g.id_group !== id_group);
      localStorage.setItem(`groups_${route.query.id}`, JSON.stringify(groups.value));
    } catch (error) {
      console.error('Erreur de suppression:', error);

    }
  }
};

const viewMembers = async (groupId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/prof_project_management/all_member/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    members.value = (response.data.result || []).map(m => ({
      name: m.full_name,
      cne: m.cne,
      lastEvaluation: m.last_evaluation,
      status: m.isp // ou m.isP selon le backend
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des membres :', error);
    members.value = [];
  }
};

onMounted(() => {
  fetchProject();
  fetchGroups();
});
</script>