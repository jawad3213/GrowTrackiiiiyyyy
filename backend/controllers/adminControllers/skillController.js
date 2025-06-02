const skillModel = require("../../models/adminModels/skillModel");

exports.createSkill = async (req, res) => {
  console.log("Received data:", req.body);

  const { skill_name, question1, question2, question3, description_skill, id_admin } = req.body;

  try {
    const skill = await skillModel.createSkill(
      skill_name,
      question1,
      question2,
      question3,
      description_skill,
      id_admin
    );

    return res.status(201).json({
      message: "Skill created successfully.",
      data: skill,
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        error: "Skill already exists. Please choose a different skill name.",
      });
    }
    console.error("Error creating skill:", error.message);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await skillModel.getAllSkills();

    return res.status(200).json({
      message: skills.length ? "Skills retrieved successfully." : "No skills found.",
      data: skills,
    });

  } catch (error) {
    console.error("Error retrieving skills:", error.message);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.updateSkill = async (req, res) => {
  const { skill_name } = req.params;
  const updates = req.body;

  console.log("Update fields:", updates);

  try {
    const updatedSkill = await skillModel.updateSkillById(skill_name, updates);
    console.log(updatedSkill)

    if (!updatedSkill) {
      return res.status(404).json({
        message: "Skill not found or no fields provided for update.",
      });
    }

    return res.status(200).json({
      message: "Skill updated successfully.",
      data: updatedSkill,
    });

  } catch (error) {
    console.error("Error updating skill:", error.message);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.deleteSkill = async (req, res) => {
  const { skill_name } = req.params;

  try {
    const result = await skillModel.deleteSkillById(skill_name);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Skill not found.",
      });
    }

    return res.status(200).json({
      message: "Skill deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting skill:", error.message);
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
    console.error("Error retrieving total number of skills:", error.message);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};
