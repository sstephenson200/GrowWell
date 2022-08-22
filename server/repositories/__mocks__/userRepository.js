const bcrypt = require("bcrypt");

const User = require("../../models/userModel");

//Mock user repository for use in unit testing

async function CreateUser(email, password_hash) {
    let newUser = new User({
        email, password_hash
    });
    return newUser;
}

async function GetUser(user_id) {
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash("password", salt);

    let existingUser = new User({
        email: "email", password_hash
    });
    return existingUser;
}

async function GetUserByEmail(email) {
    if (email === "nonExisting@email.com") {
        return undefined;
    } else {
        let salt = await bcrypt.genSalt();
        let password_hash = await bcrypt.hash("password", salt);
        let existingUser = new User({
            email, password_hash
        });
        return existingUser;
    }
}

async function DeleteUser(user_id) {
    let email = "email";
    let password_hash = "password";
    return (
        new User({
            email, password_hash
        })
    );
}

async function UpdateEmail(existingUser, email) {
    return;
}

async function UpdatePassword(existingUser, password_hash) {
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