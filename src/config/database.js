const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://kbtug22004_db_user:shubham1234@mingle1.fo0eqru.mongodb.net/Mingle")
}

module.exports = connectDB;