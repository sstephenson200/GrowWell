const router = require("express").Router();

const { check, validationResult } = require('express-validator');

const userController = require("../controllers/userController");

router.post("/createUser", [
    check('email')
        .not().isEmpty().withMessage("Email required.")
        .isEmail().withMessage("Invalid email.")
        .normalizeEmail()
        .trim(),
    check('username')
        .not().isEmpty().withMessage("Username required.")
        .isLength({ min: 4, max: 30 }).withMessage("Username must be between 4 and 30 characters.")
        .trim(),
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .isLength({ min: 8, max: 30 }).withMessage("Password must be between 8 and 30 characters.")
        .trim(),
    check('passwordVerify')
        .not().isEmpty().withMessage("Password_verify required.")
        .isLength({ min: 8, max: 30 }).withMessage("Password Verify must be between 8 and 30 characters.")
        .trim(),
], userController.createUser);

router.get("/getUsername", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
], userController.getUsername);

router.get("/login", [
    check('email')
        .not().isEmpty().withMessage("Email required.")
        .isEmail().withMessage("Invalid email.")
        .normalizeEmail()
        .trim(),
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .trim()
], userController.login);

router.delete("/deleteUser", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .trim()
], userController.deleteUser);

router.put("/updateUsername", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('username')
        .not().isEmpty().withMessage("Username required.")
        .isLength({ min: 4, max: 30 }).withMessage("Username must be between 4 and 30 characters.")
        .trim(),
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .trim()
], userController.updateUsername);

router.put("/updateEmail", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('email')
        .not().isEmpty().withMessage("Email required.")
        .isEmail().withMessage("Invalid email.")
        .normalizeEmail()
        .trim(),
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .trim()
], userController.updateEmail);

router.put("/updatePassword", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
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
], userController.updatePassword);

module.exports = router;