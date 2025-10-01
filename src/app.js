const express = require("express");

const app =express();




//learning about the try catch block means error handling
app.get("/getuserdata",(req,res)=>{
    
   try {
     throw new Error("Some error occured")
     res.send("User data sent")
   } catch (error) {
        res.status(500).send("Some error occured at server")
   }
})


app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Some error occured at server")
    }
})

app.listen(3000,()=>{
    console.log("Server is listening at port 3000")
})