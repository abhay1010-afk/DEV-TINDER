const express=require("express");
const ProfileRouter=express.Router();
const {userauth}=require("../Middlewares/auth");
const {validateEditData}=require("../utils/validate");
ProfileRouter.get("/Profile/view",userauth,async (req,res)=>{
     const user=req.user;
         res.send(user);
})
ProfileRouter.patch("/Profile/edit",userauth,(req,res)=>{
   try{
    if(!validateEditData(req)){
        res.status(404).send("EDIT IS NOT ALLOWED");
    }
    res.send("edit");

   }catch(err){
    res.status(404).send("ERROR:"+err.message);
   }

})
module.exports=ProfileRouter;