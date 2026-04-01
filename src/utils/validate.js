const validator=require("validator");
const validatesignupdata=(req)=>{
    const {firstName,LastName,password,email}=req.body;
    if(!firstName||!LastName){
        throw new Error("Name is not send correctly or there is some error in sending the name");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong "+password);
    }
    if(!validator.isEmail(email)){
        throw new Error("Email is invalid"+email);
    }
}
const validateEditData=(req)=>{
    const allowedEditData=["Age","firstName","About","Skills","Gender","LastName"];
   const isupdateallowed= Object.keys(req).every((k)=>{
         allowedEditData.includes(k);
    })
    return isupdateallowed;
}
module.exports={
    validatesignupdata,
    validateEditData
};