/**
 * server.js – Growtrack API
 * -------------------------------------------------------------
 * - Exporte l'instance Express pour les tests (Supertest)
 * - Ne démarre le serveur que si NODE_ENV !== 'test'
 * - Limiteur de requêtes & CORS avant les routes
 * - Toutes les routes regroupées par domaine
 * -------------------------------------------------------------
 */

require('dotenv').config();

const express       = require('express');
const cookieParser  = require('cookie-parser');
const cors          = require('cors');
const rateLimit     = require('express-rate-limit');

const authController       = require('./controllers/authController');
const verify               = require('./middlewares/VerifyToken');
const AuthRoute            = require('./routes/AuthRoute');
const hashRoute            = require('./routes/HashRoute');
const DashAdminRoute       = require('./routes/adminRoutes/AdminDashboardRoute');
const ProfileAdminRoute    = require('./routes/adminRoutes/AdminProfile');
const EvaluationAdminRoute = require('./routes/adminRoutes/GlobalOverView_Route');
const contactusRoute       = require('./routes/contactusRoute');

// Initialise la connexion PG (side‑effect utile à tout le projet)
require('./config/db');

const PORT = process.env.PORT || 3000;
const app  = express();

/* ──────────────────────── Middlewares ──────────────────────── */

app.use(express.json());
app.use(cookieParser());

/* ────────────── CORS (mise à jour) ────────────── */
const whitelist = [
  'https://frontend-production-665b.up.railway.app',
  /^http:\/\/localhost(:\d+)?$/,        // localhost + n’importe quel port
  /^http:\/\/127\.0\.0\.1(:\d+)?$/
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // requêtes serveur ou Postman

    const ok = whitelist.some(rule =>
      typeof rule === 'string' ? rule === origin : rule.test(origin)
    );
    cb(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('/*', cors(corsOptions));   // pré‑flight global (Express 5)

/* ────────────── Rate‑limit ────────────── */
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 min
  max: 150,                 // 150 requêtes / IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status : 429,
    message: 'Too many requests, please try again after 60 minutes.'
  }
});
app.use(limiter);

/* ─────────────────────────── Routes ─────────────────────────── */

app.use('/api/auth', AuthRoute);
app.post('/api/resetpass', verify.verifyToken, authController.ResetPassEmail);

app.use('/api/hash',           hashRoute);
app.use('/api/DashAdmin',      DashAdminRoute);
app.use('/api/ProfileAdmin',   ProfileAdminRoute);
app.use('/api/GlobalOverView', EvaluationAdminRoute);
app.use('/api/contactus',      contactusRoute);

app.get('/testbackend', (req, res) => {
  res.send('connexion reussie to backend !!');
});

/* ──────────────────────── Démarrage ────────────────────────── */

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
  });
}

module.exports = app; // indispensable pour Supertest / Jest
