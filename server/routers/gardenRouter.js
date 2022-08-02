const router = require("express").Router();
const auth = require("../middleware/auth");

const { check } = require('express-validator');

const gardenController = require("../controllers/gardenController");

router.post("/createGarden", [
    check('name')
        .not().isEmpty().withMessage("Name required.")
        .isLength({ min: 4, max: 30 }).withMessage("Name must be between 4 and 30 characters.")
        .escape(),
    check('length')
        .isInt({ min: 1, max: 20 }).withMessage("Length must be between 1 and 20m."),
    check('width')
        .isInt({ min: 1, max: 20 }).withMessage("Width must be between 1 and 20m."),
], auth, gardenController.createGarden);

router.post("/getAllGardens", auth, gardenController.getAllGardens);

router.post("/getGardenByID", [
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
], auth, gardenController.getGardenByID);

router.delete("/deleteGarden", [
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .trim()
], auth, gardenController.deleteGarden);

router.put("/updateName", [
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('name')
        .not().isEmpty().withMessage("Name required.")
        .isLength({ min: 4, max: 30 }).withMessage("Name must be between 4 and 30 characters.")
        .trim(),
], auth, gardenController.updateName);

router.put("/updatePlotPlantedDate", [
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('plot_number')
        .not().isEmpty().withMessage("Plot_number required.")
        .isInt().withMessage("Plot_number must be an integer value."),
    check('date_planted')
        .not().isEmpty().withMessage("Date_planted required.")
        .isDate().withMessage("Invalid date."),
], auth, gardenController.updatePlotPlantedDate);

router.put("/updatePlotPlant", [
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('plot_number')
        .not().isEmpty().withMessage("Plot_number required.")
        .isInt().withMessage("Plot_number must be an integer value."),
    check('plant_id')
        .optional(),
    check('date_planted')
        .optional()
        .isDate().withMessage("Invalid date."),
], auth, gardenController.updatePlotPlant);

module.exports = router;