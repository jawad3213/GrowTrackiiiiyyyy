const bcrypt = require("bcrypt");
const professorModel = require("../../models/adminModels/professorModel");
const { v4: uuidv4 } = require("uuid");

// Fonction pour générer l'URL complète de l'image
const generateImageUrl = (path) => {
  return path ? `http://localhost:8080/${path.replace(/\\/g, "/")}` : null;
};

exports.createProfessor = async (req, res) => {
  console.log("Données reçues :", req.body);
  const { name, cin, email, pass, departement, course, code, classe, note } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    // Parse if received as string
    let parsedClasse = classe;
    let parsedCourse = course;

    if (typeof classe === "string") {
      parsedClasse = JSON.parse(classe);
    }

    if (typeof course === "string") {
      parsedCourse = JSON.parse(course);
    }

    // Validation
    if (!Array.isArray(parsedClasse) || !Array.isArray(parsedCourse)) {
      return res.status(400).json({ message: "course and classe must be arrays." });
    }

    if (parsedClasse.length !== parsedCourse.length) {
      return res.status(400).json({ message: "Classes and courses must have the same length." });
    }

    const id_user = uuidv4();
    const role = "Professor";
    const hashedPassword = await bcrypt.hash(pass, 10);

    const professor = await professorModel.createProfessor(
      id_user, name, cin, email, hashedPassword, departement, parsedCourse, code, parsedClasse, note, role, imagePath
    );

    res.status(201).json({
      message: "Professor added successfully.",
      professor,
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        error: "The email address already exists. Please use a different email.",
      });
    }
    console.error("Erreur lors de l'ajout du professor :", error.message);
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

exports.getAllProfessor = async (req, res) => {
  try {
    const professors = await professorModel.getAllProfessor();

    if (professors.length === 0) {
      return res.status(200).json({
        message: "No professor found.",
        data: [],
      });
    }

    // Ajouter l'URL complète pour chaque image
    const updatedProfessors = professors.map(professor => ({
      ...professor,
      profile_picture_url: generateImageUrl(professor.profile_picture),
    }));

    return res.status(200).json({
      message: "Professors retrieved successfully.",
      data: updatedProfessors,
    });

  } catch (error) {
    console.error("Error retrieving professors:", error);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

exports.getProfessorByCin = async (req, res) => {
  const { cin } = req.body;

  try {
    const professor = await professorModel.getProfessorByCin(cin);

    if (!professor) {
      return res.status(404).json({
        message: "Professor not found.",
        data: null
      });
    }

    // Ajouter l'URL de l'image
    professor.profile_picture_url = generateImageUrl(professor.profile_picture);

    return res.status(200).json({
      message: "Professor retrieved successfully.",
      data: professor
    });

  } catch (error) {
    console.error("Error retrieving professor by CIN:", error);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

exports.updateProfessor = async (req, res) => {
  const userId = req.params.id_professor;
  const updates = req.body;

  console.log("ID :", userId);
  console.log("Données :", updates);

  try {
    const updatedUser = await professorModel.updateProfessorById(userId, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: "Professor not found or no fields provided." });
    }

    res.status(200).json({
      message: "Professor updated successfully.",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteProfessor = async (req, res) => {
  const { id_professor } = req.params;

  try {
    const result = await professorModel.deleteProfessorById(id_professor);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Professor not found.",
      });
    }

    return res.status(200).json({
      message: "Professor deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting professor:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.getTotalProfessors = async (req, res) => {
  try {
    const total = await professorModel.total();

    return res.status(200).json({
      message: "Total number of professors retrieved successfully.",
      data: total
    });

  } catch (error) {
    console.error("Error retrieving total number of professors:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.getProfessorsByClass = async (req, res) => {
  const { classe } = req.body;

  try {
    const professors = await professorModel.getProfessorsByClass(classe);

    const updatedProfessors = professors.map(professor => ({
      ...professor,
      profile_picture_url: generateImageUrl(professor.profile_picture),
    }));

    return res.status(200).json({
      message: "Professors retrieved successfully by class.",
      data: updatedProfessors,
    });

  } catch (error) {
    console.error("Error retrieving professors by class:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.getProfessorsBySector = async (req, res) => {
  const { sector } = req.body;

  try {
    const professors = await professorModel.getStudentsBySector(sector);

    const updatedProfessors = professors.map(professor => ({
      ...professor,
      profile_picture_url: generateImageUrl(professor.profile_picture),
    }));

    return res.status(200).json({
      message: "Professors retrieved successfully by sector.",
      data: updatedProfessors,
    });

  } catch (error) {
    console.error("Error retrieving professors by sector:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};
