const authModel = require("../models/authModel");
const JWT = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const {Authlimiter} = require('../middlewares/Limiter')
const cookieOptions = {
    httpOnly: true,
    secure: false, // Change to true when HTTPS is ready 
    sameSite: 'Strict',
  };

exports.Login =
async (req , res) =>{
  const {password, email, RememberMe} = req.body;
  const useCookies = req.headers['use-cookies'] === 'true' ;
  
  try {
      const user = await authModel.LoginModel(email, password);
      if(user){
          Authlimiter.resetKey(req.ip);

          const access_token = JWT.sign(
            { id: user.id_member, role: user.role, fullname: user.full_name},
            process.env.ACCESS_SECRET,
            { expiresIn: '15m'})

          const refresh_token = JWT.sign(
            {id: user.id_member, type:"refresh", RememberMe:RememberMe}
            ,process.env.REFRESH_SECRET,
            { expiresIn: '7d'})
          if(useCookies){
            if(RememberMe){ // Normal Cookies with expiration
                res.cookie("access_token", access_token,{
                    ...cookieOptions,
                    maxAge:  15 * 60 * 1000,
                });
                res.cookie("refresh_token", refresh_token,{
                    ...cookieOptions,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }else { // Session Cookies, cleared when the session is closed 
                res.cookie("access_token", access_token,{
                    ...cookieOptions
                });

                res.cookie("refresh_token", refresh_token,{
                    ...cookieOptions
                });
            }
  
          return res.status(200).json({message: "Connected Successfully Avec Cookies!" ,role: user.role, access_token, refresh_token, email: user.email, fullname: user.full_name});
        }else{ // else dyal if cookies
          return res.status(200).json({message: "Connected Successfully Sans Cookies !" , role: user.role, access_token, refresh_token, email: user.email, fullname: user.full_name});
        }
    }else{ //else dyal if user
          return res.status(401).json({message: "Email or Password is incorrect"})
      }

  } catch (error) {
      return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
}


exports.RefreshToken = async (req, res) => {
  console.log('01')
    const refresh_token = req.cookies.refresh_token || req.body.refresh_token;
    if (!refresh_token) {
      return res.status(401).json({ message: "No token refresh was found, Please login again!" });
    }

    try {
      const decoded = JWT.verify(refresh_token, process.env.REFRESH_SECRET);
      const RememberMe = decoded.RememberMe;
      const useCookies = req.headers['use-cookies'] === 'true';
      const user = await authModel.GetUserById(decoded.id);
      if (!user) {
        return res.status(400).json({ message: "Please log in" });
      }
      
      const new_access_token = JWT.sign(
        { id: user.id_member, role: user.role, fullname: user.fullname},
        process.env.ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      if(useCookies){
      res.cookie("access_token", new_access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: RememberMe ? 15 * 60 * 1000 : undefined 
      });
      return res.status(201).json({
        message: "The new access token is set!",})
      }
      else{
        return res.status(201).json({
        message: "The new access token is set!", access_token: new_access_token
      });
    }
  
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
        return res.status(200).json({ message: "Logout successful" });
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

exports.check = (req,res)=>{
  if (req.user) {
    return res.status(200).json({ valid: true, id: req.user.id ,role : req.user.role , message: 'Authenticated' });
  } else {
    return res.status(401).json({valid: false, role : null, message: 'Not authenticated' });
  }
}