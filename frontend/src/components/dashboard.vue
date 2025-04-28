<template>
  <admin-layout>
  
  <h1 class="text-4xl font-bold text-gray-900 mb-7">
    Welcome to Your Admin Dashboard <span class="uppercase">SOUKAINA</span>,
    <span class="text-xl font-medium text-gray-500">
      here’s what’s happening with your Dash this month
    </span>
  </h1>

  <div class="mb-20 grid grid-cols-12 gap-4 md:gap-6">
  <!-- Left column: ecommerce-metrics + monthly-sale -->
  <div class="col-span-12 xl:col-span-7 space-y-15">
    <ecommerce-metrics />
    <monthly-sale />
  </div>

  <!-- Right column: monthly-target -->
  <div class="col-span-12 xl:col-span-5 space-y-15">
    <monthly-target />
  </div>
</div>
<evaluation-source />
<div class="mt-20">
  <total-evaluation />
</div>

<user-distrubution />



</admin-layout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import EcommerceMetrics from '@/components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget.vue'
import MonthlySale from '@/components/ecommerce/MonthlySale.vue'
import EvaluationSource from './ecommerce/EvaluationSource.vue'
import UserDistrubution from './ecommerce/UserDistrubution.vue'
import TotalEvaluation from './ecommerce/TotalEvaluation.vue'

export default {
  components: {
    TotalEvaluation,
    UserDistrubution,
    EvaluationSource,
    AdminLayout,
    EcommerceMetrics,
    MonthlyTarget,
    MonthlySale,
  },
  name: 'Ecommerce',
}
</script>
