const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlenght: 45
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlenght: 45

    },
    emailid: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Mongoose setter -> converts to lowercase on save
        trim: true,     // removes leading/trailing whitespace
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter a valid email" + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Please Enter a Strong Password:" + value)
            }
        }

    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/07/88/67/21/360_F_788672190_maGwfDtey1ep9BqZsLO9f6LaUkIBMNt1.jpg",// deafult image if user does not provide any image
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Pleae Enter Strong Password:" + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String],//an array of strings
        validate: {
        validator: function(arr) {
            return arr.length <= 20; // max 20 skills
        },
        message: "Maximum 20 skills are allowed"
    }
    },
},
    { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User;