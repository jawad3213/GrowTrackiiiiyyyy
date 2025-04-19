import { createRouter, createWebHistory } from "vue-router"; 
import LoadingPage from "./components/LoadingPage.vue";
import AboutUs from "./components/AboutUs.vue";
import ContactUs from "./components/ContactUs.vue";
import Teachers from "./components/Teachers.vue";
import Students from "./components/Students.vue";
import Login from "./components/Login.vue";
import resetPassword from "./components/resetPassword.vue";
import forgotPassword from "@/components/forgotPassword.vue";
import check from "./components/check.vue";

const routes = [
    {
        name: 'LoadingPage',
        component: LoadingPage,
        path: '/'
    },
    {
        name: 'AboutUs',
        component: AboutUs,
        path: '/AboutUs'
    },
    {
        name: 'ContactUs',
        component: ContactUs,
        path: '/ContactUs'
    },
    {
        name: 'Teachers',
        component: Teachers,
        path: '/Teachers'
    },
    {
        name: 'Students',
        component: Students,
        path: '/Students'
    },
    {
        name: 'Login',
        component: Login,
        path: '/Login'
    },
    {
        name: "restepass",
        component: resetPassword,
        path:"/resetpass",
    },
    {
        name: "forgotepass",
        component: forgotPassword,
        path:"/forgotpass",
    },
    {
        name: "check",
        component: check,
        path:"/check",
    },

];

const router =createRouter({
    history: createWebHistory(),
    routes
});

export default router