const router = require("express").Router();
const { check, validationResult } = require('express-validator');
const gardenController = require("../controllers/gardenController");

router.post("/createGarden", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('name')
        .not().isEmpty().withMessage("Name required.")
        .isLength({ min: 4, max: 30 }).withMessage("Name must be between 4 and 30 characters.")
        .escape(),
    check('length')
        .isInt({ min: 1, max: 6 }).withMessage("Length must be between 1 and 6m."),
    check('width')
        .isInt({ min: 1, max: 6 }).withMessage("Width must be between 1 and 6m."),
], gardenController.createGarden);

router.get("/getAllGardens", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
], gardenController.getAllGardens);

router.get("/getGardenByID", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
], gardenController.getGardenByID);

router.get("/getPlotByNumber", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('plot_number')
        .not().isEmpty().withMessage("Plot_number required.")
        .isInt().withMessage("Plot_number must be an integer value."),
], gardenController.getPlotByNumber);

router.delete("/deleteGarden", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('password')
        .not().isEmpty().withMessage("Password required.")
        .trim()
], gardenController.deleteGarden);

router.delete("/deleteAllGardens", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
], gardenController.deleteAllGardens);

router.put("/updateName", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('name')
        .not().isEmpty().withMessage("Name required.")
        .isLength({ min: 4, max: 30 }).withMessage("Name must be between 4 and 30 characters.")
        .trim(),
], gardenController.updateName);

router.put("/updatePlotPlantedDate", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('plot_number')
        .not().isEmpty().withMessage("Plot_number required.")
        .isInt().withMessage("Plot_number must be an integer value."),
    check('date_planted')
        .not().isEmpty().withMessage("Date_planted required.")
        .isDate().withMessage("Invalid date."),
], gardenController.updatePlotPlantedDate);

router.put("/updatePlotPlant", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('garden_id')
        .not().isEmpty().withMessage("Garden_id required."),
    check('plot_number')
        .not().isEmpty().withMessage("Plot_number required.")
        .isInt().withMessage("Plot_number must be an integer value."),
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('date_planted')
        .optional()
        .isDate().withMessage("Invalid date."),
], gardenController.updatePlotPlant);

module.exports = router;