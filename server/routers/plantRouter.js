const router = require("express").Router();

const auth = require("../middleware/auth");
const { upload } = require("../middleware/imageUpload");

const { check } = require("express-validator");

const plantController = require("../controllers/plantController");

router.post("/createPlant", upload.array("file", 3), auth, plantController.createPlant);

router.get("/getAllPlants", plantController.getAllPlants);

router.post("/getImageByID", [
    check("image_id")
        .not().isEmpty().withMessage("Image ID required."),
], plantController.getImageByID);

router.post("/getPlantByID", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
], plantController.getPlantByID);

router.delete("/deletePlant", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
], auth, plantController.deletePlant);

router.put("/updateName", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("name")
        .not().isEmpty().withMessage("Name required.")
        .isLength({ min: 1, max: 30 }).withMessage("Name must be between 1 and 30 characters.")
        .trim(),
], auth, plantController.updateName);

router.put("/updateDescription", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("description")
        .not().isEmpty().withMessage("Description required.")
        .isLength({ min: 1, max: 250 }).withMessage("Description must be between 1 and 250 characters.")
        .trim(),
], auth, plantController.updateDescription);

router.put("/updateEnums", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("enumType")
        .not().isEmpty().withMessage("Enum type required.")
        .trim(),
    check("enumValue")
        .not().isEmpty().withMessage("Enum value required."),
], auth, plantController.updateEnums);

router.put("/updateMonthlySchedules", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("scheduleType")
        .not().isEmpty().withMessage("Schedule type required.")
        .trim(),
    check("scheduleValue")
        .not().isEmpty().withMessage("Schedule value required."),
], auth, plantController.updateMonthlySchedules);

router.put("/updateRequiredWeeklySchedules", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("scheduleType")
        .not().isEmpty().withMessage("Schedule type required.")
        .trim(),
    check("scheduleValue")
        .not().isEmpty().withMessage("Schedule value required."),
], auth, plantController.updateRequiredWeeklySchedules);

router.put("/updateOptionalWeeklySchedules", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("scheduleType")
        .not().isEmpty().withMessage("Schedule type required.")
        .trim(),
    check("scheduleValue")
        .not().isEmpty().withMessage("Schedule value required."),
], auth, plantController.updateOptionalWeeklySchedules);

router.put("/updateCompostSchedule", [
    check("plant_id")
        .not().isEmpty().withMessage("Plant ID required."),
    check("compost_schedule")
        .not().isEmpty().withMessage("Compost schedule required.")
        .isLength({ min: 1, max: 30 }).withMessage("Compost schedule must be between 1 and 30 characters.")
        .trim(),
], auth, plantController.updateCompostSchedule);

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