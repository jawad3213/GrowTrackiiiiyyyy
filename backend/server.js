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

app.post('/api/reset-pass-email',verify.verifyToken, authController.ResetPassEmail);

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});

const pool = require('./db');

app.get('/testbackend',(req,res)=>{
    res.send('connexion reussie to backend !! ');
})
