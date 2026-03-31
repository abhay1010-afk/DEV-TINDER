const express=require("express");
const validator = require("validator");
const bcrypt=require("bcrypt");
const User=require("../Models/User");
const {userauth}=require("../Middlewares/auth")
const {validatesignupdata}=require("../utils/validate");

const authRouter=express.Router();
authRouter.post("/signup",async(req,res)=>{
    try{
    validatesignupdata(req);
 
  
    const {firstName,LastName,email,password,Age,PhNumber}=req.body;
    console.log(password);
     
     const hashedPassword=await bcrypt.hash(password,10);
     console.log(hashedPassword); 
     const user=new User({
        firstName:firstName,
        LastName:LastName,
        email:email,
        password:hashedPassword,
        Age:Age,
        PhNumber:PhNumber
     });  
    
    
    
    await user.save();
    console.log(user);
    res.send("Request Send Succesfully");
    }catch(err){
res.status(400).send("There is error sending the request"+err.message);
    }
})
authRouter.post("/login",async (req,res)=>{
    try{
        const {email,password}=req.body;
      const user= await User.findOne({email:email});
      if(!user){
        throw new Error("INVAILD CREDENTIALS");
      }
      const checkLogin=await user.validatePassword(password);
      if(checkLogin){
       const token=await user.getJWT();
       console.log(token);
       res.cookie("token",token,{
        expires:new Date(Date.now()+8*360000)
       });
        res.send("Login Successfull");
      }else{
        throw new Error("LOGIN IS UNSUCCESSFULL");
      }

    }catch(err){
        res.status(401).send("ERROR :"+err.message)
    }
});
authRouter.post("/logout",async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.send("LogOut successfulll");
})
authRouter.patch("/forgetPassword", async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = email || username;
    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid Credential" });
    }
    //* need to add otp verification of userId

    const { password } = req.body;
    console.log(password);

    if (validator.isStrongPassword(password)) {
      const passwordHash = await bcrypt.hash(password, 10);
      user.password = passwordHash;
      user.save();
      res.status(200).json({ message: "Password Has Been changed" });
    } else {
      throw new Error("Password is not strong");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
authRouter.patch("/changePassword", userauth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ error: "Please login again" });
    }
    const { password, newPassword } = req.body;

    if (validator.isStrongPassword(newPassword)) {
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        console.log(passwordHash);
        user.password = passwordHash;
        user.save();
        res.status(200).json({ message: "Password Has Been changed" });
      } else {
        throw new Error("Password is incorrect");
      }
    } else {
      throw new Error("Password is not strong");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports=
    authRouter
