const mongoose=require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const UserSchema=new mongoose.Schema({
    firstName:{
        type:String,
        // required:true,
        
        minLength:4,
    },
    LastName:{
        type:String,
        // required:true,
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("the password you entered in not strong "+value);
            }
        }
    
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("the email you entered in invalid "+value);
        }
      }
       
    },
    Gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender Data is invalid");
                
            }

        }
    },
    Age:{
        type:Number,
        required:false,

    },
    PhNumber:{
        type:String,
        
        
        
        
    },
    About:{
        type:String,
        default:"I am a computer science engineer",
        uppercase:true,
    },
    skills:{
        type:[String],
        default:["javascript"]
    },
    ImgUrl:{
        type:String,
        default:"https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHVua25vd258ZW58MHx8MHx8fDA%3D"

    }


},{
    timestamps:true
});
UserSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"Abhay1010@",{
        expiresIn:"1d"
    })
    return token;
    
}
UserSchema.methods.validatePassword=async function(inputpasswordbyuser){
    const hashedPassword=this.password;
    const isvalidatePassword=await bcrypt.compare(inputpasswordbyuser,hashedPassword);
    return isvalidatePassword;
}
module.exports=mongoose.model("User",UserSchema);