import { createRouter, createWebHistory } from "vue-router"; 
import LoadingPage from "@/components/Home/LoadingPage.vue";
import AboutUs from "./components/AboutUs.vue";
import ContactUs from "./components/ContactUs.vue";
import TeachersGenralpage from "./components/Home/Teachers.vue";
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
import DeleteProf from "./components/DeleteProf.vue";
import DeleteSupervisor from "./components/DeleteSupervisor.vue";

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
import Team from "./components/Team.vue";
import Error from "./components/Error.vue";
import AddMemberForm from "./components/AddMemberForm.vue";

import GroupMembers from "@/components/MenuProf/GroupMembers.vue";
import GeneratePdf from "@/components/GeneratePdf.vue";


const routes = [
    {
        name: 'LoadingPage',
        component: LoadingPage,
        path: '/'
    },
    {
        name: 'Error',
        component: Error,
        path: '/Error'
    },
    {
        name: "OurTeam",
        component: Team,
        path:"/OurTeam",
        meta :{DoNotrequiresAuth: true}
    },
    {
        name: 'ContactUs',
        component: ContactUs,
        path: '/ContactUs',
        meta :{DoNotrequiresAuth: true}
    },
    {
        name: 'TeachersGenralpage',
        component: TeachersGenralpage,
        path: '/Teachers',
        meta :{DoNotrequiresAuth: true}
    },
    {
        name: 'Students general page ',
        component: Students,
        path: '/Students',
        meta :{DoNotrequiresAuth: true}
    },
    {
        name: 'Login',
        component: Login,
        path: '/Login',
        meta :{DoNotrequiresAuth: true}
    },
    {
        name: "restepass",
        component: resetPassword,
        path:"/resetpass",
        meta :{DoNotrequiresAuth: true}
    },
    {
        name: "forgotepass",
        component: forgotPassword,
        path:"/forgotpass",
        meta :{DoNotrequiresAuth: true}
    },
    {
        name: "check",
        component: check,
        path:"/check",
        meta :{DoNotrequiresAuth: true}
    },
    {
        name: "AddSupervisorModal ",
        component: AddSupervisorModal ,
        path:"/AddSupervisorModal",
        meta :{role: 'admin'}
    },
    {
        name: "Skills",
        component: Skills,
        path:"/Skills",
        meta :{role: 'admin'}
    },
    {
        name: "Group",
        component: Group,
        path:"/Group",
        meta :{role: 'admin'}
    },
    {
        name: "Professor",
        component: Professor,
        path:"/Professor",
        meta :{role: 'admin'}
    },

    {
        name: "Supervisor",
        component: Supervisor,
        path:"/Supervisor",
        meta :{role: 'admin'}
    },
    {
        name: "Student",
        component: Student,
        path:"/Student",
        meta :{role: 'admin'}
    },
    {
        name : "dashboard",
        component : dashboard,
        path : "/dashboard",
        meta :{role: 'admin'}
    },
    {
        name : "Calendar",
        component : Calendar,
        path : "/Calendar",
        meta :{role: 'admin'}
    },
    {
        name : "UserProfile",
        component : UserProfile,
        path : "/UserProfile",
        meta :{role: 'admin'}
    },
    {
        name : "GlobalOverview",
        component : GlobalOverview,
        path : "/GlobalOverview",
        meta :{role: 'admin'}
    },
    
    {
        name : "Signals",
        component : Signals,
        path : "/Signals",
        meta :{role: 'admin'}
    },
    {
        name : "Coach",
        component : Coach,
        path : "/Coach",
        meta :{role: 'admin'}
    },
    {
        name : "AddCoach",
        component : AddCoach,
        path : "/AddCoach",
        meta :{role: 'admin'}
    },
    {
        name : "GeneratePdf",
        component : GeneratePdf,
        path : "/gen",
    },
    
{
  path: '/AddMember/:id_group',
  name: 'AddMember',
  component: AddMemberForm,
  props: true,
  meta :{role: 'Professor'}
},
 {// This route MUST exist for goToAddMember()
    path: '/GroupMembers/:id_group',
    name: 'GroupMembers',
    component: GroupMembers,
    meta :{role: 'Professor'}
  },  
    {
        name : "AddField",
        component : AddField,
        path : "/AddField",
        meta :{role: 'admin'}
    },
    
    {
        name : "EditCoach",
        component : EditCoach,
        path : "/EditCoach/:id_coach",
        props: true,
        meta: {edit:true},
    },
    {
        name : "AddProfessorModal",
        component : AddProfessorModal,
        path : "/AddProfessor",
        meta :{role: 'admin'}
    },
    
    
    {
        name : "AddSkill",
        component : AddSkill,
        path : "/AddSkill",
        meta :{role: 'admin'}
    },
    {
        name : "EditSkill",
        component : AddSkill,
        path : "/AddSkill/:skill_name",
        props: true,
        meta: {edit:true, role: 'admin'},
    },
    {
        name : "DeleteSkill",
        component : DeleteSkill,
        path : "/DeleteSkill/:skill_name",
        props: true,
        meta: {edit:true, role: 'admin'},
    },
    {
        name : "AddStudentModal",
        component : AddStudentModal,
        path : "/AddStudent",
        meta :{role: 'admin'}
    },
    {
        name : "EditStudentModal",
        component : AddStudentModal,
        path : "/AddStudent/:cin",
        props: true,
        meta: {edit:true, role:'admin'},
    },
    {
        name : "AddSupervisorModal",
        component : AddSupervisorModal,
        path : "/AddSupervisor",
        meta :{role: 'admin'}
    },
    {
        name : "Evaluation",
        component : Evaluation,
        path : "/Evaluation",
        meta :{role: 'admin'}
    },
    {
        name : "Personalized",
        component : Personalized,
        path : "/Personalized",
        meta :{role: 'admin'}
    },
    {
        name : "SignalModal/:id",
        component : SignalEvaluationModal,
        path : "/SignalModal",
        props: true,
        meta :{role: 'admin'}
    },
    {
        name : "Solution",
        component : Solution,
        path : "/Solution",
        meta :{role: 'admin'}
    },

    {
        name : "DeleteStudent",
        component : DeleteStudent,
        path : "/DeleteStudent/:id_member",
        meta :{role: 'admin'}
    },
    {
        name : "DeleteProf",
        component : DeleteProf,
        path : "/Deleteprof/:id_member",
        meta :{role: 'admin'}
    },
    {
        name : "DeleteSupervisor",
        component : DeleteSupervisor,
        path : "/DeleteSupervisor/:id_member",
        meta :{role: 'admin'}
    },
    {
        name : "DashboardProf",
        component : DashboardProf,
        path : "/DashboardProf",
        meta :{role: 'Professor'}
    },
    {
        name : "ClassesEval",
        component : ClassesEval,
        path : "/ClassesEval",
        meta :{role: 'Professor'}
    },
    {
        name : "HistoriqueEval",
        component : HistoriqueEval,
        path : "/HistoriqueEval",
        meta :{role: 'Professor'}
    },
    {
        name : "ProjectMang",
        component : ProjectMang,
        path : "/ProjectMang",
        meta :{role: 'Professor'}
    },
    {
    name : "ClassesSignal",
    component : ClassesSignal,
    path : "/ClassesSignal",
    meta : { role: 'Professor' }
    },
    {
        name : "HistoriqueSignal",
        component : HistoriqueSignal,
        path : "/HistoriqueSignal",
        meta : { role: 'Professor' }
    },
    {
        name : "Rapport",
        component : Rapport,
        path : "/Rapport",
        meta : { role: 'Professor' }
    },
    {
        name : "Notification",
        component : Notification,
        path : "/Notification",
        meta : { role: 'Professor' }
    },
    {
        name : "AddProject",
        component : AddProject,
        path : "/AddProject",
        meta : { role: 'Professor' }
    },
    {
        name : "AddMembers",
        component : AddMembers,
        path : "/AddMembers",
        meta : { role: 'Professor' }
    },
    {
        name : "NewSignal",
        component : NewSignal,
        path : "/newsignal",
        meta : { role: 'Professor' }
    },
    {
        name : "ViewHistory",
        component : ViewHistory,
        path : "/viewhistory",
        meta : { role: 'Professor' }
    },
    {
        name : "SolutionSignal",
        component : SolutionSignal,
        path : "/SolutionSignal",
        meta : { role: 'Professor' }
    },
    {
        name : "SolutionError",
        component : SolutionErrror,
        path : "/SolutionError",
        meta : { role: 'Professor' }
    },
    {
        name : "ChooseSkills",
        component : ChooseSkills,
        path : "/ChooseSkills",
        meta : { role: 'Professor' }
    },
    {
        name : "SkillsChoosen",
        component : SkillsChoosen,
        path : "/SkillsChoosen",
        meta : { role: 'Professor' }
    },
    {
        name : "courseEvaluation",
        component : courseEvaluation,
        path : "/courseEvaluation",
        meta : { role: 'Professor' }
    },
    {
        name : "EndEval",
        component : EndEval,
        path : "/EndEval",
        meta : { role: 'Professor' }
    },
    {
        name : "Thanku",
        component : Thanku,
        path : "/Thanku",
        meta : { role: 'Professor' }
    },
    {
        name : "ViewEval",
        component : ViewEval,
        path : "/ViewEval",
        meta : { role: 'Professor' }
    }
    ,
     {
        name : "StudEvals",
        component : StudEvals,
        path : "/StudEvals",
        meta : { role: 'student' }
        }, 
    {
        name : "StudProject",
        component : StudProjects,
        path : "/StudProject",
        meta : { role: 'student' }
    },
    {
        name : "StudRapport",
        component : StudRapport,
        path : "/StudRapport",
        meta : { role: 'student' }
    },
    {
        name : "StudSignals",
        component : StudSignals,
        path : "/StudSignals",
        meta : { role: 'student' }
    },
    {
        name : "StudNotif",
        component : StudNotif,
        path : "/StudNotif",
        meta : { role: 'student' }
    },
    {
        name : "skillsChoseen",
        component : skillsChoseen,
        path : "/skillsChoseen",
        meta : { role: 'student' }
    },
    {
        name : "evalSkills",
        component : evalSkills,
        path : "/evalSkills",
        meta : { role: 'student' }
    },
    {
        name : "StudSolution",
        component : StudSolution,
        path : "/StudSolution",
        meta : { role: 'student' }
    },
    {
        name : "StudReason",
        component : StudReason,
        path : "/StudReason",
        meta : { role: 'student' }
    },
    {
        name : "skillsEnd",
        component : skillsEnd,
        path : "/skillsEnd",
        meta : { role: 'student' }
    },
    {
        name : "end",
        component : end,
        path : "/end",
        meta : { role: 'student' }
    },
    {
        name : "CompletionRate",
        component : CompletionRate,
        path : "/CompletionRate",
        meta : { role: 'student' }
    },
    {
        name : "dashstud",
        component : dashstud,
        path : "/dashstud",
        meta : { role: 'student' }
    },
    {
        name : "selfEval",
        component : selfEval,
        path : "/selfEval",
        meta : { role: 'student' }
    }
    ,
    {
        name : "ProjectDetails",
        component : ProjectDetails,
        path : "/ProjectDetails",
        meta :{role: 'Professor'}
    },

    
];

const router =createRouter({
    history: createWebHistory(),
    routes
});

import {useAuthStore} from '@/stores/auth'
import EditCoach from "./components/EditCoach.vue";


router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();
    if (to?.meta?.DoNotrequiresAuth) {
        return next();
    }
    if (!auth.isAuthenticated) {
        try {
            await auth.checkAuth();
            if (to?.meta?.role && to.meta.role !== auth.Role) {
                return next('/Error');
            }
            return next();

        } catch (error) {
            console.log('Authentication check failed:', error);
            return next('/Login');
        }
    } else {
        if (to?.meta?.role && to.meta.role !== auth.Role) {
            return next('/Error');
        }
        return next();
    }
});

export default router