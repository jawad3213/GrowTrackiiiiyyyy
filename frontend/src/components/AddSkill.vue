<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center overflow-y-auto z-50 font-inter"
  >
    <!-- Backdrop: semi-transparent with blur -->
    <div
      class="fixed inset-0 bg-gray-400/30 backdrop-blur-[8px]"
      @click="closeModal"
      aria-hidden="true"
    ></div>

    <!-- Modal Container -->
    <div
      class="relative bg-white border-2 rounded-2xl shadow-xl w-full max-w-2xl p-8 sm:p-10 border-t-2 border-purple-500"
    >
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
      >
        &times;
      </button>

      <!-- Modal Header -->
      <div class="mb-6 text-center">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Skill' : 'Add Skill' }}
        </h2>
        <p class="text-sm text-gray-600 mt-1">
          Fill in the skill and its indicators below
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Skill Name -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Skill Name*</label>
          <input
            v-model="skill.skill_name"
            :readonly="isEditMode"
            type="text"
            placeholder="Skill name"
            :class="[
              'w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500',
              isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300' : 'border-gray-300 text-gray-800'
            ]"
          />
          <span class="text-red-500 text-sm">{{ formStore.errors.skill_name }}</span>
        </div>

        <!-- Indicator 1 -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Indicator 1*</label>
          <input
            v-model="skill.question1"
            type="text"
            placeholder="First indicator"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          />
          <span class="text-red-500 text-sm">{{ formStore.errors.question1 }}</span>
        </div>

        <!-- Indicator 2 -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Indicator 2*</label>
          <input
            v-model="skill.question2"
            type="text"
            placeholder="Second indicator"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          />
          <span class="text-red-500 text-sm">{{ formStore.errors.question2 }}</span>
        </div>

        <!-- Indicator 3 -->
        <div class="md:col-span-2">
          <label class="block mb-1 font-semibold text-gray-700">Indicator 3*</label>
          <input
            v-model="skill.question3"
            type="text"
            placeholder="Third indicator"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          />
          <span class="text-red-500 text-sm">{{ formStore.errors.question3 }}</span>
        </div>

        <!-- Skill Description -->
        <div class="md:col-span-2">
          <label class="block mb-1 font-semibold text-gray-700">Skill Description   </label>
          <textarea
            v-model="skill.description_skill"
            rows="3"
            placeholder="Description of the skill..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          ></textarea>
          <span class="text-red-500 text-sm">{{ formStore.errors.description_skill }}</span>
        </div>

        <!-- Form Alerts -->
        <div class="md:col-span-2">
          <p v-if="formStore.error" class="text-red-500 text-sm mb-2 animate-pulse">
            {{ formStore.error }}
          </p>
          <p v-if="formStore.success" class="text-green-500 text-sm mb-2 animate-pulse">
            {{ formStore.success }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4 pt-4 md:col-span-2">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="formStore.loading"
            class="flex-1 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-orange-400 hover:from-purple-700 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="formStore.loading">Saving...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFormStore } from '@/stores/form'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SkillSchema from '@/schemas/CreateSkill.schema'

const formStore = useFormStore()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const isEditMode = route.params.skill_name !== undefined
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

function closeModal() {
  isOpen.value = false
  router.push('/Skills')
}

async function submitForm() {
  if (!isEditMode) {
    try {
      const sanitizedData = formStore.sanitizeInputs(skill.value)
      const valid = await formStore.validateWithSchema(sanitizedData, SkillSchema)
      if (valid) {
        await formStore.submitForm('/admin/skills/create', sanitizedData, () => {
          closeModal()
        })
        if (!formStore.errors) {
          formStore.clearStatus()
          router.push('/Skills')
        }
      }
    } catch (error) {
      console.log('Error while trying to add the skill:', error)
    }
  } else {
    try {
      const UpdatedData = {}
      for (const key in skill.value) {
        if (skill.value[key] !== OriginalData[key]) {
          UpdatedData[key] = skill.value[key]
        }
      }
      if (Object.keys(UpdatedData).length > 0) {
        const sanitizedPartialData = formStore.sanitizeInputs(UpdatedData)
        const partialSchema = SkillSchema.pick(Object.keys(sanitizedPartialData))
        const valid = await formStore.validateWithSchema(sanitizedPartialData, partialSchema)
        if (valid) {
          await formStore.Update(`/admin/skills/${OriginalData.skill_name}`, sanitizedPartialData)
          if (!formStore.errors) {
            formStore.clearStatus()
            router.push('/Skills')
          }
        }
      } else {
        router.push('/Skills')
      }
    } catch (error) {
      console.log('Error during update:', error)
    }
  }
}

onMounted(() => {
  if (isEditMode) {
    skill.value = formStore.SelectedSkill
    for (const key in skill.value) {
      OriginalData[key] = skill.value[key]
    }
  }
  formStore.clearStatus()
})
</script>
