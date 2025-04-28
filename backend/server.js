const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require("path");

// Récupération du port depuis le fichier .env
const PORT = process.env.PORT || 8080;

// Middleware pour parser les cookies
app.use(cookieParser());

// Ces deux lignes sont utiles pour les routes POST/PUT classiques (JSON ou form-urlencoded)
// 👉 PAS utilisées par multer, mais ne posent pas de problème pour le reste de l'app
app.use(express.json()); // Pour les requêtes avec JSON (API)
app.use(express.urlencoded({ extended: true })); // Pour les formulaires HTML classiques

// Rendre le dossier "uploads" accessible publiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importation des routes
const AuthRoute = require("./routes/AuthRoute");
const studentRoute = require("./routes/adminRoutes/studentRoute");
const professorRoute = require("./routes/adminRoutes/professorRoute");
const supervisorRoute = require("./routes/adminRoutes/supervisorRoute");
const skillRoute = require("./routes/adminRoutes/skillRoute");
const classRoute = require("./routes/adminRoutes/classRoute");
const coachRoute = require("./routes/adminRoutes/coachRoute");
const signalRoute = require("./routes/adminRoutes/signalRoute");

// Montage des routes
app.use("/auth", AuthRoute);
app.use("/admin/students", studentRoute);
app.use("/admin/professors", professorRoute);
app.use("/admin/supervisors", supervisorRoute);
app.use("/admin/skills", skillRoute);
app.use("/admin/class", classRoute);
app.use("/admin/coachs", coachRoute);
app.use("/admin/signals", signalRoute);

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`✅ Server Running on http://localhost:${PORT}`);
});
