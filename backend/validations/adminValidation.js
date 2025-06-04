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




const validate_student = [
  // Name
  body('name')
    .notEmpty().withMessage("Name is required.")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters.")
    .matches(/^[A-Za-zÀ-ÿ\s\-']+$/).withMessage("Name can only contain letters, spaces, hyphens, and apostrophes.")
    .trim()
    .escape(),

  // CIN
  body('cin')
    .notEmpty().withMessage("CIN is required.")
    .isLength({ min: 6, max: 10 }).withMessage("CIN must be between 6 and 10 characters.")
    .isAlphanumeric('fr-FR').withMessage("CIN must contain only letters and numbers.")
    .trim()
    .escape(),

  // CNE
  body('cne')
    .notEmpty().withMessage("CNE is required.")
    .isLength({ min: 10, max: 10 }).withMessage("CNE must be exactly 10 characters.")
    .isAlphanumeric('fr-FR').withMessage("CNE must contain only letters and numbers.")
    .trim()
    .escape(),

  // Email
  body('email')
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalid email address.")
    .normalizeEmail(),

  // Password
  body('pass')
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

  // Filiere
  body('filier')
    .notEmpty().withMessage("Filière is required.")
    .isLength({ min: 2, max: 50 }).withMessage("Filière must be between 2 and 50 characters.")
    .matches(/^[A-Za-zÀ-ÿ\s\-']+$/).withMessage("Filière must contain only letters, spaces, hyphens, and apostrophes.")
    .trim()
    .escape(),

  // Groupe
  body('group')
    .notEmpty().withMessage("Groupe is required.")
    .isAlphanumeric('fr-FR').withMessage("Groupe must be alphanumeric.")
    .isLength({ min: 1, max: 10 }).withMessage("Groupe must be between 1 and 10 characters.")
    .trim()
    .escape(),

  // Admin Note (optional)
  body('note')
    .optional()
    .isLength({ max: 255 }).withMessage("Admin note must be less than 255 characters.")
    .trim()
    .escape()
];

module.exports = {
    validate_student,
    validations,
    validate
}
