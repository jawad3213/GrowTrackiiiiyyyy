import { createRouter, createWebHistory } from "vue-router"; 
import LoadingPage from "@/components/Home/LoadingPage.vue";
import AboutUs from "./components/AboutUs.vue";
import ContactUs from "./components/ContactUs.vue";
//import Teachers from "./components/Home/Teachers.vue";
import Students from "./components/Home/Students.vue";
import Login from "./components/Login.vue";
import resetPassword from "./components/resetPassword.vue";
import forgotPassword from "@/components/forgotPassword.vue";
import check from "./components/check.vue";
import Skills from "./components/Menu/Skills.vue";
import Supervisor from "./components/Menu/Supervisor.vue";
import Group from "./components/Menu/Group.vue";
import Professor from "./components/Menu/Professor.vue";
import Student from "./components/Menu/Student.vue";
import AddStudentModal from "./components/AddStudentModal.vue";
import dashboard from "./components/dashboard.vue";
import Calendar from "./components/Menu/Calendar.vue";
import UserProfile from "./components/Menu/UserProfile.vue";
import GlobalOverview from "./components/Menu/GlobalOverview.vue";
import Signals from "./components/Menu/Signals.vue";
import Coach from "./components/Menu/Coach.vue";

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
    {
        name: "Skills",
        component: Skills,
        path:"/Skills",
    },
    {
        name: "Group",
        component: Group,
        path:"/Group",
    },
    {
        name: "Professor",
        component: Professor,
        path:"/Professor",
    },

    {
        name: "Supervisor",
        component: Supervisor,
        path:"/Supervisor",
    },
    {
        name: "Student",
        component: Student,
        path:"/Student",
    },
    {
        name: "AddStudentModal",
        component: AddStudentModal,
        path:"/AddStudent",
    },
    {
        name : "dashboard",
        component : dashboard,
        path : "/dashboard",
    },
    {
        name : "Calendar",
        component : Calendar,
        path : "/Calendar",
    },
    {
        name : "UserProfile",
        component : UserProfile,
        path : "/UserProfile",
    },
    {
        name : "GlobalOverview",
        component : GlobalOverview,
        path : "/GlobalOverview",
    },
    {
        name : "Signals",
        component : Signals,
        path : "/Signals",
    },
    {
        name : "Coach",
        component : Coach,
        path : "/Coach",
    },
    {
        path: '/reset-pass-email',
        name: 'ResetPassword',
        component: resetPassword,
    },
];

const router =createRouter({
    history: createWebHistory(),
    routes
});

export default router