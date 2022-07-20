const { check, validationResult } = require('express-validator');
const validator = require("../validators/validator");
const userValidator = require("../validators/userValidator");
const gardenValidator = require("../validators/gardenValidator");

const alarmController = require("./alarmController");
const noteController = require("./noteController");

const Garden = require("../models/gardenModel");
const User = require("../models/userModel");
const Plant = require("../models/plantModel");

//Function to delete all gardens for a given user_id
async function deleteAllGardens(user_id) {

    try {
        await Garden.deleteMany({ 'user_id': user_id });
        return true;

    } catch (error) {
        return false;
    }
}

//Create Garden Endpoint
const createGarden = async (request, response) => {

    const { user_id, length, width, name } = request.body;

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
        const newGarden = new Garden({
            user_id, size: [length, width], name, plot: gardenPlots
        });
        await newGarden.save();

        return response.status(200).json({ message: "Garden created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to get all garden names for a given user_id
const getAllGardens = async (request, response) => {

    const { user_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const gardens = await Garden.find({ "user_id": user_id });

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
        return response.status(200).json({ errorMessage: "Invalid garden_id." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id });
    if (!existingGarden) {
        return response.status(200).json({ errorMessage: "Invalid garden_id." });
    }

    const garden = await Garden.findOne({ _id: garden_id });

    return response.status(200).json({ garden: garden });
}

//Request to delete a garden
const deleteGarden = async (request, response) => {

    const { user_id, garden_id, password } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(200).json({ errorMessage: "Invalid garden_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });
    if (!existingUser || !await userValidator.checkPasswordCorrect(password, existingUser.password_hash)) {
        return response.status(200).json({ errorMessage: "Invalid credentials." });
    }

    try {
        const deletedNotes = await noteController.deleteNotesByGarden(garden_id);
        const deletedAlarms = await alarmController.deleteAlarmsByGarden(garden_id);
        const deletedGarden = await Garden.deleteOne({ _id: garden_id });

        return response.status(200).json({ message: "Garden deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a garden's name
const updateName = async (request, response) => {

    const { user_id, garden_id, name } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(200).json({ errorMessage: "Invalid garden_id." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id });
    if (!existingGarden) {
        return response.status(200).json({ errorMessage: "Invalid garden_id." });
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
        return response.status(200).json({ errorMessage: "Invalid garden_id." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id });
    if (!existingGarden) {
        return response.status(200).json({ errorMessage: "Invalid garden_id." });
    }

    const gardenSize = existingGarden.plot.length;

    if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
        return response.status(200).json({ errorMessage: "Invalid plot_number." });
    }

    if (Date.parse(date_planted) == Date.parse(existingGarden.plot[plot_number].date_planted)) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    try {
        await Garden.updateOne({ _id: garden_id, "plot.plot_number": plot_number }, { $set: { 'plot.$.date_planted': date_planted } });

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
        return response.status(200).json({ errorMessage: "Invalid garden_id." });
    }

    if (plant_id !== undefined) {
        if (!validator.checkValidId(plant_id)) {
            return response.status(200).json({ errorMessage: "Invalid plant_id." });
        }

        const existingPlant = await Plant.findOne({ _id: plant_id });
        if (!existingPlant) {
            return response.status(200).json({ errorMessage: "Invalid plant_id." });
        }

        if (plant_id === existingPlant._id) {
            return response.status(200).json({ errorMessage: "No change detected." });
        }
    } else {
        plant_id = null;
    }

    const existingGarden = await Garden.findOne({ _id: garden_id });
    if (!existingGarden) {
        return response.status(200).json({ errorMessage: "Invalid garden_id." });
    }

    const gardenSize = existingGarden.plot.length;

    if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
        return response.status(200).json({ errorMessage: "Invalid plot_number." });
    }

    if (date_planted == null) {
        date_planted = Date.now();
    }

    try {
        await Garden.updateOne({ _id: garden_id, "plot.plot_number": plot_number }, { $set: { 'plot.$.plant_id': plant_id, 'plot.$.date_planted': date_planted } });

        return response.status(200).json({ message: "Plot plant updated successfully." });

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
    updatePlotPlant
}