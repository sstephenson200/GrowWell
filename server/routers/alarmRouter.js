const router = require("express").Router();

const auth = require("../middleware/auth");

const { check } = require("express-validator");

const alarmController = require("../controllers/alarmController");

// *** CREATE REQUESTS ***

//Request to create a new alarm
router.post("/createAlarm", [
    check("title")
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters."),
    check("due_date")
        .not().isEmpty().withMessage("Due date required."),
    check("garden_id")
        .optional(),
    check("plot_number")
        .optional()
        .isInt().withMessage("Plot number must be an integer value."),
    check("isParent")
        .optional()
        .isBoolean().withMessage("isParent must be true or false."),
    check("parent")
        .optional(),
    check("notification_id")
        .not().isEmpty().withMessage("Notification ID required."),
], auth, alarmController.createAlarm);

// *** GET REQUESTS ***

//Request to get all alarms for a given user
router.post("/getAllAlarms", auth, alarmController.getAllAlarms);

//Request to get an alarm for a given alarm_id
router.get("/getAlarmByID", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
], auth, alarmController.getAlarmByID);

// *** DELETE REQUESTS ***

//Request to delete an alarm by given alarm_id
router.delete("/deleteAlarm", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
], auth, alarmController.deleteAlarm);

//Request to delete all alarms for a given parent ID
router.delete("/deleteAlarmsByParent", [
    check("parent")
        .not().isEmpty().withMessage("Parent ID required."),
], auth, alarmController.deleteAlarmsByParent);

// *** UPDATE REQUESTS ***

//Request to update an alarm's title
router.put("/updateTitle", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("title")
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters.")
        .trim(),
], auth, alarmController.updateTitle);

//Request to update an alarm's next due date
router.put("/updateDueDate", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("due_date")
        .not().isEmpty().withMessage("Due date required.")
        .isDate().withMessage("Invalid date."),
], auth, alarmController.updateDueDate);

//Request to update an alarm's listed garden plot
router.put("/updateGardenPlot", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("garden_id")
        .optional(),
    check("plot_number")
        .optional()
        .isInt().withMessage("Plot number must be an integer value."),
], auth, alarmController.updateGardenPlot);

//Request to mark an alarm as complete or incomplete
router.put("/updateCompletionStatus", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required.")
], auth, alarmController.updateCompletionStatus);

//Request to turn an alarm on or off
router.put("/updateActiveStatus", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required.")
], auth, alarmController.updateActiveStatus);

//Request to update an alarm's linked notification ID
router.put("/updateNotificationID", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("notification_id")
        .not().isEmpty().withMessage("Notification ID required."),
], auth, alarmController.updateNotificationID);

module.exports = router;