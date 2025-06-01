<template>
  <StudentLayout>
    <div class="max-w-5xl mx-auto p-6 text-center">
      <h1 class="bg-[#868CFF] text-white py-4 rounded-lg text-4xl font-bold mb-6">
        Evaluate Yourself By Yourself
      </h1>

      <!-- Liste des compétences -->
      <div v-for="(skill, index) in skills" :key="index" class="mb-4">
        <button
          @click="toggle(index)"
          class="w-full flex justify-between items-center bg-[#FA9148] text-white text-2xl px-4 py-3 rounded-md text-left font-semibold focus:outline-none hover:bg-[#e87c30]"
        >
          {{ skill.name }}
          <span>{{ skill.open ? '▲' : '▼' }}</span>
        </button>

        <!-- Questions + sliders -->
        <div v-if="skill.open" class="bg-orange-100 border border-orange-300 px-6 py-4 rounded-md mt-2 text-left">
          <div v-if="skill.questions.length > 0">
            <div v-for="(q, qIndex) in skill.questions" :key="qIndex" class="mb-4">
              <label class="font-semibold">{{ q.text }}</label>
              <input type="range" min="0" max="5" step="0.1"
                     v-model.number="skill.ratings[qIndex]"
                     class="w-full accent-purple-600" />
              <p class="text-sm text-center text-purple-700 mt-1">{{ skill.ratings[qIndex] }}</p>
            </div>
          </div>
          <p v-else class="text-gray-600">Chargement des questions...</p>
        </div>
      </div>

      <!-- Recapitulation -->
      <div class="mt-6">
        <button
          @click="toggle(skills.length)"
          class="w-full flex justify-between items-center bg-[#FA9148] text-white text-2xl px-4 py-3 rounded-md text-left font-semibold hover:bg-[#e87c30]"
        >
          Recapitulation
          <span>{{ recapOpen ? '▲' : '▼' }}</span>
        </button>

        <div v-if="recapOpen" class="bg-gray-100 px-6 py-4 rounded-md mt-2 text-left">
          <div v-for="(skill, index) in skills" :key="index">
            <p class="text-gray-700">
              {{ skill.name }} : {{ averageRating(skill.ratings) }} / 5
            </p>
          </div>
          <p class="mt-4 text-sm font-semibold">Why did you choose to give yourself such a mark?</p>
          <textarea v-model="recapText" rows="3"
                    class="w-full border mt-2 p-2 rounded-md text-sm resize-none"
                    placeholder="e.g. I focused mainly on onboarding new customers..."></textarea>
        </div>
      </div>

      <!-- Submit -->
      <button
        @click="submit"
        class="mt-8 bg-[#868CFF] text-white py-2 px-30 rounded-lg text-3xl font-bold hover:opacity-90"
      >
        Submit
      </button>
    </div>
  </StudentLayout>
</template>

<script>
import StudentLayout from '@/components/layout/StudentLayout.vue'
import axios from 'axios'

export default {
  components: { StudentLayout },
  data() {
    return {
      skills: [
        { name: "Conflict Resolution", open: false, questions: [], ratings: [] },
        { name: "Influence and Persuasion", open: false, questions: [], ratings: [] },
        { name: "Communication", open: false, questions: [], ratings: [] },
        { name: "Leadership", open: false, questions: [], ratings: [] },
        { name: "Critical Thinking", open: false, questions: [], ratings: [] },
        { name: "Adaptability", open: false, questions: [], ratings: [] },
      ],
      recapOpen: false,
      recapText: ''
    }
  },
  methods: {
    async toggle(index) {
      if (index === this.skills.length) {
        this.recapOpen = !this.recapOpen
        return
      }

      const skill = this.skills[index]
      skill.open = !skill.open

      // Charger les questions s’il n’y en a pas déjà
      if (skill.open && skill.questions.length === 0) {
        try {
          const res = await axios.get(`http://localhost:3001/questions?skill=${skill.name}`)
          this.skills[index].questions = res.data
          this.skills[index].ratings = Array(res.data.length).fill(0)
        } catch (error) {
          console.error(`Erreur lors du chargement des questions pour ${skill.name}`, error)
        }
      }
    },

    averageRating(ratings) {
      if (ratings.length === 0) return 0
      const total = ratings.reduce((sum, r) => sum + r, 0)
      return (total / ratings.length).toFixed(1)
    },

    async submit() {
      for (const skill of this.skills) {
        const answers = skill.questions.map((q, i) => ({
          skill: skill.name,
          question: q.text,
          rating: skill.ratings[i] ?? 0
        }))

        await axios.post('http://localhost:3001/answers', {
          skill: skill.name,
          answers
        })
      }

      alert("Your answers have been submitted. Thank you!")
      // Tu peux rediriger ou nettoyer ici
    }
  }
}
</script>
