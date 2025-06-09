const express = require("express");
const router = express.Router();

const classController = require("../../controllers/adminControllers/classController");

const verifyRolee = require('../../middlewares/verificationRole');
const {verifyToken}=require('../../middlewares/VerifyToken')

router.use(verifyToken)
router.use(verifyRolee("admin"))


// Create a fields ans classes
router.post("/create", classController.createClass);

// Get all fields
router.get("/", classController.getAllSectors);

// Get class by name
router.get("/search", classController.getClassByName);

// Update class
router.patch("/:id_field", classController.updateField);

// Delete class
router.delete("/delete/:id_class", classController.deleteClass);

// Count total classes
router.get("/total", classController.getTotalfield);

module.exports = router;
