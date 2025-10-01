const express = require("express");

const app =express();

app.get("/user",(req,res,next)=>{
    res.send("route 1")
    next()
},(req,res)=>{
    console.log("Route 2")
})



app.listen(3000,()=>{
    console.log("Server is listening at port 3000")
})