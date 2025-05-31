<template>
  <!-- Fond flou et gris clair -->
  <div v-if="isOpen" class="fixed inset-0 bg-gray-800/70 backdrop-blur-sm flex items-center justify-center z-50 font-inter">
    
    <!-- Conteneur du formulaire -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
      
      <!-- Bouton de fermeture -->
      <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">
        &times;
      </button>

      <!-- Titre -->
      <h2 class="text-2xl font-bold mb-1 text-center">{{ isEditMode ? 'Edit Skill' : 'Add Skill' }}</h2>
      <p class="text-sm text-gray-600 mb-6 text-center">Fill in the skill and its indicators below</p>

      <!-- Formulaire -->
      <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div v-if="!isEditMode" class="md:col-span-2">
          <label class="font-semibold">Skill Name*</label>
          <input v-model="skill.skill_name" type="text" placeholder="Skill name"
         class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <span class="text-red-500 text-sm">{{ formStore.errors.skill_name }}</span>
        </div>

        <div v-else class="md:col-span-2">
          <label class="font-semibold">Skill Name* <small>not Editibale</small></label>
          <input v-model="skill.skill_name" type="text" placeholder="Skill name" readonly
          class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none focus:ring-0"/>
          <span class="text-red-500 text-sm">{{ formStore.errors.skill_name }}</span>
        </div>

        <div>
          <label class="font-semibold">Indicator 1*</label>
          <input v-model="skill.question1" type="text" placeholder="First indicator"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <span class="text-red-500 text-sm">{{ formStore.errors.question1 }}</span>
        </div>

        <div>
          <label class="font-semibold">Indicator 2*</label>
          <input v-model="skill.question2" type="text" placeholder="Second indicator"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <span class="text-red-500 text-sm">{{ formStore.errors.question2 }}</span>
        </div>

        <div class="md:col-span-2">
          <label class="font-semibold">Indicator 3*</label>
          <input v-model="skill.question3" type="text" placeholder="Third indicator"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <span class="text-red-500 text-sm">{{ formStore.errors.question3 }}</span>
        </div>

        <div class="md:col-span-2">
          <label class="font-semibold">Skill Description*</label>
          <textarea v-model="skill.description_skill" rows="3" placeholder="Description of the skill..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
          <span class="text-red-500 text-sm">{{ formStore.errors.description_skill }}</span>
          <span class="text-red-500 text-sm">{{ formStore.errors.id_admin }}</span>
        </div>

        <div class="md:col-span-2 flex justify-end items-center gap-4 mt-4">
          <button type="button" @click="closeModal"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit"
            class="px-6 py-2 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-md shadow-md">
            Save
          </button>
        </div>

        <div class="md:col-span-2">
          <p v-if="formStore.error" class="text-red-500 text-sm mt-2 animate-pulse">{{ formStore.error }}</p>
          <p v-if="formStore.success" class="text-green-500 text-sm mt-2 animate-pulse">{{ formStore.success }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useFormStore } from '@/stores/form'
import { useRouter ,useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SkillSchema from '@/schemas/CreateSkill.schema';


const formStore = useFormStore()
const router = useRouter()
const route = useRoute()
const isEditMode = route.params.skill_name !== undefined;
const auth = useAuthStore()
const OriginalData = {}


const isOpen = ref(true)

const skill = ref({
  skill_name: '',
  question1: '',
  question2: '',
  question3: '',
  description_skill: '',
  id_admin: auth.ID
})

console.log(auth.ID)
function closeModal() {
  isOpen.value = false
  router.push('/Skills')
}

async function submitForm() {
  if(!isEditMode){
    try {
    const sanitizedData = formStore.sanitizeInputs(skill.value)
    console.log(sanitizedData)
    const valid = await formStore.validateWithSchema(sanitizedData,SkillSchema)
    if(valid){
      await formStore.submitForm('/admin/skills/create', sanitizedData, () => {closeModal()})
      if(!formStore.errors){
        console.log('sent');
        formStore.clearStatus();
        router.push('/Skills');
    }}} catch (error) {
      console.log("Error while trying to Add the skill ",error); //bedel hadi mli kolxi yekhdem 
    }
  }else {
    try {
      // First identify what has changed
      const UpdatedData = {}
      for (const key in skill.value) {
        if (skill.value[key] !== OriginalData[key]) {
          UpdatedData[key] = skill.value[key];  
        }
      }
      
      // Only proceed if there are actual changes
      if (Object.keys(UpdatedData).length > 0) {
        const sanitizedPartialData = formStore.sanitizeInputs(UpdatedData);
        
        // Create a partial schema only for the fields being updated
        const partialSchema = SkillSchema.pick(Object.keys(sanitizedPartialData));
        
        const valid = await formStore.validateWithSchema(sanitizedPartialData, partialSchema)
        
        if(valid) {
          await formStore.Update(`/admin/skills/${OriginalData.skill_name}`, sanitizedPartialData)
          if(!formStore.errors) {
            console.log('Update successful');
            formStore.clearStatus();
            router.push('/Skills');
          }
        }
      } else {
        console.log('No changes detected');
        router.push('/Skills');
      }
    } catch (error) {
      console.log("Error during update: ", error);
    }
  }
}
onMounted(()=>{
  if(isEditMode){
    skill.value = formStore.SelectedSkill;
    for (const key in skill.value ) {
    OriginalData[key] = skill.value[key];
  }
  console.log(OriginalData)
  }
})
formStore.clearStatus()
</script>
