const Alarm = require("../../models/alarmModel");

//Mock alarm repository for use in unit testing

async function CreateAlarm(user_id, title, due_date, garden_id, plot_number, isParent, parent, notification_id) {
    const newAlarm = new Alarm({
        user_id, title, due_date, garden_id, plot_number, isParent, parent, notification_id
    });
    return newAlarm;
}

async function GetAllAlarms(user_id) {
    let alarms = [];
    alarms.push(new Alarm({
        user_id, title: "Test1", due_date: "2022-09-02", notificatoin_id: "12345"
    }));
    alarms.push(new Alarm({
        user_id, title: "Test2", due_date: "2022-09-02", notificatoin_id: "12345"
    }));
    alarms.push(new Alarm({
        user_id, title: "Test3", due_date: "2022-09-02", notificatoin_id: "12345"
    }));
    return alarms;
}

async function GetAlarmByID(alarm_id) {
    let user_id = "userID";
    let alarm = new Alarm({
        user_id, title: "SingleAlarm", due_date: "2022-09-02", notificatoin_id: "12345"
    });
    return alarm;
}

async function DeleteAlarm(alarm_id) {
    return;
}

async function DeleteAlarmsByParent(parent) {
    let user_id = "userID";
    let alarms = [];
    alarms.push(new Alarm({
        user_id, title: "Test1", due_date: "2022-09-02", notificatoin_id: "12345"
    }));
    alarms.push(new Alarm({
        user_id, title: "Test2", due_date: "2022-09-02", notificatoin_id: "12345"
    }));
    alarms.push(new Alarm({
        user_id, title: "Test3", due_date: "2022-09-02", notificatoin_id: "12345"
    }));
    return alarms;
}

async function DeleteAlarmsByGarden(garden_id) {
    let user_id = "userID";
    let alarm = new Alarm({
        user_id, title: "Test1", due_date: "2022-09-02", notificatoin_id: "12345"
    });
    return alarm;
}

async function UpdateCompletionStatus(existingAlarm, completion_status) {
    return;
}

async function UpdateActiveStatus(existingAlarm, active_status) {
    return;
}

async function UpdateNotificationID(existingAlarm, notification_id) {
    return;
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