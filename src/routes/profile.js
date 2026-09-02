const express=require("express");
const ProfileRouter=express.Router();
const {userauth}=require("../Middlewares/auth");
const {validateEditData}=require("../utils/validate");
ProfileRouter.get("/Profile/view",userauth,async (req,res)=>{
     const user=req.user;
         res.send(user);
})
ProfileRouter.patch("/Profile/edit", userauth, async (req, res) => {
   console.log("BODY:", req.body); // 👈 add this
   try {
     if (!validateEditData(req)) {
       console.log("VALIDATION FAILED"); // 👈 add this
       return res.status(404).send("EDIT IS NOT ALLOWED");
     }
     
     const loggedinUser=req.user;
     Object.keys(req.body).forEach((key)=>(loggedinUser[key]=req.body[key]));
     await loggedinUser.save();
     res.json({
        message:`${loggedinUser.firstName},your Profile updated successfully`,
        data:loggedinUser,
     });


     
   } catch (err) {
     res.status(404).send("ERROR:" + err.message);
   }
})
module.exports=ProfileRouter;