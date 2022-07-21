const moment = require("moment");
const { deleteImages } = require("../middleware/imageUpload");

const { check, validationResult } = require('express-validator');
const validator = require("../validators/validator");
const gardenValidator = require("../validators/gardenValidator");

const Note = require("../models/noteModel");
const Plant = require("../models/plantModel");
const Garden = require("../models/gardenModel");

//Function to delete a note by garden_id
async function deleteNotesByGarden(garden_id) {

    const existingNote = await Note.findOne({ 'garden_id': garden_id });
    if (!existingNote) {
        return false;
    }

    try {
        let notes = await Note.find({ 'garden_id': garden_id });
        await Note.deleteMany({ 'garden_id': garden_id });
        notes.forEach((note) => {
            deleteImages(note.image);
        });

        return true;

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Function to delete all notes for a given user_id
async function deleteAllNotes(user_id) {

    try {
        let notes = await Note.find({ 'user_id': user_id });
        await Note.deleteMany({ 'user_id': user_id });
        notes.forEach((note) => {
            deleteImages(note.image);
        });
        return true;

    } catch (error) {
        return false;
    }

}

//Request to create a new note
const createNote = async (request, response) => {

    const parsedReq = request.body.note;

    const { user_id, title, description, garden_id, plot_number } = parsedReq;
    const date = Date.now();

    //Check if required params are given
    if (!user_id) {
        return response.status(200).json({ errorMessage: "User_id required." });
    } else if (!title) {
        return response.status(200).json({ errorMessage: "Title required." });
    }

    if (!validator.checkValidLength(title, 1, 30)) {
        return response.status(200).json({ errorMessage: "Title must be between 1 and 30 characters." });
    }

    if (description != null) {
        if (!validator.checkValidLength(description, 1, 250)) {
            return response.status(200).json({ errorMessage: "Description must be between 1 and 250 characters." });
        }
    }

    let existingGarden = null;
    let gardenSize = null;

    if (garden_id != null) {
        if (!validator.checkValidId(garden_id)) {
            return response.status(200).json({ errorMessage: "Invalid garden_id." });
        }

        existingGarden = await Garden.findOne({ _id: garden_id });
        if (!existingGarden) {
            return response.status(200).json({ errorMessage: "Invalid garden_id." });
        }
        gardenSize = existingGarden.plot.length;
    }

    if (!gardenValidator.checkGardenAndPlotsProvided(garden_id, plot_number)) {
        return response.status(200).json({ errorMessage: "Plot_number must be provided with garden_id." });
    }

    if (plot_number != null) {
        if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
            return response.status(200).json({ errorMessage: "Invalid plot number." });
        }
    }

    //Get image_id array
    const image_id = [];
    if (request.files !== undefined) {
        for (let i = 0; i < request.files.length; i++) {
            const id = request.files[i].id;
            image_id.push(id);
        }
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
const getNotes = async (request, response) => {

    const { user_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const notes = await Note.find({ 'user_id': user_id });

    return response.status(200).json({ notes: notes });
}

//Request to get all notes for a given plot
const getNotesByPlot = async (request, response) => {

    const { garden_id, plot_number } = request.body;

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

    const notes = await Note.find({ 'garden_id': garden_id, 'garden.plot.plot_number': plot_number });

    return response.status(200).json({ notes: notes });
}

//Request to get all notes for a given date
const getNotesByDate = async (request, response) => {

    const { user_id, date } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const notes = await Note.find({ 'user_id': user_id, 'date': { $gte: moment(date).toDate(), $lte: moment(date).endOf('day').toDate() } });

    return response.status(200).json({ notes: notes });
}

//Request to get all notes for a given month
const getNotesByMonth = async (request, response) => {

    const { user_id, date } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const startOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment(date).endOf('month').format('YYYY-MM-DD');

    const notes = await Note.find({ 'user_id': user_id, 'date': { $gte: moment(startOfMonth).toDate(), $lte: moment(endOfMonth).toDate() } });

    return response.status(200).json({ notes: notes });
}

//Request to delete a note
const deleteNote = async (request, response) => {

    const { note_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(note_id)) {
        return response.status(200).json({ errorMessage: "Invalid note_id." });
    }

    const existingNote = await Note.findOne({ _id: note_id });
    if (!existingNote) {
        return response.status(200).json({ errorMessage: "Invalid note_id." });
    }

    try {
        let note = await Note.findOneAndDelete(existingNote);
        deleteImages(note.image);

        return response.status(200).json({ message: "Note deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a note's title
const updateTitle = async (request, response) => {

    const { note_id, title } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(note_id)) {
        return response.status(200).json({ errorMessage: "Invalid note_id." });
    }

    const existingNote = await Note.findOne({ _id: note_id });
    if (!existingNote) {
        return response.status(200).json({ errorMessage: "Invalid note_id." });
    }

    if (title == existingNote.title) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    try {
        await Note.updateOne(existingNote, { 'title': title });

        return response.status(200).json({ message: "Note title updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a note's description
const updateDescription = async (request, response) => {

    const { note_id, description } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(note_id)) {
        return response.status(200).json({ errorMessage: "Invalid note_id." });
    }

    const existingNote = await Note.findOne({ _id: note_id });
    if (!existingNote) {
        return response.status(200).json({ errorMessage: "Invalid note_id." });
    }

    if (description == existingNote.description) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    try {
        await Note.updateOne(existingNote, { 'description': description });

        return response.status(200).json({ message: "Note description updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update a note's related garden plot
const updateGardenPlot = async (request, response) => {

    let { note_id, garden_id, plot_number } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(note_id)) {
        return response.status(200).json({ errorMessage: "Invalid note_id." });
    }

    const existingNote = await Note.findOne({ _id: note_id });
    if (!existingNote) {
        return response.status(200).json({ errorMessage: "Invalid note_id." });
    }

    if (!gardenValidator.checkGardenAndPlotsProvided(garden_id, plot_number)) {
        return response.status(200).json({ errorMessage: "Plot_number must be provided with garden_id." });
    }

    if (garden_id && plot_number) {
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
    } else {
        garden_id = null;
        plot_number = null;
    }

    if (garden_id == existingNote.garden_id) {
        if (plot_number == existingNote.plot_number) {
            return response.status(200).json({ errorMessage: "No change detected." });
        }
    }

    try {
        await Note.updateOne(existingNote, { 'garden_id': garden_id, 'plot_number': plot_number });

        return response.status(200).json({ message: "Note garden plot updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to edit a note's related photos
const updateImages = async (request, response) => {

    const parsedReq = JSON.parse(request.body.note);

    let { note_id } = parsedReq;

    //Check if required params are given
    if (!note_id) {
        return response.status(200).json({ errorMessage: "Note_id required." });
    }

    if (!validator.checkValidId(note_id)) {
        return response.status(200).json({ errorMessage: "Invalid note_id." });
    }

    const existingNote = await Note.findOne({ _id: note_id });
    if (!existingNote) {
        return response.status(200).json({ errorMessage: "Invalid note_id." });
    }

    //Get image_id array
    let image_id = [];
    request.files.forEach((file) => {
        const id = file.id;
        image_id.push(id);
    });

    //Get current note images
    let savedImages = [];
    for (let i = 0; i < existingNote.image.length; i++) {
        savedImages.push(existingNote.image[i]);
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

        await Note.updateOne(existingNote, { image: image_id });

        return response.status(200).json({ message: "Note images updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

module.exports = {
    deleteNotesByGarden,
    deleteAllNotes,
    createNote,
    getNotes,
    getNotesByPlot,
    getNotesByDate,
    getNotesByMonth,
    deleteNote,
    updateTitle,
    updateDescription,
    updateGardenPlot,
    updateImages
}