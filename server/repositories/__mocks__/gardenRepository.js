const Garden = require("../../models/gardenModel");
const Plant = require("../../models/plantModel");

//Mock garden repository for use in unit testing

async function CreateGarden(user_id, length, width, name, gardenPlots) {
    let newGarden = new Garden({
        user_id, size: [length, width], name, plot: gardenPlots
    });
    return newGarden;
}

async function CheckExistingGardenName(name, user_id) {
    if (name === "nonExistingGardenTest") {
        return undefined;
    } else {
        return new Garden({
            user_id, size: [3, 2], name: "Test1", plot: []
        });
    }
}

async function GetAllGardens(user_id) {
    let gardens = [];
    gardens.push(new Garden({
        user_id, size: [3, 2], name: "Test1", plot: []
    }));
    gardens.push(new Garden({
        user_id, size: [3, 2], name: "Test2", plot: []
    }));
    gardens.push(new Garden({
        user_id, size: [3, 2], name: "Test3", plot: []
    }));
    return gardens;
}

async function GetGardenByID(garden_id) {
    let user_id = "userID";
    let garden = new Garden({
        user_id, size: [3, 2], name: "SingleGarden", plot: [{ plot_number: 0 }, { plot_number: 1 }, { plot_number: 2 }]
    });
    return garden;
}

async function DeleteGarden(garden_id) {
    return;
}

async function DeleteAllGardens(user_id) {
    return;
}

async function UpdatePlotPlant(garden_id, plant_id, plot_number) {
    return;
}

async function GetGarden(garden_id) {
    let user_id = "userID";
    return new Garden({
        user_id, size: [3, 2], name: "Test1", plot: [{
            plot_number: 0,
            plant_id: "plant",
            date_planted: "2022-04-05"
        },
        {
            plot_number: 1,
            plant_id: "62fffa28c2fc2e3c8cbaa5de",
            date_planted: "2022-04-05"
        }]
    });
}

async function GetPlant(plant_id) {
    let user_id = "userID";
    return new Plant({
        user_id, name: "Plant"
    });
}

async function UpdatePlotHistory(garden_id, plant_id, plot_number) {
    return;
}

module.exports = {
    CreateGarden,
    CheckExistingGardenName,
    GetAllGardens,
    GetGardenByID,
    DeleteGarden,
    DeleteAllGardens,
    UpdatePlotPlant,
    GetGarden,
    GetPlant,
    UpdatePlotHistory
}