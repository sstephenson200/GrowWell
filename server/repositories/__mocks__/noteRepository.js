const Note = require("../../models/noteModel");

//Mock alarm repository for use in unit testing

async function DeleteNotesByGarden(garden_id) {
    let user_id = "userID";
    let notes = [];
    notes.push(new Note({
        user_id, title: "Test1"
    }));
    return notes;
}

module.exports = {
    DeleteNotesByGarden
}