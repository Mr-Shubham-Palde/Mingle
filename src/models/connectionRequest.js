const e = require('express')
const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","accepted","rejected","interested"],
            message:"{VALUE} is not a valid status"
        },
        required:true
    }
},{
    timestamps:true
})
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    //check if fromuserid and touserid are same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId) ){
        throw new Error("You cannot send a connection request to yourself");
    }
    next()
})





const ConnectionRequest = new  mongoose.model("ConnectionRequest", connectionRequestSchema);


module.exports = ConnectionRequest;