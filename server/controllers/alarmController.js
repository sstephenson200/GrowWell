const validator = require("../validators/validator");
const { validationResult } = require('express-validator');
const alarmValidator = require("../validators/alarmValidator");
const gardenValidator = require("../validators/gardenValidator");

const Alarm = require("../models/alarmModel");
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

    const { user_id, title, due_date, garden_id, plot_number, isParent, parent, notification_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(200).json({ errorMessage: "Invalid user_id." });
    }

    let existingGarden = null;

    if (garden_id != null) {
        if (!validator.checkValidId(garden_id)) {
            return response.status(200).json({ errorMessage: "Invalid garden_id." });
        }

        existingGarden = await Garden.findOne({ _id: garden_id, 'user._id': user_id });
        if (!existingGarden) {
            return response.status(200).json({ errorMessage: "Invalid garden_id." });
        }
    }

    if (!alarmValidator.checkValidDate(due_date)) {
        return response.status(200).json({ errorMessage: "Invalid due_date." });
    }

    if (!alarmValidator.checkDateInFuture(due_date)) {
        return response.status(200).json({ errorMessage: "Date must be in the future." });
    }

    if (!gardenValidator.checkGardenAndPlotsProvided(garden_id, plot_number)) {
        return response.status(200).json({ errorMessage: "Plot_number must be provided with garden_id." });
    }

    if (plot_number != null) {
        const gardenSize = existingGarden.plot.length;
        if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
            return response.status(200).json({ errorMessage: "Invalid plot_number." });
        }
    }

    if (parent != null) {
        if (!validator.checkValidId(parent)) {
            return response.status(200).json({ errorMessage: "Invalid parent." });
        }

        let existingAlarm = await Alarm.findOne({ _id: parent, 'user._id': user_id });
        if (!existingAlarm) {
            return response.status(200).json({ errorMessage: "Invalid parent." });
        }
    }

    try {
        const newAlarm = new Alarm({
            user_id, title, due_date, garden_id, plot_number, isParent, parent, notification_id
        });
        const savedAlarm = await newAlarm.save();

        return response.status(200).json({ message: "Alarm created successfully.", alarm: savedAlarm });

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
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    const alarms = await Alarm.find({ 'user_id': user_id });

    return response.status(200).json({ alarms: alarms });
}

//Request to get an alarm for a given alarm_id
const getAlarmByID = async (request, response) => {

    const { alarm_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    return response.status(200).json({ alarm: existingAlarm });
}

//Request to delete an alarm
const deleteAlarm = async (request, response) => {

    const { alarm_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    try {
        await Alarm.findOneAndDelete({ _id: alarm_id });

        return response.status(200).json({ message: "Alarm deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to delete all alarms linked to a given parent alarm
const deleteAlarmsByParent = async (request, response) => {

    const { parent } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    try {
        let removedAlarms = await Alarm.find({ 'parent': parent });

        await Alarm.deleteMany({ 'parent': parent });

        return response.status(200).json({ message: "Alarms deleted successfully.", alarms: removedAlarms });

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
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    if (title == existingAlarm.title) {
        return response.status(200).json({ errorMessage: "No change detected." });
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
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    if (Date.parse(due_date) == Date.parse(existingAlarm.due_date)) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    if (!alarmValidator.checkDateInFuture(due_date)) {
        return response.status(200).json({ errorMessage: "Date must be in the future." });
    }

    try {
        await Alarm.updateOne(existingAlarm, { 'due_date': due_date });

        return response.status(200).json({ message: "Alarm due_date updated successfully." });

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
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
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

    if (garden_id == existingAlarm.garden_id) {
        if (plot_number == existingAlarm.plot_number) {
            return response.status(200).json({ errorMessage: "No change detected." });
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

//Request to update an alarm's completion status
const updateCompletionStatus = async (request, response) => {

    const { alarm_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    let completion_status = null;

    if (existingAlarm.completion_status == true) {
        completion_status = false;
    } else {
        completion_status = true;
    }

    try {
        await Alarm.updateOne(existingAlarm, { 'completion_status': completion_status });

        return response.status(200).json({ message: "Alarm completion status updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update an alarm's active status
const updateActiveStatus = async (request, response) => {

    const { alarm_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm_id." });
    }

    let active_status = null;

    if (existingAlarm.active_status == true) {
        active_status = false;
    } else {
        active_status = true;
    }

    try {
        await Alarm.updateOne(existingAlarm, { 'active_status': active_status });

        return response.status(200).json({ message: "Alarm active status updated successfully." });

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
    deleteAlarmsByParent,
    updateTitle,
    updateDueDate,
    updateGardenPlot,
    updateCompletionStatus,
    updateActiveStatus
}