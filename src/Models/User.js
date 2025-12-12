const mongoose=require("mongoose");
const validator=require("validator");

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
        required:true,

    },
    PhNumber:{
        type:Number,
        default:280830802,
        
        
    },
    About:{
        type:String,
        default:"I am a computer science engineer",
        uppercase:true,
    },
    skills:{
        type:[String],
        default:["javascript"]
    }


},{
    timestamps:true
});
module.exports=mongoose.model("User",UserSchema);