const router = require("express").Router();
const { upload } = require("../middleware/imageUpload");

const { check, validationResult } = require('express-validator');

const noteController = require("../controllers/noteController");

router.post("/createNote", upload.array("file", 3), noteController.createNote);

router.get("/getNotesByPlant", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
], noteController.getNotesByPlant);

router.get("/getNotesByPlot", [
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('plot_number')
        .not().isEmpty().withMessage("Plot_number required.")
        .isInt().withMessage("Plot_number must be an integer value."),
], noteController.getNotesByPlot);

router.get("/getNotesByDate", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('date')
        .not().isEmpty().withMessage("Date required.")
        .isDate().withMessage("Invalid date."),
], noteController.getNotesByDate);

router.get("/getNotesByMonth", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('date')
        .not().isEmpty().withMessage("Date required.")
        .isDate().withMessage("Invalid date."),
], noteController.getNotesByMonth);

router.delete("/deleteNote", [
    check('note_id')
        .not().isEmpty().withMessage("Note_id required."),
], noteController.deleteNote);

router.put("/updateTitle", [
    check('note_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('title')
        .not().isEmpty().withMessage("Title required.")
        .isLength({ min: 1, max: 30 }).withMessage("Title must be between 1 and 30 characters.")
        .trim(),
], noteController.updateTitle);

router.put("/updateDescription", [
    check('note_id')
        .not().isEmpty().withMessage("Alarm_id required."),
    check('description')
        .not().isEmpty().withMessage("Description required.")
        .isLength({ min: 1, max: 250 }).withMessage("Description must be between 1 and 250 characters.")
        .trim(),
], noteController.updateDescription);

router.put("/updateGardenPlot", [
    check('note_id')
        .not().isEmpty().withMessage("Note_id required."),
    check('garden_id')
        .optional(),
    check('plot_number')
        .optional()
        .isInt().withMessage("Plot_number must be an integer value."),
], noteController.updateGardenPlot);

router.put("/updateImages", upload.array("file", 3), noteController.updateImages);

module.exports = router;