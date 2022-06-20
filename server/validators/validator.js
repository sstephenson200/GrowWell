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

//Check if both garden_id and plot_number are provided
function checkGardenAndPlotsProvided(garden_id, plot_number) {
    if (garden_id != null && plot_number == null) {
        return false;
    }

    if (garden_id == null && plot_number != null) {
        return false;
    }
}

//Check if garden name already in use for given user
async function checkExistingGardenName(name, user_id) {
    const existingGarden = await Garden.findOne({ 'name': name, 'user._id': user_id });
    if (existingGarden) {
        return true;
    }
}

//Check plot_number is valid
// ***** NEED TO ADD IF PLOT NUMBER>GARDEN.PLOT.LENGTH WHEN GET GARDEN IS WRITTEN *****
function checkValidPlotNumber(garden_id, plot_number) {
    if (plot_number < 0) {
        return false;
    }
}

//Check string has valid length
function checkValidLength(string, min, max) {
    if (string.length >= min && string.length <= max) {
        return true;
    }
}

module.exports = {
    checkMatchingPasswords,
    checkExistingUser,
    checkExistingGarden,
    checkDateInFuture,
    checkValidId,
    checkGardenAndPlotsProvided,
    checkExistingGardenName,
    checkValidPlotNumber,
    checkValidLength
}