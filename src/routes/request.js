const express=require('express');
const { userauth } = require('../Middlewares/auth');
const { default: mongoose } = require('mongoose');
const User = require('../Models/User');
const ConnectionRequest = require('../Models/connecttionRequest');

const requestRouter=express.Router();
requestRouter.post("/request/send/:status/:touserId",userauth,async (req,res,next)=>{
    try{
        const user=req.user;
        if(!user){
            return res.status(404).json({error:"Unauthorised Access!!"});
        }
        const fromuserId=user._id;
        const {status,touserId}=req.params;
        if(mongoose.Types.ObjectId.isValid(touserId)){
            const isTouserExist=await User.findById(touserId);
            if(!isTouserExist){
                return res.status(404).json({error:"INValid to user id"});
            }
         }else{
            return res.status(404).json({error:"INVALID USER CREDENTIALS"});
         }
         if (fromuserId.toString() === touserId) {
  return res.status(400).json({ error: "Cannot send request to yourself !!" });
}
        
         const allowedStatus=["Ignored","Interested"];
         if(!allowedStatus.includes(status)){
            return res.status(404).json({error:`invalid status type ${status}`});
         }
         const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[{
                fromuserId,touserId
            },{fromuserId:touserId,touserId:fromuserId}],
         });
         if(existingConnectionRequest){
            return res.status(404).json({error:"There is already a request has been sent By you!!"});
         }
         const connectionRequest=new ConnectionRequest({
            fromuserId,touserId,status
         });
         const data=await connectionRequest.save();
         if (status === "Interested") {
        res.status(200).json({ message: "Connection request Send" });
      } else if (status === "Ignored") {
        res.status(200).json({ message: "User ignored" });
      } else {
        res.status(400).json({ error: "Invalid request type" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);
requestRouter.post("/request/review/:status/:requestId",userauth,async (req,res)=>{
  try{
  const loggedinUser=req.user;
  const {status,requestId}=req.params;
  const allowedStatus=["Accepted","Rejected"];
  if(!allowedStatus.includes(status)){
    return res.status(404).json({err:"INVALID STATUS Sent !!"});
  }
  const connectionRequest= await  ConnectionRequest.findOne({
    _id:requestId,
    touserId:loggedinUser._id,
    status:"Interested"
  });
 
  if(!connectionRequest){
    return res.status(404).json({err:"connection can not established!!"});
  }
  connectionRequest.status=status;
  const data=await connectionRequest.save();

  res.json({message:"Connection Request :"+status,data});
  
  }catch{
     return res.status(404).json({err:"CONNECTION REQUEST NOT FOUND!!"});
  }
})
    
   

module.exports=requestRouter;