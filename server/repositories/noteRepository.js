const Note = require("../models/noteModel");

//Alarm repository for use in production

async function GetNotes(user_id) {
    let notes = await Note.find({ "user_id": user_id });
    return notes;
}

async function GetNotesByPlot(user_id, garden_id) {
    let notes = await Note.find({ "user_id": user_id, "garden_id": garden_id });
    return notes;
}

async function GetNotesByPlant(user_id, plant_id) {
    let notes = await Note.find({ "user_id": user_id, "plant_id": plant_id });
    return notes;
}

async function GetNotesByMonth(user_id, startOfMonth, endOfMonth) {
    let notes = await Note.find({ "user_id": user_id, "date": { $gte: moment(startOfMonth).toDate(), $lte: moment(endOfMonth).toDate() } });
    return notes;
}

async function DeleteNotesByGarden(garden_id) {
    let notes = await Note.find({ "garden_id": garden_id });
    await Note.deleteMany({ "garden_id": garden_id });
    return notes;
}

async function DeleteAllNotes(user_id) {
    let notes = await Note.find({ "user_id": user_id });
    await Note.deleteMany({ "user_id": user_id });
    return notes;
}

module.exports = {
    GetNotes,
    GetNotesByPlot,
    GetNotesByPlant,
    GetNotesByMonth,
    DeleteNotesByGarden,
    DeleteAllNotes
}