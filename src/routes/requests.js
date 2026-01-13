const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
    try {
        const user = req.user
        console.log("Sending connection request");
        res.send(user.firstName + " send the connection request successfully  ");
    }
    catch (error) {
        return res.status(500).send("Error: " + (error.message || error));
    }
})
module.exports = requestRouter;