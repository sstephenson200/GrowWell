const validator = require("../validators/validator");

const Plant = require("../models/plantModel");


//Create Plant Endpoint
const createPlant = async (request, response) => {

    let parsedReq = JSON.parse(request.body.plant);

    let { name, description, plant_type, sow_date, plant_date, transplant_date, harvest_date, sun_condition, soil_type,
        soil_ph, water_schedule, compost_schedule, prune_schedule, feed_schedule, indoor_schedule, spacing, plant_problem,
        companion_plant, incompatible_plant } = parsedReq;

    let enums = [{ type: plant_type, name: "plant_type" }, { type: sun_condition, name: "sun_condition" }, { type: soil_type, name: "soil_type" }, { type: soil_ph, name: "soil_ph" }];
    const monthlySchedules = [{ type: sow_date, name: "sow_date" }, { type: plant_date, name: "plant_date" }, { type: transplant_date, name: "transplant_date" }, { type: harvest_date, name: "harvest_date" }];
    const requiredWeeklySchedules = [{ type: water_schedule, name: "water_schedule" }, { type: spacing, name: "spacing" }];
    const optionalWeeklySchedules = [{ type: prune_schedule, name: "prune_schedule" }, { type: feed_schedule, name: "feed_schedule" }, { type: indoor_schedule, name: "indoor_schedule" }];
    let stringArrays = [{ type: plant_problem, name: "plant_problem" }, { type: companion_plant, name: "companion_plant" }, { type: incompatible_plant, name: "incompatible_plant" }];

    //Check if required params are given
    if (!name) {
        return response.status(400).json({ errorMessage: "Name required." });
    } else if (!plant_type) {
        return response.status(400).json({ errorMessage: "Plant type required." });
    } else if (!sun_condition) {
        return response.status(400).json({ errorMessage: "Sun_condition required." });
    } else if (!soil_type) {
        return response.status(400).json({ errorMessage: "Soil_type required." });
    } else if (!soil_ph) {
        return response.status(400).json({ errorMessage: "Soil_ph required." });
    } else if (!water_schedule) {
        return response.status(400).json({ errorMessage: "Water_schedule required." });
    } else if (!indoor_schedule) {
        return response.status(400).json({ errorMessage: "Indoor_schedule required." });
    } else if (!spacing) {
        return response.status(400).json({ errorMessage: "Spacing required." });
    }

    if (!validator.checkValidLength(name, 1, 30)) {
        return response.status(400).json({ errorMessage: "Name must be between 1 and 30 characters." });
    }

    if (description != null) {
        if (!validator.checkValidLength(description, 1, 250)) {
            return response.status(400).json({ errorMessage: "Description must be between 1 and 250 characters." });
        }
    }

    if (compost_schedule != null) {
        if (!validator.checkValidLength(compost_schedule, 1, 30)) {
            return response.status(400).json({ errorMessage: "Compost schedule must be between 1 and 30 characters." });
        }
    }

    let editedEnumsEntry = [];
    let editedEnums = [];

    //Check all enum values are valid and remove duplicates
    for (let i = 0; i < enums.length; i++) {
        if (enums[i].name !== "plant_type") {
            editedEnumsEntry = [...new Set(enums[i].type)];
        } else {
            editedEnumsEntry = enums[i].type;
        }
        editedEnums.push(editedEnumsEntry);
        if (!validator.checkValidPlantEnum(enums[i])) {
            return response.status(400).json({ errorMessage: "Invalid " + enums[i].name + "." });
        }
    }

    //Reset enum values
    enums = editedEnums;
    plant_type = enums[0];
    sun_condition = enums[1];
    soil_type = enums[2];
    soil_ph = enums[3];

    //Check monthly schedules have 2 values between 1 and 12 
    for (let i = 0; i < monthlySchedules.length; i++) {
        if (monthlySchedules[i].type != null) {
            if (!validator.checkArrayLength(monthlySchedules[i].type, 2)) {
                const listName = monthlySchedules[i].name;
                return response.status(400).json({ errorMessage: listName + " must have start and end month." });
            }
            if (!validator.checkValidMonthSchedule(monthlySchedules[i].type)) {
                return response.status(400).json({ errorMessage: "Month values must be between 1 and 12." });
            }
        }
    }

    //Check required weekly values have 2 values greater than 1
    for (let i = 0; i < requiredWeeklySchedules.length; i++) {
        const listName = requiredWeeklySchedules[i].name;
        if (!validator.checkArrayLength(requiredWeeklySchedules[i].type, 2)) {
            return response.status(400).json({ errorMessage: listName + " array must have max and min value." });
        }
        if (!validator.checkValidWeeklySchedule(requiredWeeklySchedules[i].type)) {
            return response.status(400).json({ errorMessage: "Schedule values for " + listName + " must be greater than 0." });
        }
    }

    //Check optional weekly values have one string or two number values
    for (let i = 0; i < optionalWeeklySchedules.length; i++) {
        const listName = optionalWeeklySchedules[i].name;
        if (optionalWeeklySchedules[i].type != null) {
            if (validator.checkArrayLength(optionalWeeklySchedules[i].type, 1)) {
                optionalWeeklySchedules[i].type[0] = optionalWeeklySchedules[i].type[0].trim();
                if (typeof optionalWeeklySchedules[i].type[0] !== 'string') {
                    return response.status(400).json({ errorMessage: "Single values for" + listName + " must be entered as strings." });
                }
            } else if (validator.checkArrayLength(optionalWeeklySchedules[i].type, 2)) {
                if (!validator.checkValidWeeklySchedule(optionalWeeklySchedules[i].type)) {
                    return response.status(400).json({ errorMessage: "Schedule values for " + listName + " must be greater than 0." });
                }
            }
        }
    }

    let editedString = "";
    let editedStringArraysEntry = [];
    let editedStringArrays = [];

    //Check entries are strings
    for (let i = 0; i < stringArrays.length; i++) {
        const listName = stringArrays[i].name;
        if (stringArrays[i].type != null) {
            editedStringArraysEntry = [...new Set(stringArrays[i].type)];
            for (let j = 0; j < editedStringArraysEntry.length; j++) {
                if (typeof editedStringArraysEntry[j] !== 'string') {
                    return response.status(400).json({ errorMessage: listName + " values must be entered as strings." });
                }
                editedString = editedStringArraysEntry[j].trim();
                editedStringArraysEntry[j] = editedString;
            }
        }
        editedStringArrays.push(editedStringArraysEntry);
    }

    //Reset array strings
    stringArrays = editedStringArrays;
    plant_problem = stringArrays[0];
    companion_plant = stringArrays[1];
    incompatible_plant = stringArrays[2];

    //Get image_id array
    const image_id = [];
    for (let i = 0; i < request.files.length; i++) {
        const id = request.files[i].id;
        image_id.push(id);
    }

    try {

        const newPlant = new Plant({
            name, description, plant_type, sow_date, plant_date, transplant_date, harvest_date, sun_condition, soil_type, soil_ph,
            water_schedule, compost_schedule, prune_schedule, feed_schedule, indoor_schedule, spacing, plant_problem, companion_plant,
            incompatible_plant, image: image_id
        });
        const savedPlant = await newPlant.save();

        return response.status(200).json({ message: "Plant created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }

}

module.exports = {
    createPlant
}