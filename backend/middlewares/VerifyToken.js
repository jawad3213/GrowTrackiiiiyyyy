const JWT = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const access_token = req.cookies.access_token || req.query.token;

  if (!access_token) {
    return res.status(401).json({
      errorCode: "NO_TOKEN",
      message: "No token was found."
    });
  }

  JWT.verify(access_token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          errorCode: "TOKEN_EXPIRED",
          message: "Access token has expired."
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          errorCode: "INVALID_TOKEN",
          message: "Invalid token structure."
        });
      } else {
        return res.status(401).json({
          errorCode: "AUTH_ERROR",
          message: "Authentication error occurred."
        });
      }
    }
    req.user = decoded;
    next();
  });
};

exports.verifyResetToken = (req, res, next) => {
  const token = req.query.token;

  if (!token) return res.status(400).json({ message: 'Missing reset token' });

  JWT.verify(token, process.env.RESET_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
};
exports.verifyResetToken = (req, res, next) => {
  const token = req.query.token;

  if (!token) return res.status(400).json({ message: 'Missing reset token' });

  JWT.verify(token, process.env.RESET_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
};