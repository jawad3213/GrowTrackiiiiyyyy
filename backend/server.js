const express = require("express")
const app = express()
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT;
const authController = require('./controllers/authController');
const {authorize}=require('./middlewares/VerifyToken')
//const {authorizate} =require("../middlewares/VerifyToken")

app.use(express.json());
app.use(cookieParser());
app.use(express.json()); // Pour les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Pour les formulaires HTML


const AuthRoute = require("./routes/AuthRoute");
app.use("/auth", AuthRoute)

const studentRoute =require("./routes/adminRoutes/studentRoute");
app.use("/admin/students",studentRoute);
//authorize(["admin"])

const professorRoute =require("./routes/adminRoutes/professorRoute");
app.use("/admin/professors",professorRoute);
//app.post('/reset-pass-email',verify.verifyToken, authController.ResetPassEmail);

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});
