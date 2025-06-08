<template>
<div class="min-h-screen bg-gray-100 dark:bg-[#121212] flex items-center justify-center px-4 py-10">
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl">
    <div class="overflow-x-auto">
      <table class="w-full bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden text-sm">
        <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
          <tr>
            <th class="text-left p-4">Member Full Name</th>
            <th class="text-center p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id_member" class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            <td class="p-4 flex items-center gap-3">
              <div>
                <div class="font-medium text-gray-800 dark:text-white">{{ member.full_name }}</div>
                <div class="text-xs text-gray-400">@{{ member.id_member }}</div>
              </div>
            </td>
            <td class="p-4 text-center">
              <div class="flex justify-center gap-2">
                <button 
                  @click="evaluate(member.id)"
                  class="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-300 shadow">
                  Evaluate
                </button>
                <button 
                  @click="signal(member.id)"
                  class="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow">
                  Signal
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="isLoading == true">
            <td colspan="2" class="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading ...
            </td>
          </tr>
          <tr v-else="members.length === 0">
            <td colspan="2" class="p-4 text-center text-gray-500 dark:text-gray-400">
              No members found in this project
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
    <button 
          @click="close"
          class="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 shadow"
        >
          Close
        </button>
  </div>
</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import router from '@/routers';
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  project_id: {
    required: true
  },
  is_visible:{
    required: true
  }
})
const auth = useAuthStore();

const emit = defineEmits(['close'])
console.log(props.is_visible, props.project_id)
const members = ref([])
const project = ref({});
const isLoading = ref(false)
const error = ref(null)

async function fetchMembers() {
  try {
    isLoading.value = true
    error.value = null
    const res = await api.get(`/student/projects/member_project?project_id=${props.project_id}&id_student=${auth.ID}`)
    console.log(res.data)
    members.value = res.data.data
  } catch (err) {
    error.value = err.message || 'Failed to load members'
    console.error('API error:', err)
  } finally {
    isLoading.value = false
  }
}

function evaluate(id) {
  router.push(`/studentEvaluate?id=${id}`)
}

function signal(id) {
  router.push(`/StudentSignal?id=${id}`)
}

function close() {
  emit('close')
}

watch(() => props.is_visible, async (visible) => {
  if (visible) {
    fetchMembers()
  }
})
// Fetch members when component mounts or project_id changes
onMounted(async()=>{
  fetchMembers();
})
</script>