const mongoose = require("mongoose");

//Create Alarm Schema
const alarmSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true, trim: true },
    due_date: { type: Date, required: true },
    schedule: { type: Number, default: null },
    garden_id: { type: mongoose.Schema.Types.ObjectId, ref: "garden", default: null },
    plot_number: { type: Number, default: null },
    completion_status: { type: Boolean, default: false },
    active_status: { type: Boolean, default: true }
});

const Alarm = mongoose.model("alarm", alarmSchema);
module.exports = Alarm;