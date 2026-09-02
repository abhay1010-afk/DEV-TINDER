const express=require('express');
const { userauth } = require('../Middlewares/auth');
const ConnectionRequest = require('../Models/connecttionRequest');
const User = require('../Models/User');
const userRoutes=express.Router();
const USER_SAFE_DATA="firstName LastName Gender Age About skills ImgUrl"

userRoutes.get("/user/requests/received",userauth,async (req,res)=>{
    try{
        const loggedinUser=req.user;
        const connectionRequest=await ConnectionRequest.find({
            status:"Interested",
            touserId:loggedinUser._id,
        }).populate("fromuserId",USER_SAFE_DATA);
        res.json({
            message:"Data fetched Successfully",
            data:connectionRequest
            
        });

    }catch{
        res.status(404).json({err:"INVALID REQUEST SENT!!"});
    }
})
userRoutes.get("/user/connections",userauth,async (req,res)=>{
    try{
        const loggedinUser=req.user;
        const connections=await ConnectionRequest.find({
            $or:[
                
                {touserId:loggedinUser._id,status:"Accepted"},
                {fromuserId:loggedinUser._id,status:"Accepted"}],
        }).populate("fromuserId",USER_SAFE_DATA).populate("touserId",USER_SAFE_DATA);
        const data=  connections.map((row)=>{
            if(row.fromuserId._id.toString()===loggedinUser._id.toString()){
                return row.touserId;
            }else{
                return row.fromuserId;
            }
        });
        res.json({
            data
        });

    }catch{
        res.status(400).json({err:"Error in finding connections!!"});
    }
})
userRoutes.get("/feed",userauth,async (req,res)=>{
    try{
        const loggedinUser=req.user;
        const page=parseInt(req.query.page);
        let limit=parseInt(req.query.limit);
        const skip=(page-1)*limit;

        const connectionRequest=await ConnectionRequest.find({
            $or:[{
                fromuserId:loggedinUser._id},
                {touserId:loggedinUser._id}]
        }).select("fromuserId touserId");
        const hideUserFromFeed= new Set();
        connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromuserId.toString());
            hideUserFromFeed.add(req.touserId.toString());
        })
        // console.log(hideUserFromFeed);
        const users=await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUserFromFeed)}},
                {_id:{$ne:loggedinUser._id}},
                
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.send(users);

    }catch(err){
        res.status(404).json({message:err.message});
    }
})
module.exports={userRoutes};