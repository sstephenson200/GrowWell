const validator = require("../validators/validator");
const { check, validationResult } = require('express-validator');

const Garden = require("../models/gardenModel");

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
        return response.status(401).json({ errorMessage: "Invalid user_id." });
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

module.exports = {
    createGarden
}