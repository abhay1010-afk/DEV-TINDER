const express=require("express");
const connectDB=require("./config/Database");
const bcrypt=require("bcrypt");
const app=express();
const User=require("./Models/User");
const {validatesignupdata}=require("./utils/validate");
const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
const {userauth}=require("./Middlewares/auth");
app.use(express.json());
app.use(cookieParser());
app.post("/signup",async(req,res)=>{
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
app.get("/data",async (req,res)=>{
   const userData=req.body.Age;
   try{
    const user= await User.find({Age:userData});
    console.log(user);
    res.send(user);
   }catch(err){
    console.log("error");
    res.status(404).send("SOMETHING WENT WRONG");
   }


})
app.get("/feed",async (req,res)=>{
    const getdata=req.body.LastName;
    try{
        const alldata=await User.findOne({LastName:getdata});
        console.log(alldata);
        res.send(alldata);

    }catch{
        res.status(501).send("Error in fetching the data");
    }
})
app.delete("/user",async (req,res)=>{
    const userId=req.body.userId;
    try{
        const user=await User.findByIdAndDelete({_id:userId});
        res.send("User deleted successfully");
    }catch(err){
          res.status(501).send("Error in deleting the user");
    }

})
app.patch("/userUpdate/:userId",async (req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    console.log(data);
    try{
        const allowed_data=["About","skills","PhNumber","Gender"];
        const isupdateallowed=Object.keys(data).every((k)=>{
            return allowed_data.includes(k);

        });
        console.log(isupdateallowed);
        if(!isupdateallowed){
            throw new Error("data is not allowed to change");
        }
       
       const user= await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"before",
            runValidators:true,
        });
        console.log(user);
       res.send("Data Updated SuccessFully");
    }
    catch(err){
          res.status(501).send("Error in Updating the User");
    }
})
app.post("/login",async (req,res)=>{
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
})
app.get("/Profile",userauth,async (req,res)=>{
     const user=req.user;
         res.send(user);
})

connectDB().then(()=>{
    console.log("connections established succesfully");
    app.listen(7777,()=>{
    console.log("server is running on port number 7777");
})
}).catch((err)=>{
    console.error("error in esatblishing connections");
})


 