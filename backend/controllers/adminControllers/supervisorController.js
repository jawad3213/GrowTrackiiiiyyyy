const bcrypt = require("bcrypt");
const supervisorModel = require("../../models/adminModels/supervisorModel");
const { v4: uuidv4 } = require("uuid");

exports.createSupervisor = async (req, res) => {
  console.log("Received data:", req.body);
  const { name, cin_sepervisor, email, pass, company, number, position, cin_student,name_internship, date_start, date_done,subject, note } = req.body;

  try {
    const id_user = uuidv4();
    const role = "supervisor";
    const hashedPassword = await bcrypt.hash(pass, 10);

    const supervisors = await supervisorModel.createSupervisor(
      id_user, name, cin_sepervisor, email, hashedPassword, company, number, position, cin_student,name_internship, date_start, date_done,subject, note, role
    );

    res.status(201).json({
      message: "Supervisor added successfully.",
      data: supervisors,
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        error: "The email address already exists. Please use a different email.",
      });
    }
    console.error("Error while adding supervisor:", error.message);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

exports.getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await supervisorModel.getAllSupervisors();

    if (supervisors.length === 0) {
      return res.status(200).json({
        message: "No supervisors found.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Supervisors retrieved successfully.",
      data: supervisors,
    });

  } catch (error) {
    console.error("Error retrieving supervisors:", error);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

exports.getSupervisorByCin = async (req, res) => {
  const { cin } = req.body;

  try {
    const supervisor = await supervisorModel.getSupervisorByCin(cin);

    if (!supervisor) {
      return res.status(404).json({
        message: "Supervisor not found.",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Supervisor retrieved successfully.",
      data: supervisor,
    });

  } catch (error) {
    console.error("Error retrieving supervisor by CIN:", error);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

exports.updateSupervisor = async (req, res) => {
  const userId = req.params.id_supervisor;
  const updates = req.body;

  console.log("ID:", userId);
  console.log("Updates:", updates);

  try {
    const updatedUser = await supervisorModel.updateSupervisorById(userId, updates);

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
    console.error("Error while updating supervisor:", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

exports.deleteSupervisor = async (req, res) => {
  const { id_supervisor } = req.params;

  try {
    const result = await supervisorModel.deleteSupervisorById(id_supervisor);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Supervisor not found.",
      });
    }

    return res.status(200).json({
      message: "Supervisor deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting supervisor:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.getTotalSupervisors = async (req, res) => {
  try {
    const total = await supervisorModel.total();

    return res.status(200).json({
      message: "Total number of supervisors retrieved successfully.",
      data: total,
    });

  } catch (error) {
    console.error("Error retrieving total number of supervisors:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.getSupervisorsByPosition = async (req, res) => {
  const { position } = req.body;

  try {
    const supervisors = await supervisorModel.getSupervisorsByPosition(position);

    return res.status(200).json({
      message: "Supervisors retrieved successfully by class.",
      data: supervisors,
    });

  } catch (error) {
    console.error("Error retrieving supervisors by class:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.getSupervisorsByCompany = async (req, res) => {
  const { company } = req.body;

  try {
    const supervisors = await supervisorModel.getSupervisorsBySector(company);

    return res.status(200).json({
      message: "Supervisors retrieved successfully by sector.",
      data: supervisors,
    });

  } catch (error) {
    console.error("Error retrieving supervisors by sector:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};
