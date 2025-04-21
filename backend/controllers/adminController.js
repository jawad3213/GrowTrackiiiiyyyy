//const express = require("express");
const bcrypt = require("bcrypt");
const adminModel = require("../models/adminModel");
const { v4: uuidv4 } = require("uuid");

exports.addStudent = async (req, res) => {
  const { name, cin, cne, email, pass, filier, group, note } = req.body;

  try {
    const id_user = uuidv4();
    const role = "student";
    const hashedPassword = await bcrypt.hash(pass, 10);

    const student = await adminModel.register(id_user, name, cin, email, hashedPassword, filier, group, note, role, cne);

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

    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};
