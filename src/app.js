const express = require("express");
const connectDB = require("./config/database")
const validator = require("validator")

const User = require("./models/user")

const app = express();
app.use(express.json())

app.post("/signup", async (req, res) => {

    try {
        const data = req.body;

        const user = new User(data)
        await user.save()
        res.send("User added to database successfully")

    } catch (error) {
        res.status(500).send("Error in saving the user")
    }

})

app.get("/getalldata",async(req,res)=>{
    try {
        const alldata = await User.find()
        res.send(alldata)
        
    } catch (error) {
        res.status(500).send("Error in fetching the data")
    }
})

// get the user by emailid

app.get("/user",async(req,res)=>{
    const useremail = req.body.emailid;

    try {
        const user = await User.findOne({emailid:useremail})
        if (user.length===0){
            return res.status(404).send("User not found")
        }else{
            res.send(user)
        }
        
    } catch (error) {
        res.status(500).send("Error in accessing  the user")

    }
})

//delete the user by the id 
app.delete("/deleteuser",async(req,res)=>{
    try {
        const userid = req.body.userid
        
        const user = await User.findByIdAndDelete(userid)
        res.send("User deleted successfully")
    } catch (error) {
        res.status(500).send("Error in deleting the user")
    }
})


//update the user

app.patch("/updateuser", async (req, res) => {
  try {
    const { userid, ...data } = req.body;
    if (!userid) return res.status(400).send("userid is required");

    const allowed_updates = ["photoUrl", "about", "skills", "age", "gender"];
    const isupdateallowed = Object.keys(data).every((k) => allowed_updates.includes(k));

    if (!isupdateallowed) {
      return res.status(400).send("Invalid updates!"); // <-- return added
    }

    const updatedUser = await User.findByIdAndUpdate(
      userid,
      data,
      { runValidators: true, new: true }
    );

    if (!updatedUser) return res.status(404).send("User not found");

    res.send("User updated successfully");
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send("Error in updating the user");
  }
});








connectDB().then(() => {
    console.log("Connected to DB successfully")

    app.listen(3000, () => {
        console.log("Server is listening at port 3000")
    })

})
    .catch((err) => {
        console.error("Database cannot be connected")
    })