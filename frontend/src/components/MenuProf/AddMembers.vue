<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div class="bg-white border-2 border-purple-500 rounded-xl shadow-xl p-6 w-full max-w-md">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Add Members</h2>
        <button @click="goBack" class="text-gray-500 hover:text-gray-800 text-xl font-bold">×</button>
      </div>

      <!-- Form with Inputs and Buttons -->
      <form @submit.prevent="saveMembers" class="space-y-6">
        <!-- Inputs -->
        <div class="space-y-2 mb-6">
          <div v-for="(member, index) in members" :key="index" class="flex items-center space-x-2">
            <input
              v-model="members[index].cne"
              :placeholder="`Member ${index + 1} CNE`"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              v-model="members[index].name"
              :placeholder="`Member ${index + 1} Name`"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              v-if="index >= initialMembersLength"
              @click="removeMember(index)"
              type="button"
              class="text-red-500 hover:text-red-700"
            >
              🗑️
            </button>
          </div>
          <button
            @click="addMemberField"
            type="button"
            class="text-purple-600 hover:underline text-sm"
          >
            + Add Member
          </button>
        </div>

        <!-- Buttons -->
        <div class="flex justify-between">
          <button
            type="button"
            @click="goBack"
            class="border border-gray-400 px-4 py-2 rounded text-gray-700"
          >
            Go Back
          </button>
          <button
            type="submit"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
          >
            Save Members
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

const isOpen = ref(true);
const router = useRouter();
const route = useRoute();
const members = ref([]);
const initialMembersLength = ref(0);

const goBack = () => {
  isOpen.value = false;
  router.push({ path: '/AddProject', query: { id: route.query.projectId } });
};

const addMemberField = () => {
  members.value.push({ cne: '', name: '' });
};

const removeMember = (index) => {
  members.value.splice(index, 1);
};

const saveMembers = async () => {
  try {
    const payload = members.value.filter((m) => m.cne.trim() !== '');
    if (payload.length === 0) return;

    const groupId = route.query.groupId;
    const token = localStorage.getItem('token');

    for (const member of payload) {
      await api.post(
        `/api/prof_project_management/add_member/${groupId}`,
        { cne: member.cne },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    router.push({ path: '/AddProject', query: { id: route.query.projectId } });
  } catch (error) {
    console.error('Erreur lors de l’enregistrement des membres :', error);
  }
};

onMounted(async () => {
  const groupId = route.query.groupId;
  if (groupId) {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get(`/api/prof_project_management/all_member/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      members.value = (data.result || []).map(m => ({
        cne: m.cne,
        name: m.full_name
      }));
      initialMembersLength.value = members.value.length;
      if (members.value.length === 0) {
        members.value = [{ cne: '', name: '' }, { cne: '', name: '' }, { cne: '', name: '' }, { cne: '', name: '' }];
      }
    } catch (error) {
      console.error('Erreur de chargement des membres :', error);
      members.value = [{ cne: '', name: '' }, { cne: '', name: '' }, { cne: '', name: '' }, { cne: '', name: '' }];
    }
  }
});
</script>