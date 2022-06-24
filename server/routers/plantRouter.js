const router = require("express").Router();
const { upload } = require('../middleware/imageUpload');
const { check, validationResult } = require('express-validator');

const plantController = require("../controllers/plantController");

router.post("/createPlant", upload.array("file", 3), plantController.createPlant);

router.get("/getAllPlants", plantController.getAllPlants);

router.get("/getPlantByID", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
], plantController.getPlantByID);

router.delete("/deletePlant", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
], plantController.deletePlant);

router.put("/updateName", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('name')
        .not().isEmpty().withMessage("Name required.")
        .isLength({ min: 1, max: 30 }).withMessage("Name must be between 1 and 30 characters.")
        .trim(),
], plantController.updateName);

router.put("/updateDescription", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('description')
        .not().isEmpty().withMessage("Description required.")
        .isLength({ min: 1, max: 250 }).withMessage("Description must be between 1 and 250 characters.")
        .trim(),
], plantController.updateDescription);

router.put("/updatePlantType", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('plant_type')
        .not().isEmpty().withMessage("Description required.")
        .trim(),
], plantController.updatePlantType);

router.put("/updateSowDate", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('sow_date')
        .not().isEmpty().withMessage("Sow_date required."),
], plantController.updateSowDate);

router.put("/updatePlantDate", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('plant_date')
        .not().isEmpty().withMessage("Plant_date required."),
], plantController.updatePlantDate);

router.put("/updateTransplantDate", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('transplant_date')
        .not().isEmpty().withMessage("Transplant_date required."),
], plantController.updateTransplantDate);

router.put("/updateHarvestDate", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('harvest_date')
        .not().isEmpty().withMessage("Harvest_date required."),
], plantController.updateHarvestDate);

router.put("/updateSunCondition", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('sun_condition')
        .not().isEmpty().withMessage("Sun_condition required."),
], plantController.updateSunCondition);

router.put("/updateSoilType", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('soil_type')
        .not().isEmpty().withMessage("Soil_type required."),
], plantController.updateSoilType);

router.put("/updateSoilPh", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('soil_ph')
        .not().isEmpty().withMessage("Soil_ph required."),
], plantController.updateSoilPh);

router.put("/updateWaterSchedule", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('water_schedule')
        .not().isEmpty().withMessage("Water_schedule required."),
], plantController.updateWaterSchedule);

router.put("/updateCompostSchedule", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('compost_schedule')
        .not().isEmpty().withMessage("Compost_schedule required.")
        .isLength({ min: 1, max: 30 }).withMessage("Compost_schedule must be between 1 and 30 characters.")
        .trim(),
], plantController.updateCompostSchedule);

router.put("/updatePruneSchedule", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('prune_schedule')
        .not().isEmpty().withMessage("Prune_schedule required."),
], plantController.updatePruneSchedule);

router.put("/updateFeedSchedule", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('feed_schedule')
        .not().isEmpty().withMessage("Feed_schedule required."),
], plantController.updatePruneSchedule);

router.put("/updateIndoorSchedule", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('indoor_schedule')
        .not().isEmpty().withMessage("Indoor_schedule required."),
], plantController.updateIndoorSchedule);

router.put("/updateSpacing", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('spacing')
        .not().isEmpty().withMessage("Spacing required."),
], plantController.updateSpacing);

router.put("/updatePlantProblems", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('plant_problem')
        .not().isEmpty().withMessage("Plant_problem required."),
], plantController.updatePlantProblems);

router.put("/updateCompanionPlants", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('companion_plant')
        .not().isEmpty().withMessage("Companion_plant required."),
], plantController.updateCompanionPlants);

router.put("/updateIncompatiblePlants", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('incompatible_plant')
        .not().isEmpty().withMessage("Incompatible_plant required."),
], plantController.updateIncompatiblePlants);

router.put("/updateImages", upload.array("file", 3), plantController.updateImages);

module.exports = router;