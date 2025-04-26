const express = require("express")
const app = express()
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT;
const authController = require('./controllers/authController');
const verify=require('./middlewares/VerifyToken')

app.use(express.json());
app.use(cookieParser());

//route authentification
const AuthRoute = require("./routes/AuthRoute");
app.use("/api/auth", AuthRoute)

//route hachage
const hashRoute = require("./routes/HashRoute");
app.use("/api/hash", hashRoute)


//route DashBaordAdmin
const DashAdminRoute = require("./routes/adminRoutes/AdminDashboardRoute");
app.use("/api/DashAdmin", DashAdminRoute)


//Global Over View
const EvaluationAdminRoute = require("./routes/adminRoutes/GlobalOverView_Route");
app.use("/api/GlobalOverView", EvaluationAdminRoute)

//reset password de user
app.post('/api/reset-pass-email',verify.verifyToken, authController.ResetPassEmail);

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});




//test_de_connexion
const pool = require('./config/db');
app.get('/testbackend',(req,res)=>{
    res.send('connexion reussie to backend !! ');
})