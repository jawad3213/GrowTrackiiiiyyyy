const { body } = require('express-validator');

const disallowedPasswords = [
  "password",
  "123456",
  "qwerty",
  "abcdef",
  "654321"
];


exports.Login = [
  body('email')
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalide Email.")
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage("Password is required."),
];


exports.Password =[
  body('password')
  .notEmpty().withMessage("The password is required")
  .isLength({ min: 8, max: 64}).withMessage("The password must have at least 8 characters")
  .custom(value => {
      if (disallowedPasswords.includes(value.toLowerCase())) {
        throw new Error('The password is weak.');
      }
      if (!/^(?=.[A-Z])(?=.\d).*$/.test(value)) {
          throw new Error("The password must contain at least one uppercase letter and one number.");
      }
      return true;
    })
  ];

exports.Email = [
    body("email")
      .notEmpty().withMessage("Email is required.")
      .isEmail().withMessage("Invalide Email.")
      .normalizeEmail(),
  ];