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

module.exports = router;