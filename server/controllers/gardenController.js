const validator = require("../validators/validator");
const { check, validationResult } = require('express-validator');

const alarmController = require("./alarmController");
const noteController = require("./noteController");

const Garden = require("../models/gardenModel");
const User = require("../models/userModel");
const Alarm = require("../models/alarmModel");
const Plant = require("../models/plantModel");
const Note = require("../models/noteModel");


//Create Garden Endpoint
const createGarden = async (request, response) => {

    const { user_id, length, width, name } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errors: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (await validator.checkExistingGardenName(name, user_id)) {
        return response.status(400).json({ errorMessage: "Garden name already in use." });
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
        const savedGarden = await newGarden.save();

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
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const gardens = await Garden.find({ user_id: user_id }).select("name");

    return response.status(200).json({ gardens: gardens });
}

//Request to get a garden for a given garden_id
const getGardenByID = async (request, response) => {

    const { user_id, garden_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(400).json({ errorMessage: "Invalid garden_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
    if (!existingGarden) {
        return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
    }

    const garden = await Garden.findOne({ _id: garden_id });

    return response.status(200).json({ garden: garden });
}

//Request to get a garden plot for a given garden_id and plot_number
const getPlotByNumber = async (request, response) => {

    const { user_id, garden_id, plot_number } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(400).json({ errorMessage: "Invalid garden_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
    if (!existingGarden) {
        return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
    }

    const gardenSize = existingGarden.plot.length;

    if (!validator.checkValidPlotNumber(gardenSize, plot_number)) {
        return response.status(400).json({ errorMessage: "Invalid plot_number." });
    }

    const plot = existingGarden.plot[plot_number];

    return response.status(200).json({ plot: plot });
}

//Request to delete a garden
const deleteGarden = async (request, response) => {

    const { user_id, garden_id, password } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(400).json({ errorMessage: "Invalid garden_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
    if (!existingGarden) {
        return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
    }

    if (! await validator.checkPasswordCorrect(password, existingUser.password_hash)) {
        return response.status(401).json({ errorMessage: "Invalid credentials." });
    }

    try {

        await noteController.deleteNotesByGarden(user_id, garden_id);
        await alarmController.deleteAlarmsByGarden(user_id, garden_id);
        await Garden.deleteOne({ _id: garden_id });

        return response.status(200).json({ message: "Garden deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to delete all gardens for a given user_id
const deleteAllGardens = async (request, response) => {

    const { user_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    try {

        await Note.deleteMany({ user_id: user_id, garden_id: { $ne: null } })
        await Alarm.deleteMany({ user_id: user_id, garden_id: { $ne: null } })
        await Garden.deleteMany({ user_id: user_id });

        return response.status(200).json({ message: "Gardens deleted successfully." });

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
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(400).json({ errorMessage: "Invalid garden_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
    if (!existingGarden) {
        return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
    }

    if (name == existingGarden.name) {
        return response.status(400).json({ errorMessage: "No name change detected." });
    }

    try {

        await Garden.updateOne({ _id: garden_id }, { name: name });

        return response.status(200).json({ message: "Garden name updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a plot's planted date
const updatePlotPlantedDate = async (request, response) => {

    const { user_id, garden_id, plot_number, date_planted } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(400).json({ errorMessage: "Invalid garden_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
    if (!existingGarden) {
        return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
    }

    const gardenSize = existingGarden.plot.length;

    if (!validator.checkValidPlotNumber(gardenSize, plot_number)) {
        return response.status(400).json({ errorMessage: "Invalid plot_number." });
    }

    if (Date.parse(date_planted) == Date.parse(existingGarden.plot[plot_number].date_planted)) {
        return response.status(400).json({ errorMessage: "No due_date change detected." });
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

    const { user_id, garden_id, plot_number, plant_id, date_planted } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(400).json({ errorMessage: "Invalid garden_id." });
    }

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }


    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
    if (!existingGarden) {
        return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
    }

    const gardenSize = existingGarden.plot.length;

    if (!validator.checkValidPlotNumber(gardenSize, plot_number)) {
        return response.status(400).json({ errorMessage: "Invalid plot_number." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    if (plant_id === existingPlant._id) {
        return response.status(400).json({ errorMessage: "No plant change detected." });
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
    getPlotByNumber,
    deleteGarden,
    deleteAllGardens,
    updateName,
    updatePlotPlantedDate,
    updatePlotPlant
}