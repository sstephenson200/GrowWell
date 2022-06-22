const router = require("express").Router();
const moment = require("moment");
const { check, validationResult } = require('express-validator');
const alarmController = require("../controllers/alarmController");

router.post("/createAlarm", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('title')
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters.")
        .escape(),
    check('due_date')
        .not().isEmpty().withMessage("Due date required.")
        .isDate().withMessage("Invalid date."),
    check('schedule')
        .optional()
        .isInt({ min: 1 }).withMessage("Repeat schedule must be greater than 0 days."),
], alarmController.createAlarm);

router.get("/getAllAlarms", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
], alarmController.getAllAlarms);

router.get("/getAlarmByID", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
], alarmController.getAlarmByID);

router.delete("/deleteAlarm", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
], alarmController.deleteAlarm);

module.exports = router;