const express = require("express");
const router = express.Router();

const classController = require("../../controllers/adminControllers/classController");

// Create a fields ans classes
router.post("/create/:id_admin", classController.createClass);

// Get all fields
router.get("/", classController.getAllSectors);

// Get class by name
router.get("/search", classController.getClassByName);

// Update class
router.patch("/:id_class", classController.updateField);

// Delete class
router.delete("/:id_class", classController.deleteClass);

// Count total classes
router.get("/total", classController.getTotalClasses);

module.exports = router;
