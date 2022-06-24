const validator = require("../validators/validator");
const { check, validationResult } = require('express-validator');

const Plant = require("../models/plantModel");


//Create Plant Endpoint
const createPlant = async (request, response) => {

    let parsedReq = JSON.parse(request.body.plant);

    let { name, description, plant_type, sow_date, plant_date, transplant_date, harvest_date, sun_condition, soil_type,
        soil_ph, water_schedule, compost_schedule, prune_schedule, feed_schedule, indoor_schedule, spacing, plant_problem,
        companion_plant, incompatible_plant } = parsedReq;

    let enums = [{ type: plant_type, name: "plant_type" }, { type: sun_condition, name: "sun_condition" }, { type: soil_type, name: "soil_type" }, { type: soil_ph, name: "soil_ph" }];
    const monthlySchedules = [{ type: sow_date, name: "sow_date" }, { type: plant_date, name: "plant_date" }, { type: transplant_date, name: "transplant_date" }, { type: harvest_date, name: "harvest_date" }];
    const requiredWeeklySchedules = [{ type: water_schedule, name: "water_schedule" }, { type: spacing, name: "spacing" }];
    const optionalWeeklySchedules = [{ type: prune_schedule, name: "prune_schedule" }, { type: feed_schedule, name: "feed_schedule" }, { type: indoor_schedule, name: "indoor_schedule" }];
    let stringArrays = [{ type: plant_problem, name: "plant_problem" }, { type: companion_plant, name: "companion_plant" }, { type: incompatible_plant, name: "incompatible_plant" }];

    //Check if required params are given
    if (!name) {
        return response.status(400).json({ errorMessage: "Name required." });
    } else if (!plant_type) {
        return response.status(400).json({ errorMessage: "Plant type required." });
    } else if (!sun_condition) {
        return response.status(400).json({ errorMessage: "Sun_condition required." });
    } else if (!soil_type) {
        return response.status(400).json({ errorMessage: "Soil_type required." });
    } else if (!soil_ph) {
        return response.status(400).json({ errorMessage: "Soil_ph required." });
    } else if (!water_schedule) {
        return response.status(400).json({ errorMessage: "Water_schedule required." });
    } else if (!indoor_schedule) {
        return response.status(400).json({ errorMessage: "Indoor_schedule required." });
    } else if (!spacing) {
        return response.status(400).json({ errorMessage: "Spacing required." });
    }

    if (!validator.checkValidLength(name, 1, 30)) {
        return response.status(400).json({ errorMessage: "Name must be between 1 and 30 characters." });
    }

    if (description != null) {
        if (!validator.checkValidLength(description, 1, 250)) {
            return response.status(400).json({ errorMessage: "Description must be between 1 and 250 characters." });
        }
    }

    if (compost_schedule != null) {
        if (!validator.checkValidLength(compost_schedule, 1, 30)) {
            return response.status(400).json({ errorMessage: "Compost schedule must be between 1 and 30 characters." });
        }
    }

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
        if (!validator.checkValidPlantEnum(enums[i])) {
            return response.status(400).json({ errorMessage: "Invalid " + enums[i].name + "." });
        }
    }

    //Reset enum values
    enums = editedEnums;
    plant_type = enums[0];
    sun_condition = enums[1];
    soil_type = enums[2];
    soil_ph = enums[3];

    //Check monthly schedules have 2 values between 1 and 12 
    for (let i = 0; i < monthlySchedules.length; i++) {
        if (monthlySchedules[i].type != null) {
            if (!validator.checkArrayLength(monthlySchedules[i].type, 2)) {
                const listName = monthlySchedules[i].name;
                return response.status(400).json({ errorMessage: listName + " must have start and end month." });
            }
            if (!validator.checkValidMonthSchedule(monthlySchedules[i].type)) {
                return response.status(400).json({ errorMessage: "Month values must be between 1 and 12." });
            }
        }
    }

    //Check required weekly values have 2 values greater than 1
    for (let i = 0; i < requiredWeeklySchedules.length; i++) {
        const listName = requiredWeeklySchedules[i].name;
        if (!validator.checkArrayLength(requiredWeeklySchedules[i].type, 2)) {
            return response.status(400).json({ errorMessage: listName + " array must have max and min value." });
        }
        if (!validator.checkValidWeeklySchedule(requiredWeeklySchedules[i].type)) {
            return response.status(400).json({ errorMessage: "Schedule values for " + listName + " must be greater than 0." });
        }
    }

    //Check optional weekly values have one string or two number values
    for (let i = 0; i < optionalWeeklySchedules.length; i++) {
        const listName = optionalWeeklySchedules[i].name;
        if (optionalWeeklySchedules[i].type != null) {
            if (validator.checkArrayLength(optionalWeeklySchedules[i].type, 1)) {
                optionalWeeklySchedules[i].type[0] = optionalWeeklySchedules[i].type[0].trim();
                if (typeof optionalWeeklySchedules[i].type[0] !== 'string') {
                    return response.status(400).json({ errorMessage: "Single values for" + listName + " must be entered as strings." });
                }
            } else if (validator.checkArrayLength(optionalWeeklySchedules[i].type, 2)) {
                if (!validator.checkValidWeeklySchedule(optionalWeeklySchedules[i].type)) {
                    return response.status(400).json({ errorMessage: "Schedule values for " + listName + " must be greater than 0." });
                }
            }
        }
    }

    let editedString = "";
    let editedStringArraysEntry = [];
    let editedStringArrays = [];

    //Check entries are strings
    for (let i = 0; i < stringArrays.length; i++) {
        const listName = stringArrays[i].name;
        if (stringArrays[i].type != null) {
            editedStringArraysEntry = [...new Set(stringArrays[i].type)];
            for (let j = 0; j < editedStringArraysEntry.length; j++) {
                if (typeof editedStringArraysEntry[j] !== 'string') {
                    return response.status(400).json({ errorMessage: listName + " values must be entered as strings." });
                }
                editedString = editedStringArraysEntry[j].trim();
                editedStringArraysEntry[j] = editedString;
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

//Request to get a plant for a given plant_id
const getPlantByID = async (request, response) => {

    const { plant_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    return response.status(200).json({ plant: existingPlant });
}

//Function to delete all image files and chunks from an array of objects
function deleteImagesFromArray(array) {
    for (let i = 0; i < array.length; i++) {
        deleteImages(array[i]);
    }
}

//Function to delete all iamges from a single object
function deleteImages(images) {
    images.forEach((image) => {
        bucket.delete(image);
    });
}

//Request to delete a plant for a given plant_id
const deletePlant = async (request, response) => {

    const { plant_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    try {

        let plant = await Plant.findOneAndDelete({ _id: plant_id });
        deleteImagesFromArray(plant);

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
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    if (name == existingPlant.name) {
        return response.status(400).json({ errorMessage: "No name change detected." });
    }

    try {

        await Plant.updateOne(existingPlant, { name: name });

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
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    if (description == existingPlant.description) {
        return response.status(400).json({ errorMessage: "No description change detected." });
    }

    try {

        await Plant.updateOne(existingPlant, { description: description });

        return response.status(200).json({ message: "Plant description updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's plant_type
const updatePlantType = async (request, response) => {

    const { plant_id, plant_type } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    let enumCheck = [];
    enumCheck.push({ type: plant_type, name: "plant_type" });

    if (!validator.checkValidPlantEnum(enumCheck[0])) {
        return response.status(400).json({ errorMessage: "Invalid plant_type." });
    }

    if (plant_type == existingPlant.plant_type) {
        return response.status(400).json({ errorMessage: "No plant_type change detected." });
    }

    try {

        await Plant.updateOne(existingPlant, { plant_type: plant_type });

        return response.status(200).json({ message: "Plant_type updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's sow_date
const updateSowDate = async (request, response) => {

    const { plant_id, sow_date } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    if (!validator.checkArrayLength(sow_date, 2)) {
        return response.status(400).json({ errorMessage: "Sow_date must have start and end month." });
    }

    if (!validator.checkValidMonthSchedule(sow_date)) {
        return response.status(400).json({ errorMessage: "Month values must be between 1 and 12." });
    }

    let currentSow = Array.from(existingPlant.sow_date);

    if (sow_date[0] == currentSow[0] && sow_date[1] == currentSow[1]) {
        return response.status(400).json({ errorMessage: "No sow_date change detected." });
    }

    try {

        await Plant.updateOne(existingPlant, { sow_date: sow_date });

        return response.status(200).json({ message: "Sow_date updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's plant_date
const updatePlantDate = async (request, response) => {

    const { plant_id, plant_date } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    if (!validator.checkArrayLength(plant_date, 2)) {
        return response.status(400).json({ errorMessage: "Plant_date must have start and end month." });
    }

    if (!validator.checkValidMonthSchedule(plant_date)) {
        return response.status(400).json({ errorMessage: "Month values must be between 1 and 12." });
    }

    let currentPlantDate = Array.from(existingPlant.plant_date);

    if (plant_date[0] == currentPlantDate[0] && plant_date[1] == currentPlantDate[1]) {
        return response.status(400).json({ errorMessage: "No plant_date change detected." });
    }

    try {

        await Plant.updateOne(existingPlant, { plant_date: plant_date });

        return response.status(200).json({ message: "Plant_date updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's transplant_date
const updateTransplantDate = async (request, response) => {

    const { plant_id, transplant_date } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    if (!validator.checkArrayLength(transplant_date, 2)) {
        return response.status(400).json({ errorMessage: "Transplant_date must have start and end month." });
    }

    if (!validator.checkValidMonthSchedule(transplant_date)) {
        return response.status(400).json({ errorMessage: "Month values must be between 1 and 12." });
    }

    let currentTransplantDate = Array.from(existingPlant.transplant_date);

    if (transplant_date[0] == currentTransplantDate[0] && transplant_date[1] == currentTransplantDate[1]) {
        return response.status(400).json({ errorMessage: "No transplant_date change detected." });
    }

    try {

        await Plant.updateOne(existingPlant, { transplant_date: transplant_date });

        return response.status(200).json({ message: "Transplant_date updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's harvest_date
const updateHarvestDate = async (request, response) => {

    const { plant_id, harvest_date } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    if (!validator.checkArrayLength(harvest_date, 2)) {
        return response.status(400).json({ errorMessage: "Harvest_date must have start and end month." });
    }

    if (!validator.checkValidMonthSchedule(harvest_date)) {
        return response.status(400).json({ errorMessage: "Month values must be between 1 and 12." });
    }

    let currentHarvestDate = Array.from(existingPlant.harvest_date);

    if (harvest_date[0] == currentHarvestDate[0] && harvest_date[1] == currentHarvestDate[1]) {
        return response.status(400).json({ errorMessage: "No harvest_date change detected." });
    }

    try {

        await Plant.updateOne(existingPlant, { harvest_date: harvest_date });

        return response.status(200).json({ message: "Harvest_date updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's sun_condition
const updateSunCondition = async (request, response) => {

    let { plant_id, sun_condition } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    let enums = [{ type: sun_condition, name: "sun_condition" }];

    let editedEnums = [...new Set(enums[0].type)];

    if (!validator.checkValidPlantEnum(enums[0])) {
        return response.status(400).json({ errorMessage: "Invalid sun_condition." });
    }

    enums = editedEnums;
    sun_condition = enums;

    try {

        await Plant.updateOne(existingPlant, { sun_condition: sun_condition });

        return response.status(200).json({ message: "Sun_condition updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's soil_type
const updateSoilType = async (request, response) => {

    let { plant_id, soil_type } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    let enums = [{ type: soil_type, name: "soil_type" }];

    let editedEnums = [...new Set(enums[0].type)];

    if (!validator.checkValidPlantEnum(enums[0])) {
        return response.status(400).json({ errorMessage: "Invalid soil_type." });
    }

    enums = editedEnums;
    soil_type = enums;

    try {

        await Plant.updateOne(existingPlant, { soil_type: soil_type });

        return response.status(200).json({ message: "Soil_type updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's soil_ph
const updateSoilPh = async (request, response) => {

    let { plant_id, soil_ph } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });

    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    let enums = [{ type: soil_ph, name: "soil_ph" }];

    let editedEnums = [...new Set(enums[0].type)];

    if (!validator.checkValidPlantEnum(enums[0])) {
        return response.status(400).json({ errorMessage: "Invalid soil_ph." });
    }

    enums = editedEnums;
    soil_ph = enums;

    try {

        await Plant.updateOne(existingPlant, { soil_ph: soil_ph });

        return response.status(200).json({ message: "Soil_ph updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//edit water_schedule

//edit compost_schedule

//edit feed_schedule

//edit indoor_schedule

//edit spacing

//edit plant_problem

//edit companion_plant

//edit incompatible_plant

//edit images

module.exports = {
    createPlant,
    getAllPlants,
    getPlantByID,
    deletePlant,
    updateName,
    updateDescription,
    updatePlantType,
    updateSowDate,
    updatePlantDate,
    updateTransplantDate,
    updateHarvestDate,
    updateSunCondition,
    updateSoilType,
    updateSoilPh
}