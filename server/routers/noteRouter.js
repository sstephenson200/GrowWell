const router = require("express").Router();

const { upload } = require("../middleware/imageUpload");
const auth = require("../middleware/auth");

const { check } = require("express-validator");

const noteController = require("../controllers/noteController");

// *** CREATE REQUESTS ***

//Request to create a new note
router.post("/createNote", upload.array("file", 3), auth, noteController.createNote);

// *** GET REQUESTS ***

//Request to get all notes for a given user
router.post("/getNotes", auth, noteController.getNotes);

//Request to get all notes for a given garden plot
router.post("/getNotesByPlot", [
    check("garden_id")
        .not().isEmpty().withMessage("Garden ID required."),
    check("plot_number")
        .not().isEmpty().withMessage("Plot number required.")
        .isInt().withMessage("Plot number must be an integer value."),
], auth, noteController.getNotesByPlot);

//Request to get all notes for a given user in a given month
router.post("/getNotesByMonth", [
    check("date")
        .not().isEmpty().withMessage("Date required.")
        .isDate().withMessage("Invalid date."),
], auth, noteController.getNotesByMonth);

// *** DELETE REQUESTS ***

//Request to delete a note by note_id
router.delete("/deleteNote", [
    check("note_id")
        .not().isEmpty().withMessage("Note ID required."),
], auth, noteController.deleteNote);

// *** UPDATE REQUESTS ***

//Request to update a note's title
router.put("/updateTitle", [
    check("note_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("title")
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters.")
        .trim(),
], auth, noteController.updateTitle);

//Request to update a note's description
router.put("/updateDescription", [
    check("note_id")
        .not().isEmpty().withMessage("Alarm ID required."),
    check("description")
        .not().isEmpty().withMessage("Description required.")
        .isLength({ min: 1, max: 250 }).withMessage("Description must be between 1 and 250 characters.")
        .trim(),
], auth, noteController.updateDescription);

//Request to update a note's linked garden plot
router.put("/updateGardenPlot", [
    check("note_id")
        .not().isEmpty().withMessage("Note ID required."),
    check("garden_id")
        .optional(),
    check("plot_number")
        .optional()
        .isInt().withMessage("Plot number must be an integer value."),
], auth, noteController.updateGardenPlot);

//Request to add or remove images from a note
router.put("/updateImages", upload.array("file", 3), auth, noteController.updateImages);

module.exports = router;