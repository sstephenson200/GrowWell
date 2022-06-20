const bcrypt = require("bcryptjs");
const validator = require("../validators/validator");
const { check, validationResult } = require('express-validator');

const User = require("../models/userModel");

//Create User Endpoint
const createUser = async (request, response) => {

    const { email, username, password, passwordVerify } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errors: validationErrors.array()[0].msg });
    }

    if (!validator.checkMatchingPasswords(password, passwordVerify)) {
        return response.status(400).json({ errorMessage: "Entered passwords must match." });
    }

    if (await validator.checkExistingUser(email)) {
        return response.status(400).json({ errorMessage: "An account already exists for this email." });
    }

    //Encrypt Password
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    try {

        const newUser = new User({
            email, username, password_hash
        });
        const savedUser = await newUser.save();

        return response.status(200).json({ message: "User created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }

}

module.exports = {
    createUser
}