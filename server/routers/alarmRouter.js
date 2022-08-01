const router = require("express").Router();

const { check } = require('express-validator');

const alarmController = require("../controllers/alarmController");

router.post("/createAlarm", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('title')
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters.")
        .escape(),
    check('due_date')
        .not().isEmpty().withMessage("Due_date required."),
    check('isParent')
        .optional()
        .isBoolean().withMessage("isParent must be true or false."),
    check('notification_id')
        .not().isEmpty().withMessage("Notification_id required."),
], alarmController.createAlarm);

router.post("/getAllAlarms", [
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

router.delete("/deleteAlarmsByParent", [
    check('parent')
        .not().isEmpty().withMessage("Parent required."),
], alarmController.deleteAlarmsByParent);

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

router.put("/updateCompletionStatus", [
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required.")
], alarmController.updateCompletionStatus);

router.put("/updateActiveStatus", [
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required.")
], alarmController.updateActiveStatus);

router.put("/updateNotificationID", [
    check('alarm_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('notification_id')
        .not().isEmpty().withMessage("Notification_id required."),
], alarmController.updateNotificationID);

module.exports = router;