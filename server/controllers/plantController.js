const { deleteImages, bucket } = require("../middleware/imageUpload");
const mongoose = require("mongoose");

const { check, validationResult } = require('express-validator');
const validator = require("../validators/validator");
const plantValidator = require("../validators/plantValidator");

const Plant = require("../models/plantModel");

//Create Plant Endpoint
const createPlant = async (request, response) => {

    let parsedReq = JSON.parse(request.body.plant);

    let { name, description, plant_type, sow_date, plant_date, transplant_date, harvest_date, sun_condition, soil_type,
        soil_ph, water_schedule, compost_schedule, prune_schedule, feed_schedule, indoor_schedule, spacing, plant_problem,
        companion_plant, incompatible_plant } = parsedReq;

    //Check if required params are given
    if (!name) {
        return response.status(200).json({ errorMessage: "Name required." });
    } else if (!plant_type) {
        return response.status(200).json({ errorMessage: "Plant type required." });
    } else if (!sun_condition) {
        return response.status(200).json({ errorMessage: "Sun_condition required." });
    } else if (!soil_type) {
        return response.status(200).json({ errorMessage: "Soil_type required." });
    } else if (!soil_ph) {
        return response.status(200).json({ errorMessage: "Soil_ph required." });
    } else if (!water_schedule) {
        return response.status(200).json({ errorMessage: "Water_schedule required." });
    } else if (!indoor_schedule) {
        return response.status(200).json({ errorMessage: "Indoor_schedule required." });
    } else if (!spacing) {
        return response.status(200).json({ errorMessage: "Spacing required." });
    }

    if (!validator.checkValidLength(name, 1, 30)) {
        return response.status(200).json({ errorMessage: "Name must be between 1 and 30 characters." });
    }

    if (description != null) {
        if (!validator.checkValidLength(description, 1, 250)) {
            return response.status(200).json({ errorMessage: "Description must be between 1 and 250 characters." });
        }
    }

    if (compost_schedule != null) {
        if (!validator.checkValidLength(compost_schedule, 1, 30)) {
            return response.status(200).json({ errorMessage: "Compost schedule must be between 1 and 30 characters." });
        }
    }

    if (!Array.isArray(sun_condition) || !Array.isArray(soil_type) || !Array.isArray(soil_ph)) {
        return response.status(200).json({ errorMessage: "Sun_condition, soil_type and soil_ph must be entered as arrays." });
    }

    let enums = [{ type: plant_type, name: "plant_type" }, { type: sun_condition, name: "sun_condition" }, { type: soil_type, name: "soil_type" }, { type: soil_ph, name: "soil_ph" }];
    let editedEnumsEntry = [];
    let editedEnums = [];

    //Check all enum values are valid and remove duplicates
    for (let i = 0; i < enums.length; i++) {
        if (enums[i].name !== "plant_type") {
            editedEnumsEntry = [...new Set(enums[i].type)];
        } else {
            editedEnumsEntry = enums[i].type;
        }
        editedEnums.push(editedEnumsEntry);
        if (!plantValidator.checkValidPlantEnum(enums[i])) {
            return response.status(200).json({ errorMessage: "Invalid " + enums[i].name + "." });
        }
    }

    //Reset enum values
    enums = editedEnums;
    plant_type = enums[0];
    sun_condition = enums[1];
    soil_type = enums[2];
    soil_ph = enums[3];

    const monthlySchedules = [{ type: sow_date, name: "sow_date" }, { type: plant_date, name: "plant_date" }, { type: transplant_date, name: "transplant_date" }, { type: harvest_date, name: "harvest_date" }];

    //Check monthly schedules have 2 values between 1 and 12 
    for (let i = 0; i < monthlySchedules.length; i++) {
        if (monthlySchedules[i].type != null) {
            if (!plantValidator.checkArrayLength(monthlySchedules[i].type, 2)) {
                const listName = monthlySchedules[i].name;
                return response.status(200).json({ errorMessage: listName + " must have start and end month." });
            }
            if (!plantValidator.checkValidMonthSchedule(monthlySchedules[i].type)) {
                return response.status(200).json({ errorMessage: "Month values must be between 1 and 12." });
            }
        }
    }

    const requiredWeeklySchedules = [{ type: water_schedule, name: "water_schedule" }, { type: spacing, name: "spacing" }];

    //Check required weekly values have 2 values greater than 1
    for (let i = 0; i < requiredWeeklySchedules.length; i++) {
        const listName = requiredWeeklySchedules[i].name;
        if (!plantValidator.checkArrayLength(requiredWeeklySchedules[i].type, 2)) {
            return response.status(200).json({ errorMessage: listName + " array must have max and min value." });
        }
        if (!plantValidator.checkValidWeeklySchedule(requiredWeeklySchedules[i].type)) {
            return response.status(200).json({ errorMessage: "Schedule values for " + listName + " must be greater than 0." });
        }
    }

    const optionalWeeklySchedules = [{ type: prune_schedule, name: "prune_schedule" }, { type: feed_schedule, name: "feed_schedule" }, { type: indoor_schedule, name: "indoor_schedule" }];

    //Check optional weekly values have one string or two number values
    for (let i = 0; i < optionalWeeklySchedules.length; i++) {
        const listName = optionalWeeklySchedules[i].name;
        if (optionalWeeklySchedules[i].type != null) {
            if (plantValidator.checkArrayLength(optionalWeeklySchedules[i].type, 1)) {
                if (typeof optionalWeeklySchedules[i].type[0] !== 'string') {
                    return response.status(200).json({ errorMessage: "Single values for " + listName + " must be entered as strings." });
                } else {
                    optionalWeeklySchedules[i].type[0] = optionalWeeklySchedules[i].type[0].trim();
                }
            } else if (plantValidator.checkArrayLength(optionalWeeklySchedules[i].type, 2)) {
                if (!plantValidator.checkValidWeeklySchedule(optionalWeeklySchedules[i].type)) {
                    return response.status(200).json({ errorMessage: "Schedule values for " + listName + " must be greater than 0." });
                }
            }
        }
    }

    let stringArrays = [{ type: plant_problem, name: "plant_problem" }, { type: companion_plant, name: "companion_plant" }, { type: incompatible_plant, name: "incompatible_plant" }];
    let editedString = "";
    let editedStringArraysEntry = [];
    let editedStringArrays = [];

    //Check entries are strings
    for (let i = 0; i < stringArrays.length; i++) {
        const listName = stringArrays[i].name;
        if (stringArrays[i].type !== null) {
            if (typeof stringArrays[i].type !== 'string') {
                editedStringArraysEntry = [...new Set(stringArrays[i].type)];
                for (let j = 0; j < editedStringArraysEntry.length; j++) {
                    if (typeof editedStringArraysEntry[j] !== 'string') {
                        return response.status(200).json({ errorMessage: listName + " values must be entered as strings." });
                    }
                    editedString = editedStringArraysEntry[j].trim();
                    editedStringArraysEntry[j] = editedString;
                }
            } else {
                return response.status(200).json({ errorMessage: "Plant_problem, companion_plant and incompatible_plant must be entered as arrays." });
            }
        }
        editedStringArrays.push(editedStringArraysEntry);
    }

    //Reset array strings
    stringArrays = editedStringArrays;
    plant_problem = stringArrays[0];
    companion_plant = stringArrays[1];
    incompatible_plant = stringArrays[2];

    //Get image_id array
    const image_id = [];
    for (let i = 0; i < request.files.length; i++) {
        const id = request.files[i].id;
        image_id.push(id);
    }

    try {
        const newPlant = new Plant({
            name, description, plant_type, sow_date, plant_date, transplant_date, harvest_date, sun_condition, soil_type, soil_ph,
            water_schedule, compost_schedule, prune_schedule, feed_schedule, indoor_schedule, spacing, plant_problem, companion_plant,
            incompatible_plant, image: image_id
        });
        const savedPlant = await newPlant.save();

        return response.status(200).json({ message: "Plant created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to get all plants
const getAllPlants = async (request, response) => {

    const plants = await Plant.find().select(["name", "image", "sow_date", "plant_date", "transplant_date", "harvest_date", "plant_type"]);

    return response.status(200).json({ plants: plants });
}

//Request to get a single image by image_id
const getImageByID = (request, response) => {

    let { image_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(image_id)) {
        return response.status(200).json({ errorMessage: "Invalid image_id." });
    }

    image_id = new mongoose.Types.ObjectId(image_id);

    bucket.find({ _id: image_id }).toArray((error, files) => {

        if (!files[0] || files.length == 0) {
            return response.status(200).json({ errorMessage: "No image found." });
        }

        const contentType = files[0].contentType;
        const fileName = files[0].filename;

        if (contentType !== "image/jpeg" && contentType !== "image/jpg") {
            return response.status(200).json({ errorMessage: "Invalid image type." });
        }

        bucket.openDownloadStreamByName(fileName).pipe(response);
    });
}

//Request to get a plant for a given plant_id
const getPlantByID = async (request, response) => {

    const { plant_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    return response.status(200).json({ plant: existingPlant });
}

//Request to delete a plant for a given plant_id
const deletePlant = async (request, response) => {

    const { plant_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    try {
        let plant = await Plant.findOneAndDelete({ _id: plant_id });
        deleteImages(plant.image);

        return response.status(200).json({ message: "Plant deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's name
const updateName = async (request, response) => {

    const { plant_id, name } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    if (name == existingPlant.name) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    try {
        await Plant.updateOne(existingPlant, { 'name': name });

        return response.status(200).json({ message: "Plant name updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's description
const updateDescription = async (request, response) => {

    const { plant_id, description } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    if (description == existingPlant.description) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    try {
        await Plant.updateOne(existingPlant, { 'description': description });

        return response.status(200).json({ message: "Plant description updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update any enum value for a given plant_id: plant_type, sun_condition, soil_type or soil_ph
const updateEnums = async (request, response) => {

    let { plant_id, enumType, enumValue } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    if (!Object.values(plantValidator.enumTypes).includes(enumType)) {
        return response.status(200).json({ errorMessage: "Invalid enumType." });
    }

    if (enumType == "plant_type") {
        if (typeof enumValue !== 'string') {
            return response.status(200).json({ errorMessage: "Plant_type must be entered as a string." });
        }
    } else {
        if (!Array.isArray(enumValue)) {
            return response.status(200).json({ errorMessage: "Sun_condition, soil_type and soil_ph must be entered as arrays." });
        }
        enumValue = [...new Set(enumValue)];
    }

    let enumCheck = [];
    enumCheck.push({ type: enumValue, name: enumType });

    if (!plantValidator.checkValidPlantEnum(enumCheck[0])) {
        return response.status(200).json({ errorMessage: "Invalid " + enumType + "." });
    }

    try {
        let query = {};
        query[enumType] = enumValue;
        await Plant.updateOne(existingPlant, query);

        return response.status(200).json({ message: enumType + " updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update any monthly schedule value for a given plant_id: sow_date, plant_date, transplant_date or harvest_date
const updateMonthlySchedules = async (request, response) => {

    let { plant_id, scheduleType, scheduleValue } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    if (!Object.values(plantValidator.monthlyScheduleTypes).includes(scheduleType)) {
        return response.status(200).json({ errorMessage: "Invalid ScheduleType." });
    }

    if (!plantValidator.checkArrayLength(scheduleValue, 2)) {
        return response.status(200).json({ errorMessage: "Monthly schedules must have start and end month." });
    }

    if (!plantValidator.checkValidMonthSchedule(scheduleValue)) {
        return response.status(200).json({ errorMessage: "Month values must be between 1 and 12." });
    }

    try {
        let query = {};
        query[scheduleType] = scheduleValue;
        await Plant.updateOne(existingPlant, query);

        return response.status(200).json({ message: scheduleType + " updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update any required weekly schedule value for a given plant_id: water_schedule, spacing
const updateRequiredWeeklySchedules = async (request, response) => {

    let { plant_id, scheduleType, scheduleValue } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    if (!Object.values(plantValidator.requiredWeeklyScheduleTypes).includes(scheduleType)) {
        return response.status(200).json({ errorMessage: "Invalid ScheduleType." });
    }

    if (!plantValidator.checkArrayLength(scheduleValue, 2)) {
        return response.status(200).json({ errorMessage: "Schedules must have 2 values." });
    }

    if (!plantValidator.checkValidWeeklySchedule(scheduleValue)) {
        return response.status(200).json({ errorMessage: scheduleType + " values must be greater than 0." });
    }

    try {
        let query = {};
        query[scheduleType] = scheduleValue;
        await Plant.updateOne(existingPlant, query);

        return response.status(200).json({ message: scheduleType + " updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update any optional weekly schedule value for a given plant_id: prune_schedule, feed_schedule, indoor_schedule
const updateOptionalWeeklySchedules = async (request, response) => {

    let { plant_id, scheduleType, scheduleValue } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    if (!Object.values(plantValidator.optionalWeeklyScheduleTypes).includes(scheduleType)) {
        return response.status(200).json({ errorMessage: "Invalid ScheduleType." });
    }

    let editedString = "";

    if (plantValidator.checkArrayLength(scheduleValue, 1)) {
        if (typeof scheduleValue[0] !== 'string') {
            return response.status(200).json({ errorMessage: "Single values for optional schedules must be entered as strings." });
        }
        editedString = scheduleValue[0].trim();
    }

    if (editedString != "") {
        scheduleValue[0] = editedString;
    }

    if (plantValidator.checkArrayLength(scheduleValue, 2)) {
        if (!plantValidator.checkValidWeeklySchedule(scheduleValue)) {
            return response.status(200).json({ errorMessage: "Schedule values must be greater than 0." });
        }
    }

    try {
        let query = {};
        query[scheduleType] = scheduleValue;
        await Plant.updateOne(existingPlant, query);

        return response.status(200).json({ message: scheduleType + " updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's compost_schedule
const updateCompostSchedule = async (request, response) => {

    const { plant_id, compost_schedule } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!plantValidator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    if (compost_schedule == existingPlant.compost_schedule) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    try {
        await Plant.updateOne(existingPlant, { 'compost_schedule': compost_schedule });

        return response.status(200).json({ message: "Plant compost_schedule updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update any list value for a given plant_id: plant_problem, companion_plant, incompatible_plant
const updateLists = async (request, response) => {

    let { plant_id, listType, listValue } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    if (!Object.values(plantValidator.listTypes).includes(listType)) {
        return response.status(200).json({ errorMessage: "Invalid listType." });
    }

    if (!Array.isArray(listValue)) {
        return response.status(200).json({ errorMessage: "Plant_problem, companion_plant and incompatible_plant must be entered as arrays." });
    }

    let editedList = [];

    for (let i = 0; i < listValue.length; i++) {
        if (typeof listValue[i] !== 'string') {
            return response.status(200).json({ errorMessage: listType + " values must be entered as strings." });
        }
        let editedString = listValue[i].trim();
        editedList.push(editedString);
    }

    listValue = editedList;
    listValue = [...new Set(listValue)];

    try {
        let query = {};
        query[listType] = listValue;
        await Plant.updateOne(existingPlant, query);

        return response.status(200).json({ message: listType + " updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to edit a plant's related photos
const updateImages = async (request, response) => {

    const parsedReq = JSON.parse(request.body.plant);

    let { plant_id } = parsedReq;

    //Check if required params are given
    if (!plant_id) {
        return response.status(200).json({ errorMessage: "Plant_id required." });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant_id." });
    }

    //Get image_id array
    const image_id = [];
    request.files.forEach((file) => {
        const id = file.id;
        image_id.push(id);
    });

    //Get current note images
    let savedImages = [];
    for (let i = 0; i < existingPlant.image.length; i++) {
        savedImages.push(existingPlant.image[i]);
    }

    //Get images to be removed
    let removedImages = [];
    if (image_id.length == 0) {
        removedImages = savedImages;
    } else {
        savedImages.forEach((image) => {
            if (!image_id.includes(image)) {
                removedImages.push(image);
            }
        });
    }

    try {
        if (removedImages != null) {
            deleteImages(removedImages);
        }

        await Plant.updateOne(existingPlant, { image: image_id });

        return response.status(200).json({ message: "Plant images updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

module.exports = {
    createPlant,
    getAllPlants,
    getImageByID,
    getPlantByID,
    deletePlant,
    updateName,
    updateDescription,
    updateEnums,
    updateMonthlySchedules,
    updateRequiredWeeklySchedules,
    updateOptionalWeeklySchedules,
    updateCompostSchedule,
    updateLists,
    updateImages
}