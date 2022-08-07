const router = require("express").Router();

const auth = require("../middleware/auth");

const { check } = require("express-validator");

const gardenController = require("../controllers/gardenController");

// *** CREATE REQUESTS ***

//Request to create a new garden
router.post("/createGarden", [
    check("name")
        .not().isEmpty().withMessage("Name required.")
        .isLength({ min: 4, max: 30 }).withMessage("Name must be between 4 and 30 characters."),
    check("length")
        .isInt({ min: 1, max: 20 }).withMessage("Length must be between 1 and 20m."),
    check("width")
        .isInt({ min: 1, max: 20 }).withMessage("Width must be between 1 and 20m."),
], auth, gardenController.createGarden);

// *** GET REQUESTS ***

//Request to get all gardens for a given user
router.post("/getAllGardens", auth, gardenController.getAllGardens);

//Request to get a garden by a given garden_id
router.post("/getGardenByID", [
    check("garden_id")
        .not().isEmpty().withMessage("Garden ID required."),
], auth, gardenController.getGardenByID);

// *** DELETE REQUESTS ***

//Request to delete a garden by garden_id
router.delete("/deleteGarden", [
    check("garden_id")
        .not().isEmpty().withMessage("Garden ID required."),
    check("password")
        .not().isEmpty().withMessage("Password required.")
        .trim()
], auth, gardenController.deleteGarden);

// *** UPDATE REQUESTS ***

//Request to update a garden's name
router.put("/updateName", [
    check("garden_id")
        .not().isEmpty().withMessage("Garden ID required."),
    check("name")
        .not().isEmpty().withMessage("Name required.")
        .isLength({ min: 4, max: 30 }).withMessage("Name must be between 4 and 30 characters.")
        .trim(),
], auth, gardenController.updateName);

//Requset to update when a plant was planted in a given plot
router.put("/updatePlotPlantedDate", [
    check("garden_id")
        .not().isEmpty().withMessage("Garden ID required."),
    check("plot_number")
        .not().isEmpty().withMessage("Plot number required.")
        .isInt().withMessage("Plot number must be an integer value."),
    check("date_planted")
        .not().isEmpty().withMessage("Date planted required.")
        .isDate().withMessage("Invalid date."),
], auth, gardenController.updatePlotPlantedDate);

//Request to update the plant in a specific plot - can also be used to remove a plant by assigning plant_id to null
router.put("/updatePlotPlant", [
    check("garden_id")
        .not().isEmpty().withMessage("Garden ID required."),
    check("plot_number")
        .not().isEmpty().withMessage("Plot number required.")
        .isInt().withMessage("Plot number must be an integer value."),
    check("plant_id")
        .optional(),
    check("date_planted")
        .optional()
        .isDate().withMessage("Invalid date."),
], auth, gardenController.updatePlotPlant);

//Request to add plant data to plot history - should be called when a plant is removed from a plot
router.put("/updatePlotHistory", [
    check("garden_id")
        .not().isEmpty().withMessage("Garden ID required."),
    check("plot_number")
        .not().isEmpty().withMessage("Plot number required.")
        .isInt().withMessage("Plot number must be an integer value."),
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("date_planted")
        .not().isEmpty().withMessage("Date planted required."),
], auth, gardenController.updatePlotHistory);

module.exports = router;