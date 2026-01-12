const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
    //read the token from the cookie

    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Token is not valid")
        }
        //validate the token 
        const decodedobj = await jwt.verify(token, "Mingle@12345")
        //find the user
        const { _id } = decodedobj
        const user = await User.findById(_id)
        if (!user) {
            return res.status(401).send("Unauthorized: User not found")
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(500).send("Error: " + (error.message || error));

    }


}


module.exports = { userAuth }