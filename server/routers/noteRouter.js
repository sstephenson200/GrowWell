const router = require("express").Router();
const { upload } = require('../middleware/imageUpload');

const Note = require("../models/noteModel");
const Garden = require("../models/gardenModel");
const User = require("../models/userModel");

//Build Endpoints
router.route("/createNote").post(upload.array("file", 3), async (request, response) => {
    try {
        const parsedReq = JSON.parse(request.body.note);
        const { user_id, title, description, garden_id, plot_number } = parsedReq;

        const date = Date.now();

        //Validation - Check All Required Fields Provided
        if (!user_id || !title) {
            return response.status(400).json({ errorMessage: "Data not provided." });
        }

        //Validation - Check User Exists
        const existingUser = await User.findOne({ user_id });
        if (!existingUser) {
            return response.status(400).json({ errorMessage: "Invalid user_id." });
        }

        //Validation - Check Garden Exists
        if (garden_id != null) {
            const existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
            if (!existingGarden) {
                return response.status(400).json({ errorMessage: "Invalid garden_id." });
            }
        }

        //Validation - Check Title is 30 chars or less
        if (title.length > 30 || title.length < 1) {
            return response.status(400).json({ errorMessage: "Title must be between 1 and 30 characters." });
        }

        //Validation - Check Description is 250 chars or less
        if (description.length > 250) {
            return response.status(400).json({ errorMessage: "Description must be less than 250 characters." });
        }

        //Validation - Check plot_number is provided with garden_id
        if (garden_id != null && plot_number == null) {
            return response.status(400).json({ errorMessage: "plot_number must be provided with garden_id." });
        }

        //Validation - Check garden_id is provided with plot_number
        if (plot_number != null && garden_id == null) {
            return response.status(400).json({ errorMessage: "garden_id must be provided with plot_number." });
        }

        //Validation - Check plot_number is Valid
        // ***** NEED TO ADD IF PLOT NUMBER>GARDEN.PLOT.LENGTH WHEN GET GARDEN IS WRITTEN *****
        if (plot_number != null) {
            if (plot_number < 0) {
                return response.status(400).json({ errorMessage: "Invalid plot number." });
            }
        }

        //Get image_id array
        const image_id = [];
        for (let i = 0; i < request.files.length; i++) {
            const id = request.files[i].id;
            image_id.push(id);
        }

        //Create Note
        const newNote = new Note({
            user_id, title, description, date, image: image_id, garden_id, plot_number
        });
        const savedNote = await newNote.save();

        return response.status(200).json({ message: "Note created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
});

module.exports = router;