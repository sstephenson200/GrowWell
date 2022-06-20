const router = require("express").Router();
const moment = require("moment");
const { check, validationResult } = require('express-validator');
const alarmController = require("../controllers/alarmController");

router.post("/createAlarm", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required.")
        .trim()
        .escape(),
    check('title')
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters.")
        .trim()
        .escape(),
    check('due_date')
        .not().isEmpty().withMessage("Due date required.")
        .isDate().withMessage("Invalid date.")
        .trim()
        .escape(),
    check('schedule')
        .optional()
        .isInt({ min: 1 }).withMessage("Repeat schedule must be greater than 0 days.")
        .trim()
        .escape(),
], alarmController.createAlarm);

module.exports = router;