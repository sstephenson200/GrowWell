const Note = require("../models/noteModel");

//Alarm repository for use in production

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
    DeleteNotesByGarden,
    DeleteAllNotes
}