const User = require("../models/userModel");

//User repository for use in production

async function CreateUser(email, password_hash) {
    let newUser = new User({
        email, password_hash
    });
    const savedUser = await newUser.save();
    return savedUser;
}

async function GetUser(user_id) {
    let existingUser = await User.findOne({ _id: user_id });
    return existingUser;
}

async function GetUserByEmail(email) {
    let existingUser = await User.findOne({ email });
    return existingUser;
}

async function DeleteUser(user_id) {
    let deletedUser = await User.deleteOne({ _id: user_id });
    return deletedUser;
}

async function UpdateEmail(existingUser, email) {
    await User.updateOne(existingUser, { "email": email });
    return;
}

async function UpdatePassword(existingUser, password_hash) {
    await User.updateOne(existingUser, { "password_hash": password_hash });
    return;
}

module.exports = {
    CreateUser,
    GetUser,
    GetUserByEmail,
    DeleteUser,
    UpdateEmail,
    UpdatePassword
}