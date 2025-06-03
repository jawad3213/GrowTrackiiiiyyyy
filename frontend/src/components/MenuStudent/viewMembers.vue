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
          <tr v-for="member in members" :key="member.id" class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            <td class="p-4 flex items-center gap-3">
              <img :src="project.avatar" class="w-10 h-10 rounded-full object-cover shadow" />
              <div>
                <div class="font-medium text-gray-800 dark:text-white">{{ member.fullName }}</div>
                <div class="text-xs text-gray-400">@{{ member.id }}</div>
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
        </tbody>
      </table>
    </div>
  </div>
</div>

</template>
<script setup>
import { useRoute } from 'vue-router';
import router from '@/routers';
import axios from 'axios'
import {ref, onMounted} from 'vue'

const members = ref([])
const project = ref({});
const route = useRoute()
const id = route.query.id 
onMounted(async function fetchMembers(){
   try {
     const res = await axios.get(`http://localhost:3001/studProjects/${id}`)
         project.value = res.data; 
    members.value = res.data.members   //accéder à .members ici
   } catch (error) {
    console.log('error api', error)
   }
}) 

function evaluate(id){
    router.push(`/studentEvaluate?id=${id}` )
}

function signal(id){
    router.push(`/StudentSignal?id=${id}` )
}

</script>