const express = require("express");
const connectDB = require("./config/database")

const { validateSignUpData } = require("./utils/validation")
const bcrypt = require("bcrypt")
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

const app = express();
app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {

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

app.post("/login", async (req, res) => {

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

//get the profile pf the user
app.get("/profile", userAuth, async (req, res) => {
    try {

        const user = req.user;
        res.send(user)

    } catch (error) {
        return res.status(500).send("Error: " + (error.message || error));
    }
})

app.post("/sendconnectionrequest", userAuth, async (req, res) => {
    try {
        const user = req.user
        console.log("Sending connection request");
        res.send(user.firstName + " send the connection request successfully  ");
    }
    catch (error) {
        return res.status(500).send("Error: " + (error.message || error));
    }
})

// app.get("/getalldata", async (req, res) => {
//     try {
//         const alldata = await User.find()
//         res.send(alldata)

//     } catch (error) {
//         res.status(500).send("Error in fetching the data")
//     }
// })

// // get the user by emailid

// app.get("/user", async (req, res) => {
//     const useremail = req.body.emailid;

//     try {
//         const user = await User.findOne({ emailid: useremail })
//         if (user.length === 0) {
//             return res.status(404).send("User not found")
//         } else {
//             res.send(user)
//         }

//     } catch (error) {
//         res.status(500).send("Error in accessing  the user")

//     }
// })

// //delete the user by the id 
// app.delete("/deleteuser", async (req, res) => {
//     try {
//         const userid = req.body.userid

//         const user = await User.findByIdAndDelete(userid)
//         res.send("User deleted successfully")
//     } catch (error) {
//         res.status(500).send("Error in deleting the user")
//     }
// })


// //update the user

// app.patch("/updateuser", async (req, res) => {
//     try {
//         const { userid, ...data } = req.body;
//         if (!userid) return res.status(400).send("userid is required");

//         const allowed_updates = ["photoUrl", "about", "skills", "age", "gender"];
//         const isupdateallowed = Object.keys(data).every((k) => allowed_updates.includes(k));

//         if (!isupdateallowed) {
//             return res.status(400).send("Invalid updates!"); // <-- return added
//         }

//         const updatedUser = await User.findByIdAndUpdate(
//             userid,
//             data,
//             { runValidators: true, new: true }
//         );

//         if (!updatedUser) return res.status(404).send("User not found");

//         res.send("User updated successfully");
//     } catch (error) {
//         console.error("Update error:", error);
//         res.status(500).send("Error in updating the user");
//     }
// });



connectDB().then(() => {
    console.log("Connected to DB successfully")

    app.listen(3000, () => {
        console.log("Server is listening at port 3000")
    })

})
    .catch((err) => {
        console.error("Database cannot be connected")
    })