const Alarm = require("../models/alarmModel");

//Alarm repository for use in production

async function CreateAlarm(user_id, title, due_date, garden_id, plot_number, isParent, parent, notification_id) {
    let newAlarm = new Alarm({
        user_id, title, due_date, garden_id, plot_number, isParent, parent, notification_id
    });
    let savedAlarm = await newAlarm.save();
    return savedAlarm;
}

async function GetAllAlarms(user_id) {
    let alarms = await Alarm.find({ "user_id": user_id });
    return alarms;
}

async function GetAlarmByID(alarm_id) {
    let alarm = await Alarm.findOne({ _id: alarm_id });
    return alarm;
}

async function DeleteAlarm(alarm_id) {
    let alarm = await Alarm.findOneAndDelete({ _id: alarm_id });
    return alarm;
}

async function DeleteAlarmsByParent(parent) {
    let removedAlarms = await Alarm.find({ "parent": parent });
    await Alarm.deleteMany({ "parent": parent });
    return removedAlarms;
}

async function DeleteAlarmsByGarden(garden_id) {
    let deletedAlarms = await Alarm.find({ "garden_id": garden_id }).select("notification_id");
    await Alarm.deleteMany({ "garden_id": garden_id });
    return deletedAlarms;
}

async function UpdateCompletionStatus(existingAlarm, completion_status) {
    let alarm = await Alarm.updateOne(existingAlarm, { "completion_status": completion_status });
    return alarm;
}

async function UpdateActiveStatus(existingAlarm, active_status) {
    let alarm = await Alarm.updateOne(existingAlarm, { "active_status": active_status });
    return alarm;
}

async function UpdateNotificationID(existingAlarm, notification_id) {
    let alarm = await Alarm.updateOne(existingAlarm, { "notification_id": notification_id });
    return alarm;
}

module.exports = {
    CreateAlarm,
    GetAllAlarms,
    GetAlarmByID,
    DeleteAlarm,
    DeleteAlarmsByParent,
    DeleteAlarmsByGarden,
    UpdateCompletionStatus,
    UpdateActiveStatus,
    UpdateNotificationID
}