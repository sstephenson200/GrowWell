const ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const Garden = require("../models/gardenModel");
const Plant = require("../models/plantModel");

//Check passwords match
function checkMatchingPasswords(password1, password2) {
    if (password1 === password2) {
        return true;
    }
}

//Check if an account already exists for given email
async function checkExistingAccount(email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
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

    if ((garden_id != null && plot_number == null) || (garden_id == null && plot_number != null)) {
        return false;
    }
    return true;
}

//Check if garden name already in use for given user
async function checkExistingGardenName(name, user_id) {
    const existingGarden = await Garden.findOne({ 'name': name, 'user._id': user_id });
    if (existingGarden) {
        return true;
    }
}

//Check plot_number is valid
function checkValidPlotNumber(gardenSize, plot_number) {

    if (plot_number > 0 && plot_number < gardenSize) {
        return true;
    }
}

//Check string has valid length
function checkValidLength(string, min, max) {
    if (string.length >= min && string.length <= max) {
        return true;
    }
}

//Check length of array
function checkArrayLength(array, length) {
    if (array.length != length) {
        return false;
    } else {
        return true;
    }
}

//Check monthly schedule is valid
function checkValidMonthSchedule(schedule) {
    for (let i = 0; i < schedule.length; i++) {
        if (typeof schedule[i] !== 'number' || schedule[i] < 1 || schedule[i] > 12) {
            return false;
        }
    }
    return true;
}

//Check entered list contents are valid enum values
function checkValidPlantEnum(list) {
    let flag = false;
    const listName = list.name;
    if (typeof list.type !== 'string') {
        for (let i = 0; i < list.type.length; i++) {
            if (Object.values(Plant.schema.path(listName).$embeddedSchemaType.enumValues).includes(list.type[i])) {
                flag = true;
            } else {
                return false;
            }
        }
        return true;
    } else {
        if (Object.values(Plant.schema.path(listName))[0].includes(list.type)) {
            return true;
        }
    }
}

//Check weekly schedule is valid
function checkValidWeeklySchedule(schedule) {
    for (let i = 0; i < schedule.length; i++) {
        if (typeof schedule[i] !== 'number' || schedule[i] < 1) {
            return false;
        }
    }
    return true;
}

//Check entered password is correct
async function checkPasswordCorrect(password, storedPasswordHash) {
    const match = await bcrypt.compare(password, storedPasswordHash);
    return match;
}

module.exports = {
    checkMatchingPasswords,
    checkExistingAccount,
    checkDateInFuture,
    checkValidId,
    checkGardenAndPlotsProvided,
    checkExistingGardenName,
    checkValidPlotNumber,
    checkValidLength,
    checkArrayLength,
    checkValidMonthSchedule,
    checkValidPlantEnum,
    checkValidWeeklySchedule,
    checkPasswordCorrect
}