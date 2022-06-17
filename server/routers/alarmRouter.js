const router = require("express").Router();
const moment = require("moment");

const Alarm = require("../models/alarmModel");
const Garden = require("../models/gardenModel");
const User = require("../models/userModel");

//Build Endpoints
router.post("/createAlarm", async (request, response) => {
    try {
        const { user_id, title, due_date, schedule, garden_id, plot_number } = request.body;

        //Validation - Check All Required Fields Provided
        if (!user_id || !title || !due_date) {
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

        //Validation - Check Date is Valid
        if (!moment(due_date).isValid()) {
            return response.status(400).json({ errorMessage: "Invalid date." });
        }

        //Validation - Check Date is in future
        if (Date.parse(due_date) <= Date.now()) {
            return response.status(400).json({ errorMessage: "Date must be in the future." });
        }

        //Validation - Check Schedule is Valid
        if (schedule != null && schedule < 1) {
            return response.status(400).json({ errorMessage: "Repeat schedule must be greater than 0 days." });
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

        //Create Alarm
        const newAlarm = new Alarm({
            user_id, title, due_date, schedule, garden_id, plot_number
        });
        const savedAlarm = await newAlarm.save();

        return response.status(200).json({ message: "Alarm created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
});

module.exports = router;