const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require("path");
const authController = require('./controllers/authController');
const verify=require('./middlewares/VerifyToken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 150, // 100 requests per ip in the current window
    message: {
      status: 429,
      message: "Too many requests from this IP, please try again after 60 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

const corsOptions = {
    origin:["http://localhost:3000", "http://localhost:5173"],
    credentials: true
}

// Récupération du port depuis le fichier .env
const PORT = process.env.PORT || 8080;

// Middleware pour parser les cookies
app.use(cookieParser());
app.use(cors(corsOptions));

// Ces deux lignes sont utiles pour les routes POST/PUT classiques (JSON ou form-urlencoded)
// 👉 PAS utilisées par multer, mais ne posent pas de problème pour le reste de l'app
app.use(express.json()); // Pour les requêtes avec JSON (API)
app.use(express.urlencoded({ extended: true })); // Pour les formulaires HTML classiques

// Rendre le dossier "uploads" accessible publiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use(limiter);

//  app.post('/api/resetpass',verify.verifyToken, authController.ResetPassEmail);

//route hachage
const hashRoute = require("./routes/HashRoute");
app.use("/api/hash", hashRoute)


//route DashBaordAdmin
const DashAdminRoute = require("./routes/adminRoutes/AdminDashboardRoute");
app.use("/api/DashAdmin", DashAdminRoute)

//PROFILE
// const ProfileAdminRoute = require("./routes/adminRoutes/AdminProfile");
// app.use("/api/ProfileAdmin", ProfileAdminRoute)

//Global Over View
const EvaluationAdminRoute = require("./routes/adminRoutes/GlobalOverView_Route");
app.use("/api/GlobalOverView", EvaluationAdminRoute)


//Global Over View
const contactus = require("./routes/contactusRoute");
app.use("/api/contactus", contactus)

// Importation des routes
const AuthRoute = require("./routes/AuthRoute");
app.use("/api/auth", AuthRoute);


const studentRoute = require("./routes/adminRoutes/studentRoute");
app.use("/admin/students", studentRoute);


const professorRoute = require("./routes/adminRoutes/professorRoute");
app.use("/admin/professors", professorRoute);

const supervisorRoute = require("./routes/adminRoutes/supervisorRoute");
app.use("/admin/supervisors", supervisorRoute);

const skillRoute = require("./routes/adminRoutes/skillRoute");
app.use("/admin/skills", skillRoute);

const classRoute = require("./routes/adminRoutes/classRoute");
app.use("/admin/class", classRoute);

const coachRoute = require("./routes/adminRoutes/coachRoute");
app.use("/admin/coachs", coachRoute);

const signalRoute = require("./routes/adminRoutes/signalRoute");
app.use("/admin/signals", signalRoute);

const profileRoute = require("./routes/adminRoutes/profileRoute");
app.use("/admin/profile", profileRoute);

const dashprof = require("./routes/profRoutes/dashRoute");
app.use("/api/dashprof", dashprof);

const dashstudent = require("./routes/studentRoutes/dashRoutes");
app.use("/student/dashboard", dashstudent);

const prjectStudent = require("./routes/studentRoutes/projectRoute");
app.use("/student/projects", prjectStudent);

const notifiRoute = require("./routes/studentRoutes/notifiRoute");
app.use("/student/notifications", notifiRoute);
















// Lancement du serveur
app.listen(PORT, () => {
    console.log(`✅ Server Running on http://localhost:${PORT}`);
});

// const pool = require('./config/db');

// app.get('/testbackend',(req,res)=>{
//     res.send('connexion reussie to backend !! ');
// })


