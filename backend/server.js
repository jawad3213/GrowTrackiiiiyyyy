const express = require("express")
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();
const PORT = process.env.PORT;
//const {ResetPassEmail} = require('./controllers/authController');
const {ResetPassEmail, check} = require('./controllers/authController');
const cors = require('cors');
const {ServerLimiter} = require('../backend/middlewares/Limiter');



const corsOptions = {
    origin:["http://localhost:3000", "http://localhost:5173"],
    credentials: true
}

const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet({hsts: false})); // Leaves Default options that come with helmet and removes the one that forces https 

// The routes of Authentication
const AuthRoute = require("./routes/AuthRoute");
app.use("/api/auth", AuthRoute)
//Usage of rate limiter for all routes except for the authentication
app.use(ServerLimiter);
const authRules = require('./validators/authrules'); // The rules for validation the inputs
const { validate } = require('./middlewares/validate'); // The middlwares that validates the inputs based on the rules given 
const { verifyResetToken }=require('./middlewares/VerifyToken')

app.post('/api/resetpass',validate(authRules.Password),verifyResetToken, ResetPassEmail);

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



app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server Running on http://localhost:${PORT}`);
    });
}


app.get('/api/validate-reset-token', verifyResetToken, check)

module.exports = app;
