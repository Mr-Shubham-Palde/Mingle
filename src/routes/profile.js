const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {

        const user = req.user;
        res.send(user)

    } catch (error) {
        return res.status(500).send("Error: " + (error.message || error));
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).send("Error: Invalid Edit Fields")
        }
        const loggedinuser = req.user;

        Object.keys(req.body).forEach(k => {
            loggedinuser[k] = req.body[k]
        })
        await loggedinuser.save();
        res.json({ message: "Profile Updated Successfully", user: loggedinuser });

    } catch (error) {
        return res.status(500).send("Error: " + (error.message || error));

    }
})
module.exports = profileRouter;