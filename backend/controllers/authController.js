const authModel = require("../models/authModel");
const { body, validationResult } = require('express-validator');
const JWT = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const PORT = process.env.PORT;
const nodemailer = require('nodemailer');
const {authlimiter} = require('../middlewares/Limiter')


exports.Login =

async (req , res) =>{
  const {password, email} = req.body;
  try {
      const user = await authModel.LoginModel(email, password);
      if(user){
      authlimiter.resetKey(req.ip);
      const Access_Token = JWT.sign(
          { id: user.id_member, role: user.role, fullname: user.fullname },
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
              sameSite:"strict",
              path:"/auth"
          });
          return res.status(200).json({message: "Connected Successfully !"});
      }else{
          return res.status(401).json({message: "Email or Password is incorrect"})
      }

  } catch (error) {
      return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
}


exports.RefreshToken = async (req, res) => {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      return res.status(401).json({ message: "No token refresh was found, Please login again!" });
    }

    try {
      const decoded = JWT.verify(refresh_token, process.env.REFRESH_SECRET);
      
      const user = await authModel.GetUserById(decoded.id);
      if (!user) {
        return res.status(400).json({ message: "Please log in" });
      }
  
      const new_access_token = JWT.sign(
        { id: user.id_member, role: user.role, fullname: user.fullname},
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

/*const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    }
  });

exports.ResetPass = 
    async (req,res)=>{
        const {email} = req.body;
        try {
        const user = await authModel.FindUserByEmail(email);
            if(!user) {return res.status(400).json({ message: "User not found with this email ❌" });}
            else {
                const Reset_Token = JWT.sign(
                    { id: user.id_member},
                    process.env.RESET_SECRET,
                    { expiresIn: '15m'})
            
                    const resetLink = `http://localhost:5173/resetpass?token=${Reset_Token}`;
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
              }
        }
        }
         catch (error) {
            console.log(error);
            return res.status(500).json({message: "Server Error, Please try again later!"});
        }
    }
*/
exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

exports.ResetPass = 
  async (req,res)=>{
      const {email} = req.body;
      try {
      const user = await authModel.FindUserByEmail(email);
          if(!user) {return res.status(400).json({ message: "User not found with this email ❌" });}
          else {
              const Reset_Token = JWT.sign(
                  { id: user.id_member},
                  process.env.RESET_SECRET,
                  { expiresIn: '15m'})
          
                  const resetLink = `http://localhost:5173/resetpass?token=${Reset_Token}`;
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
            
            const sent = await exports.transporter.sendMail(mailOptions);
            
            if (sent) {
              return res.status(200).json({
                message: "A password reset email has been sent. Please check your inbox or spam folder ✅",
              });
            }
      }
      }
       catch (error) {
          console.log(error);
          return res.status(500).json({message: "Server Error, Please try again later!"});
      }
  }

exports.ResetPassEmail= 
    async (req,res)=>{
        try {
        const id_user = req.user.id;  
        const HashedPass = await bcrypt.hash(req.body.password, 10);
        const user = await authModel.UpdatePassById(id_user, HashedPass);
        if(!user) {
            return res.status(400).json({ message: "User not found with this email " });
        }
        else {
            return res.status(201).json({message: "The password was updated successfully!"})
        }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error " });
        }
    }

    /*
exports.check = (req,res)=>{
  if (req.user) {
    return res.status(200).json({ message: 'Authenticated' });
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
}
  */

exports.check = (req,res)=>{
  if (req.user) {
    return res.status(200).json({ valid: true, role : req.user.role , message: 'Authenticated' });
  } else {
    return res.status(401).json({valid: false, role : null, message: 'Not authenticated' });
  }
}