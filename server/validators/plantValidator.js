const Plant = require("../models/plantModel");

//Enum containing plant enum types available for editing
const enumTypes = {
    plant_type: "plant_type",
    sun_condition: "sun_condition",
    soil_type: "soil_type",
    soil_ph: "soil_ph"
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
    let flag = false;
    const listName = list.name;
    if (typeof list.type !== 'string') {
        for (let i = 0; i < list.type.length; i++) {
            if (Object.values(Plant.schema.path(listName).$embeddedSchemaType.enumValues).includes(list.type[i])) {
                flag = true;
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
    checkArrayLength,
    checkValidMonthSchedule,
    checkValidPlantEnum,
    checkValidWeeklySchedule
}