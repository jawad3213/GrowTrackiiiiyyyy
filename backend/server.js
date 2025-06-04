const express = require("express")
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const {ResetPassEmail, check} = require('./controllers/authController');
const cors = require('cors');
const {ServerLimiter} = require('../backend/middlewares/Limiter');
const { verifyResetToken }=require('./middlewares/VerifyToken')
const path = require('path')



const corsOptions = {
    origin:["http://localhost:3000", "http://localhost:5173"],
    credentials: true
}

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour les formulaires HTML classiques
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet({hsts: false})); // Leaves Default options that come with helmet and removes the one that forces https 

// The routes of Authentication
const AuthRoute = require("./routes/AuthRoute");
app.use("/api/auth", AuthRoute)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const studentRoute = require("./routes/adminRoutes/studentRoute");
const professorRoute = require("./routes/adminRoutes/professorRoute");
const supervisorRoute = require("./routes/adminRoutes/supervisorRoute");
const skillRoute = require("./routes/adminRoutes/skillRoute");
const classRoute = require("./routes/adminRoutes/classRoute");
const coachRoute = require("./routes/adminRoutes/coachRoute");
const signalRoute = require("./routes/adminRoutes/signalRoute");
const profileRoute = require("./routes/adminRoutes/profileRoute");



//Usage of rate limiter for all routes except for the authentication
app.use(ServerLimiter);

app.use("/admin/students", studentRoute);
app.use("/admin/professors", professorRoute);
app.use("/admin/supervisors", supervisorRoute);
app.use("/admin/skills", skillRoute);
app.use("/admin/class", classRoute);
app.use("/admin/coachs", coachRoute);
app.use("/admin/signals", signalRoute);
app.use("/admin/profile", profileRoute);



const authRules = require('./validators/authrules'); // The rules for validation the inputs
const { validate } = require('./middlewares/validate'); // The middlwares that validates the inputs based on the rules given 
app.get('/api/validate-reset-token', verifyResetToken, check) //Route for checking the reset token
app.post('/api/resetpass',validate(authRules.Password),verifyResetToken, ResetPassEmail);

const contactus = require("./routes/contactusRoute");
app.use("/api/contactus", contactus)


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


//prof_Evaluation history
const prof_evaluation_history = require("./routes/professorRoutes/Evaluation_Route_history");
app.use("/api/prof_evaluation_history", prof_evaluation_history)

//prof_Evaluation classes
const prof_evaluation_classes = require("./routes/professorRoutes/Evaluation_Route_classes");
app.use("/api/prof_evaluation_classes", prof_evaluation_classes)

//prof_project
const prof_project_management = require("./routes/professorRoutes/project_management_Route");
app.use("/api/prof_project_management", prof_project_management)

//prof signal history
const prof_signal_history = require("./routes/professorRoutes/signal_history_Route");
app.use("/api/signal_history", prof_signal_history)

//prof signal classes
const prof_signal_classes = require("./routes/professorRoutes/signal_classes_Route");
app.use("/api/signal_classes", prof_signal_classes)


const dashRoute = require("./routes/profRoutes/dashRoute");
app.use("/prof/dashboard", dashRoute );
const student_report = require("./routes/professorRoutes/student_report");
app.use("/api/report", student_report)





app.listen(PORT, () => {
    console.log(`✅ Server Running on http://localhost:${PORT}`);
});


