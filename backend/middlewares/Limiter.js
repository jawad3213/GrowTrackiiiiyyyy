const rateLimit = require('express-rate-limit');

const Authlimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 20, // 20 requests per ip in the current window
    keyGenerator: (req) => req.ip,
    message: {
      status: 429,
      message: "Too many attemps, please try again after 30 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
  });


const ServerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 250, // 250 requests per ip in the current window
    message: {
      status: 429,
      message: "Too many requests, please try again after 60 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

module.exports = {Authlimiter, ServerLimiter}