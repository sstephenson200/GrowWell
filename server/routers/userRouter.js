const router = require("express").Router();
const { check, validationResult } = require('express-validator');
const userController = require("../controllers/userController");

router.post("/createUser", [
    check('email')
        .not().isEmpty().withMessage("Email required.")
        .isEmail().withMessage("Invalid email.")
        .normalizeEmail()
        .trim()
        .escape(),
    check('username')
        .not().isEmpty().withMessage("Username required.")
        .isLength({ min: 4, max: 30 }).withMessage("Username must be between 4 and 30 characters.")
        .trim()
        .escape(),
    check('password')
        .not().isEmpty().withMessage("Password required.").withMessage("Password must be between 8 and 30 characters.")
        .isLength({ min: 8, max: 30 })
        .trim()
        .escape(),
    check('passwordVerify')
        .not().isEmpty().withMessage("Password Verify required.")
        .isLength({ min: 8, max: 30 }).withMessage("Password Verify must be between 8 and 30 characters.")
        .trim()
        .escape(),
], userController.createUser);

module.exports = router;