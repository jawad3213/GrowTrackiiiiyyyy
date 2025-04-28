//const express = require("express");
const bcrypt = require("bcrypt");
const studentModel = require("../../models/adminModels/studentModel");
const { v4: uuidv4 } = require("uuid");


const generateImageUrl = (path) => {
  return path ? `http://localhost:8080/${path.replace(/\\/g, "/")}` : null;
};



exports.createStudent = async (req, res) => {
    console.log("Données reçues :", req.body);
  const { name, cin, cne, email, pass, field, note } = req.body;
  console.log(req.body)
  const imagePath = req.file ? req.file.path : null;

  try {
    const id_user = uuidv4();
    const role = "student";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    const student = await studentModel.createStudent(id_user, name, cin, cne, email, hashedPassword, field, note, role,imagePath);

    res.status(201).json({
      message: "Student added successfully.",
      student,
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        error: "The email address already exists. Please use a different email.",
      });
    }
    console.error("Erreur lors de l'ajout du student :", error.message);


    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

exports.getAllStudents = async (req, res) => {
    try {
      const students = await studentModel.getAllStudents();
  
      if (students.length === 0) {
        return res.status(200).json({
          message: "No students found.",
          data: [],
        });
      }
  
      // 🔁 Ajout de l'URL complète de l'image
      const updatedStudents = students.map(student => ({
        ...student,
        profile_picture_url: generateImageUrl(student.profile_picture),
      }));

    return res.status(200).json({
      message: "Students retrieved successfully.",
      data: updatedStudents,
    });
  
    } catch (error) {
      console.error("Error retrieving students:", error);
      return res.status(500).json({
        error: "Internal server error. Please try again later.",
      });
    }
  };


exports.getStudentByCin = async (req, res) => {
    const { cin } = req.body;
  
    try {
      const student = await studentModel.getStudentByCin(cin);
  
      if (!student) {
        return res.status(404).json({
          message: "Student not found.",
          data: null
        });
      }
      student.profile_picture_url = generateImageUrl(student.profile_picture);
  
      return res.status(200).json({
        message: "Student retrieved successfully.",
        data: student
      });
  
    } catch (error) {
      console.error("Error retrieving student by ID:", error);
      return res.status(500).json({
        error: "Internal server error. Please try again later.",
      });
    }
  };
  
exports.updateStudent = async (req, res) => {
    const userId = req.params.id_student;
    const updates = req.body;

    
  console.log("ID :", userId);
  console.log("Données :", updates);
  
    try {
      const updatedUser = await studentModel.updateStudentById(userId, updates);
  
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


exports.deleteStudent = async (req, res) => {
    const { id_student } = req.params;
  
    try {
      const result = await studentModel.deleteStudentById(id_student);
  
      if (result.rowCount === 0) {
        return res.status(404).json({
          message: "Student not found.",
        });
      }
  
      return res.status(200).json({
        message: "Student deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      return res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  };


  exports.getTotalStudents = async (req, res) => {
    try {
      const total = await studentModel.total();
  
      return res.status(200).json({
        message: "Total number of students retrieved successfully.",
        data: total
      });
      
    } catch (error) {
      console.error("Error retrieving total number of students:", error);
      return res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  };
  
  exports.getStudentsByClass = async (req, res) => {
    const { classe } = req.body;
  
    try {
      const students = await studentModel.getStudentsByClass(classe);

      const updatedStudents = students.map(student => ({
        ...student,
        profile_picture_url: generateImageUrl(student.profile_picture),
      }));
  
      return res.status(200).json({
        message: "Students retrieved successfully by class.",
        data: updatedStudents,
      });
      
  
    } catch (error) {
      console.error("Error retrieving students by class:", error);
      return res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  };

  exports.getStudentsBySector = async (req, res) => {
    const { sector } = req.body;
  
    try {
      const students = await studentModel.getStudentsBySector(sector);
      
      const updatedStudents = students.map(student => ({
        ...student,
        profile_picture_url: generateImageUrl(student.profile_picture),
      }));
  
      return res.status(200).json({
        message: "Students retrieved successfully by sector.",
        data: updatedStudents,
      });
  
    } catch (error) {
      console.error("Error retrieving students by sector:", error);
      return res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  };
  

  