const bcrypt = require("bcrypt");

const User = require("../models/userModel");

//Check passwords match
function checkMatchingPasswords(password1, password2) {
    if (password1 === password2) {
        return true;
    }
}

//Check entered password is correct
async function checkPasswordCorrect(password, storedPasswordHash) {
    const match = await bcrypt.compare(password, storedPasswordHash);
    return match;
}


module.exports = {
    checkMatchingPasswords,
    checkPasswordCorrect
}