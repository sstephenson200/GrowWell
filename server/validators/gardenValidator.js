const Garden = require("../models/gardenModel");

//Check if both garden_id and plot_number are provided
function checkGardenAndPlotsProvided(garden_id, plot_number) {

    if ((garden_id != null && plot_number == null) || (garden_id == null && plot_number != null)) {
        return false;
    }
    return true;
}

//Check if garden name already in use for given user
async function checkExistingGardenName(name, user_id) {
    const existingGarden = await Garden.findOne({ 'name': name, 'user._id': user_id });
    if (existingGarden) {
        return true;
    }
}

//Check plot_number is valid
function checkValidPlotNumber(gardenSize, plot_number) {

    if (plot_number > 0 && plot_number < gardenSize) {
        return true;
    }
}

module.exports = {
    checkGardenAndPlotsProvided,
    checkExistingGardenName,
    checkValidPlotNumber
}