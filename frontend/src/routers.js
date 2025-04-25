import { createRouter, createWebHistory } from "vue-router"; 
import LoadingPage from "@/components/Home/LoadingPage.vue";
import AboutUs from "./components/AboutUs.vue";
import ContactUs from "./components/ContactUs.vue";
import Teachers from "./components/Home/Teachers.vue";
import Students from "./components/Home/Students.vue";
import Login from "./components/Login.vue";
import resetPassword from "./components/resetPassword.vue";
import forgotPassword from "@/components/forgotPassword.vue";
import check from "./components/check.vue";
import Skills from "./components/Dash1/Skills.vue";
import Supervisor from "./components/Dash1/Supervisor.vue";
import Group from "./components/Dash1/Group.vue";
import Professor from "./components/Dash1/Professor.vue";
import Student from "./components/Dash1/Student.vue";
import Departement from "./components/Dash1/Departement.vue";
import AddStudentModal from "./components/AddStudentModal.vue";
import dashboard from "./components/dashboard.vue";
import Calendar from "./components/Others/Calendar.vue";
import UserProfile from "./components/Others/UserProfile.vue";
import GlobalOverview from "./components/Dash1/GlobalOverview.vue";
import Signals from "./components/Dash1/Signals.vue";
import Coach from "./components/Dash1/Coach.vue";

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
        name: "Departement",
        component: Departement,
        path:"/Departement",
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
];

const router =createRouter({
    history: createWebHistory(),
    routes
});

export default router