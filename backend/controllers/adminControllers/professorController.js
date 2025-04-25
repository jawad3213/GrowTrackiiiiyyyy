//const express = require("express");
const bcrypt = require("bcrypt");
const professorModel = require("../../models/adminModels/professorModel");
const { v4: uuidv4 } = require("uuid");

exports.createProfessor = async (req, res) => {
    console.log("Données reçues :", req.body);
  const { name, cin, email, pass,departement, course, code, classe, note } = req.body;

  try {
    const id_user = uuidv4();
    const role = "professor";
    const hashedPassword = await bcrypt.hash(pass, 10);

    const professors = await professorModel.createProfessor(id_user, name, cin, email, hashedPassword,departement, course, code, classe, note, role);

    res.status(201).json({
      message: "professor added successfully.",
      professors,
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
  
      return res.status(200).json({
        message: "professor retrieved successfully.",
        data: professors,
      });
  
    } catch (error) {
      console.error("Error retrieving professor:", error);
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
          message: "professor not found.",
          data: null
        });
      }
  
      return res.status(200).json({
        message: "professor retrieved successfully.",
        data: professor
      });
  
    } catch (error) {
      console.error("Error retrieving professor by ID:", error);
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
        return res.status(404).json({ message: "Utilisateur introuvable ou aucun champ fourni." });
      }
  
      res.status(200).json({
        message: "Utilisateur mis à jour avec succès.",
        data: updatedUser,
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };


exports.deleteProfessor = async (req, res) => {
    const { id_professor } = req.params;
  
    try {
      const result = await professorModel.deleteProfessorById(id_professor);
  
      if (result.rowCount === 0) {
        return res.status(404).json({
          message: "Student not found.",
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
  
      return res.status(200).json({
        message: "professors retrieved successfully by class.",
        data: professors,
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
  
      return res.status(200).json({
        message: "Professors retrieved successfully by sector.",
        data: professors,
      });
  
    } catch (error) {
      console.error("Error retrieving professors by sector:", error);
      return res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  };
  

  