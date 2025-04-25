const express = require("express");
const router = express.Router();

const classController = require("../../controllers/adminControllers/classController");

// Create a class
router.post("/create", classController.createClass);

// Get all classes
router.get("/", classController.getAllClasses);

// Get class by name
router.get("/search", classController.getClassByName);

// Update class
router.patch("/:id_class", classController.updateClass);

// Delete class
router.delete("/:id_class", classController.deleteClass);

// Count total classes
router.get("/total", classController.getTotalClasses);

module.exports = router;
