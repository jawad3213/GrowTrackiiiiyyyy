<template>
<nav class="bg-[#F3F3F3] py-4 px-8 flex items-center justify-between">

  <div class="flex items-center space-x-2">
    <img src="../assets/logo.png" alt="Logo" class="w-50 h-10" />
  </div>

  <ul class="flex space-x-8 font-medium text-xl text-gray-800">
    <li><router-link to="/">Home</router-link></li>
    <li><router-link to="/Teachers">Teachers</router-link></li>
    <li><router-link to="/Students">Students</router-link></li>
    <li><router-link to="/AboutUs">About Us</router-link></li>
    <li><router-link to="/ContactUs">Contact Us</router-link></li>
  </ul>

<router-link
  to="/Login"
  class="bg-[#F97316] text-white font-medium text-sm px-8 py-4 rounded-full border-2 border-[#692CF3] hover:opacity-90 transition"
>
  Login
</router-link>

</nav>

</template>

<script>
import { RouterLink } from 'vue-router'
export default{
    name : 'HeaderPage'
}
</script>