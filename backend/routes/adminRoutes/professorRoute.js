const express = require("express");
const router = express.Router();
const {validate_student,validations,validate} = require("../../validations/adminValidation")
const professorController = require("../../controllers/adminControllers/professorController")
const path = require("path");
const multer = require ("multer");
const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken}=require('../../middlewares/VerifyToken')

router.use(verifyToken)
router.use(verifyRolee("admin"))


// Config multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + file.originalname;
      cb(null, uniqueSuffix);
    },
  });
  const upload = multer({ storage: storage });




router.post("/create", upload.single('image'),professorController.createProfessor);
//,validate_student,validate
router.get("/",professorController.getAllProfessor);
router.get("/search",professorController.getProfessorByCin);
router.patch("/:id_professor",professorController.updateProfessor);
router.delete("/delete/:id_member", upload.single('image'), professorController.deleteProfessor);
router.get("/total",professorController.getTotalProfessors)
router.get("/class",professorController.getProfessorsByClass)
router.get("/sector",professorController.getProfessorsBySector)


module.exports = router;