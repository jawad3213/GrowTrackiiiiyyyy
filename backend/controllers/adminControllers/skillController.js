
const skillModel = require("../../models/adminModels/skillModel");


exports.createSkill = async (req, res) => {

  console.log("Received data:", req.body);
  const { skill_name, question1, question2, question3,desciption_skill} = req.body;
  const { id_admin } = req.params;

  try {
    const skills = await skillModel.createSkill(
        skill_name, question1, question2, question3, id_admin,desciption_skill
    );

    res.status(201).json({
      message: "Skill added successfully.",
      data: skills,
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        error: "The email address already exists. Please use a different email.",
      });
    }
    console.error("Error while adding skill:", error.message);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await skillModel.getAllSkills();

    if (skills.length === 0) {
      return res.status(200).json({
        message: "No skills found.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Skills retrieved successfully.",
      data: skills,
    });

  } catch (error) {
    console.error("Error retrieving skills:", error);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

exports.updateSkill = async (req, res) => {
  const userId = req.params.id_skill;
  const updates = req.body;

  console.log("ID:", userId);
  console.log("Updates:", updates);

  try {
    const updatedUser = await skillModel.updateSkillById(userId, updates);

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found or no fields provided.",
      });
    }

    res.status(200).json({
      message: "User updated successfully.",
      data: updatedUser,
    });

  } catch (err) {
    console.error("Error while updating skill:", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

exports.deleteSkill = async (req, res) => {
  const { id_skill } = req.params;

  try {
    const result = await skillModel.deleteSkillById(id_skill);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Skill not found.",
      });
    }

    return res.status(200).json({
      message: "Skill deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting skill:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.getTotalSkills = async (req, res) => {
  try {
    const total = await skillModel.total();

    return res.status(200).json({
      message: "Total number of skills retrieved successfully.",
      data: total,
    });

  } catch (error) {
    console.error("Error retrieving total number of skills:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};