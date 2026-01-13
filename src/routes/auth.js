const express = require("express")
const { validateSignUpData } = require("../utils/validation")
const bcrypt = require("bcrypt")
const User = require("../models/user")

const authRouter = express.Router()


authRouter.post("/signup", async (req, res) => {

    try {
        //validating the data
        validateSignUpData(req)
        const { firstName, lastName, emailid, password } = req.body
        //encrypt the password and then store it into the database
        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({ firstName, lastName, emailid, password: passwordHash })
        await user.save()
        res.send("User added to database successfully")

    } catch (err) {
        res.status(500).send("Error in saving the user:" + err.message)
    }

})

authRouter.post("/login", async (req, res) => {

    try {

        const { emailid, password } = req.body

        if (!emailid || !password) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const user = await User.findOne({ emailid: emailid })

        if (!user) {
            throw new Error("Invalid Credentials")
        }

        const ispasswordvalid = await user.validatePassword(password)

        if (ispasswordvalid) {
            //create a jwt token
            const token = await user.getJWT()

            //Add the token to cookie and send the response back to the user
            res.cookie("token", token, { expires: new Date(Date.now() + 86400000) })

            return res.status(200).json({ message: "Login successful" });
        } else {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

    } catch (error) {
        return res.status(500).send("Error: " + (error.message || error));
    }

})
authRouter.post("/logout",async(req,res)=>{
    try {
         res.cookie("token",null,{expires:new Date(Date.now())}) 
        
        res.send("Logout Successfully") 
        
    } catch (error) {
        return res.status(500).send("Error: " + (error.message || error));
    }
})

module.exports = authRouter

