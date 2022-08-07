const router = require("express").Router();

const auth = require("../middleware/auth");

const { check } = require('express-validator');

const userController = require("../controllers/userController");

// *** CREATE REQUESTS ***

//Request to create a new user
router.post("/createUser", [
    check('email')
        .not().isEmpty().withMessage("Email required.")
        .isEmail().withMessage("Invalid email.")
        .normalizeEmail()
        .trim(),
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .isLength({ min: 8, max: 30 }).withMessage("Password must be between 8 and 30 characters.")
        .trim(),
    check('passwordVerify')
        .not().isEmpty().withMessage("Password_verify required.")
        .isLength({ min: 8, max: 30 }).withMessage("Password must be between 8 and 30 characters.")
        .trim(),
], userController.createUser);

// *** AUTH REQUESTS***

//Request to log a user into their account using email and password
router.post("/login", [
    check('email')
        .not().isEmpty().withMessage("Email required.")
        .isEmail().withMessage("Invalid email.")
        .normalizeEmail()
        .trim(),
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .trim()
], userController.login);

// Request to check if user is logged into system and fully authenticated
router.get("/checkLoggedIn", userController.checkLoggedIn);

// Request to log user out of the system by invalidating their JWT
router.get("/logout", auth, userController.logout);

// *** GET REQUESTS ***

//Request to get user data for logged in user
router.post("/getUser", auth, userController.getUser);

// *** DELETE REQUESTS ***

//Request to delete a user account
router.delete("/deleteUser", [
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .trim()
], auth, userController.deleteUser);

// *** UPDATE REQUESTS ***

//Request to update a user's email address for use in login
router.put("/updateEmail", [
    check('email')
        .not().isEmpty().withMessage("Email required.")
        .isEmail().withMessage("Invalid email.")
        .normalizeEmail()
        .trim(),
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .trim()
], auth, userController.updateEmail);

//Request to update a user's password for use in login
router.put("/updatePassword", [
    check('newPassword')
        .not().isEmpty().withMessage("New password required.")
        .isLength({ min: 8, max: 30 }).withMessage("Password must be between 8 and 30 characters.")
        .trim(),
    check('oldPassword')
        .not().isEmpty().withMessage("Old password required.")
        .trim(),
    check('newPasswordVerify')
        .not().isEmpty().withMessage("New password verification required.")
        .trim(),
], auth, userController.updatePassword);

//Request to reset user's password to a randomly generated password - this triggers an email being sent to the user's email address with their new password
router.put("/resetPassword", [
    check('email')
        .not().isEmpty().withMessage("Email required.")
        .isEmail().withMessage("Invalid email.")
        .normalizeEmail()
        .trim(),
], userController.resetPassword);

module.exports = router;