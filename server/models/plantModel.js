const mongoose = require("mongoose");

//Create Plant Schema
const plantSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null, trim: true },
    plant_type: { type: String, enum: ["Vegetable", "Fruit", "Herb"], required: true },
    sow_date: { type: [Number], default: null },
    plant_date: { type: [Number], default: null },
    transplant_date: { type: [Number], default: null },
    harvest_date: { type: [Number], default: null },
    sun_condition: { type: [String], enum: ["Partial Shade", "Full Sun", "Full Shade"], required: true },
    soil_type: { type: [String], enum: ["Chalk", "Clay", "Loam", "Sand"], required: true },
    soil_ph: { type: [String], enum: ["Acid", "Neutral", "Alkaline"], required: true },
    water_schedule: { type: [Number], required: true },
    compost_schedule: { type: String, default: null, trim: true },
    prune_schedule: { type: [String], default: null },
    feed_schedule: { type: [String], default: null },
    indoor_schedule: { type: [String], required: true },
    spacing: { type: [Number], required: true },
    plant_problem: { type: [String], default: null },
    companion_plant: { type: [String], default: null },
    incompatible_plant: { type: [String], default: null },
    image: [{ type: mongoose.Schema.Types.ObjectId, ref: "image", default: null }]
});

const Plant = mongoose.model("plant", plantSchema);
module.exports = Plant;