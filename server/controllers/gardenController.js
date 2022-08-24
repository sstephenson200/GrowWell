const { validationResult } = require("express-validator");
const validator = require("../validators/validator");
const userValidator = require("../validators/userValidator");
const gardenValidator = require("../validators/gardenValidator");

const alarmController = require("./alarmController");
const noteController = require("./noteController");

const Garden = require("../models/gardenModel");

const { CreateGarden, GetAllGardens, GetGardenByID, DeleteGarden, UpdatePlotPlant, GetGarden, GetPlant, UpdatePlotHistory, DeleteAllGardens } = require("../repositories/gardenRepository");
const { GetUser } = require("../repositories/userRepository");

// *** CREATE REQUESTS ***

//Create Garden Endpoint
const createGarden = async (request, response) => {

    let user_id = request.user;

    const { length, width, name } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (await gardenValidator.checkExistingGardenName(name, user_id)) {
        return response.status(200).json({ errorMessage: "Garden name already in use." });
    }

    //Create Plots
    const numPlots = length * width;
    const gardenPlots = [];
    for (let i = 0; i < numPlots; i++) {
        const emptyPlot = { plot_number: i, plant_id: null, date_planted: null, plot_history: [] };
        gardenPlots.push(emptyPlot);
    }

    try {
        let newGarden = await CreateGarden(user_id, length, width, name, gardenPlots);
        return response.status(200).json({ message: "Garden created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

// *** GET REQUESTS *** 

//Request to get all garden names for a given user_id
const getAllGardens = async (request, response) => {

    let user_id = request.user;
    let gardens = await GetAllGardens(user_id);
    return response.status(200).json({ gardens: gardens });
}

//Request to get a garden for a given garden_id
const getGardenByID = async (request, response) => {

    const { garden_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    let existingGarden = await GetGardenByID(garden_id);
    if (!existingGarden) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    return response.status(200).json({ garden: existingGarden });
}

// *** DELETE REQUESTS *** 

//Request to delete a garden
const deleteGarden = async (request, response) => {

    let user_id = request.user;

    const { garden_id, password } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    let existingUser = await GetUser(user_id);
    if (!existingUser || !await userValidator.checkPasswordCorrect(password, existingUser.password_hash)) {
        return response.status(200).json({ errorMessage: "Invalid credentials." });
    }

    try {
        const deletedNotes = await noteController.deleteNotesByGarden(garden_id);
        const deletedAlarms = await alarmController.deleteAlarmsByGarden(garden_id);
        let deletedGarden = await DeleteGarden(garden_id);

        return response.status(200).json({ message: "Garden deleted successfully.", alarms: deletedAlarms });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Function to delete all gardens for a given user_id
async function deleteAllGardens(user_id) {

    try {
        await DeleteAllGardens(user_id);
        return true;

    } catch (error) {
        throw error;
    }
}

// *** UPDATE REQUESTS ***

//Request to update a garden's name
const updateName = async (request, response) => {

    let user_id = request.user;

    const { garden_id, name } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id });
    if (!existingGarden) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    if (name == existingGarden.name) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    if (await gardenValidator.checkExistingGardenName(name, user_id)) {
        return response.status(200).json({ errorMessage: "Garden name already in use." });
    }

    try {
        await Garden.updateOne({ _id: garden_id }, { "name": name });

        return response.status(200).json({ message: "Garden name updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plot's planted date
const updatePlotPlantedDate = async (request, response) => {

    let { garden_id, plot_number, date_planted } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id });
    if (!existingGarden) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    const gardenSize = existingGarden.plot.length;

    if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
        return response.status(200).json({ errorMessage: "Invalid plot number." });
    }

    if (Date.parse(date_planted) == Date.parse(existingGarden.plot[plot_number].date_planted)) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    try {
        await Garden.updateOne({ _id: garden_id, "plot.plot_number": plot_number }, { $set: { "plot.$.date_planted": date_planted } });

        return response.status(200).json({ message: "Plot planted date updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plot's current plant
const updatePlotPlant = async (request, response) => {

    let { garden_id, plot_number, plant_id, date_planted } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    if (plant_id !== undefined) {
        if (!validator.checkValidId(plant_id)) {
            return response.status(200).json({ errorMessage: "Invalid plant ID." });
        }

        let existingPlant = await GetPlant(plant_id);
        if (!existingPlant) {
            return response.status(200).json({ errorMessage: "Invalid plant ID." });
        }

        if (plant_id === existingPlant._id) {
            return response.status(200).json({ errorMessage: "No change detected." });
        }
    }

    let existingGarden = await GetGarden(garden_id);
    if (!existingGarden) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    const gardenSize = existingGarden.plot.length;

    if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
        return response.status(200).json({ errorMessage: "Invalid plot number." });
    }

    if (date_planted == null) {
        date_planted = Date.now();
    }

    try {
        let garden = await UpdatePlotPlant(garden_id, plant_id, plot_number, date_planted);
        return response.status(200).json({ message: "Plot plant updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plot's history
const updatePlotHistory = async (request, response) => {

    let { garden_id, plot_number, plant_id, date_planted } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(200).json({ errorMessage: "Invalid plant ID." });
    }

    let existingPlant = await GetPlant(plant_id);
    if (!existingPlant) {
        return response.status(200).json({ errorMessage: "Invalid plant ID." });
    }

    let existingGarden = await GetGarden(garden_id);
    if (!existingGarden) {
        return response.status(200).json({ errorMessage: "Invalid garden ID." });
    }

    const gardenSize = existingGarden.plot.length;

    if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
        return response.status(200).json({ errorMessage: "Invalid plot number." });
    }

    if (!Date.parse(date_planted)) {
        return response.status(200).json({ errorMessage: "Invalid date planted." });
    }

    let plot_history = existingGarden.plot[plot_number].plot_history;
    plot_history.push({ "plant_id": plant_id, "date_planted": date_planted });

    try {
        let garden = await UpdatePlotHistory(garden_id, plot_number, plot_history);
        return response.status(200).json({ message: "Plot history updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

module.exports = {
    createGarden,
    getAllGardens,
    getGardenByID,
    deleteGarden,
    deleteAllGardens,
    updateName,
    updatePlotPlantedDate,
    updatePlotPlant,
    updatePlotHistory
}