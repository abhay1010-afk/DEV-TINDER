const express = require("express");
const connectDB = require("./config/Database");

const app = express();
const User = require("./Models/User");

const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const ProfileRouter = require("./routes/profile");
const requestRouter=require("./routes/request");
const {userRoutes}=require("./routes/user");
const cors=require("cors");


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
}));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", ProfileRouter);
app.use("/",requestRouter);
app.use("/",userRoutes);

app.get("/data", async (req, res) => {
    const userData = req.body.Age;
    try {
        const user = await User.find({ Age: userData });
        console.log(user);
        res.send(user);
    } catch (err) {
        console.log("error");
        res.status(404).send("SOMETHING WENT WRONG");
    }


})
app.get("/feed", async (req, res) => {
    const getdata = req.body.LastName;
    try {
        const alldata = await User.find({ LastName: getdata });
        console.log(alldata);
        res.send(alldata);

    } catch {
        res.status(501).send("Error in fetching the data");
    }
})
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _id: userId });
        res.send("User deleted successfully");
    } catch (err) {
        res.status(501).send("Error in deleting the user");
    }

})
app.patch("/userUpdate/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    console.log(data);
    try {
        const allowed_data = ["About", "skills", "PhNumber", "Gender","LastName","ImgUrl"];
        const isupdateallowed = Object.keys(data).every((k) => {
            return allowed_data.includes(k);

        });
        console.log(isupdateallowed);
        if (!isupdateallowed) {
            throw new Error("data is not allowed to change");
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "before",
            runValidators: true,
        });
        console.log(user);
        res.send("Data Updated SuccessFully");
    }
    catch (err) {
        res.status(501).send("Error in Updating the User");
    }
})


connectDB().then(() => {
    console.log("connections established succesfully");
    app.listen(7777, () => {
        console.log("server is running on port number 7777");
    })
}).catch((err) => {
    console.error("error in esatblishing connections");
})


