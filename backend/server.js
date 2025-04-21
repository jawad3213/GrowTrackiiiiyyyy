const express = require("express")
const app = express()
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT;
const authController = require('./controllers/authController');
const verify=require('./middlewares/VerifyToken')

app.use(express.json());
app.use(cookieParser());

const AuthRoute = require("./routes/AuthRoute");
app.use("/api/auth", AuthRoute)


app.post('/api/reset-pass-email',verify.verifyToken, authController.ResetPassEmail);

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});

const pool = require('./db');

app.get('/testbackend',(req,res)=>{
    res.send('connexion reussie to backend !! ');
})
