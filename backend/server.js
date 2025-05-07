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
const dashRoute = require("./routes/profRoutes/dashRoute");


// Montage des routes
app.use("/auth", AuthRoute);
app.use("/prof/dashboard", dashRoute );



// Lancement du serveur
app.listen(PORT, () => {
    console.log(`✅ Server Running on http://localhost:${PORT}`);
});
