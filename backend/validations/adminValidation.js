const { body , validationResult } = require('express-validator');

const disallowedPasswords = ["azertyui", "password123", "12345678"]; // Adjust as needed

const validations = [
  // CIN
  body('cin')
    .notEmpty().withMessage("CIN is required.")
    .isLength({ min: 6, max: 10 }).withMessage("CIN must be between 6 and 10 characters.")
    .isAlphanumeric('fr-FR').withMessage("CIN must contain only letters and numbers.")
    .trim()
    .escape(),

  // Phone
  body('phone')
    .notEmpty().withMessage("Phone number is required.")
    .matches(/^(\+212|0)(6|7)\d{8}$/).withMessage("Phone number must be a valid Moroccan number.")
    .trim(),

  // Password
  body('password')
    .notEmpty().withMessage("Password is required.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
    .custom(value => {
      if (disallowedPasswords.includes(value.toLowerCase())) {
        throw new Error("Please choose a stronger password.");
      }
      if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) {
        throw new Error("Password must contain at least one uppercase letter and one number.");
      }
      return true;
    }),

  // Role
  body('role')
    .notEmpty().withMessage("Role is required.")
    .isIn(['admin', 'student', 'teacher']).withMessage("Role must be one of: 'admin', 'student', or 'teacher'."),

  // Full Name
  body('full_name')
    .notEmpty().withMessage("Full name is required.")
    .isLength({ min: 2, max: 100 }).withMessage("Full name must be between 2 and 100 characters.")
    .matches(/^[A-Za-zÀ-ÿ\s\-']+$/).withMessage("Full name can only contain letters, spaces, hyphens, and apostrophes.")
    .trim()
    .escape(),

  // Email
  body('email')
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalid email address.")
    .normalizeEmail(),

  // Image (optional)
  body('image')
    .optional()
    .isURL().withMessage("Image must be a valid URL.")
];

const validate = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }
    next();
}
module.exports = {
    validations,validate}
