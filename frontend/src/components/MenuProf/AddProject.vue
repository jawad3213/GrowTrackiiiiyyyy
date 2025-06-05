<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 font-inter">
    <div class="bg-white border-2 rounded-2xl shadow-xl w-full max-w-xl p-6 sm:p-8 border-purple-500">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl mb-2 font-bold text-gray-900">Add Project</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">×</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Name + Sub -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="font-semibold">How many Sub Group are there</label>
            <input
              v-model.number="form.subgroups"
              type="number"
              placeholder="Enter the number"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <!-- Month Start + Number of Months -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Start Month*</label>
            <input
              v-model="form.month_start"
              type="month"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label class="font-semibold">Number of Months*</label>
            <input
              v-model.number="form.month_number"
              type="number"
              min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <!-- Level + Field -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Year of Studies*</label>
            <select
              v-model="form.level"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
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
            <select
              v-model="form.field"
              :disabled="availableFields.length === 0"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option disabled value="">-- select field --</option>
              <option v-for="field in availableFields" :key="field">{{ field }}</option>
            </select>
          </div>
        </div>

        <!-- Admin Notes -->
        <div>
          <label class="font-semibold">Admin Notes</label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="e.g. Notes or description..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>

        <!-- Groups Table -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="font-semibold">Groups</label>
            <div class="flex gap-2">
              <input
                v-model="newGroupName"
                placeholder="Group name"
                class="px-3 py-1 border border-gray-300 rounded text-sm w-32"
              />
              <button
                @click.prevent="addGroup"
                class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
              >
                + Create
              </button>
            </div>
          </div>
          <table class="w-full text-sm border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 text-left">Name</th>
                <th class="p-2 text-left">Option</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(group, index) in form.groups" :key="group.id_group || index" class="border-t border-gray-200">
                <td class="p-2">{{ group.name }}</td>
                <td class="p-2">
                  <button @click="editGroup(group, index)" class="text-blue-500 hover:text-blue-700">✏️</button>
                  <button @click.prevent="removeGroup(index)" class="text-red-500 hover:text-red-700">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            @click="closeModal"
            class="border border-gray-400 px-4 py-2 rounded text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
          >
            Save Project
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();
const isOpen = ref(true);
const projectId = ref(route.query.id);

const fieldsByYear = {
  AP: ['TD1', 'TD2', 'TD3'],
  CI: ['GINF', 'GSEA', 'CYS', 'GSR', 'GINL'],
};

const availableFields = computed(() => {
  if (form.value.level.startsWith('AP')) return fieldsByYear.AP;
  if (form.value.level.startsWith('CI')) return fieldsByYear.CI;
  return [];
});

const form = ref({
  name: '',
  subgroups: 0,
  month_start: '',
  month_number: 1,
  description: '',
  level: '',
  field: '',
  groups: [],
});

const newGroupName = ref('');
const newProjectId = ref('');

const addGroup = async () => {
  if (!newGroupName.value.trim()) return;
  try {
    const token = localStorage.getItem('token');
    if (projectId.value) {
      const response = await api.post(
        `/api/prof_project_management/add_group/${projectId.value}`,
        { name: newGroupName.value.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      form.value.groups.push({ ...response.data.result, member_count: 0 });
      localStorage.setItem(`groups_${projectId.value}`, JSON.stringify(form.value.groups));
    } else {
      form.value.groups.push({ name: newGroupName.value.trim(), member_count: 0 });
    }
    newGroupName.value = '';
  } catch (error) {
    console.error('Erreur lors de l’ajout du groupe :', error);
 
  }
};

const removeGroup = async (index) => {
  const group = form.value.groups[index];
  if (projectId.value && group.id_group) {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/prof_project_management/delete_group/${group.id_group}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du groupe :', error);

    }
  }
  form.value.groups.splice(index, 1);
  if (projectId.value) {
    localStorage.setItem(`groups_${projectId.value}`, JSON.stringify(form.value.groups));
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    subgroups: 0,
    month_start: '',
    month_number: 1,
    description: '',
    level: '',
    field: '',
    groups: [],
  };
  newGroupName.value = '';
};

const closeModal = () => {
  isOpen.value = false;
  router.push('/ProjectMang');
};

const submitForm = async () => {
  try {
    const { name, month_start, month_number, description, level, field, groups } = form.value;

    // Validation des champs requis
    if (!name || !month_start || !month_number || !level || !field) return;

    // Construction du payload avec transformation de la date
    const payload = {
      name,
      month_start: month_start.split('-').reverse().join('/'), // MM/YYYY
      month_number,
      description,
      level,
      field,
    };

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Création ou mise à jour du projet
    
    if (!projectId.value) {
      console.log('hello')
      const { data } = await api.post(`/api/prof_project_management/add_project`, payload, { headers });
      
      const newProjectId = data.result.id_project;

      // Ajout des groupes s'ils existent
      // if (groups?.length) {
      //   for (const group of groups) {
      //     const res = await api.post(
      //       `/api/prof_project_management/add_group/${newProjectId}`,
      //       { name: group.name },
      //       { headers }
      //     );
      //     group.id_group = res.data.result.id_group;
      //   }
      //   localStorage.setItem(`groups_${newProjectId}`, JSON.stringify(groups));
      // }
    } else {
      await api.patch(`/api/prof_project_management/update_project/${projectId.value}`, payload, { headers });
    }

    router.push('/ProjectMang');
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error);
  }
};


const editGroup = (group, index) => {
  router.push({
    path: '/AddMembers',
    query: { projectId: projectId.value || newProjectId.value, groupId: group.id_group || index },
  });
};


const fetchMembers = async () => {
  try {
    const response = await api.get('http://localhost:3001/Members');
    members.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);

  }
};

onMounted(async () => {
  if (projectId.value) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/prof_project_management/all_project', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const project = response.data.result.find((p) => p.id_project === parseInt(projectId.value));
      if (project) {
        // Charger les groupes depuis le backend
        const groupRes = await api.get(`/api/prof_project_management/all_group/${projectId.value}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        form.value = {
          name: project.name_project,
          subgroups: project.team_count,
          month_start: new Date(project.date_project).toISOString().slice(0, 7), // YYYY-MM
          month_number: Math.ceil(
            (new Date(project.end_date) - new Date(project.date_project)) / (1000 * 60 * 60 * 24 * 30)
          ),
          description: project.description,
          level: project.id_sector,
          field: project.id_class,
          groups: (groupRes.data.result || []).map(g => ({
            ...g,
            name: g.team_name,
            id_group: g.id_team,
            member_count: g.number_of_member
          })),
        };
      }
    } catch (error) {
      console.error('Erreur de chargement du projet à éditer :', error);
    }
  }
});
</script>