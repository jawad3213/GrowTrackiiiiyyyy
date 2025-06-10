1<template>
  <StudentLayout>
  
  <h1 class="text-3xl font-bold dark:text-white text-gray-900 mb-7">
    Good to see you again <span class="uppercase">{{username}}</span>
    <span class="text-xl font-medium dark:text-white text-gray-500">
      , Here’s what’s happening this month:
    </span>
    
  </h1>
  <div class="mb-20 grid grid-cols-12 gap-4 md:gap-6">
  <!-- Left column: ecommerce-metrics + monthly-sale -->
      <div class="col-span-12 xl:col-span-7 space-y-15">
          <Cards />
      </div>

      <!-- Right column: monthly-target -->
      <div class="col-span-12 xl:col-span-5 space-y-15">
        <CompletionRate />
      </div>
  </div>

  <div class="mb-20 grid grid-cols-12 gap-4 md:gap-6">
  <!-- Left column: 6/12 -->
      <div class="col-span-12 xl:col-span-6 space-y-15">
        <FirstChart />
      </div>

        <!-- Right column: 6/12 -->
        <div class="col-span-12 xl:col-span-6 space-y-15">
          <SecondChart/>
        </div>

 
  </div>

  
<EvalByRole />

<div class="my-10"></div>  <!-- Ajoute un espace vertical -->

<RatingSkill />

  


</StudentLayout>
</template>

<script>
import StudentLayout from '@/components/layout/StudentLayout.vue'
import CompletionRate from './CompletionRate.vue'
import FirstChart from './FirstChart.vue'
import SecondChart from './SecondChart.vue'
import Cards from '@/components/MenuStudent/dashStudent/Cards.vue'
import EvalByRole from './EvalByRole.vue'
import RatingSkill from './RatingSkill.vue'

import { ref, onMounted } from 'vue'
export default {
  components: {
    Cards,
    FirstChart,
    SecondChart,
    StudentLayout,
    EvalByRole,
    CompletionRate,
    RatingSkill
  },
  name: 'Ecommerce',

  setup() {
    const username = ref('');

    onMounted(() => {
      username.value = localStorage.getItem('username') || 'Nom inconnu';
    });

    return { username };
  }
}
</script>
