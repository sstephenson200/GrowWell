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

router.delete("/deleteAllAlarms", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
], alarmController.deleteAllAlarms);

router.put("/updateTitle", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('title')
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters.")
        .trim(),
], alarmController.updateTitle);

router.put("/updateDueDate", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('due_date')
        .not().isEmpty().withMessage("Due_date required.")
        .isDate().withMessage("Invalid date."),
], alarmController.updateDueDate);

router.put("/updateSchedule", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('schedule')
        .not().isEmpty().withMessage("Schedule required.")
        .isInt({ min: 1 }).withMessage("Repeat schedule must be greater than 0 days."),
], alarmController.updateSchedule);

router.put("/updateGardenPlot", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('plot_number')
        .not().isEmpty().withMessage("Plot_number required.")
        .isInt().withMessage("Plot_number must be an integer value."),
], alarmController.updateGardenPlot);

router.put("/removeSchedule", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
], alarmController.removeSchedule);

router.put("/removeGardenPlot", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
], alarmController.removeGardenPlot);

module.exports = router;