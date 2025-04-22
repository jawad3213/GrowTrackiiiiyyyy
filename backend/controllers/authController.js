const authModel = require("../models/authModel");
const { body, validationResult } = require('express-validator');
const JWT = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const PORT = process.env.PORT;
const nodemailer = require('nodemailer');

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  return hashed;
};

exports.Login = [
body('email')
.notEmpty().withMessage("Email is required.")
.isEmail().withMessage("Invalide Email.")
.normalizeEmail(),

body('password')
.notEmpty().withMessage("Password is required."),

async (req , res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  const {password, email} = req.body;
  
  try {
      const user = await authModel.LoginModel(email, password);
      console.log(user)
      if(user){
      const Access_Token = JWT.sign(
          { id: user.id_member, role: user.role, },
          process.env.ACCESS_SECRET,
          { expiresIn: '15m'})

      const refresh_token = JWT.sign(
          {id: user.id_member, type:"refresh"}
          ,process.env.REFRESH_SECRET,
          { expiresIn: '7d'})

          res.cookie("access_token", Access_Token,{
              httpOnly: true,
              secure:false,
              sameSite:"strict"
          });
          res.cookie("refresh_token", refresh_token,{
              httpOnly: true,
              secure:false,
              sameSite:"strict"
              // path:"/auth"
          });
          console.log(user.id_member);
          return res.status(200).json({message: "Connected Successfully !" ,Access_Token, refresh_token});
      }else{
          return res.status(401).json({message: "Email or Password is incorrect"})
      }

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
}
]

exports.RefreshToken = async (req, res) => {
    const refresh_token = req.cookies.refresh_token;
    const access_token = req.cookies.access_token;
    console.log(access_token);
    console.log(refresh_token);
    console.log("hello");
    
    if (!refresh_token) {
      return res.status(401).json({ message: "No token refresh was found, Please login again!" });
    }

    try {
      const decoded = JWT.verify(refresh_token, process.env.REFRESH_SECRET);
      
      const user = await authModel.GetUserById(decoded.id); 
      console.log(user); 
      if (!user) {
        return res.status(400).json({ message: "Please log in" });
      }
  
      const new_access_token = JWT.sign(
        { id: user.id_member, role: user.role },
        process.env.ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      res.cookie("access_token", new_access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
  
      return res.status(201).json({
        message: "The new access token is set!",
        access_token: new_access_token,
      });
  
    } catch (error) {
      res.clearCookie("refresh_token");
      return res.status(401).json({ message: "Invalid or expired refresh token!" });
    }
  };
exports.Logout=(req, res)=>{
    try {
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
          });;
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
          });;
        return res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    }
  });

exports.ResetPass = [
    body("email")
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalide Email.")
    .normalizeEmail(),

    async (req,res)=>{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("hello");
        const {email} = req.body;
        try {
        const user = await authModel.FindUserByEmail(email);
            if(!user) {return res.status(400).json({ message: "User not found with this email ❌" });}
            else {
                const Reset_Token = JWT.sign(
                    { id: user.id_member, role: user.role, },
                    process.env.ACCESS_SECRET,
                    { expiresIn: '15m'})
            
            const resetLink = `http://localhost:${PORT}/reset-pass-email?token=${Reset_Token}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset Request 🔒",
                html: `
                  <h2>Password Reset</h2>
                  <p>Click the link below to reset your password:</p>
                  <a href="${resetLink}">Reset My Password</a>
                  <p>This link will expire in 15 minutes.</p>
                `
              };
              
              const sent = await transporter.sendMail(mailOptions);
              
              if (sent) {
                return res.status(200).json({
                  message: "A password reset email has been sent. Please check your inbox or spam folder ✅",
                });
            } else {
                return res.status(500).json({ message: "Failed to send reset email " });
            }
        }
        }
         catch (error) {
            console.log(error);
            return res.status(500).json({message: "Server Error, Please try again later!"});
        }
    }
]

const disallowedPasswords = [
    "password",
    "123456",
    "qwerty",
    "abcdef",
    "654321"
  ];

exports.ResetPassEmail=[
    body('password')
    .notEmpty().withMessage("The password is required")
    .isLength({ min: 8 }).withMessage("The Password must have at least 8 charachters")
    .custom(value => {
      if (disallowedPasswords.includes(value.toLowerCase())) {
        throw new Error('The password is weak.');
      }
    //   if (!/^(?=.[A-Z])(?=.\d).{8,}$/.test(value)) {
    //     throw new Error("The password must contain at least an uppercase and a number.");
    //   }
      return true;
    }),
    async (req,res)=>{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
        const id_user = req.user.id;  
        const password = JSON.stringify(req.body.password);
        console.log(password);
        console.log(req.body.password)
        //const HashedPass = await hashPassword(password,10);
        const HashedPass = await bcrypt.hash(req.body.password, 10);
        const user = await authModel.UpdatePassById(id_user, HashedPass);
        console.log(user);
        if(!user) {
            return res.status(400).json({ message: "User not found with this email " });
        }
        else {
            return res.status(201).json({message: "The password was updated successfully ! Please try to log in with the new password now"})
        }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Interne Servel Error " });
        }
  
    }
]