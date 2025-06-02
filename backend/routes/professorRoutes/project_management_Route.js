const express = require("express");
const router = express.Router();
const project_Controller = require('../../controllers/profController/project_management_Controller.js');
const {verifyToken}=require('../../middlewares/VerifyToken.js');

//affichage de tous les evaluations de ce prof 
router.get('/all_project',verifyToken,project_Controller.all_project_Controller);


//delete project by id_project
router.delete('/delete_project/:id_project',verifyToken,project_Controller.delete_project_Controller);

//delete project by id_project
router.post('/add_project',verifyToken,project_Controller.add_project_Controller);

//add group to project
router.post('/add_group/:project_id',verifyToken,project_Controller.add_group_Controller);

//delete group
router.delete('/delete_group/:id_group',verifyToken,project_Controller.delete_group_Controller);


//add member to greoup of project
router.post('/add_member/:id_group',verifyToken,project_Controller.add_member_Controller);

module.exports = router;