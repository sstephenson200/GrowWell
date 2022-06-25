const ObjectId = require("mongoose").Types.ObjectId;

//Check if mongoose ID is valid
function checkValidId(id) {
    if (ObjectId.isValid(id)) {
        return true;
    }
}

//Check string has valid length
function checkValidLength(string, min, max) {
    if (string.length >= min && string.length <= max) {
        return true;
    }
}

module.exports = {
    checkValidId,
    checkValidLength
}