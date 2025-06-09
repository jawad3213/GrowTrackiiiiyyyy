const express = require("express");
const router = express.Router();
const project_Controller = require('../../controllers/profController/project_management_Controller.js');
const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken}=require('../../middlewares/VerifyToken')

router.use(verifyToken)
router.use(verifyRolee("Professor"))

//affichage de tous les evaluations de ce prof 
router.get('/all_project',project_Controller.all_project_Controller);

//avoir les groupes du projet
router.get('/all_group/:id_project',project_Controller.all_group_Controller);

//delete group
router.delete('/delete_group/:id', project_Controller.delete_team_Controller);

//delete project by id_project
router.delete('/delete_project/:id_project',project_Controller.delete_project_Controller);

//edit project (start date) (nombre de mois)
router.patch('/update_project/:id', project_Controller.update_project_Controller);

//delete project by id_project
router.post('/add_project',project_Controller.add_project_Controller);

//add group to project
router.post('/add_group/:project_id',project_Controller.add_group_Controller);

//delete group
router.delete('/delete_group/:id_group',project_Controller.delete_group_Controller);

//add member to greoup of project
router.post('/add_member/:id_group',project_Controller.add_member_Controller);

//get group member
router.get('/all_member/:id_group',project_Controller.all_member_Controller);


module.exports = router;