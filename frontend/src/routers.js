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
import Skills from "./components/Menu/Skills.vue";
import Supervisor from "./components/Menu/Supervisor.vue";
import Group from "./components/Menu/Group.vue";
import Professor from "./components/Menu/Professor.vue";
import Student from "./components/Menu/Student.vue";
import dashboard from "./components/dashboard.vue";
import Calendar from "./components/Menu/Calendar.vue";
import UserProfile from "./components/Menu/UserProfile.vue";
import GlobalOverview from "./components/Menu/GlobalOverview.vue";
import Signals from "./components/Menu/Signals.vue";
import Coach from "./components/Menu/Coach.vue";
import AddCoach from "./components/AddCoach.vue";
import AddField from "./components/AddField.vue";
import AddProfessorModal from "./components/AddProfessorModal.vue";
import AddSkill from "./components/AddSkill.vue";
import DeleteSkill from "./components/DeleteSkill.vue"
import AddStudentModal from "./components/AddStudentModal.vue";
import AddSupervisorModal from "./components/AddSupervisorModal.vue";
import Evaluation from "./components/Evaluation.vue";
import Personalized from "./components/Personalized.vue";
import Solution from "./components/Solution.vue";
import DeleteStudent from "./components/DeleteStudent.vue";
import SignalEvaluationModal from "./components/SignalEvaluationModal.vue";
import DashboardProf from "./components/DashboardProf.vue";

import ClassesEval from "./components/MenuProf/ClassesEval/ClassesEval.vue";
import ClassesSignal from "./components/MenuProf/signal/ClassesSignal.vue";


import HistoriqueEval from "./components/MenuProf/ClassesEval/HistoriqueEval.vue";
import HistoriqueSignal from "./components/MenuProf/signal/HistoriqueSignal.vue";
import ProjectMang from "./components/MenuProf/ProjectMang.vue";
import Rapport from "./components/MenuProf/Rapport.vue";
import Notification from "./components/MenuProf/Notification.vue";
import AddProject from "./components/MenuProf/AddProject.vue";
import AddMembers from "./components/MenuProf/AddMembers.vue";
import NewSignal from "./components/MenuProf/signal/NewSignal.vue";
import ViewHistory from "./components/MenuProf/signal/ViewHistory.vue";
import SolutionSignal from "./components/MenuProf/signal/SolutionSignal.vue";
import SolutionErrror from "./components/MenuProf/signal/SolutionErrror.vue";

import ChooseSkills from "./components/MenuProf/ClassesEval/ChooseSkills.vue";
import SkillsChoosen from "./components/MenuProf/ClassesEval/SkillsChoosen.vue";
import courseEvaluation from "./components/MenuProf/ClassesEval/courseEvaluation.vue";
import EndEval from "./components/MenuProf/ClassesEval/EndEval.vue";
import Thanku from "./components/MenuProf/ClassesEval/Thanku.vue";
import ViewEval from "./components/MenuProf/ClassesEval/ViewEval.vue";
import ProjectDetails from "./components/MenuProf/ProjectDetails.vue";

import CompletionRate from "./components/MenuStudent/dashStudent/CompletionRate.vue";
import StudEvals from "./components/MenuStudent/Evaluations/StudEvals.vue";
import dashstud from "./components/MenuStudent/dashStudent/dashstud.vue";
import StudProjects from "./components/MenuStudent/Evaluations/StudProjects.vue";
import StudSignals from "./components/MenuStudent/Evaluations/StudSignals.vue";
import skillsChoseen from "./components/MenuStudent/SelfEval/skillsChoseen.vue";
import evalSkills from "./components/MenuStudent/SelfEval/evalSkills.vue";
import skillsEnd from "./components/MenuStudent/SelfEval/skillsEnd.vue";
import end from "./components/MenuStudent/SelfEval/end.vue";

import StudRapport from "./components/MenuStudent/StudRapport.vue";
import StudNotif from "./components/MenuStudent/StudNotif.vue";
import StudSolution from "./components/MenuStudent/StudSolution.vue";
import StudReason from "./components/MenuStudent/StudReason.vue";
import selfEval from "./components/MenuStudent/selfEval.vue";



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
        path: '/Login',
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
        name : "dashboard",
        component : dashboard,
        path : "/dashboard",
        meta: { requiresAuth: true },
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
        name : "AddCoach",
        component : AddCoach,
        path : "/AddCoach",
    },
    
    {
        name : "AddField",
        component : AddField,
        path : "/AddField",
    },
    {
        name : "AddProfessorModal",
        component : AddProfessorModal,
        path : "/AddProfessor",
    },
    {
        name : "AddSkill",
        component : AddSkill,
        path : "/AddSkill",
    },
    {
        name : "EditSkill",
        component : AddSkill,
        path : "/AddSkill/:skill_name",
        props: true,
        meta: {edit:true},
    },
    {
        name : "DeleteSkill",
        component : DeleteSkill,
        path : "/DeleteSkill/:skill_name",
        props: true,
        meta: {edit:true},
    },
    {
        name : "AddStudentModal",
        component : AddStudentModal,
        path : "/AddStudent"
    },
    {
        name : "EditStudentModal",
        component : AddStudentModal,
        path : "/AddStudent/:cin",
        props: true,
        meta: {edit:true},
    },
    {
        name : "AddSupervisorModal",
        component : AddSupervisorModal,
        path : "/AddSupervisor",
    },
    {
        name : "Evaluation",
        component : Evaluation,
        path : "/Evaluation",
    },
    {
        name : "Personalized",
        component : Personalized,
        path : "/Personalized",
    },
    {
        name : "SignalModal",
        component : SignalEvaluationModal,
        path : "/SignalModal",
    },
    {
        name : "Solution",
        component : Solution,
        path : "/Solution",
    },

    {
        name : "DeleteStudent",
        component : DeleteStudent,
        path : "/DeleteStudent/:id_member"
    },
    {
        name : "DashboardProf",
        component : DashboardProf,
        path : "/DashboardProf"
    },
    {
        name : "ClassesEval",
        component : ClassesEval,
        path : "/ClassesEval"
    },
    {
        name : "HistoriqueEval",
        component : HistoriqueEval,
        path : "/HistoriqueEval"
    },
    {
        name : "ProjectMang",
        component : ProjectMang,
        path : "/ProjectMang"
    },
    {
        name : "ClassesSignal",
        component : ClassesSignal,
        path : "/ClassesSignal"
    },
    {
        name : "HistoriqueSignal",
        component : HistoriqueSignal,
        path : "/HistoriqueSignal"
    },
    
    {
        name : "Rapport",
        component : Rapport,
        path : "/Rapport"
    },
    {
        name : "Notification",
        component : Notification,
        path : "/Notification"
    },
    {
        name : "AddProject",
        component : AddProject,
        path : "/AddProject"
    },
    {
        name : "AddMembers",
        component : AddMembers,
        path : "/AddMembers"
    },
    {

        name : "NewSignal",
        component : NewSignal,
        path : "/newsignal"
    },
    {
        name : "ViewHistory",
        component : ViewHistory,
        path : "/viewhistory"
    },
    {
        name : "SolutionSignal",
        component : SolutionSignal,
        path : "/SolutionSignal"
    },
    {
        name : "SolutionError",
        component : SolutionErrror,
        path : "/SolutionError"
    },

    {
        name : "ChooseSkills",
        component : ChooseSkills,
        path : "/ChooseSkills"
    },
    {
        name : "SkillsChoosen",
        component : SkillsChoosen,
        path : "/SkillsChoosen"
    },
    {
        name : "courseEvaluation",
        component : courseEvaluation,
        path : "/courseEvaluation"
    },
    {
        name : "EndEval",
        component : EndEval,
        path : "/EndEval"
    },
    {
        name : "Thanku",
        component : Thanku,
        path : "/Thanku"
    },
    {
        name : "ViewEval",
        component : ViewEval,
        path : "/ViewEval"
    },
     {
        name : "StudEvals",
        component : StudEvals,
        path : "/StudEvals"
    },
     {
        name : "StudProject",
        component : StudProjects,
        path : "/StudProject"
    },
     {
        name : "StudRapport",
        component : StudRapport,
        path : "/StudRapport"
    },
     {
        name : "StudSignals",
        component : StudSignals,
        path : "/StudSignals"
    },
     {
        name : "StudNotif",
        component : StudNotif,
        path : "/StudNotif"
    },
     {
        name : "skillsChoseen",
        component : skillsChoseen,
        path : "/skillsChoseen"
    },
     {
        name : "evalSkills",
        component : evalSkills,
        path : "/evalSkills"
    },
     {
        name : "StudSolution",
        component : StudSolution,
        path : "/StudSolution"
    },
     {
        name : "StudReason",
        component : StudReason,
        path : "/StudReason"
    },
    {
        name : "skillsEnd",
        component : skillsEnd,
        path : "/skillsEnd"
    },
    {
        name : "end",
        component : end,
        path : "/end"
    },
    {
        name : "CompletionRate",
        component : CompletionRate,
        path : "/CompletionRate"
    },
    {
        name : "dashstud",
        component : dashstud,
        path : "/dashstud"
    },
    {
        name : "selfEval",
        component : selfEval,
        path : "/selfEval"
    },
{
        name : "ProjectDetails",
        component : ProjectDetails,
        path : "/ProjectDetails"
    },

    
];

const router =createRouter({
    history: createWebHistory(),
    routes
});

import {useAuthStore} from '@/stores/auth'

router.beforeEach(async (to, from, next)=>{
    const auth = useAuthStore();
    if(to?.meta.requiresAuth){
        try {
          await auth.checkAuth();
          next();
        } catch (error) {
        console.log('error de check', error)
          next('/Login'); // Token not OK
        }
      } else {
        next();
      }
});

export default router