//resetPassword
<template>
  <!-- Fond dégradé -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 via-pink-500 to-orange-400 px-4">

    <!-- Contenu central -->
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-8 sm:p-10 text-center">

      <div v-if="!store.validtoken"> 
      <!-- Titre -->
      <h1 class="text-2xl font-bold text-gray-800 mb-2">The link is invalide</h1>
      <!-- Sous-titre -->
      <p class="text-gray-600 text-sm">
        Please request another link
      </p>
      <div v-if="store.load" class="text-gray-500 text-sm">
        Loading...
      </div>
      </div>

    <div v-if="store.validtoken"> 
      <!-- Titre -->
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Create new password</h1>
      <!-- Sous-titre -->
      <p class="text-gray-600 text-sm mb-6">
        Your new password must be different from previously used passwords
      </p>
      <div v-if="store.load" class="text-gray-500 text-sm">
        Loading...
      </div>
      </div>
      <!-- Formulaire -->
      <form>
        <div v-if="store.validtoken" class="grid gap-y-4 text-left">

          <!-- Nouveau mot de passe -->
          <div>
            <label class="block text-sm font-bold mb-1 text-gray-800">Password</label>
            <input
              v-model="newpassword"
              type="password"
              placeholder="Must be at least 8 characters"
              class="w-full py-3 px-4 border-2 border-gray-200 rounded-md text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none"
              required
            />
            <span class="text-red-500 text-sm">{{ formStore.errors.newpassword }}</span>
          </div>

          <!-- Confirmation mot de passe -->
          <div>
            <label class="block text-sm font-bold mb-1 text-gray-800">Confirm Password</label>
            <input
              v-model="confirmpasssword"
              type="password"
              placeholder="Both passwords must match"
              class="w-full py-3 px-4 border-2 border-gray-200 rounded-md text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none"
              required
            />
            <!-- Erreur store -->
            <p v-if="!!store.errorMsg" class="text-red-600 text-sm mt-2">
              {{store.errorMsg}}
            </p>
          </div>
          <!-- Bouton -->
          <button
            @click.prevent="resetPass"
            type="submit"
            class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition duration-300"
          >
            Reset password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref , onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useFormStore } from '@/stores/form'
import * as yup from 'yup'

  
const disallowedPasswords = [
  "password",
  "12345678",
  "qwertyui",
  "abcdefgh",
  "87654321"
];

const passwordSchema = yup.object({
  newpassword: yup
  .string()
  .required('The password is required')
  .min(8, 'The password must have at least 8 characters')
  .max(64, 'The password must be at most 64 characters')
  .test(
    'not-in-disallowed',
    'The password is weak.',
    value => !disallowedPasswords.includes(value?.toLowerCase())
  )
  .matches(
    /^(?=.*[A-Z])(?=.*\d).+$/,
    'The password must contain at least one uppercase letter and one number.'
  )
})

const store = useAuthStore()
const formStore = useFormStore()
const newpassword = ref('')
const confirmpasssword = ref('')     
const router = useRouter()
const route = useRoute() //pour recupérer  de l'url 
const token = route.query.token || ''; //pour recupérer le token de de l'url 

async function checktoken(token){
  try {
    await store.CheckResetToken(token);
  } catch (error) {
    console.log('Invalide link')
  }
}checktoken(token);

function match(){
  if(newpassword.value !== confirmpasssword.value){
  store.error = 'Passwords do not match';
  confirmpasssword.value = '';
  return false;
}return true;
}



async function resetPass() {
  try {
    const valid = await formStore.validateWithSchema({newpassword: newpassword.value}, passwordSchema);
    if(valid){
    if (match()) {
    await store.resetPassword(newpassword.value , token);
    if (!store.errorMsg) {
      formStore.clearStatus();
      router.push('/check');
    }
  }
}
  } catch (error) {
    console.error('An Error occured while submiting the password, Please Try again', error)
  }
  
}
onMounted(() => {
    store.checkAuth()
    if(store.isAuthenticated){ //à répeter
        router.push('/');
    }
    store.Clearstatus();
});


</script>