const ObjectId = require("mongoose").Types.ObjectId;

const User = require("../models/userModel");
const Garden = require("../models/gardenModel");

//Check passwords match
function checkMatchingPasswords(password1, password2) {
    if (password1 === password2) {
        return true;
    }
}

//Check if an account already exists for given email
async function checkExistingUser(email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return true;
    }
}

//Check if garden exists for given user
async function checkExistingGarden(garden_id, user_id) {
    const existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
    if (existingGarden) {
        return true;
    }
}

//Check if entered date is in future
function checkDateInFuture(date) {
    if (Date.parse(date) >= Date.now()) {
        return true;
    }
}

//Check if mongoose ID is valid
function checkValidId(id) {
    if (ObjectId.isValid(id)) {
        return true;
    }
}

module.exports = {
    checkMatchingPasswords,
    checkExistingUser,
    checkExistingGarden,
    checkDateInFuture,
    checkValidId
}