//auth.js 
import { defineStore } from "pinia";
import {ref, computed, resolveComponent } from 'vue';
import api from '@/services/api';
export const useAuthStore = defineStore('auth',() =>
    {
        /*
        state
        */
        const user = ref(null)
        const error = ref(null)
        const loading = ref(false)
        const role = ref(null);
        const id = ref(null)
        const valide = ref(false);
        const CookiesAccepted = localStorage.getItem("cookiesAccepted") || document.cookie.includes('cookiesAccepted') || '';

        //pas de email pasword car sont de données temp on aurait pas besoin dans d'autres composants
        /*
        actions
        */
        async function Login(email , password, RememberMe){
            loading.value = true
            try {
                const response = await api.post('/api/auth/login', {email , password, RememberMe},
                    {headers : {
                    'use-cookies': CookiesAccepted
                }}); //api url !! //envoi de l'objet 
                user.value = response.data?.user;
                role.value = response.data?.role;
                localStorage.setItem('username', response.data?.fullname);
                // Set token in localStorage even if the cookies are enabled
                localStorage.setItem('access_token', response.data?.access_token);
                localStorage.setItem('refresh_token', response.data?.refresh_token)
                error.value = null;
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
                 await api.post('/api/auth/reset-password', {email})//api url !!
                 error.value = null;
            } catch (err) {
                error.value = err.response?.data?.message || ' Invalid email '; // vérifier que l'api envoie un message
            }finally{
                loading.value = false
            }
        };

        async function resetPassword(password, token){
            loading.value = true
            try {
                 await api.post(`/api/resetpass?token=${token}`, {password}) 
                 error.value = null;
            } catch (err) {
                error.value = err.response?.data?.message || 'Reset password failed'
            }finally{
                loading.value =false
            }
        };

        async function checkAuth(){
            loading.value = true;
            try {
                const response = await api.get('/api/auth/check')
                role.value = response?.data?.role;
                error.value = null;
                id.value = response?.data?.id
                user.value = response?.status == 200;
                return true
            } catch (err) {
                return false
            }finally{
                loading.value =false
            }
        }

        async function CheckResetToken(token){
            loading.value = true
            try {
                const res = await api.get(`/api/validate-reset-token?token=${token}`);
                error.value = null;
                valide.value = true;
            } catch (err) {
                console.log(err.response?.data?.message);
                valide.value = false;
                error.value = err.response?.data?.message || 'The link is invalide, Please request a new link'
            }finally{
                loading.value =false
            }
        }

        async function logout() {
            loading.value = true
            try {
                await api.post('/api/auth/logout')
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                //url backend
                 user.value = null
                 error.value = null;
            } catch (err) {
                error.value = err.response?.data?.message || 'Logout failed'
            }finally{
                loading.value =false
            }
            
        };

        function Clearstatus(){ //pour ne pas laisser les msg d'erreurs ou .. coler dans l'interface 
                    loading.value= false,
                    error.value= null
        }

        const isAuthenticated = computed(()=>user.value);
        const errorMsg = computed(()=>error.value);
        const load = computed(()=>loading.value);
        const Role = computed(()=>role.value);
        const ID = computed(()=>id.value)
        const validtoken = computed(()=>valide.value)

        return{
            user,
            validtoken,
            ID,
            error,
            Role,
            errorMsg,
            load,
            isAuthenticated,
            checkAuth,
            Clearstatus, 
            Login,
            logout,
            resetPassword, 
            forgotPassword,
            CheckResetToken,
        }
    }
)
