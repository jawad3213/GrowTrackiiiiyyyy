const express = require("express");
const router = express.Router();
const {validate_student,validations,validate} = require("../../validations/adminValidation")
const studentController = require("../../controllers/adminControllers/studentController")
const path = require("path");
const multer = require ("multer");


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

router.post("/create", upload.single('image'),studentController.createStudent);
//,validate_student,validate
router.get("/",studentController.getAllStudents);
router.get("/search",studentController.getStudentByCin);
router.patch("/update/:id_student",studentController.updateStudent);
router.delete("/:id_student",studentController.deleteStudent);
router.get("/total",studentController.getTotalStudents)
router.get("/class",studentController.getStudentsByClass)
router.get("/sector",studentController.getStudentsBySector)


module.exports = router;