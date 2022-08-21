const Note = require("../models/noteModel");

//Alarm repository for use in production

async function DeleteNotesByGarden(garden_id) {
    let notes = await Note.find({ "garden_id": garden_id });
    await Note.deleteMany({ "garden_id": garden_id });
    return notes;
}

module.exports = {
    DeleteNotesByGarden
}