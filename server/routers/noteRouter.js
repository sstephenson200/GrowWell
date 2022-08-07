const router = require("express").Router();

const { upload } = require("../middleware/imageUpload");
const auth = require("../middleware/auth");

const { check } = require("express-validator");

const noteController = require("../controllers/noteController");

router.post("/createNote", upload.array("file", 3), auth, noteController.createNote);

router.post("/getNotes", auth, noteController.getNotes);

router.get("/getNotesByDate", [
    check("date")
        .not().isEmpty().withMessage("Date required.")
        .isDate().withMessage("Invalid date."),
], auth, noteController.getNotesByDate);

router.post("/getNotesByMonth", [
    check("date")
        .not().isEmpty().withMessage("Date required.")
        .isDate().withMessage("Invalid date."),
], auth, noteController.getNotesByMonth);

router.delete("/deleteNote", [
    check("note_id")
        .not().isEmpty().withMessage("Note ID required."),
], auth, noteController.deleteNote);

router.put("/updateTitle", [
    check("note_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("title")
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters.")
        .trim(),
], auth, noteController.updateTitle);

router.put("/updateDescription", [
    check("note_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("description")
        .not().isEmpty().withMessage("Description required.")
        .isLength({ min: 1, max: 250 }).withMessage("Description must be between 1 and 250 characters.")
        .trim(),
], auth, noteController.updateDescription);

router.put("/updateGardenPlot", [
    check("note_id")
        .not().isEmpty().withMessage("Note ID required."),
    check("garden_id")
        .optional(),
    check("plot_number")
        .optional()
        .isInt().withMessage("Plot number must be an integer value."),
], auth, noteController.updateGardenPlot);

router.put("/updateImages", upload.array("file", 3), auth, noteController.updateImages);

module.exports = router;