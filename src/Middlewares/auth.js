const adminauth=(req,res)=>{
    const token="abc";
    const adminauthorised=token==="bc";
    if(!adminauthorised){
       res.status(401).send("unauthorised access");
    }
    else{
        res.send("hello admin data");
    }
}
const userauth=(req,res,next)=>{
    const token="xyz";
    const isuserauthorised=token==="xyz";
    if(!isuserauthorised){
        res.status(404).send("Invalid User Access");
    }
    else{
        // res.send("USER IS ACCESSING THE FILES");
        next();
    }
}
module.exports={
    adminauth,
    userauth
}