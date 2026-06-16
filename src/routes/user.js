const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills "

userRouter.get("/user/requests/received",userAuth,async (req,res) => {

    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({ toUserId: loggedInUser._id , 
        status:"interested"
    }).populate("fromUserId",["firstName","lastName","photoUrl","age"]);// you can alos write like this .populate("fromUserId","firstName lastName"); not inside the array just the values that we want and seperated by the spaces

        return res.status(200).json({ data: connectionRequests });
    }
    catch(error){
        return res.status(500).send("Error: " + (error.message || error));
    }
}
)
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser= req.user;

        const connectionrequests = await ConnectionRequest.find({
            $or:[
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id,status : "accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA)// we can also write like this .populate("fromUserId toUserId","firstName lastName") not inside the array just the values that we want and seperated by the spaces

        const data = connectionrequests.map((row) => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        return res.status(200).json({ data});

    }
    catch(error){
        return res.status(400).send("Error: " + (error.message || error));
    }
})




module.exports = userRouter;