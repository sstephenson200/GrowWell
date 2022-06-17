const router = require("express").Router();

const Garden = require("../models/gardenModel");
const User = require("../models/userModel");

//Build Endpoints
router.post("/createGarden", async (request, response) => {
    try {
        const { user_id, length, width, name } = request.body;

        //Validation - Check All Fields Provided
        if (!user_id || !length || !width || !name) {
            return response.status(400).json({ errorMessage: "Data not provided." });
        }

        //Validation - Check Length is Less Than 6
        if (length > 6 || length < 1) {
            return response.status(400).json({ errorMessage: "Length must be between 1 and 6." });
        }

        //Validation - Check Width is Less Than 6
        if (width > 6 || width < 1) {
            return response.status(400).json({ errorMessage: "Width must be between 1 and 6." });
        }

        //Validation - Check Name Length
        if (name.length < 4) {
            return response.status(400).json({ errorMessage: "Garden name must be 4 characters or longer." });
        }

        //Validation - Check User Exists
        const existingUser = await User.findOne({ user_id });
        if (!existingUser) {
            return response.status(400).json({ errorMessage: "Invalid user_id." });
        }

        //Validation - Check if Garden Name Already Exists
        const existingGarden = await Garden.findOne({ name, user_id });
        if (existingGarden) {
            return response.status(400).json({ errorMessage: "User's garden names must be unique." });
        }

        //Create Plots
        const numPlots = length * width;
        const emptyPlot = [null, null, []];
        const gardenPlots = [];
        for (let i = 0; i < numPlots; i++) {
            gardenPlots.push(emptyPlot);
        }

        //Create Garden
        const newGarden = new Garden({
            user_id, size: [length, width], name, plot: gardenPlots
        });
        const savedGarden = await newGarden.save();

        return response.status(200).json({ message: "Garden created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
});

module.exports = router;