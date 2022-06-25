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
        .not().isEmpty().withMessage("Due_date required.")
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
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
], alarmController.getAlarmByID);

router.delete("/deleteAlarm", [
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
], alarmController.deleteAlarm);

router.put("/updateTitle", [
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('title')
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters.")
        .trim(),
], alarmController.updateTitle);

router.put("/updateDueDate", [
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('due_date')
        .not().isEmpty().withMessage("Due_date required.")
        .isDate().withMessage("Invalid date."),
], alarmController.updateDueDate);

router.put("/updateSchedule", [
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('schedule')
        .optional()
        .isInt({ min: 1 }).withMessage("Repeat schedule must be greater than 0 days."),
], alarmController.updateSchedule);

router.put("/updateGardenPlot", [
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('garden_id')
        .optional(),
    //.not().isEmpty().withMessage("Garden_id required."),
    check('plot_number')
        .optional()
        //.not().isEmpty().withMessage("Plot_number required.")
        .isInt().withMessage("Plot_number must be an integer value."),
], alarmController.updateGardenPlot);

module.exports = router;