const rateLimit = require('express-rate-limit');

const Authlimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 20, // 20 requests per ip in the current window
    keyGenerator: (req) => {
        const ip = req.ip;
        console.log(`🔍 Rate limit check for IP: ${ip}`);
        return ip;
    },
    // Version moderne pour express-rate-limit v7+
    handler: (req, res, next, options) => {
        console.log(`🚫 Rate limit reached for IP: ${req.ip}`);
        console.log(`   Window: ${options.windowMs}ms, Max: ${options.max}`);
        console.log(`   Headers - Remaining: ${res.getHeader('X-RateLimit-Remaining')}, Reset: ${res.getHeader('X-RateLimit-Reset')}`);
        
        // Réponse personnalisée
        res.status(429).json({
            status: 429,
            message: "Too many attemps, please try again after 30 minutes.",
            retryAfter: Math.ceil(options.windowMs / 1000), // en secondes
            limit: options.max,
            windowMs: options.windowMs
        });
    },
    message: {
        status: 429,
        message: "Too many attemps, please try again after 30 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false,
    
    // Skip certaines conditions si nécessaire
    skip: (req) => {
        // Exemple: skip si IP locale pour dev (optionnel)
        // return req.ip === '127.0.0.1' && process.env.NODE_ENV === 'development';
        return false; // Ne skip rien pour tester
    },
    
    // Pas de onLimitReached - utilise handler à la place
});

const ServerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 500, // 500 requests per ip in the current window
    keyGenerator: (req) => {
        console.log(`🌐 Server limiter check for IP: ${req.ip}`);
        return req.ip;
    },
    handler: (req, res, next, options) => {
        console.log(`🚫 Server rate limit reached for IP: ${req.ip}`);
        res.status(429).json({
            status: 429,
            message: "Too many requests, please try again after 60 minutes.",
            retryAfter: Math.ceil(options.windowMs / 1000)
        });
    },
    message: {
        status: 429,
        message: "Too many requests, please try again after 60 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false,
});

// Middleware de debug pour voir toutes les requêtes
const debugMiddleware = (req, res, next) => {
    const originalSend = res.send;
    res.send = function(...args) {
        if (res.statusCode === 429) {
            console.log(`🚫 429 Response sent for ${req.method} ${req.path} from IP: ${req.ip}`);
        } else {
            console.log(`✅ ${res.statusCode} Response sent for ${req.method} ${req.path} from IP: ${req.ip}`);
        }
        return originalSend.apply(this, args);
    };
    next();
};

module.exports = { 
    Authlimiter, 
    ServerLimiter,
    debugMiddleware // Export pour utilisation optionnelle
};