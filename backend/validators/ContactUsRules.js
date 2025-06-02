const { body } = require('express-validator');

exports.contactUsSchema = [
    body('Email')
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalide Email.")
    .normalizeEmail()
    .trim()
    .escape(),

    body('FirstName')
    .notEmpty().withMessage("FirstName is required.")
    .isString().withMessage('First name must be a string.')
    .escape(),

    body('LastName')
    .notEmpty().withMessage("LastName is required.")
    .isString().withMessage('Last name must be a string.')
    .escape(),

    body('Phone')
    .notEmpty().withMessage("Phone Number is required")
    .isMobilePhone().withMessage("Phone number is too long")
    .isLength({ min: 10, max: 20}).withMessage('Invalide phone number'),

    body('Message')
    .notEmpty().withMessage("Message is required.")
    .isLength({min:2}).withMessage("Message is too short")
    .isLength({max: 1000}).withMessage("Message is too long")
    .escape(),
];

