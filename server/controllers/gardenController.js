const validator = require("../validators/validator");
const { check, validationResult } = require('express-validator');

const Garden = require("../models/gardenModel");
const User = require("../models/userModel");

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
    const emptyPlot = [null, null, []];
    const gardenPlots = [];
    for (let i = 0; i < numPlots; i++) {
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

module.exports = {
    createGarden,
    getAllGardens,
    getGardenByID
}