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
const validateEditData = (req) => {
    const allowedEditData = ["Age", "firstName", "About", "Skills", "Gender", "LastName","ImgUrl"];
    const isUpdateAllowed = Object.keys(req.body).every((k) => {
        return allowedEditData.includes(k); 
    });
    return isUpdateAllowed;
}
module.exports={
    validatesignupdata,
    validateEditData
};