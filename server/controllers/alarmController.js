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

    const existingUser = await User.findOne({ _id: user_id });

    if (!existingUser) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
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
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id, 'user._id': user_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id for given user_id." });
    }

    const alarm = await Alarm.findOne({ _id: alarm_id });

    return response.status(200).json({ alarm: alarm });
}

//Request to delete an alarm
const deleteAlarm = async (request, response) => {

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
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id, 'user._id': user_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id for given user_id." });
    }

    try {

        await Alarm.deleteOne(existingAlarm);

        return response.status(200).json({ message: "Alarm deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to delete all alarms for a given user_id
const deleteAllAlarms = async (request, response) => {

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

    try {

        await Alarm.deleteMany({ user_id: user_id });

        return response.status(200).json({ message: "Alarms deleted successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update an alarm's title
const updateTitle = async (request, response) => {

    const { user_id, alarm_id, title } = request.body;

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
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id, 'user._id': user_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id for given user_id." });
    }

    if (title == existingAlarm.title) {
        return response.status(400).json({ errorMessage: "No title change detected." });
    }

    try {

        await Alarm.updateOne(existingAlarm, { title: title });

        return response.status(200).json({ message: "Alarm title updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update an alarm's due date
const updateDueDate = async (request, response) => {

    const { user_id, alarm_id, due_date } = request.body;

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
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id, 'user._id': user_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id for given user_id." });
    }

    if (Date.parse(due_date) == Date.parse(existingAlarm.due_date)) {
        return response.status(400).json({ errorMessage: "No due_date change detected." });
    }

    if (!validator.checkDateInFuture(due_date)) {
        return response.status(400).json({ errorMessage: "Date must be in the future." });
    }

    try {

        await Alarm.updateOne(existingAlarm, { due_date: due_date });

        return response.status(200).json({ message: "Alarm due_date updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update an alarm's repeat schedule
const updateSchedule = async (request, response) => {

    const { user_id, alarm_id, schedule } = request.body;

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
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id, 'user._id': user_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id for given user_id." });
    }

    if (schedule == existingAlarm.schedule) {
        return response.status(400).json({ errorMessage: "No schedule change detected." });
    }

    try {

        await Alarm.updateOne(existingAlarm, { schedule: schedule });

        return response.status(200).json({ message: "Alarm schedule updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to update an alarm's related garden plot
const updateGardenPlot = async (request, response) => {

    const { user_id, alarm_id, garden_id, plot_number } = request.body;

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
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id, 'user._id': user_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id for given user_id." });
    }

    if (!validator.checkValidId(garden_id)) {
        return response.status(400).json({ errorMessage: "Invalid garden_id." });
    }

    if (await !validator.checkExistingGarden(garden_id, user_id)) {
        return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
    }

    if (garden_id == existingAlarm.garden_id) {
        if (plot_number == existingAlarm.plot_number) {
            return response.status(400).json({ errorMessage: "No plot_number change detected." });
        }
    }

    if (!validator.checkValidPlotNumber(garden_id, plot_number)) {
        return response.status(400).json({ errorMessage: "Invalid plot_number." });
    }

    try {

        await Alarm.updateOne(existingAlarm, { garden_id: garden_id, plot_number: plot_number });

        return response.status(200).json({ message: "Alarm garden plot updated successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to remove an alarm's repeat schedule
const removeSchedule = async (request, response) => {

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
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id, 'user._id': user_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id for given user_id." });
    }

    if (existingAlarm.schedule == null) {
        return response.status(400).json({ errorMessage: "No existing schedule." });
    }

    try {

        await Alarm.updateOne(existingAlarm, { schedule: null });

        return response.status(200).json({ message: "Alarm schedule removed successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

//Request to remove an alarm's related garden plot
const removeGardenPlot = async (request, response) => {

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
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    const existingAlarm = await Alarm.findOne({ _id: alarm_id, 'user._id': user_id });
    if (!existingAlarm) {
        return response.status(400).json({ errorMessage: "Invalid alarm_id for given user_id." });
    }

    if (existingAlarm.garden_id == null || existingAlarm.plot_number == null) {
        return response.status(400).json({ errorMessage: "No existing garden plot." });
    }

    try {

        await Alarm.updateOne(existingAlarm, { garden_id: null, plot_number: null });

        return response.status(200).json({ message: "Alarm garden plot removed successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

module.exports = {
    createAlarm,
    getAllAlarms,
    getAlarmByID,
    deleteAlarm,
    deleteAllAlarms,
    updateTitle,
    updateDueDate,
    updateSchedule,
    updateGardenPlot,
    removeSchedule,
    removeGardenPlot
}