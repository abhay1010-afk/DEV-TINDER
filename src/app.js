const express=require("express");
const app=express();
app.use("/test",(req,res)=>{
    res.send("hello wlcm to routing .");
});
app.use("/hello",(req,res)=>{
    res.send("RCB won the ipl 2025");
});
app.use((req,res)=>{
    res.send("hello abhay welcome to backend ");
});
app.listen(7777,()=>{
    console.log("server is running on port number 7777");
})
