const validator = require("../validators/validator");
const { check, validationResult } = require('express-validator');

const Alarm = require("../models/alarmModel");

//Create Alarm Endpoint
const createAlarm = async (request, response) => {

    const { user_id, title, due_date, schedule, garden_id, plot_number } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (garden_id != null) {
        if (!validator.checkValidId(garden_id)) {
            return response.status(400).json({ errorMessage: "Invalid garden_id." });
        }
        if (await validator.checkExistingGarden(garden_id, user_id)) {
            return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
        }
    }

    if (!validator.checkDateInFuture(due_date)) {
        return response.status(400).json({ errorMessage: "Date must be in the future." });
    }

    if (validator.checkGardenAndPlotsProvided) {
        return response.status(400).json({ errorMessage: "Plot_number must be provided with garden_id." });
    }

    if (plot_number != null) {
        if (!validator.checkValidPlotNumber) {
            return response.status(400).json({ errorMessage: "Invalid plot number." });
        }
    }

    try {

        const newAlarm = new Alarm({
            user_id, title, due_date, schedule, garden_id, plot_number
        });
        const savedAlarm = await newAlarm.save();

        return response.status(200).json({ message: "Alarm created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }

}

module.exports = {
    createAlarm
}