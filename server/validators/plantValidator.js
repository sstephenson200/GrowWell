const Plant = require("../models/plantModel");

//Enum containing plant enum types available for editing
const enumTypes = {
    plant_type: "plant_type",
    sun_condition: "sun_condition",
    soil_type: "soil_type",
    soil_ph: "soil_ph"
}

//Enum containing plant monthly schedule types available for editing
const monthlyScheduleTypes = {
    sow_date: "sow_date",
    plant_date: "plant_date",
    transplant_date: "transplant_date",
    harvest_date: "harvest_date"
}

//Enum containing plant required weekly schedule types available for editing
const requiredWeeklyScheduleTypes = {
    water_schedule: "water_schedule",
    spacing: "spacing"
}

//Enum containing plant optional weekly schedule types available for editing
const optionalWeeklyScheduleTypes = {
    prune_schedule: "prune_schedule",
    feed_schedule: "feed_schedule",
    indoor_schedule: "indoor_schedule"
}

//Enum containing plant list types available for editing
const listTypes = {
    plant_problem: "plant_problem",
    companion_plant: "companion_plant",
    incompatible_plant: "incompatible_plant"
}

//Check length of array
function checkArrayLength(array, length) {
    if (array.length != length) {
        return false;
    } else {
        return true;
    }
}

//Check monthly schedule is valid
function checkValidMonthSchedule(schedule) {
    for (let i = 0; i < schedule.length; i++) {
        if (typeof schedule[i] !== 'number' || schedule[i] < 1 || schedule[i] > 12) {
            return false;
        }
    }
    return true;
}

//Check entered list contents are valid enum values
function checkValidPlantEnum(list) {
    const listName = list.name;
    if (typeof list.type !== 'string') {
        for (let i = 0; i < list.type.length; i++) {
            if (Object.values(Plant.schema.path(listName).$embeddedSchemaType.enumValues).includes(list.type[i])) {
                //true
            } else {
                return false;
            }
        }
        return true;
    } else {
        if (Object.values(Plant.schema.path(listName))[0].includes(list.type)) {
            return true;
        }
    }
}

//Check weekly schedule is valid
function checkValidWeeklySchedule(schedule) {
    for (let i = 0; i < schedule.length; i++) {
        if (typeof schedule[i] !== 'number' || schedule[i] < 1) {
            return false;
        }
    }
    return true;
}

module.exports = {
    enumTypes,
    monthlyScheduleTypes,
    requiredWeeklyScheduleTypes,
    optionalWeeklyScheduleTypes,
    listTypes,
    checkArrayLength,
    checkValidMonthSchedule,
    checkValidPlantEnum,
    checkValidWeeklySchedule
}