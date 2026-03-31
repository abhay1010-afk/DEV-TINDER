const { default: mongoose } = require("mongoose");
const User = require("./User");

const connectionRequestSchema = new mongoose.Schema({
    fromuserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    touserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "Ignored", "Interested", "Accepted", "Rejected"],
            message: `{VALUE} is incorrect status Type`,
        },
        required: true
    },

},
    { timestamps: true });
    connectionRequestSchema.index({ fromuserId: 1, touserId: 1 });


connectionRequestSchema.pre("save", function () {
 

  if (this.fromuserId.equals(this.touserId)) {
    throw new Error("You Could not send request to yourself");
  }

  
});

const ConnectionRequest=new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=ConnectionRequest;