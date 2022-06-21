const mongoose = require("mongoose");

//Create Note Schema
const noteSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null, trim: true },
    date: { type: Date, required: true },
    image: [{ type: mongoose.Schema.Types.ObjectId, ref: "image", default: null }],
    garden_id: { type: mongoose.Schema.Types.ObjectId, ref: "garden", default: null },
    plot_number: { type: Number, default: null }
});

const Note = mongoose.model("note", noteSchema);
module.exports = Note;