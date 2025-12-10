const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
    firstName:{
        type:String
    },
    LastName:{
        type:String
    },
    password:{
        type:String
    },
    Gender:{
        type:String
    },
    Age:{
        type:Number
    },
    PhNumber:{
        type:Number
    }


});
module.exports=mongoose.model("User",UserSchema);