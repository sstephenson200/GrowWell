const mongoose = require("mongoose");

//Create User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    password_hash: { type: String, required: true }
});

const User = mongoose.model("user", userSchema);
module.exports = User;