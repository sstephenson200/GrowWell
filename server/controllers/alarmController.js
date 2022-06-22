const validator = require("../validators/validator");
const { check, validationResult } = require('express-validator');

const Alarm = require("../models/alarmModel");
const User = require("../models/userModel");

//Request to create new alarm record
const createAlarm = async (request, response) => {

    const { user_id, title, due_date, schedule, garden_id, plot_number } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(401).json({ errorMessage: "Invalid user_id." });
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

    if (validator.checkGardenAndPlotsProvided(garden_id, plot_number)) {
        return response.status(400).json({ errorMessage: "Plot_number must be provided with garden_id." });
    }

    if (plot_number != null) {
        if (!validator.checkValidPlotNumber(garden_id, plot_number)) {
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

//Request to get all alarms for a given user_id
const getAllAlarms = async (request, response) => {

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
        return response.status(401).json({ errorMessage: "Invalid user_id for given user_id.." });
    }

    const alarms = await Alarm.find({ user_id: user_id });

    return response.status(200).json({ alarms: alarms });
}

//Request to get an alarm for a given alarm_id
const getAlarmByID = async (request, response) => {

    const { user_id, alarm_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(401).json({ errorMessage: "Invalid user_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id, 'user._id': user_id });
    if (!existingAlarm) {
        return response.status(401).json({ errorMessage: "Invalid alarm_id for given user_id." });
    }

    const alarm = await Alarm.findOne({ _id: alarm_id });

    return response.status(200).json({ alarm: alarm });
}

//Request to delete an alarm
const deleteAlarm = async (request, response) => {

    const { user_id, alarm_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errors: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(401).json({ errorMessage: "Invalid user_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id, 'user._id': user_id });
    if (!existingAlarm) {
        return response.status(401).json({ errorMessage: "Invalid alarm_id for given user_id." });
    }

    try {

        await Alarm.deleteOne(existingAlarm);

        return response.status(200).json({ message: "Alarm deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

module.exports = {
    createAlarm,
    getAllAlarms,
    getAlarmByID,
    deleteAlarm
}