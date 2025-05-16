const express = require("express")
const app = express()
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT;
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

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

const AuthRoute = require("./routes/AuthRoute");
app.use("/api/auth", AuthRoute)

app.use(limiter);

app.post('/api/resetpass',verify.verifyToken, authController.ResetPassEmail);

//route hachage
const hashRoute = require("./routes/HashRoute");
app.use("/api/hash", hashRoute)


//route DashBaordAdmin
const DashAdminRoute = require("./routes/adminRoutes/AdminDashboardRoute");
app.use("/api/DashAdmin", DashAdminRoute)

//PROFILE
const ProfileAdminRoute = require("./routes/adminRoutes/AdminProfile");
app.use("/api/ProfileAdmin", ProfileAdminRoute)

//Global Over View
const EvaluationAdminRoute = require("./routes/adminRoutes/GlobalOverView_Route");
app.use("/api/GlobalOverView", EvaluationAdminRoute)


//Global Over View
const contactus = require("./routes/contactusRoute");
app.use("/api/contactus", contactus)

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

//rapport student
const student_report = require("./routes/professorRoutes/student_report");
app.use("/api/report", student_report)

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});

const pool = require('./config/db');

app.get('/testbackend',(req,res)=>{
    res.send('connexion reussie to backend !! ');
})


