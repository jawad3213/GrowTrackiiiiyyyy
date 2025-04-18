const JWT = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const access_token = req.cookies.access_token || req.query.token;
    if (!access_token) {
      return res.status(401).json({ message: "NO token was found." });
    }
    JWT.verify(access_token, process.env.ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalide token or expired." });
      }
      req.user = decoded;
      next();
    });
  };
