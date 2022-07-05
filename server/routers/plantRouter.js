const router = require("express").Router();
const { upload } = require('../middleware/imageUpload');
const { check, validationResult } = require('express-validator');

const plantController = require("../controllers/plantController");

router.post("/createPlant", upload.array("file", 3), plantController.createPlant);

router.get("/getAllPlants", plantController.getAllPlants);

router.post("/getImageByID", [
    check('image_id')
        .not().isEmpty().withMessage("Image_id required."),
], plantController.getImageByID);

router.post("/getPlantByID", [
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

router.put("/updateEnums", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('enumType')
        .not().isEmpty().withMessage("EnumType required.")
        .trim(),
    check('enumValue')
        .not().isEmpty().withMessage("EnumValue required."),
], plantController.updateEnums);

router.put("/updateMonthlySchedules", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('scheduleType')
        .not().isEmpty().withMessage("ScheduleType required.")
        .trim(),
    check('scheduleValue')
        .not().isEmpty().withMessage("scheduleValue required."),
], plantController.updateMonthlySchedules);

router.put("/updateRequiredWeeklySchedules", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('scheduleType')
        .not().isEmpty().withMessage("ScheduleType required.")
        .trim(),
    check('scheduleValue')
        .not().isEmpty().withMessage("scheduleValue required."),
], plantController.updateRequiredWeeklySchedules);

router.put("/updateOptionalWeeklySchedules", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('scheduleType')
        .not().isEmpty().withMessage("ScheduleType required.")
        .trim(),
    check('scheduleValue')
        .not().isEmpty().withMessage("scheduleValue required."),
], plantController.updateOptionalWeeklySchedules);

router.put("/updateCompostSchedule", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('compost_schedule')
        .not().isEmpty().withMessage("Compost_schedule required.")
        .isLength({ min: 1, max: 30 }).withMessage("Compost_schedule must be between 1 and 30 characters.")
        .trim(),
], plantController.updateCompostSchedule);

router.put("/updateLists", [
    check('plant_id')
        .not().isEmpty().withMessage("Plant_id required."),
    check('listType')
        .not().isEmpty().withMessage("ListType required.")
        .trim(),
    check('listValue')
        .not().isEmpty().withMessage("ListValue required."),
], plantController.updateLists);

router.put("/updateImages", upload.array("file", 3), plantController.updateImages);

module.exports = router;