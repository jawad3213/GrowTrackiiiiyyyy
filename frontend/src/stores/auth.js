//auth.js 
import { defineStore } from "pinia";
import {ref, computed } from 'vue';
import api from '@/services/api';
export const useAuthStore = defineStore('auth',() =>
    {
        /*
        state
        */
        const user = ref(null)
        const error = ref(null)
        const loading = ref(false)
        //pas de email pasword car sont de données temp on aurait pas besoin dans d'autres composants
        /*
        actions
        */
        async function Login(email , password){
            loading.value = true
            try {
                const response = await api.post('/api/auth/login', {email , password}); //api url !! //envoi de l'objet 
                user.value = response.data?.user;
            } catch (err) {
                error.value = err.response?.data?.message || 'Email or password incorrect'; // vérifier que l'api envoie un message
                user.value = null;
            }finally{
                loading.value = false
            }
        };

    /*     async function fetchUser(){ //l'affichage du profile 
            loading.value = true
            try{
                const res = await api.get('/me');
                user.value = res.data?.user;
            }catch(err){
                error.value = err.response?.data?.message || 'connexion failed ';
                user.value = null;
            }finally{
                loading.value = false
            }
        } */

        async function forgotPassword(email){
            loading.value = true
            try {
                 await api.post('/api/auth/reset-password', {email}) //api url !!
                
            } catch (err) {
                error.value = err.response?.data?.message || ' Invalid email '; // vérifier que l'api envoie un message
            }finally{
                loading.value = false
            }
        };

        async function resetPassword( newpassword, confirmpassword){
            loading.value = true
            try {
                 await api.post('/api/auth/reset-pass-email', {newpassword}) //url backend
            } catch (err) {
                error.value = err.response?.data?.message || 'Reset password failed'
            }finally{
                loading.value =false
            }
        };
        function logout() { 
            user.value = null 
             //faire le router .link home lors de clique sur le bouton
        };

        function Clearstatus(){ //pour ne pas laisser les msg d'erreurs ou .. coler dans l'interface 
                    loading.value= false,
                    error.value= null
        }

        const isAuthenticated = computed(()=>!!user.value);
        const errorMsg = computed(()=>error.value);
        const load = computed(()=>loading.value);

        return{
            user, errorMsg,load, Clearstatus, Login,logout,resetPassword, forgotPassword, isAuthenticated
        }
    }
    
    
    
)
