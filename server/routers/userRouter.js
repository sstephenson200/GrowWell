const router = require("express").Router();

const auth = require("../middleware/auth");

const { check } = require('express-validator');

const userController = require("../controllers/userController");

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

router.get("/checkLoggedIn", userController.checkLoggedIn);

router.get("/logout", auth, userController.logout);

router.post("/getUser", auth, userController.getUser);

router.delete("/deleteUser", [
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .trim()
], auth, userController.deleteUser);

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

router.put("/resetPassword", [
    check('email')
        .not().isEmpty().withMessage("Email required.")
        .isEmail().withMessage("Invalid email.")
        .normalizeEmail()
        .trim(),
], userController.resetPassword);

module.exports = router;