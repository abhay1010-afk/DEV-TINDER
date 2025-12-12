const jwt=require('jsonwebtoken');
const User = require('../Models/User');
const userauth=async (req,res,next)=>{
    try{
    const {token}=req.cookies;
    if(!token){
        throw new Error("Invalid token");
    }
    const decodeMessage=await jwt.verify(token,"Abhay1010@");
    const {_id}=decodeMessage;
    const user=await User.findById(_id);
    if(!user){
        throw new Error("User Does not exist");
    }
    req.user=user;
    next();
    }catch(err){
        res.status(404).send("ERROR:"+err.message);
    }


   
}
module.exports={
  
    userauth
}