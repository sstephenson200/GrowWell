const validator = require("../validators/validator");
const { check, validationResult } = require('express-validator');
const moment = require("moment");

const Note = require("../models/noteModel");
const User = require("../models/userModel");
const Plant = require("../models/plantModel");
const Garden = require("../models/gardenModel");

//Request to create a new note
const createNote = async (request, response) => {

    const parsedReq = JSON.parse(request.body.note);

    let { user_id, title, description, garden_id, plot_number } = parsedReq;
    const date = Date.now();

    //Check if required params are given
    if (!user_id) {
        return response.status(400).json({ errorMessage: "User_id required." });
    } else if (!title) {
        return response.status(400).json({ errorMessage: "Title required." });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(401).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkValidLength(title, 1, 30)) {
        return response.status(400).json({ errorMessage: "Title must be between 1 and 30 characters." });

    }

    if (description != null) {
        if (!validator.checkValidLength(description, 1, 250)) {
            return response.status(400).json({ errorMessage: "Description must be between 1 and 250 characters." });

        }
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    let existingGarden = null;
    let gardenSize = null;

    if (garden_id != null) {
        if (!validator.checkValidId(garden_id)) {
            return response.status(400).json({ errorMessage: "Invalid garden_id." });
        }

        existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
        if (!existingGarden) {
            return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
        }
        gardenSize = existingGarden.plot.length;
    }

    if (!validator.checkGardenAndPlotsProvided(garden_id, plot_number)) {
        return response.status(400).json({ errorMessage: "Plot_number must be provided with garden_id." });
    }

    if (plot_number != null) {
        if (!validator.checkValidPlotNumber(gardenSize, plot_number)) {
            return response.status(400).json({ errorMessage: "Invalid plot number." });
        }
    }

    //Get image_id array
    const image_id = [];
    for (let i = 0; i < request.files.length; i++) {
        const id = request.files[i].id;
        image_id.push(id);
    }

    try {

        const newNote = new Note({
            user_id, title, description, date, image: image_id, garden_id, plot_number
        });
        const savedNote = await newNote.save();

        return response.status(200).json({ message: "Note created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to get all notes for a given plant
const getNotesByPlant = async (request, response) => {

    const { user_id, plant_id } = request.body;

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

    if (!validator.checkValidId(plant_id)) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const existingPlant = await Plant.findOne({ _id: plant_id });
    if (!existingPlant) {
        return response.status(400).json({ errorMessage: "Invalid plant_id." });
    }

    const gardens = await Garden.find({ user_id: user_id, "plot.plant_id": plant_id });

    const notes = await Note.find({ user_id: user_id, garden_id: { $in: gardens } });

    return response.status(200).json({ notes: notes });
}

//Request to get all notes for a given plot
const getNotesByPlot = async (request, response) => {

    const { user_id, garden_id, plot_number } = request.body;

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

    if (!validator.checkValidId(garden_id)) {
        return response.status(400).json({ errorMessage: "Invalid garden_id." });
    }

    const existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
    if (!existingGarden) {
        return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
    }

    const gardenSize = existingGarden.plot.length;

    if (!validator.checkValidPlotNumber(gardenSize, plot_number)) {
        return response.status(400).json({ errorMessage: "Invalid plot_number." });
    }

    const notes = await Note.find({ user_id: user_id, garden_id: garden_id, "garden.plot.plot_number": plot_number });

    return response.status(200).json({ notes: notes });
}

//Request to get all notes for a given date
const getNotesByDate = async (request, response) => {

    const { user_id, date } = request.body;

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

    const notes = await Note.find({ user_id: user_id, date: { $gte: moment(date).toDate(), $lte: moment(date).endOf('day').toDate() } });

    return response.status(200).json({ notes: notes });
}

//Request to get all notes for a given month
const getNotesByMonth = async (request, response) => {

    const { user_id, date } = request.body;

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

    const startOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment(date).endOf('month').format('YYYY-MM-DD');


    const notes = await Note.find({ user_id: user_id, date: { $gte: moment(startOfMonth).toDate(), $lte: moment(endOfMonth).toDate() } });

    return response.status(200).json({ notes: notes });
}


module.exports = {
    createNote,
    getNotesByPlant,
    getNotesByPlot,
    getNotesByDate,
    getNotesByMonth
}