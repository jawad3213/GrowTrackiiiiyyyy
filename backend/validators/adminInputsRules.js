const { check } = require('express-validator');

const Types=['pair', 'self', 'supervisor', 'professor']

exports.id_evaluation = [
  check('id_evaluation')
    .notEmpty().withMessage("ID is required.")
    .isInt({ min: 0 }).withMessage("Must be a positive integer.")
];

exports.type = [
  check("type")
      .notEmpty().withMessage("Type is required.")
      .custom(value => {
        if (!Types.includes(value.toLowerCase())) {
          throw new Error('Evaluation type is invalide');
        }return true;
      })
  ];