const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");

const { validationResult } = require("express-validator");
const userValidator = require("../validators/userValidator");

const passwordMailer = require("../mailer/passwordMailer");

const gardenController = require("./gardenController");
const alarmController = require("./alarmController");
const noteController = require("./noteController");

const User = require("../models/userModel");

// *** CREATE REQUESTS ***

//Request to create a new user record
const createUser = async (request, response) => {

    const { email, password, passwordVerify } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!userValidator.checkMatchingPasswords(password, passwordVerify)) {
        return response.status(200).json({ errorMessage: "Entered passwords must match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return response.status(200).json({ errorMessage: "An account already exists for this email." });
    }

    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    try {
        const newUser = new User({
            email, password_hash
        });
        const savedUser = await newUser.save();

        //Auto login
        const token = jwt.sign({
            user: savedUser._id
        }, process.env.JWT_SECRET);

        response.cookie("token", token, {
            httpOnly: true
        }).send({ message: "User created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

// *** AUTH REQUESTS ***

// Request to log user into the system using email and password
const login = async (request, response) => {

    const { email, password } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser || !await userValidator.checkPasswordCorrect(password, existingUser.password_hash)) {
        return response.status(200).json({ errorMessage: "Invalid credentials." });
    }

    const token = jwt.sign({
        user: existingUser._id
    }, process.env.JWT_SECRET);

    response.cookie("token", token, {
        httpOnly: true
    }).send({ message: "User logged in successfully." });
}

// Request to check if user is logged into system
const checkLoggedIn = async (request, response) => {

    try {
        let token = request.cookies.token;

        if (!token) {
            return response.json(false);
        }

        jwt.verify(token, process.env.JWT_SECRET);

        response.send(true);

    } catch (error) {
        response.json(false);
    }
}

// Request to log user out of the system
const logout = async (request, response) => {

    //Clear JWT cookie
    response.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    }).send({ message: "User logged out successfully." });
}

// *** GET REQUESTS ***

// Request to get a user by user_id
const getUser = async (request, response) => {

    let user_id = request.user;

    const user = await User.findOne({ _id: user_id });
    if (!user) {
        return response.status(200).json({ errorMessage: "Invalid user ID." });
    }

    return response.status(200).json({ user: user });
}

// *** DELETE REQUESTS *** 

//Request to delete a user
const deleteUser = async (request, response) => {

    let user_id = request.user;

    const { password } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const existingUser = await User.findOne({ _id: user_id });
    if (!existingUser || !await userValidator.checkPasswordCorrect(password, existingUser.password_hash)) {
        return response.status(200).json({ errorMessage: "Invalid credentials." });
    }

    try {
        const deletedGardens = await gardenController.deleteAllGardens(user_id);
        const deletedAlarms = await alarmController.deleteAllAlarms(user_id);
        const deletedNotes = await noteController.deleteAllNotes(user_id);
        const deletedUser = await User.deleteOne({ _id: user_id });

        return response.status(200).json({ message: "User deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

// *** UPDATE REQUESTS ***

//Request to update a user's email address
const updateEmail = async (request, response) => {

    let user_id = request.user;

    const { email, password } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const existingUser = await User.findOne({ _id: user_id });
    if (!existingUser || !await userValidator.checkPasswordCorrect(password, existingUser.password_hash)) {
        return response.status(200).json({ errorMessage: "Invalid credentials." });
    }

    if (email == existingUser.email) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return response.status(200).json({ errorMessage: "An account already exists for this email." });
    }

    try {
        await User.updateOne(existingUser, { "email": email });

        return response.status(200).json({ message: "Email updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a user's password
const updatePassword = async (request, response) => {

    let user_id = request.user;

    const { newPassword, newPasswordVerify, oldPassword } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const existingUser = await User.findOne({ _id: user_id });
    if (!existingUser || !await userValidator.checkPasswordCorrect(oldPassword, existingUser.password_hash)) {
        return response.status(200).json({ errorMessage: "Invalid credentials." });
    }

    if (!userValidator.checkMatchingPasswords(newPassword, newPasswordVerify)) {
        return response.status(200).json({ errorMessage: "Entered passwords must match." });
    }

    if (userValidator.checkMatchingPasswords(oldPassword, newPassword)) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    //Encrypt Password
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(newPassword, salt);

    try {
        await User.updateOne(existingUser, { "password_hash": password_hash });

        return response.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to reset a user's forgotten password
const resetPassword = async (request, response) => {

    const { email } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return response.status(200).json({ errorMessage: "No account exists for this email." });
    }

    let password = generator.generate({
        length: 25,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true
    });

    //Encrypt Password
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    try {
        await User.updateOne(existingUser, { "password_hash": password_hash });

        passwordMailer.mailer(email, password);

        return response.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

module.exports = {
    createUser,
    login,
    checkLoggedIn,
    logout,
    getUser,
    deleteUser,
    updateEmail,
    updatePassword,
    resetPassword
}