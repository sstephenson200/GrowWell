const { deleteImages } = require("../middleware/imageUpload");

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

    if (!Array.isArray(sun_condition) || !Array.isArray(soil_type) || !Array.isArray(soil_ph)) {
        return response.status(400).json({ errorMessage: "Sun_condition, soil_type and soil_ph must be entered as arrays." });
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
            return response.status(400).json({ errorMessage: "Invalid " + enums[i].name + "." });
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
                return response.status(400).json({ errorMessage: listName + " must have start and end month." });
            }
            if (!plantValidator.checkValidMonthSchedule(monthlySchedules[i].type)) {
                return response.status(400).json({ errorMessage: "Month values must be between 1 and 12." });
            }
        }
    }

    const requiredWeeklySchedules = [{ type: water_schedule, name: "water_schedule" }, { type: spacing, name: "spacing" }];

    //Check required weekly values have 2 values greater than 1
    for (let i = 0; i < requiredWeeklySchedules.length; i++) {
        const listName = requiredWeeklySchedules[i].name;
        if (!plantValidator.checkArrayLength(requiredWeeklySchedules[i].type, 2)) {
            return response.status(400).json({ errorMessage: listName + " array must have max and min value." });
        }
        if (!plantValidator.checkValidWeeklySchedule(requiredWeeklySchedules[i].type)) {
            return response.status(400).json({ errorMessage: "Schedule values for " + listName + " must be greater than 0." });
        }
    }

    const optionalWeeklySchedules = [{ type: prune_schedule, name: "prune_schedule" }, { type: feed_schedule, name: "feed_schedule" }, { type: indoor_schedule, name: "indoor_schedule" }];

    //Check optional weekly values have one string or two number values
    for (let i = 0; i < optionalWeeklySchedules.length; i++) {
        const listName = optionalWeeklySchedules[i].name;
        if (optionalWeeklySchedules[i].type != null) {
            if (plantValidator.checkArrayLength(optionalWeeklySchedules[i].type, 1)) {
                if (typeof optionalWeeklySchedules[i].type[0] !== 'string') {
                    return response.status(400).json({ errorMessage: "Single values for " + listName + " must be entered as strings." });
                } else {
                    optionalWeeklySchedules[i].type[0] = optionalWeeklySchedules[i].type[0].trim();
                }
            } else if (plantValidator.checkArrayLength(optionalWeeklySchedules[i].type, 2)) {
                if (!plantValidator.checkValidWeeklySchedule(optionalWeeklySchedules[i].type)) {
                    return response.status(400).json({ errorMessage: "Schedule values for " + listName + " must be greater than 0." });
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
                        return response.status(400).json({ errorMessage: listName + " values must be entered as strings." });
                    }
                    editedString = editedStringArraysEntry[j].trim();
                    editedStringArraysEntry[j] = editedString;
                }
            } else {
                return response.status(400).json({ errorMessage: "Plant_problem, companion_plant and incompatible_plant must be entered as arrays." });
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
        return response.status(400).json({ errorMessage: "No change detected." });
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
        return response.status(400).json({ errorMessage: "No change detected." });
    }

    try {
        await Plant.updateOne(existingPlant, { 'description': description });

        return response.status(200).json({ message: "Plant description updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

const updateEnums = async (request, response) => {

    let { plant_id, enumType, enumValue } = request.body;

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

    if (!Object.values(plantValidator.enumTypes).includes(enumType)) {
        return response.status(400).json({ errorMessage: "Invalid enumType." });
    }

    if (enumType == "plant_type") {
        if (typeof enumValue !== 'string') {
            return response.status(400).json({ errorMessage: "Plant_type must be entered as a string." });
        }
    } else {
        if (!Array.isArray(enumValue)) {
            return response.status(400).json({ errorMessage: "Sun_condition, soil_type and soil_ph must be entered as arrays." });
        }
        enumValue = [...new Set(enumValue)];
    }

    let enumCheck = [];
    enumCheck.push({ type: enumValue, name: enumType });

    if (!plantValidator.checkValidPlantEnum(enumCheck[0])) {
        return response.status(400).json({ errorMessage: "Invalid " + enumType + "." });
    }

    try {
        let query = {};
        query[enumType] = enumValue;
        await Plant.updateOne(existingPlant, query);

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

//Request to update a plant's water_schedule
const updateWaterSchedule = async (request, response) => {

    const { plant_id, water_schedule } = request.body;

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

    if (!validator.checkArrayLength(water_schedule, 2)) {
        return response.status(400).json({ errorMessage: "Water_schedule must have start and end month." });
    }

    if (!validator.checkValidWeeklySchedule(water_schedule)) {
        return response.status(400).json({ errorMessage: "Water_schedule values must be greater than 0." });
    }

    let currentWaterDate = Array.from(existingPlant.water_schedule);

    if (water_schedule[0] == currentWaterDate[0] && water_schedule[1] == currentWaterDate[1]) {
        return response.status(400).json({ errorMessage: "No water_schedule change detected." });
    }

    try {

        await Plant.updateOne(existingPlant, { water_schedule: water_schedule });

        return response.status(200).json({ message: "Water_schedule updated successfully." });

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
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    if (compost_schedule == existingPlant.compost_schedule) {
        return response.status(400).json({ errorMessage: "No change detected." });
    }

    try {
        await Plant.updateOne(existingPlant, { 'compost_schedule': compost_schedule });

        return response.status(200).json({ message: "Plant compost_schedule updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's prune_schedule
const updatePruneSchedule = async (request, response) => {

    const { plant_id, prune_schedule } = request.body;

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

    let editedString = "";

    if (validator.checkArrayLength(prune_schedule, 1)) {
        if (typeof prune_schedule[0] !== 'string') {
            return response.status(400).json({ errorMessage: "Single values for prune_schedule must be entered as strings." });
        }
        editedString = prune_schedule[0].trim();
    }

    let currentPruneDate = Array.from(existingPlant.prune_schedule);

    if (editedString != "") {
        prune_schedule[0] = editedString;

        if (prune_schedule[0] == currentPruneDate[0]) {
            return response.status(400).json({ errorMessage: "No prune_schedule change detected." });
        }
    }

    if (validator.checkArrayLength(prune_schedule, 2)) {
        if (!validator.checkValidWeeklySchedule(prune_schedule)) {
            return response.status(400).json({ errorMessage: "Prune_schedule values must be greater than 0." });
        }

        if (prune_schedule[0] == currentPruneDate[0] && prune_schedule[1] == currentPruneDate[1]) {
            return response.status(400).json({ errorMessage: "No prune_schedule change detected." });
        }
    }

    try {

        await Plant.updateOne(existingPlant, { prune_schedule: prune_schedule });

        return response.status(200).json({ message: "Prune_schedule updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's feed_schedule
const updateFeedSchedule = async (request, response) => {

    const { plant_id, feed_schedule } = request.body;

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

    let editedString = "";

    if (validator.checkArrayLength(feed_schedule, 1)) {
        if (typeof feed_schedule[0] !== 'string') {
            return response.status(400).json({ errorMessage: "Single values for feed_schedule must be entered as strings." });
        }
        editedString = feed_schedule[0].trim();
    }

    let currentFeedDate = Array.from(existingPlant.feed_schedule);

    if (editedString != "") {
        feed_schedule[0] = editedString;

        if (feed_schedule[0] == currentFeedDate[0]) {
            return response.status(400).json({ errorMessage: "No feed_schedule change detected." });
        }
    }

    if (validator.checkArrayLength(feed_schedule, 2)) {
        if (!validator.checkValidWeeklySchedule(feed_schedule)) {
            return response.status(400).json({ errorMessage: "Feed_schedule values must be greater than 0." });
        }

        if (feed_schedule[0] == currentFeedDate[0] && feed_schedule[1] == currentFeedDate[1]) {
            return response.status(400).json({ errorMessage: "No feed_schedule change detected." });
        }
    }

    try {

        await Plant.updateOne(existingPlant, { feed_schedule: feed_schedule });

        return response.status(200).json({ message: "Feed_schedule updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's indoor_schedule
const updateIndoorSchedule = async (request, response) => {

    const { plant_id, indoor_schedule } = request.body;

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

    let editedString = "";

    if (validator.checkArrayLength(indoor_schedule, 1)) {
        if (typeof indoor_schedule[0] !== 'string') {
            return response.status(400).json({ errorMessage: "Single values for indoor_schedule must be entered as strings." });
        }
        editedString = indoor_schedule[0].trim();
    }

    let currentIndoorDate = Array.from(existingPlant.indoor_schedule);

    if (editedString != "") {
        indoor_schedule[0] = editedString;

        if (indoor_schedule[0] == currentIndoorDate[0]) {
            return response.status(400).json({ errorMessage: "No indoor_schedule change detected." });
        }
    }

    if (validator.checkArrayLength(indoor_schedule, 2)) {
        if (!validator.checkValidWeeklySchedule(indoor_schedule)) {
            return response.status(400).json({ errorMessage: "Indoor_schedule values must be greater than 0." });
        }

        if (indoor_schedule[0] == currentIndoorDate[0] && indoor_schedule[1] == currentIndoorDate[1]) {
            return response.status(400).json({ errorMessage: "No indoor_schedule change detected." });
        }
    }

    try {

        await Plant.updateOne(existingPlant, { indoor_schedule: indoor_schedule });

        return response.status(200).json({ message: "Indoor_schedule updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's spacing
const updateSpacing = async (request, response) => {

    const { plant_id, spacing } = request.body;

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

    if (!validator.checkArrayLength(spacing, 2)) {
        return response.status(400).json({ errorMessage: "Spacing must have min and max value." });
    }

    if (!validator.checkValidWeeklySchedule(spacing)) {
        return response.status(400).json({ errorMessage: "Spacing values must be greater than 0." });
    }

    let currentSpacing = Array.from(existingPlant.spacing);

    if (spacing[0] == currentSpacing[0] && spacing[1] == currentSpacing[1]) {
        return response.status(400).json({ errorMessage: "No spacing change detected." });
    }

    try {

        await Plant.updateOne(existingPlant, { spacing: spacing });

        return response.status(200).json({ message: "Spacing updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's plant_problem
const updatePlantProblems = async (request, response) => {

    let { plant_id, plant_problem } = request.body;

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

    let stringArrays = [{ type: plant_problem, name: "plant_problem" }];

    let editedStringArrays = [];
    let editedStringArraysEntry = [...new Set(stringArrays[0].type)];

    for (let i = 0; i < editedStringArraysEntry.length; i++) {
        if (typeof editedStringArraysEntry[i] !== 'string') {
            return response.status(400).json({ errorMessage: "Plant_problem values must be entered as strings." });
        }
        let editedString = editedStringArraysEntry[i].trim();
        editedStringArraysEntry[i] = editedString;
    }

    editedStringArrays.push(editedStringArraysEntry);

    stringArrays = editedStringArrays;
    plant_problem = stringArrays[0];

    try {

        await Plant.updateOne(existingPlant, { plant_problem: plant_problem });

        return response.status(200).json({ message: "Plant_problem updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's companion_plant
const updateCompanionPlants = async (request, response) => {

    let { plant_id, companion_plant } = request.body;

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

    let stringArrays = [{ type: companion_plant, name: "companion_plant" }];

    let editedStringArrays = [];
    let editedStringArraysEntry = [...new Set(stringArrays[0].type)];

    for (let i = 0; i < editedStringArraysEntry.length; i++) {
        if (typeof editedStringArraysEntry[i] !== 'string') {
            return response.status(400).json({ errorMessage: "Companion_plant values must be entered as strings." });
        }
        let editedString = editedStringArraysEntry[i].trim();
        editedStringArraysEntry[i] = editedString;
    }

    editedStringArrays.push(editedStringArraysEntry);

    stringArrays = editedStringArrays;
    companion_plant = stringArrays[0];

    try {

        await Plant.updateOne(existingPlant, { companion_plant: companion_plant });

        return response.status(200).json({ message: "Companion_plant updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plant's incompatible_plant
const updateIncompatiblePlants = async (request, response) => {

    let { plant_id, incompatible_plant } = request.body;

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

    let stringArrays = [{ type: incompatible_plant, name: "incompatible_plant" }];

    let editedStringArrays = [];
    let editedStringArraysEntry = [...new Set(stringArrays[0].type)];

    for (let i = 0; i < editedStringArraysEntry.length; i++) {
        if (typeof editedStringArraysEntry[i] !== 'string') {
            return response.status(400).json({ errorMessage: "Companion_plant values must be entered as strings." });
        }
        let editedString = editedStringArraysEntry[i].trim();
        editedStringArraysEntry[i] = editedString;
    }

    editedStringArrays.push(editedStringArraysEntry);

    stringArrays = editedStringArrays;
    incompatible_plant = stringArrays[0];

    try {

        await Plant.updateOne(existingPlant, { incompatible_plant: incompatible_plant });

        return response.status(200).json({ message: "Incompatible_plant updated successfully." });

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
        return response.status(400).json({ errorMessage: "Plant_id required." });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    //Get image_id array
    const image_id = [];
    for (let i = 0; i < request.files.length; i++) {
        const id = request.files[i].id;
        image_id.push(id);
    }

    let savedImages = [];

    for (let i = 0; i < existingPlant.image.length; i++) {
        savedImages.push(existingPlant.image[i]);
    }

    let removedImages = [];

    if (image_id.length == 0) {
        removedImages = savedImages;
    } else {
        for (let i = 0; i < savedImages.length; i++) {
            if (!image_id.includes(savedImages[i])) {
                removedImages.push(savedImages[i]);
            }
        }
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
    getPlantByID,
    deletePlant,
    updateName,
    updateDescription,
    updateEnums,
    updateSowDate,
    updatePlantDate,
    updateTransplantDate,
    updateHarvestDate,
    updateWaterSchedule,
    updateCompostSchedule,
    updatePruneSchedule,
    updateFeedSchedule,
    updateIndoorSchedule,
    updateSpacing,
    updatePlantProblems,
    updateCompanionPlants,
    updateIncompatiblePlants,
    updateImages
}