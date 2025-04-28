import {  createRouter, createWebHistory } from "vue-router";
import login from "../components/login.vue";
import resetPassword from "../components/resetPassword.vue";
import home from "../components/home.vue";
import forgotPassword from "../components/forgotPassword.vue";
import check from "../components/check.vue";
import contactUs from "../components/contactUs.vue";
import Header from "../components/Header.vue";
import AddStudentModal from "@/components/AddStudentModal.vue";
import AddProfessorModal from "@/components/AddProfessorModal.vue";
import AddSupervisorModal from "@/components/AddSupervisorModal.vue";
import AddSkill from "@/components/AddSkill.vue";
import signal from "@/components/signal.vue";
import AddCoach from "@/components/AddCoach.vue";
import AddField from "@/components/AddField.vue";

const routes = [
    {
        name: "Home",
        component: home,
        path:"/",

    },
    {
        name: "login",
        component: login,
        path:"/login",
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
        name: "contactUs",
        component: contactUs,
        path:"/contactUs",
    },
    {
        name: "Header",
        component: Header,
        path:"/Header",
    },
    {
        name: "AddStudent",
        component: AddStudentModal,
        path:"/AddStudent",
    },
    {
        name: "AddProfessor",
        component: AddProfessorModal,
        path:"/AddProfessor",
    },
    {
        name: "AddSupervisor",
        component: AddSupervisorModal,
        path:"/AddSupervisor",
    },
    {
        name: "AddSkill",
        component: AddSkill,
        path:"/AddSkill",
    },
    {
        name: "AddCoach",
        component: AddCoach,
        path:"/AddCoach",
    },
    {
        name: "AddField",
        component: AddField,
        path:"/AddField",
    },
    {
        name: "signal",
        component: signal,
        path:"/signal",
    },
];

const router = createRouter({
    history:createWebHistory(),
    routes,
});

export default router;