const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

//Build Endpoints
router.post("/createUser", async (request, response) => {
    try {
        const { email, username, password, passwordVerify } = request.body;

        //Validation - Check All Fields Provided
        if (!email || !username || !password || !passwordVerify) {
            return response.status(400).json({ errorMessage: "Data not provided." });
        }

        //Validation - Check Username Length
        if (username.length < 4) {
            return response.status(400).json({ errorMessage: "Username must be 4 characters or longer." });
        }

        //Validation - Check Password Length
        if (password.length < 8) {
            return response.status(400).json({ errorMessage: "Password must be 8 characters or longer." });
        }

        //Validation - Check Passwords Match
        if (password !== passwordVerify) {
            return response.status(400).json({ errorMessage: "Entered passwords must match." });
        }

        //Validation - Check if User Account Already Exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ errorMessage: "An account already exists for this email." });
        }

        //Encrypt Password
        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash(password, salt);

        //Create User
        const newUser = new User({
            email, username, password_hash
        });
        const savedUser = await newUser.save();

        return response.status(200).json({ message: "User created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
});

module.exports = router;