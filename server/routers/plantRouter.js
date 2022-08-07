const router = require("express").Router();

const auth = require("../middleware/auth");
const { upload } = require("../middleware/imageUpload");

const { check } = require("express-validator");

const plantController = require("../controllers/plantController");

// *** CREATE REQUESTS ***

//Request to create a new plant
router.post("/createPlant", upload.array("file", 3), auth, plantController.createPlant);

// *** GET REQUESTS ***

//Request to get all plant data
router.get("/getAllPlants", plantController.getAllPlants);

//Request to get an image by image_id for use in rendering
router.post("/getImageByID", [
    check("image_id")
        .not().isEmpty().withMessage("Image ID required."),
], plantController.getImageByID);

//Request to get plant data for a given plant_id
router.post("/getPlantByID", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
], plantController.getPlantByID);

// *** DELETE REQUESTS ***

//Request to delete a plant by plant_id
router.delete("/deletePlant", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
], auth, plantController.deletePlant);

// *** UPDATE REQUESTS ***

//Request to update a plant's name
router.put("/updateName", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("name")
        .not().isEmpty().withMessage("Name required.")
        .isLength({ min: 1, max: 30 }).withMessage("Name must be between 1 and 30 characters.")
        .trim(),
], auth, plantController.updateName);

//Request to update a plant's description
router.put("/updateDescription", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("description")
        .not().isEmpty().withMessage("Description required.")
        .isLength({ min: 1, max: 250 }).withMessage("Description must be between 1 and 250 characters.")
        .trim(),
], auth, plantController.updateDescription);

//Request to update any enum value for a given plant_id: plant_type, sun_condition, soil_type or soil_ph
router.put("/updateEnums", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("enumType")
        .not().isEmpty().withMessage("Enum type required.")
        .trim(),
    check("enumValue")
        .not().isEmpty().withMessage("Enum value required."),
], auth, plantController.updateEnums);

//Request to update any monthly schedule value for a given plant_id: sow_date, plant_date, transplant_date or harvest_date
router.put("/updateMonthlySchedules", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("scheduleType")
        .not().isEmpty().withMessage("Schedule type required.")
        .trim(),
    check("scheduleValue")
        .not().isEmpty().withMessage("Schedule value required."),
], auth, plantController.updateMonthlySchedules);

//Request to update any required weekly schedule value for a given plant_id: water_schedule, spacing
router.put("/updateRequiredWeeklySchedules", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("scheduleType")
        .not().isEmpty().withMessage("Schedule type required.")
        .trim(),
    check("scheduleValue")
        .not().isEmpty().withMessage("Schedule value required."),
], auth, plantController.updateRequiredWeeklySchedules);

//Request to update any optional weekly schedule value for a given plant_id: prune_schedule, feed_schedule, indoor_schedule
router.put("/updateOptionalWeeklySchedules", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("scheduleType")
        .not().isEmpty().withMessage("Schedule type required.")
        .trim(),
    check("scheduleValue")
        .not().isEmpty().withMessage("Schedule value required."),
], auth, plantController.updateOptionalWeeklySchedules);

//Request to update a plant's compost_schedule
router.put("/updateCompostSchedule", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("compost_schedule")
        .not().isEmpty().withMessage("Compost schedule required.")
        .isLength({ min: 1, max: 30 }).withMessage("Compost schedule must be between 1 and 30 characters.")
        .trim(),
], auth, plantController.updateCompostSchedule);

//Request to update any list value for a given plant_id: plant_problem, companion_plant, incompatible_plant
router.put("/updateLists", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("listType")
        .not().isEmpty().withMessage("List type required.")
        .trim(),
    check("listValue")
        .not().isEmpty().withMessage("List value required."),
], auth, plantController.updateLists);

router.put("/updateImages", upload.array("file", 3), auth, plantController.updateImages);

module.exports = router;