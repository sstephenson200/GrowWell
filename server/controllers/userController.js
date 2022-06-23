const bcrypt = require("bcrypt");
const validator = require("../validators/validator");
const { check, validationResult } = require('express-validator');

const User = require("../models/userModel");

//Request to create a new user record
const createUser = async (request, response) => {

    const { email, username, password, passwordVerify } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkMatchingPasswords(password, passwordVerify)) {
        return response.status(400).json({ errorMessage: "Entered passwords must match." });
    }

    if (await validator.checkExistingAccount(email)) {
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

// Request to get a user's username by user_id
const getUsername = async (request, response) => {

    const { user_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const username = await User.findOne({ user_id }).select("username");

    if (!username) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    return response.status(200).json({ username: username });
}

// Request to log user into the system using email and password
const login = async (request, response) => {

    //JWT AUTH TO BE ADDED IN LATER SPRINT

    const { email, password } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        return response.status(401).json({ errorMessage: "Invalid credentials." });
    }

    if (!await validator.checkPasswordCorrect(password, existingUser.password_hash)) {
        return response.status(401).json({ errorMessage: "Invalid credentials." });
    }

    return response.status(200).json({ message: "You're ready to login!" });
}

//Request to delete a user
const deleteUser = async (request, response) => {

    const { user_id, password } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (! await validator.checkPasswordCorrect(password, existingUser.password_hash)) {
        return response.status(401).json({ errorMessage: "Invalid credentials." });
    }

    try {

        //need to delete gardens, alarms, notes before deleting user

        await User.deleteOne(existingUser);

        return response.status(200).json({ message: "User deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a user's username
const updateUsername = async (request, response) => {

    const { user_id, username, password } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (username == existingUser.username) {
        return response.status(400).json({ errorMessage: "No username change detected." });
    }

    if (! await validator.checkPasswordCorrect(password, existingUser.password_hash)) {
        return response.status(401).json({ errorMessage: "Invalid credentials." });
    }

    try {

        await User.updateOne(existingUser, { username: username });

        return response.status(200).json({ message: "Username updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a user's email address
const updateEmail = async (request, response) => {

    const { user_id, email, password } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (email == existingUser.email) {
        return response.status(400).json({ errorMessage: "No email change detected." });
    }

    if (! await validator.checkPasswordCorrect(password, existingUser.password_hash)) {
        return response.status(401).json({ errorMessage: "Invalid credentials." });
    }

    try {

        await User.updateOne(existingUser, { email: email });

        return response.status(200).json({ message: "Email updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a user's password
const updatePassword = async (request, response) => {

    const { user_id, newPassword, newPasswordVerify, oldPassword } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkMatchingPasswords(newPassword, newPasswordVerify)) {
        return response.status(400).json({ errorMessage: "Entered passwords must match." });
    }

    if (! await validator.checkPasswordCorrect(oldPassword, existingUser.password_hash)) {
        return response.status(401).json({ errorMessage: "Invalid credentials." });
    }

    if (oldPassword == newPassword) {
        return response.status(400).json({ errorMessage: "No password change detected." });
    }

    //Encrypt Password
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(newPassword, salt);

    try {

        await User.updateOne(existingUser, { password_hash: password_hash });

        return response.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

module.exports = {
    createUser,
    getUsername,
    login,
    deleteUser,
    updateUsername,
    updateEmail,
    updatePassword
}