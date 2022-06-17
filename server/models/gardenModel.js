const mongoose = require("mongoose");

//Create Garden Schema
const gardenSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    size: {type: [Number], required: true},
    name: {type: String, required: true},
    plot: [{
        plant_id: {type: mongoose.Schema.Types.ObjectId, ref: "plant", default: null},
        date_planted: {type: Date, default: null},
        plot_history: [{
            plant_id: {type: mongoose.Schema.Types.ObjectId, ref: "plant", default: null},
            date_planted: {type: Date, default: null}
        }]
    }]
});

const Garden = mongoose.model("garden", gardenSchema);
module.exports = Garden;