const express = require("express");
const connectDB = require("./config/database")

const User = require("./models/user")

const app =express();

app.post("/signup",async(req,res)=>{
    const userobj = {
        firstName:"Virat",
        lastName:"Palde",
        emailid:"virat@gmail.com",
        password:"virat@123",
    }
    //creating a new instance of the model
    const user = new User(userobj)
    try {
        await user.save()
        res.send("User added successfully")
    } catch (error) {
        res.status(400).send("Error while adding the user")
        
    }


})






connectDB().then(()=>{
    console.log("Connected to DB successfully")

    app.listen(3000,()=>{
        console.log("Server is listening at port 3000")
    })
    
})
.catch((err) => {
    console.error("Database cannot be connected")
})