//const express = require("express");
const bcrypt = require("bcrypt");
const adminModel = require("../models/adminModel");
const { v4: uuidv4 } = require("uuid");

exports.createStudent = async (req, res) => {
    console.log("Données reçues :", req.body);
  const { name, cin, cne, email, pass, filiere, group, note } = req.body;

  try {
    const id_user = uuidv4();
    const role = "student";
    const hashedPassword = await bcrypt.hash(pass, 10);

    const student = await adminModel.createStudent(id_user, name, cin, email, hashedPassword, filiere, group, note, role, cne);

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
      const students = await adminModel.getAllStudents();
  
      if (students.length === 0) {
        return res.status(200).json({
          message: "No students found.",
          data: [],
        });
      }
  
      return res.status(200).json({
        message: "Students retrieved successfully.",
        data: students,
      });
  
    } catch (error) {
      console.error("Error retrieving students:", error);
      return res.status(500).json({
        error: "Internal server error. Please try again later.",
      });
    }
  };


exports.getStudentById = async (req, res) => {
    const { id_student } = req.params;
  
    try {
      const student = await adminModel.getStudentById(id_student);
  
      if (!student) {
        return res.status(404).json({
          message: "Student not found.",
          data: null
        });
      }
  
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
    const userId = req.params.id;
    const updates = req.body;

    
  console.log("ID :", userId);
  console.log("Données :", updates);
  
    try {
      const updatedUser = await adminModel.updateStudentById(userId, updates);
  
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