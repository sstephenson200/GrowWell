const validator = require("../validators/validator");
const { validationResult } = require("express-validator");
const alarmValidator = require("../validators/alarmValidator");
const gardenValidator = require("../validators/gardenValidator");

const Alarm = require("../models/alarmModel");
const Garden = require("../models/gardenModel");

const { CreateAlarm, GetAllAlarms, GetAlarmByID, DeleteAlarm, DeleteAlarmsByParent, DeleteAlarmsByGarden, UpdateCompletionStatus, UpdateActiveStatus, UpdateNotificationID } = require("../repositories/alarmRepository");

// *** CREATE REQUESTS *** 

//Request to create new alarm record
const createAlarm = async (request, response) => {

    let user_id = request.user;

    const { title, due_date, garden_id, plot_number, isParent, parent, notification_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(200).json({ errorMessage: "Invalid user ID." });
    }

    let existingGarden = null;

    if (garden_id != null) {
        if (!validator.checkValidId(garden_id)) {
            return response.status(200).json({ errorMessage: "Invalid garden ID." });
        }

        existingGarden = await Garden.findOne({ _id: garden_id, "user._id": user_id });
        if (!existingGarden) {
            return response.status(200).json({ errorMessage: "Invalid garden ID." });
        }
    }

    if (!alarmValidator.checkValidDate(due_date)) {
        return response.status(200).json({ errorMessage: "Invalid due date." });
    }

    if (!alarmValidator.checkDateInFuture(due_date)) {
        return response.status(200).json({ errorMessage: "Date must be in the future." });
    }

    if (!gardenValidator.checkGardenAndPlotsProvided(garden_id, plot_number)) {
        return response.status(200).json({ errorMessage: "Plot number must be provided with garden ID." });
    }

    if (plot_number != null) {
        const gardenSize = existingGarden.plot.length;
        if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
            return response.status(200).json({ errorMessage: "Invalid plot number." });
        }
    }

    if (parent != null) {
        if (!validator.checkValidId(parent)) {
            return response.status(200).json({ errorMessage: "Invalid parent ID." });
        }

        let existingAlarm = await Alarm.findOne({ _id: parent, "user._id": user_id });
        if (!existingAlarm) {
            return response.status(200).json({ errorMessage: "Invalid parent ID." });
        }
    }

    try {
        let savedAlarm = await CreateAlarm(user_id, title, due_date, garden_id, plot_number, isParent, parent, notification_id);
        return response.status(200).json({ message: "Alarm created successfully.", alarm: savedAlarm });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

// *** GET REQUESTS ***

//Request to get all alarms for a given user_id
const getAllAlarms = async (request, response) => {

    let user_id = request.user;
    let alarms = await GetAllAlarms(user_id);
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
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    let existingAlarm = await GetAlarmByID(alarm_id);
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    return response.status(200).json({ alarm: existingAlarm });
}

// *** DELETE REQUESTS ***

//Request to delete an alarm
const deleteAlarm = async (request, response) => {

    const { alarm_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    try {
        await DeleteAlarm(alarm_id);
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
        let removedAlarms = await DeleteAlarmsByParent(parent);
        return response.status(200).json({ message: "Alarms deleted successfully.", alarms: removedAlarms });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Function to delete an alarm by garden_id
async function deleteAlarmsByGarden(garden_id) {
    try {
        let deletedAlarms = await DeleteAlarmsByGarden(garden_id);
        return deletedAlarms;
    } catch (error) {
        console.log(error);
    }
}

//Function to delete all alarms for a given user_id
async function deleteAllAlarms(user_id) {
    try {
        await Alarm.deleteMany({ "user_id": user_id });
        return true;
    } catch (error) {
        throw error;
    }
}

// *** UPDATE REQUESTS ***

//Request to update an alarm's title
const updateTitle = async (request, response) => {

    const { alarm_id, title } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    if (title == existingAlarm.title) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    try {
        await Alarm.updateOne(existingAlarm, { "title": title });

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
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    if (Date.parse(due_date) == Date.parse(existingAlarm.due_date)) {
        return response.status(200).json({ errorMessage: "No change detected." });
    }

    if (!alarmValidator.checkDateInFuture(due_date)) {
        return response.status(200).json({ errorMessage: "Date must be in the future." });
    }

    try {
        await Alarm.updateOne(existingAlarm, { "due_date": due_date });

        return response.status(200).json({ message: "Alarm due date updated successfully." });

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
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    if (!gardenValidator.checkGardenAndPlotsProvided(garden_id, plot_number)) {
        return response.status(200).json({ errorMessage: "Plot number must be provided with garden ID." });
    }

    if (garden_id && plot_number) {
        if (!validator.checkValidId(garden_id)) {
            return response.status(200).json({ errorMessage: "Invalid garden ID." });
        }

        const existingGarden = await Garden.findOne({ _id: garden_id });
        if (!existingGarden) {
            return response.status(200).json({ errorMessage: "Invalid garden ID." });
        }

        const gardenSize = existingGarden.plot.length;

        if (!gardenValidator.checkValidPlotNumber(gardenSize, plot_number)) {
            return response.status(200).json({ errorMessage: "Invalid plot number." });
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
        await Alarm.updateOne(existingAlarm, { "garden_id": garden_id, "plot_number": plot_number });

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
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    let completion_status = !existingAlarm.completion_status;

    try {
        let updatedAlarm = await UpdateCompletionStatus(existingAlarm, completion_status);
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
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    let active_status = !existingAlarm.active_status;

    try {
        let updatedAlarm = await UpdateActiveStatus(existingAlarm, active_status);
        return response.status(200).json({ message: "Alarm active status updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update an alarm's notification_id
const updateNotificationID = async (request, response) => {

    const { alarm_id, notification_id } = request.body;

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
        return response.status(200).json({ errorMessage: validationErrors.array()[0].msg });
    }

    if (!validator.checkValidId(alarm_id)) {
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id });
    if (!existingAlarm) {
        return response.status(200).json({ errorMessage: "Invalid alarm ID." });
    }

    try {
        let updatedAlarm = await UpdateNotificationID(existingAlarm, notification_id);
        return response.status(200).json({ message: "Alarm notification ID updated successfully." });

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
    updateActiveStatus,
    updateNotificationID
}