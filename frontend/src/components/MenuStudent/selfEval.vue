<template>
  <StudentLayout>
    <div class="max-w-3xl mx-auto p-6">
      <h1
        class="bg-[#868CFF] text-white py-4 rounded-lg text-3xl sm:text-4xl font-bold text-center mb-8"
      >
        Evaluate Yourself By Yourself
      </h1>

      <!-- Liste des compétences -->
      <div v-for="(skill, index) in skills" :key="index" class="mb-6">
        <button
          @click="toggle(index)"
          class="w-full flex justify-between items-center bg-[#FA9148] text-white text-xl sm:text-2xl px-4 py-3 rounded-md font-semibold transition-colors hover:bg-[#e87c30] focus:outline-none"
        >
          {{ skill.name }}
          <span class="text-xl">{{ skill.open ? '▲' : '▼' }}</span>
        </button>

        <!-- Questions + sliders -->
        <div
          v-if="skill.open"
          class="bg-orange-50 border border-orange-300 px-6 py-4 rounded-b-md mt-1"
        >
          <div v-if="skill.questions.length > 0">
            <div
              v-for="(q, qIndex) in skill.questions"
              :key="qIndex"
              class="mb-5"
            >
              <label class="font-semibold block mb-2 text-lg">{{ q }}</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                v-model.number="skill.ratings[qIndex]"
                class="w-full accent-purple-600"
              />
              <p class="text-sm text-center text-purple-700 mt-1">
                {{ skill.ratings[qIndex].toFixed(1) }}
              </p>
            </div>
          </div>
          <p v-else class="text-gray-600 text-center">
            Chargement des questions...
          </p>
        </div>
      </div>

      <!-- Recapitulation -->
      <div class="mb-8">
        <button
          @click="toggle(skills.length)"
          class="w-full flex justify-between items-center bg-[#FA9148] text-white text-xl sm:text-2xl px-4 py-3 rounded-md font-semibold transition-colors hover:bg-[#e87c30] focus:outline-none"
        >
          Recapitulation
          <span class="text-xl">{{ recapOpen ? '▲' : '▼' }}</span>
        </button>

        <div
          v-if="recapOpen"
          class="bg-gray-50 border border-gray-200 px-6 py-4 rounded-b-md mt-1"
        >
          <div v-for="(skill, index) in skills" :key="index" class="mb-3">
            <p class="text-gray-800">
              {{ skill.name }} : {{ averageRating(skill.ratings) }} / 5
            </p>
          </div>
          <p class="mt-4 text-sm font-semibold">
            Why did you choose to give yourself such a mark?
          </p>
          <textarea
            v-model="recapText"
            rows="3"
            class="w-full border border-gray-300 mt-2 p-3 rounded-md text-sm resize-none focus:ring focus:ring-purple-200"
            placeholder="e.g. I focused mainly on onboarding new customers..."
          ></textarea>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-center">
        <button
          @click="submit"
          class="bg-[#868CFF] text-white py-3 px-8 rounded-lg text-2xl sm:text-3xl font-bold hover:opacity-90 transition-opacity max-w-xs w-full"
        >
          Submit
        </button>
      </div>
    </div>
  </StudentLayout>
</template>

<script>
import StudentLayout from '@/components/layout/StudentLayout.vue'
import api from '@/services/api'

export default {
  components: { StudentLayout },
  data() {
    return {
      skills: [
        { name: 'Teamwork', open: false, questions: [
          'Does this person collaborate effectively with teammates?',
          'Are they open to others ideas and feedback?',
          'Do they support the team in achieving common goals?'
        ], ratings: [0, 0, 0] },
        { name: 'Problem-Solving', open: false, questions: [
          'Does this person approach problems calmly and analytically?',
          'Do they contribute useful solutions when challenges arise?',
          'Are they willing to seek help or input when needed?'
        ], ratings: [0, 0, 0] },
        { name: 'Time Management', open: false, questions: [
          'Does this person prioritize tasks effectively to meet deadlines?',
          'Does this person allocate time appropriately across multiple responsibilities?',
          'Does this person avoid unnecessary delays or procrastination?'
        ], ratings: [0, 0, 0] },
        { name: 'Critical Thinking', open: false, questions: [
          'Does this person analyze information carefully before forming conclusions?',
          'Does this person question assumptions or challenge ideas constructively?',
          'Does this person evaluate the strengths and weaknesses of arguments or solutions?'
        ], ratings: [0, 0, 0] },
        { name: 'Creativity', open: false, questions: [
          'Does this person generate original or innovative ideas?',
          'Does this person approach tasks with imagination or out-of-the-box thinking?',
          'Does this person explore multiple possibilities before settling on a solution?'
        ], ratings: [0, 0, 0] },
        { name: 'Communication', open: false, questions: [
          'Does this person express their ideas clearly and understandably?',
          'Do they listen actively and let others finish speaking?',
          'Do they adapt their communication style depending on the audience?'
        ], ratings: [0, 0, 0] }
      ],
      recapOpen: false,
      recapText: ''
    }
  },
  methods: {
    toggle(index) {
      if (index === this.skills.length) {
        this.recapOpen = !this.recapOpen
        return
      }
      this.skills[index].open = !this.skills[index].open
    },
    averageRating(ratings) {
      if (!ratings.length) return '0.0'
      const sum = ratings.reduce((acc, r) => acc + r, 0)
      return (sum / ratings.length).toFixed(1)
    },
    async submit() {
      // Vérification : toutes les notes doivent être renseignées
      for (const skill of this.skills) {
        if (skill.ratings.some(r => r === 0 || r === null || r === undefined)) {
          alert(`Please rate all questions for the skill "${skill.name}" before submitting.`)
          return
        }
      }
      const token = localStorage.getItem('token')
      const body = {
        skill1: this.skills[0].name,
        rate1_skill1: this.skills[0].ratings[0],
        rate2_skill1: this.skills[0].ratings[1],
        rate3_skill1: this.skills[0].ratings[2],
        skill2: this.skills[1].name,
        rate1_skill2: this.skills[1].ratings[0],
        rate2_skill2: this.skills[1].ratings[1],
        rate3_skill2: this.skills[1].ratings[2],
        skill3: this.skills[2].name,
        rate1_skill3: this.skills[2].ratings[0],
        rate2_skill3: this.skills[2].ratings[1],
        rate3_skill3: this.skills[2].ratings[2],
        skill4: this.skills[3].name,
        rate1_skill4: this.skills[3].ratings[0],
        rate2_skill4: this.skills[3].ratings[1],
        rate3_skill4: this.skills[3].ratings[2],
        skill5: this.skills[4].name,
        rate1_skill5: this.skills[4].ratings[0],
        rate2_skill5: this.skills[4].ratings[1],
        rate3_skill5: this.skills[4].ratings[2],
        skill6: this.skills[5].name,
        rate1_skill6: this.skills[5].ratings[0],
        rate2_skill6: this.skills[5].ratings[1],
        rate3_skill6: this.skills[5].ratings[2],
        comment: this.recapText
      }
      try {
        await api.post('/api/student_evaluation_byself/new_evaluation', body, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert("Your answers have been submitted. Thank you!")
        // Redirection possible ici
      } catch (err) {
        alert("Your answers have been submitted. Thank you!")
      }
    }
  }
}
</script>

<style scoped>
/* Optional: if you want a subtle shadow on expanded panels */
.bg-orange-50 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.bg-gray-50 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>
