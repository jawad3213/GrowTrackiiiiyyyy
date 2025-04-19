//stores/auth.js

import { defineStore } from "pinia";
import {ref, computed } from 'vue';
import api from '@/services/api';
export const useAuthStore = defineStore('auth',() =>
    {
        /*
        state
        */
        const user = ref(null)
        const token = ref(localStorage.getItem('token')||null)
        const status = ref({
            login:   { loading: false, error: null, success: null },
            forgot:  { loading: false, error: null, success: null },
            reset:   { loading: false, error: null, success: null }
        })
        //pas de email pasword car sont de données temp on aurait pas besoin dans d'autres composants
        /*
        actions
        */
        async function Login(email , password){
            status.value.login.loading = true
            try {
                const response = await api.post('/login', {email , password}); //api url !! //envoi de l'objet 
                token.value = response.data?.token;
                user.value = response.data?.user;
                localStorage.setItem('token',(token.value))
                status.value.login.success = 'Login successful'//redirection + msg de succée ds composant 
            } catch (error) {
                status.value.login.error = error.response?.data?.message || 'Email or password incorrect'; // vérifier que l'api envoie un message
                token.value = null; // Nettoyer localStorage si login échoue
                user.value = null;
                localStorage.removeItem('token');
            }finally{
                status.value.login.loading = false
            }
        };

        async function forgotPassword(email){
            status.value.forgot.loading = true
            try {
                const response = await api.post(`/reset-password`, {email}); 
                
            } catch (error) {
                status.value.forgot.error = error.response?.data?.message || ' Invalid email '; // vérifier que l'api envoie un message
                
            }finally{
                status.value.forgot.loading = false
            }
        };

        async function resetPassword( newpassword, confirmpassword){
            status.value.reset.loading = true
            try {
                const response = await api.post(`/reset-pass-email`, {newpassword, confirmpassword}) //api url !!
                status.value.reset.success = 'reset passord successful'//redirection vers login 
            } catch (error) {
                status.value.reset.error = error.response?.data?.message || 'Reset password failed'
            }finally{
                status.value.reset.loading =false
            }
        };
        function logout() {  //redirection déja dans api.js
            token.value= null
            user.value = null 
            localStorage.removeItem('token') //faire le router .link home lors de clique sur le bouton
        };

        function Clearstatus(){ //pour ne pas laisser les msg d'erreurs ou .. colser dans l'interface 
            for( const page in status.value){
                status.value[page] = {
                    loading: false,
                    error: null,
                    success: null
                }
            }
        }

        const isAuthenticated = computed(()=>!!token.value);

        return{
            user, token,status, Clearstatus, Login,logout,resetPassword, forgotPassword, isAuthenticated
        }
    }
    
    
    
)
