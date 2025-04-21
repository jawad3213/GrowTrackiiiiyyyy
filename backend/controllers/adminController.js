const express =require("express");
const bcrypt =require("bcrypt")
const adminModel =require("../models/adminModel")


exports.addstudent = async (req,res) => {
    const {cin,phone,email,pass,name,classe} = req.body;
    try{
        const HashedPass = await bcrypt.hash(pass,10);
        const student = await adminModel.register(cin,phone,email,HashedPass,name,classe);
        res.status(201).json({message: "ajoute reussite "})
    }catch(error){
        if(error.code = 23505){
            return res.status(400).json({error: "l'eamil est deja existe !"})
        }
        res.status(500).json({message: "error server"});
    }
    
}