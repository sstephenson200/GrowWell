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
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
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

module.exports = router;