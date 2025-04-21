const express = require("express")
const app = express()
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT;
const authController = require('./controllers/authController');
const verify=require('./middlewares/VerifyToken')
//const {authorizate} =require("../middlewares/VerifyToken")

app.use(express.json());
app.use(cookieParser());

const AuthRoute = require("./routes/AuthRoute");
app.use("/auth", AuthRoute)

const adminRoute =require("./routes/adminRoute");
app.use("/admin",adminRoute);
//authorizate([admin])

//app.post('/reset-pass-email',verify.verifyToken, authController.ResetPassEmail);

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});
