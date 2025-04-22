const mongoose = require("mongoose");

// Define the User Schema
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true,
        trim:true,
    },
    lastName: {
        type:String,
        required:true,
        trim:true
    },
    email: {
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    token: {
        type: String,
      },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Create and Export the User Model
module.exports = mongoose.model("User", UserSchema);
