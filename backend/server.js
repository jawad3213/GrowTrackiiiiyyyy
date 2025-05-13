/**
 * server.js – Growtrack API
 * -------------------------------------------------------------
 * CORS & rate‑limit avant les routes | exporté pour les tests
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

// Initialise la connexion PG
require('./config/db');

const PORT = process.env.PORT || 3000;
const app  = express();

/* ──────────────────────── Middlewares ──────────────────────── */

app.use(express.json());
app.use(cookieParser());

/* ────────────── CORS ────────────── */
const whitelist = [
  'https://frontend-production-665b.up.railway.app',
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);           // appels serveur‑à‑serveur
    const ok = whitelist.some(r =>
      typeof r === 'string' ? r === origin : r.test(origin)
    );
    cb(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));                    // requêtes simples
app.options('/api/:path*', cors(corsOptions)); // pré‑flights sur toute l’API

/* ────────────── Rate‑limit ────────────── */
const limiter = rateLimit({
  windowMs: 60*60*1000,
  max      : 150,
  standardHeaders: true,
  legacyHeaders  : false,
  message: { status: 429, message: 'Too many requests, please try again after 60 minutes.' }
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

app.get('/testbackend', (_, res) => res.send('connexion reussie to backend !!'));

/* ──────────────────────── Démarrage ────────────────────────── */

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () =>
    console.log(`🚀  Server running on http://localhost:${PORT}`)
  );
}

module.exports = app;          // indispensable pour Supertest / Jest
