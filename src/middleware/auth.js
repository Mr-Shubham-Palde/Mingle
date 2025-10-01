const express = require("express");
 const adminAuth = (req,res,next)=>{

    const token = "xyz"
    const isauthenticated = token === "xyz"

    if(!isauthenticated){
        res.stautus(400).send("Unauthorized request")
    }
    else{
        next()
    }

}
const userAuth = (req,res,next)=>{
    console.log("User Auth is getting checked")
    const token = "xyz"
    const isauthenticated = token === "xyz"

    if(!isauthenticated){
        res.stautus(400).send("Unauthorized request")
    }
    else{
        next()
    }

}


module.exports = {adminAuth,userAuth}