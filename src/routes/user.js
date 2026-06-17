const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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
        return res.status(200).json({data});

    }
    catch(error){
        return res.status(400).send("Error: " + (error.message || error));
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) ||1 
        let limit = parseInt(req.query.limit) || 10 ;
        limit = limit>50?50 :limit;
        const skip = (page - 1) * limit;
        //user should see all the cards but should not see the cards of the users who have sent connection requests to him/her and also should not see the cards of the users to whom he/she has sent connection requests and his own card should also not be visible to him/her
        //0.his own cars
        //1.his connections
        //2. ignored people
        //3. already sent the connection request


        const connectionRequests = await ConnectionRequest.find({
            $or:[
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((request) => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        }) 

        const users = await User.find({
           $and:[ {_id: { $nin: Array.from(hideUsersFromFeed)}},
            { _id: { $ne: loggedInUser._id } }],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.json({ data: users });

    }
    catch(error){
        return res.status(400).send("Error: " + (error.message || error));
    }
})


module.exports = userRouter;