// const express = require("express");
const bcrypt = require("bcrypt");
const coachModel = require("../../models/adminModels/coachModel");
const { v4: uuidv4 } = require("uuid");

exports.createCoach = async (req, res) => {
    console.log("Données reçues :", req.body);
    const { name, cin, email, pass, field, note } = req.body;

    try {
        const id_user = uuidv4();
        const role = "coach";
        const hashedPassword = await bcrypt.hash(pass, 10);

        const coachs = await coachModel.createCoach(id_user, name, cin, email, hashedPassword, field ,note, role);

        res.status(201).json({
            message: "Coach added successfully.",
            coachs,
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                error: "The email address already exists. Please use a different email.",
            });
        }
        console.error("Erreur lors de l'ajout du coach :", error.message);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};

exports.getAllCoach = async (req, res) => {
    try {
        const coachs = await coachModel.getAllCoach();

        if (coachs.length === 0) {
            return res.status(200).json({
                message: "No coach found.",
                data: [],
            });
        }

        return res.status(200).json({
            message: "Coachs retrieved successfully.",
            data: coachs,
        });

    } catch (error) {
        console.error("Error retrieving coachs:", error);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
};

exports.getCoachByCin = async (req, res) => {
    const { cin } = req.body;

    try {
        const coach = await coachModel.getCoachByCin(cin);

        if (!coach) {
            return res.status(404).json({
                message: "Coach not found.",
                data: null
            });
        }

        return res.status(200).json({
            message: "Coach retrieved successfully.",
            data: coach
        });

    } catch (error) {
        console.error("Error retrieving coach by CIN:", error);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
};

exports.updateCoach = async (req, res) => {
    const userId = req.params.id_coach;
    const updates = req.body;
    const imagePath = req.file ? req.file.path : null;
  
    if (imagePath) {
      updates.profile_picture = imagePath; // Ajout du chemin de l’image
    }

    console.log("ID :", userId);
    console.log("Données :", updates);

    try {
        const updatedUser = await coachModel.updateCoachById(userId, updates);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found or no fields provided." });
        }

        res.status(200).json({
            message: "User updated successfully.",
            data: updatedUser,
        });
    } catch (err) {
        console.error("Error during update:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.deleteCoach = async (req, res) => {
    const { id_coach } = req.params;

    try {
        const result = await coachModel.deleteCoachById(id_coach);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Coach not found.",
            });
        }

        return res.status(200).json({
            message: "Coach deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting coach:", error);
        return res.status(500).json({
            message: "Internal server error. Please try again later.",
        });
    }
};

exports.getTotalCoachs = async (req, res) => {
    try {
        const total = await coachModel.total();

        return res.status(200).json({
            message: "Total number of coachs retrieved successfully.",
            data: total
        });

    } catch (error) {
        console.error("Error retrieving total number of coachs:", error);
        return res.status(500).json({
            message: "Internal server error. Please try again later.",
        });
    }
};


