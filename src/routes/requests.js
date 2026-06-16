const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({ error: "User not found" });  // ✅ fixed message
        }
        //we commented this check because we are also doing this check in pre save hook of connection request model
        // if(toUserId === fromUserId.toString()) {
        //     return res.status(400).json({ error: "You cannot send a connection request to yourself" });  // ✅ fixed message
        // }

        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        //check if their is an exisiting connection request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }

            ]
        })
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()
        return res.status(200).json({ message: req.user.firstName + ' is '+ status +' in '+toUser.firstName , data });
    }
    catch (error) {
        return res.status(500).send("Error: " + (error.message || error));
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const { status, requestId } = req.params;



        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status not allowed"});
        }

        const connectionRequest = await ConnectionRequest.findOne({_id:requestId, toUserId:loggedInUser._id,
            status:"interested"
        })

        if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found or already reviewed"});
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();
        return res.status(200).json({message:"Connection request "+ status, data});

        // first of all validate the status 
        // Akshay is sending the connection request to  we have to checked whether is elon is logged in user or not 
        // loggedInId == toUserId
        // status = interested
        // request id should be valid 

    }
    catch(error){
        return res.status(500).send("Error: " + (error.message || error));
    }
})


module.exports = requestRouter;