const Garden = require("../models/gardenModel");
const Plant = require("../models/plantModel");

//Garden repository for use in production

async function CreateGarden(user_id, length, width, name, gardenPlots) {
    let newGarden = new Garden({
        user_id, size: [length, width], name, plot: gardenPlots
    });
    await newGarden.save();
    return newGarden;
}

async function CheckExistingGardenName(name, user_id) {
    let existingGarden = await Garden.findOne({ "name": name, "user._id": user_id });
    return existingGarden;
}

async function GetAllGardens(user_id) {
    let gardens = await Garden.find({ "user_id": user_id });
    return gardens;
}

async function GetGardenByID(garden_id) {
    let garden = await Garden.findOne({ _id: garden_id });
    return garden;
}

async function DeleteGarden(garden_id) {
    let deletedGarden = await Garden.deleteOne({ _id: garden_id });
    return deletedGarden;
}

async function GetUser(user_id) {
    let existingUser = await User.findOne({ _id: user_id });
    return existingUser;
}

async function UpdatePlotPlant(garden_id, plant_id, plot_number) {
    let garden;
    if (plant_id == undefined) {
        garden = await Garden.updateOne({ _id: garden_id, "plot.plot_number": plot_number }, { $set: { "plot.$.plant_id": null, "plot.$.date_planted": null } });
    } else {
        garden = await Garden.updateOne({ _id: garden_id, "plot.plot_number": plot_number }, { $set: { "plot.$.plant_id": plant_id, "plot.$.date_planted": date_planted } });
    }
    return garden;
}

async function GetGarden(garden_id) {
    let existingGarden = await Garden.findOne({ _id: garden_id });
    return existingGarden;
}

async function GetPlant(plant_id) {
    let existingPlant = await Plant.findOne({ _id: plant_id });
    return existingPlant;
}

async function UpdatePlotHistory(garden_id, plot_number, plot_history) {
    let garden = await Garden.updateOne({ _id: garden_id, "plot.plot_number": plot_number }, { $set: { "plot.$.plot_history": plot_history } });
    return garden;
}

module.exports = {
    CreateGarden,
    CheckExistingGardenName,
    GetAllGardens,
    GetGardenByID,
    DeleteGarden,
    GetUser,
    UpdatePlotPlant,
    GetGarden,
    GetPlant,
    UpdatePlotHistory
}