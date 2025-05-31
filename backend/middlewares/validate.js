const { validationResult } = require('express-validator');

exports.validate = (rules) => {
  return async (req, res, next) => {
    for (let rule of rules) {
      await rule.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  };
};