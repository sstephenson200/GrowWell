const router = require("express").Router();

const auth = require("../middleware/auth");

const { check } = require("express-validator");

const alarmController = require("../controllers/alarmController");

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

router.post("/getAllAlarms", auth, alarmController.getAllAlarms);

router.get("/getAlarmByID", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
], auth, alarmController.getAlarmByID);

router.delete("/deleteAlarm", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
], auth, alarmController.deleteAlarm);

router.delete("/deleteAlarmsByParent", [
    check("parent")
        .not().isEmpty().withMessage("Parent ID required."),
], auth, alarmController.deleteAlarmsByParent);

router.put("/updateTitle", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("title")
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters.")
        .trim(),
], auth, alarmController.updateTitle);

router.put("/updateDueDate", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("due_date")
        .not().isEmpty().withMessage("Due date required.")
        .isDate().withMessage("Invalid date."),
], auth, alarmController.updateDueDate);

router.put("/updateGardenPlot", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("garden_id")
        .optional(),
    check("plot_number")
        .optional()
        .isInt().withMessage("Plot number must be an integer value."),
], auth, alarmController.updateGardenPlot);

router.put("/updateCompletionStatus", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required.")
], auth, alarmController.updateCompletionStatus);

router.put("/updateActiveStatus", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required.")
], auth, alarmController.updateActiveStatus);

router.put("/updateNotificationID", [
    check("alarm_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("notification_id")
        .not().isEmpty().withMessage("Notification ID required."),
], auth, alarmController.updateNotificationID);

module.exports = router;