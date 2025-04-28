
const classModel = require("../../models/adminModels/classModel");

exports.createClass = async (req, res) => {
  const { field, description, classe } = req.body;
  const {id_admin} = req.params;

  try {
    if (!Array.isArray(classe)) {
      return res.status(400).json({ message: "Classe must be an array." });
    }

    const newClass = await classModel.createClass(field, description, classe,id_admin);

    res.status(201).json({
      message: "Class created successfully.",
      data: newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getAllSectors = async (req, res) => {
  try {
    const classes = await classModel.getAllSectors();
    res.status(200).json({
      message: "Classes retrieved successfully.",
      data: classes,
    });
  } catch (error) {
    console.error("Error retrieving classes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getClassByName = async (req, res) => {
  const { name } = req.body;

  try {
    const foundClass = await classModel.getClassByName(name);

    if (!foundClass) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json({
      message: "Class retrieved successfully.",
      data: foundClass,
    });
  } catch (error) {
    console.error("Error retrieving class:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.updateField = async (req, res) => {
  const classId = req.params.id_class;
  const updates = req.body;

  try {
    const updatedClass = await classModel.updateFieldById(classId, updates);

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found or no data provided." });
    }

    res.status(200).json({
      message: "Class updated successfully.",
      data: updatedClass,
    });
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteClass = async (req, res) => {
  const { id_class } = req.params;

  try {
    const result = await classModel.deleteClassById(id_class);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json({ message: "Class deleted successfully." });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getTotalClasses = async (req, res) => {
  try {
    const total = await classModel.totalClasses();
    res.status(200).json({
      message: "Total number of classes retrieved successfully.",
      data: total,
    });
  } catch (error) {
    console.error("Error retrieving total classes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
