const express=require("express");
const connectDB=require("./config/Database");
const app=express();
const User=require("./Models/User");
app.use(express.json());
app.post("/signup",async(req,res)=>{
    // const user=new User({
    //     firstName:"Sanu",
    //     LastName:"Tomar",
    //     password:"abhay1010@",
    //     Age:21,
    //     PhNumber:626110903,

     const user=new User(req.body);   
    
    
    try{
    await user.save();
    console.log(user);
    res.send("Request Send Succesfully");
    }catch{(err)=>{
res.status(400).send("There is error sending the request"+err.message);
    }}
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
app.patch("/userUpdate",async (req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    console.log(data);
    try{
       const user= await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"before"
        });
        console.log(user);
       res.send("Data Updated SuccessFully");
    }
    catch(err){
          res.status(501).send("Error in Updating the User");
    }
})

connectDB().then(()=>{
    console.log("connections established succesfully");
    app.listen(7777,()=>{
    console.log("server is running on port number 7777");
})
}).catch((err)=>{
    console.error("error in esatblishing connections");
})


 