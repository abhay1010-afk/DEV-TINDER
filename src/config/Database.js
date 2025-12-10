const mongoose=require("mongoose");
const connectDB=async ()=>{
    await mongoose.connect("mongodb+srv://abhaytomar1010_db_user:mCtCAaX2W4dNzUKr@learningnode.pdrlwsa.mongodb.net/devtinder");
};

module.exports=connectDB;
