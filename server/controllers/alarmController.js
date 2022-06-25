const validator = require("../validators/validator");
const { check, validationResult } = require('express-validator');
const alarmValidator = require("../validators/alarmValidator");
const gardenValidator = require("../validators/gardenValidator");

const Alarm = require("../models/alarmModel");
const User = require("../models/userModel");
const Garden = require("../models/gardenModel");

//Function to delete an alarm by garden_id
async function deleteAlarmsByGarden(garden_id) {

    try {
        await Alarm.deleteMany({ 'garden_id': garden_id });
        return true;

    } catch (error) {
        return false;
    }

}

//Function to delete all alarms for a given user_id
async function deleteAllAlarms(user_id) {

    try {
        await Alarm.deleteMany({ 'user_id': user_id });
        return true;

    } catch (error) {
        return false;
    }

}

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

    let existingGarden = null;

    if (garden_id != null) {
        if (!validator.checkValidId(garden_id)) {
            return response.status(400).json({ errorMessage: "Invalid garden_id." });
        }

        existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
        if (!existingGarden) {
            return response.status(400).json({ errorMessage: "Invalid garden_id." });
        }
    }

    if (!alarmValidator.checkDateInFuture(due_date)) {
        return response.status(400).json({ errorMessage: "Date must be in the future." });
    }

    if (!gardenValidator.checkGardenAndPlotsProvided(garden_id, plot_number)) {
        return response.status(400).json({ errorMessage: "Plot_number must be provided with garden_id." });
    }

    if (plot_number != null) {
        const gardenSize = existingGarden.plot.length;
        if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
            return response.status(400).json({ errorMessage: "Invalid plot_number." });
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

    const alarms = await Alarm.find({ 'user_id': user_id });

    return response.status(200).json({ alarms: alarms });
}

//Request to get an alarm for a given alarm_id
const getAlarmByID = async (request, response) => {

    const { alarm_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    return response.status(200).json({ alarm: existingAlarm });
}

//Request to delete an alarm
const deleteAlarm = async (request, response) => {

    const { alarm_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    try {
        await Alarm.findOneAndDelete({ _id: alarm_id });

        return response.status(200).json({ message: "Alarm deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update an alarm's title
const updateTitle = async (request, response) => {

    const { alarm_id, title } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    if (title == existingAlarm.title) {
        return response.status(400).json({ errorMessage: "No change detected." });
    }

    try {
        await Alarm.updateOne(existingAlarm, { 'title': title });

        return response.status(200).json({ message: "Alarm title updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update an alarm's due date
const updateDueDate = async (request, response) => {

    const { alarm_id, due_date } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    if (Date.parse(due_date) == Date.parse(existingAlarm.due_date)) {
        return response.status(400).json({ errorMessage: "No change detected." });
    }

    if (!alarmValidator.checkDateInFuture(due_date)) {
        return response.status(400).json({ errorMessage: "Date must be in the future." });
    }

    try {
        await Alarm.updateOne(existingAlarm, { 'due_date': due_date });

        return response.status(200).json({ message: "Alarm due_date updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update an alarm's repeat schedule
const updateSchedule = async (request, response) => {

    let { alarm_id, schedule } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    if (!schedule) {
        schedule = null;
    }

    if (schedule == existingAlarm.schedule) {
        return response.status(400).json({ errorMessage: "No change detected." });
    }

    try {
        await Alarm.updateOne(existingAlarm, { 'schedule': schedule });

        return response.status(200).json({ message: "Alarm schedule updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update an alarm's related garden plot
const updateGardenPlot = async (request, response) => {

    let { alarm_id, garden_id, plot_number } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(400).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id." });
    }

    if (!gardenValidator.checkGardenAndPlotsProvided(garden_id, plot_number)) {
        return response.status(400).json({ errorMessage: "Plot_number must be provided with garden_id." });
    }

    if (garden_id && plot_number) {
        if (!validator.checkValidId(garden_id)) {
            return response.status(400).json({ errorMessage: "Invalid garden_id." });
        }

        const existingGarden = await Garden.findOne({ _id: garden_id });
        if (!existingGarden) {
            return response.status(400).json({ errorMessage: "Invalid garden_id." });
        }

        const gardenSize = existingGarden.plot.length;

        if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
            return response.status(400).json({ errorMessage: "Invalid plot_number." });
        }
    } else {
        garden_id = null;
        plot_number = null;
    }

    if (garden_id == existingAlarm.garden_id) {
        if (plot_number == existingAlarm.plot_number) {
            return response.status(400).json({ errorMessage: "No change detected." });
        }
    }

    try {
        await Alarm.updateOne(existingAlarm, { 'garden_id': garden_id, 'plot_number': plot_number });

        return response.status(200).json({ message: "Alarm garden plot updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

module.exports = {
    deleteAlarmsByGarden,
    deleteAllAlarms,
    createAlarm,
    getAllAlarms,
    getAlarmByID,
    deleteAlarm,
    updateTitle,
    updateDueDate,
    updateSchedule,
    updateGardenPlot
}