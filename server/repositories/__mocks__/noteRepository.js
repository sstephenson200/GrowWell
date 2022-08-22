const Note = require("../../models/noteModel");

//Mock alarm repository for use in unit testing

async function GetNotes(user_id) {
    let notes = [];
    notes.push(new Note({
        user_id, title: "Test1"
    }));
    notes.push(new Note({
        user_id, title: "Test2"
    }));
    return notes;
}

async function GetNotesByPlot(user_id, garden_id) {
    let notes = [];
    notes.push(new Note({
        user_id, title: "Test1", plot_number: 1
    }));
    notes.push(new Note({
        user_id, title: "Test2", plot_number: 2
    }));
    return notes;
}

async function GetNotesByPlant(user_id, plant_id) {
    let notes = [];
    notes.push(new Note({
        user_id, title: "Test1", plot_number: 1
    }));
    return notes;
}

async function GetNotesByMonth(user_id, startOfMonth, endOfMonth) {
    let notes = [];
    notes.push(new Note({
        user_id, title: "Test1", plot_number: 1
    }));
    return notes;
}

async function DeleteNotesByGarden(garden_id) {
    let user_id = "userID";
    let notes = [];
    notes.push(new Note({
        user_id, title: "Test1"
    }));
    return notes;
}

async function DeleteAllNotes(user_id) {
    let notes = [];
    notes.push(new Note({
        user_id, title: "Test1"
    }));
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