<!-- src/views/GroupList.vue -->
<template>
  <ProfLayout>
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar à gauche -->
      
      <!-- Zone principale (Header + Contenu) -->
      <div class="flex-1 flex flex-col">
        <!-- Header en haut -->
        
        <!-- Contenu principal -->
        <div class="flex-1 overflow-auto p-6">
          <!-- En-tête du Project Details -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Project Details
            </h2>
            <!-- Bouton “Create Group” -->
            <div class="relative inline-flex items-center justify-center group">
              <div
                class="absolute inset-0 duration-1000 opacity-60 transition-all
                       bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400
                       rounded-xl blur-lg filter
                       group-hover:opacity-100 group-hover:duration-200"
              ></div>
              <button
                @click="isCreating = true"
                class="relative inline-flex items-center justify-center text-base rounded-xl
                       bg-gray-900 dark:bg-gray-800 px-6 py-2 font-semibold text-white
                       transition-all duration-200 hover:bg-gray-800 hover:shadow-lg
                       hover:-translate-y-0.5 hover:shadow-gray-600/30"
              >
                + Create Group
                <svg
                  aria-hidden="true"
                  viewBox="0 0 10 10"
                  height="20"
                  width="20"
                  fill="none"
                  class="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
                >
                  <path
                    d="M0 5h7"
                    class="transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                  ></path>
                  <path
                    d="M1 1l4 4-4 4"
                    class="transition-transform duration-200 group-hover:translate-x-[3px]"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal de création de groupe -->
          <transition name="fade">
            <div
              v-if="isCreating"
              class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50"
            >
              <div
                class="bg-white dark:bg-gray-800 border-2 rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 border-purple-500"
              >
                <!-- Header du modal -->
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Create New Group
                  </h3>
                  <button
                    @click="closeCreateModal"
                    class="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <!-- Formulaire création -->
                <form @submit.prevent="submitCreateGroup" class="space-y-4">
                  <div>
                    <label class="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
                      Group Name
                    </label>
                    <input
                      v-model="newGroupName"
                      type="text"
                      placeholder="Enter group name"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div class="flex justify-end space-x-3 mt-4">
                    <button
                      type="button"
                      @click="closeCreateModal"
                      class="border border-gray-400 dark:border-gray-600 px-4 py-2 rounded text-gray-700 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold transition"
                    >
                      Save Group
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </transition>

          <!-- Loader pendant la récupération des groupes -->
          <div v-if="loading" class="flex justify-center items-center py-16">
            <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <!-- Liste des groupes -->
          <div v-else>
            <div v-if="groups.length" class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <table class="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th class="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Group ID</th>
                    <th class="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Group Name</th>
                    <th class="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Members</th>
                    <th class="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr
                    v-for="group in groups"
                    :key="group.id_team"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                  >
                    <td class="p-3 text-gray-900 dark:text-gray-100">{{ group.id_team }}</td>
                    <td class="p-3 text-gray-900 dark:text-gray-100">{{ group.team_name }}</td>
                    <td class="p-3 text-gray-900 dark:text-gray-100">{{ group.number_of_member }}</td>
                    <td class="p-3 flex space-x-4">
                      <!-- Delete Button -->
                      <button
                        @click.stop="deleteGroup(group.id_team)"
                        class="text-red-500 hover:text-red-700 transition"
                        title="Delete Group"
                      >
                       <svg
    xmlns="http://www.w3.org/2000/svg"
    height="28px"
    viewBox="0 -960 960 960"
    width="28px"
    fill="#FF0000"
  >
    <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/>
  </svg>
                      </button>
                      <!-- Add Members Button -->
                      <button
                        @click.stop="goToAddMember(group.id_team)"
                        class="text-blue-500 hover:text-blue-700 transition"
                        title="Add Members"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#2854C5"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"/></svg> 
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Affichage quand aucun groupe n’existe -->
            <div v-else class="flex flex-col items-center justify-center py-20 space-y-6">
              <p class="text-xl font-semibold text-gray-700 dark:text-gray-300">
                No groups have been created yet.
              </p>
              <div class="relative inline-flex items-center justify-center group">
                <div
                  class="absolute inset-0 duration-1000 opacity-60 transition-all
                         bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400
                         rounded-xl blur-lg filter
                         group-hover:opacity-100 group-hover:duration-200"
                ></div>
                <button
                  @click="isCreating = true"
                  class="relative inline-flex items-center justify-center text-base rounded-xl
                         bg-gray-900 dark:bg-gray-800 px-6 py-2 font-semibold text-white
                         transition-all duration-200 hover:bg-gray-800 hover:shadow-lg
                         hover:-translate-y-0.5 hover:shadow-gray-600/30"
                >
                  + Create Your First Group
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    height="10"
                    width="10"
                    fill="none"
                    class="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
                  >
                    <path
                      d="M0 5h7"
                      class="transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                    ></path>
                    <path
                      d="M1 1l4 4-4 4"
                      class="transition-transform duration-200 group-hover:translate-x-[3px]"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Message d’erreur si besoin -->
            <div v-if="errorMessage" class="mt-6 text-red-500 text-sm text-center">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProfLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import ProfLayout from '../layout/ProfLayout.vue';

const route = useRoute();
const router = useRouter();
const projectId = route.query.id || route.params.id;

const isCreating = ref(false);
const newGroupName = ref('');
const groups = ref([]);
const loading = ref(false);
const errorMessage = ref('');

const closeCreateModal = () => {
  newGroupName.value = '';
  isCreating.value = false;
};

// Récupérer tous les groupes
const fetchGroups = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(
      `/api/prof_project_management/all_group/${projectId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    groups.value = response.data.result.map((g) => ({
      id_team: g.id_team,
      team_name: g.team_name,
      number_of_member: g.number_of_member || 0,
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des groupes :', error);
    errorMessage.value = '';
  } finally {
    loading.value = false;
  }
};

// Créer un nouveau groupe
const submitCreateGroup = async () => {
  if (!newGroupName.value.trim()) return;
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(
      `/api/prof_project_management/add_group/${projectId}`,
      { name: newGroupName.value.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const created = response.data.result;
    groups.value.push({
      id_team: created.id_team,
      team_name: newGroupName.value.trim(),
      number_of_member: 0,
    });
    closeCreateModal();
  } catch (error) {
    console.error('Erreur lors de la création du groupe :', error);
    errorMessage.value = 'Failed to create group. Please try again.';
  }
};

// Supprimer un groupe
const deleteGroup = async (groupId) => {
  if (!confirm('Are you sure you want to delete this group?')) return;
  try {
    const token = localStorage.getItem('token');
    await api.delete(
      `/api/prof_project_management/delete_group/${groupId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    groups.value = groups.value.filter((g) => g.id_team !== groupId);
  } catch (error) {
    console.error('Erreur lors de la suppression du groupe :', error);
    errorMessage.value = 'Failed to delete group. Please try again.';
  }
};

// Naviguer vers le formulaire d’ajout de membre
const goToAddMember = (groupId) => {
  router.push({ name: 'AddMember', params: { id_group: groupId } });
};

onMounted(() => {
  if (!projectId) {
    errorMessage.value = 'No project ID provided.';
    return;
  }
  fetchGroups();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
