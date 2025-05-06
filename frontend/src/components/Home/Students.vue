<template>
    <HeaderPage />

<div class="items-center w-10/12 grid-cols-2 mx-auto overflow-x-hidden lg:grid md:py-14 lg:py-24 xl:py-14 lg:mt-3 xl:mt-5" data-aos="fade-right" data-aos-duration="800">
       <div class="pr-2 md:mb-14 py-14 md:py-0">
         <h1 style="font-weight: bold; font-size: 60px; color: #212121; font-family: 'Inter', sans-serif;">
            <span class="block w-full">Join the GrowTrack</span> 
            Community
         </h1>
          <p class="text-[20px] font-normal text-[#231B00] font-inter py-4 2xl:py-8 md:py-6 2xl:pr-5">
            Thousands of students already trust GrowTrack to help them thrive. Whether you’re exploring career paths or building teamwork skills, 
            GrowTrack gives you the tools and support to confidently move forward.        
         </p>

  <div class="mt-4">
    <router-link to="/Login" 
      class="inline-block px-8 py-4 text-white text-base text-xl font-semibold rounded-full"
      style="background: linear-gradient(to right, #692CF3, #F97316);">
      Start Now
    </router-link>
  </div>


</div>
  
  <div class="pb-0 overflow-hidden md:p-10 lg:p-0 sm:pb-0">
    <img id="heroImg1" class="transition-all duration-300 ease-in-out hover:scale-105 lg:w-5/6 sm:mx-auto sm:w-5/6 sm:pb-12 lg:pb-0" src="@/assets/students.jpg" alt="Awesome hero page image" width="500" height="888"/>
  </div>
</div>



<section class="bg-[#DAD1EE] py-16">
  <div>
    
    <!-- Titre centré -->
    <div class="text-center">
      <h2 class="text-6xl font-bold text-gray-900">
        Start From Scratch, Build Your Future
      </h2>
      <p class="text-[20px] font-normal text-[#000000] font-inter  mt-4">
        With GrowTrack, You Can Kick-Start Your Journey By
      </p>
    </div>

    <!-- Contenu grille -->
    <div class="w-10/12 mx-auto overflow-x-hidden grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" data-aos="fade-right" data-aos-duration="800">

      <!-- Liste des fonctionnalités -->
      <div class="space-y-8">
        <!-- Bloc 1 -->
        <div class="flex items-start gap-4">
          <img src="@/assets/strengh.jpg" alt="Strength Icon" class="w-20 h-20 mt-1" />
          <div>
            <h3 class="text-3xl font-semibold text-gray-800 mb-1">
              Discovering Your Strengths
            </h3>
            <p class="text-xl text-gray-600 text-sm">
              Begin with our quick self-assessment quizzes. They help you identify what you're good at and pinpoint areas for improvement.
            </p>
          </div>
        </div>

        <!-- Bloc 2 -->
        <div class="flex items-start gap-4">
          <img src="@/assets/gathering.jpg" alt="Feedback Icon" class="w-20 h-20 mt-1" />
          <div>
            <h3 class="text-3xl font-semibold text-gray-800 mb-1">
              Gathering Honest Feedback
            </h3>
            <p class=" text-xl text-gray-600 text-sm">
              Receive constructive insights from your peers and teachers. This feedback shows you what to focus on, even when you feel you haven't accomplished much yet.
            </p>
          </div>
        </div>

        <!-- Bloc 3 -->
        <div class="flex items-start gap-4">
          <img src="@/assets/tracking.jpg" alt="Progress Icon" class="w-20 h-20 mt-1" />
          <div>
            <h3 class="text-3xl text-3xl font-semibold text-gray-800 mb-1">
              Tracking Your Progress
            </h3>
            <p class="text-xl text-gray-600 text-sm">
              Our dynamic dashboards display your growth clearly. Every small step is recorded, so you'll see real progress over time.
            </p>
          </div>
        </div>

        <!-- Bloc 4 -->
        <div class="flex items-start gap-4">
          <img src="@/assets/earning.jpg" alt="Recognition Icon" class="w-20 h-20 mt-1" />
          <div>
            <h3 class="text-3xl font-semibold text-gray-800 mb-1">
              Earning Recognition
            </h3>
            <p class="text-xl text-gray-600 text-sm">
              As you improve, celebrate your achievements with shareable badges. Each badge is a milestone proving that even if you started with nothing, you're becoming the best version of yourself.
            </p>
          </div>
        </div>
      </div>

      <!-- Illustration (dans la même grille) -->
      <div class="flex justify-center">
        <img src="@/assets/students1.png" alt="Success Illustration" class="w-11/12 " />
      </div>

    </div>
  </div>
</section>








<section class="bg-white py-33 px-6">
  <div class="max-w-6xl mx-auto text-center">
    <!-- Title -->
    <h2 class="text-6xl font-bold text-gray-900">
      What Our Students Say
    </h2>
    <p class="text-[20px] font-normal text-[#000000] font-inter  mt-4">
      Real Feedback From Students Using GrowTrack To Empower Student Success.    </p>

    <!-- Testimonials container -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-1 items-center mt-20">

      <!-- Testimonial 1 -->
      <div class="flex flex-col items-center text-center px-6">
        <!-- Stars -->
        <div class="flex justify-center mb-3 text-orange-500 text-xl">
          <span>★</span><span>★</span><span>★</span><span>★</span><span class="text-gray-400">★</span>
        </div>

        <!-- Quote -->
        <p class=" class=text-[20px] font-medium text-[#424242] font-inter mb-6 w-[300px] italic">
          "GrowTrack really helped me understand my strengths and areas to improve. The platform is easy to use and the feedback from my peers was incredibly valuable. I would love to see even more features in the future!”
        </p>

        <!-- Logo + name -->
        <img src="@/assets/photo1.png" alt="photo1" class="w-12 h-12 object-contain mb-2">
        <p class="text-sm text-gray-700 font-medium">Sarah LA</p>
      </div>

      <!-- Testimonial 2 -->
      <div class="flex flex-col items-center text-center px-6">
        <!-- Stars -->
        <div class="flex justify-center mb-3 text-orange-500 text-xl">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>

        <!-- Quote -->
        <p class=" class=text-[20px] font-medium text-[#424242] font-inter mb-6 w-[300px] italic">
          "Using GrowTrack was an amazing experience! It made me much more aware of my soft skills and how to develop them. The dashboard is clear, the feedback is motivating, and I genuinely feel more confident in my teamwork and communication skills."
        </p>

        <!-- Logo + name -->
        <img src="@/assets/photo2.webp" alt="photo2" class="w-12 h-12 object-contain mb-2">
        <p class="text-sm text-gray-700 font-medium">Soukaina EL</p>
      </div>
    </div>

    
  </div>
</section>
<footer class="bg-gradient-to-r from-[#692CF3] to-[#F97316] text-white py-6 px-4">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
    
    <!-- Logo -->
    <div class="flex items-center space-x-2">
      <img src="@/assets/logo3.jpg" alt="Logo" class="w-50 h-10 object-contain" />

    </div>

    
    <div class="flex space-x-8 justify-center gap-4 text-lg font-medium">
      <span>© Copyright 2025 GrowTrack</span>
      <router-link to="/AboutUs" class="hover:underline">About Us</router-link>
      <router-link to="/ContactUs" class="hover:underline">Contact Us</router-link>
      <router-link to="/Teachers" class="hover:underline">Teachers</router-link>
      <router-link to="/Students" class="hover:underline">Students</router-link>
      <router-link to="/" class="hover:underline">Home</router-link>
    </div>

    
    <div class="flex space-x-4">
      <a href="https://x.com/i/flow/login"><img src="@/assets/twitter.png" alt="Twitter" class="w-6 h-6" /></a>
      <a href="https://fr-fr.facebook.com/login/web/"><img src="@/assets/facebook.png" alt="Facebook" class="w-6 h-6" /></a>
      <a href="https://www.instagram.com/?flo=true"><img src="@/assets/instagram.png" alt="Instagram" class="w-6 h-6" /></a>
    </div>

  </div>
</footer>
</template>

<script>

import axios from 'axios';
import HeaderPage from "@/components/Header.vue";

export default{
  name : 'Students',
  components :{
        HeaderPage
    }
}
</script>
