1<template>
  <StudentLayout>
  
  <h1 class="text-3xl font-bold text-gray-900 mb-7">
    Good to see you again <span class="uppercase">user name</span>
    <span class="text-xl font-medium text-gray-500">
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
}
</script>
