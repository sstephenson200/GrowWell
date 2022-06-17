const router = require("express").Router();
const { upload } = require('../middleware/imageUpload');

const Plant = require("../models/plantModel");

//Build Endpoints
router.route("/createPlant").post(upload.array("file", 3), async (request, response) => {
    try {
        const parsedReq = JSON.parse(request.body.plant);
        const { name, description, plant_type, sow_date, plant_date, transplant_date, harvest_date, sun_condition, soil_type,
            soil_ph, water_schedule, compost_schedule, prune_schedule, feed_schedule, indoor_schedule, spacing, plant_problem,
            companion_plant, incompatible_plant } = parsedReq;

        //Validation - Check All Required Fields Provided
        if (!name || !plant_type || !sun_condition || !soil_type || !soil_ph || !water_schedule || !indoor_schedule || !spacing) {
            return response.status(400).json({ errorMessage: "Data not provided." });
        }

        //Validation - Check Name is 30 chars or less
        if (name.length > 30 || name.length < 1) {
            return response.status(400).json({ errorMessage: "Name must be between 1 and 30 characters." });
        }

        //Validation - Check Description is 250 chars or less
        if (description != null) {
            if (description.length > 250) {
                return response.status(400).json({ errorMessage: "Description must be less than 250 characters." });
            }
        }

        //Validation - Check plant_type is valid
        if (!Object.values(Plant.schema.path('plant_type').enumValues).includes(plant_type)) {
            return response.status(400).json({ errorMessage: "Invalid plant_type." });
        }

        //Validation - Check sow_date is Valid
        if (sow_date != undefined && sow_date.length != 0) {
            if (sow_date.length != 2) {
                return response.status(400).json({ errorMessage: "Sow start and end must both be specified." });
            }
            for (let i = 0; i < sow_date.length; i++) {
                if (sow_date[i] < 1 || sow_date[i] > 12) {
                    return response.status(400).json({ errorMessage: "Month value must be between 1 and 12." });
                }
            }
        }

        //Validation - Check plant_date is Valid
        if (plant_date != undefined && plant_date.length != 0) {
            if (plant_date.length != 2) {
                return response.status(400).json({ errorMessage: "Plant start and end must both be specified." });
            }
            for (let i = 0; i < plant_date.length; i++) {
                if (plant_date[i] < 1 || plant_date[i] > 12) {
                    return response.status(400).json({ errorMessage: "Month value must be between 1 and 12." });
                }
            }
        }

        //Validation - Check transplant_date is Valid
        if (transplant_date != undefined && transplant_date.length != 0) {
            if (transplant_date.length != 2) {
                return response.status(400).json({ errorMessage: "Transplant start and end must both be specified." });
            }
            for (let i = 0; i < transplant_date.length; i++) {
                if (transplant_date[i] < 1 || transplant_date[i] > 12) {
                    return response.status(400).json({ errorMessage: "Month value must be between 1 and 12." });
                }
            }
        }

        //Validation - Check harvest_date is Valid
        if (harvest_date != undefined && harvest_date.length != 0) {
            if (harvest_date.length != 2) {
                return response.status(400).json({ errorMessage: "Harvest start and end must both be specified." });
            }
            for (let i = 0; i < harvest_date.length; i++) {
                if (harvest_date[i] < 1 || harvest_date[i] > 12) {
                    return response.status(400).json({ errorMessage: "Month value must be between 1 and 12." });
                }
            }
        }

        //Validation - Check sun_condition is valid
        for (let i = 0; i < sun_condition.length; i++) {
            if (!Object.values(Plant.schema.path('sun_condition').$embeddedSchemaType.enumValues).includes(sun_condition[i])) {
                return response.status(400).json({ errorMessage: "Invalid sun_condition." });
            }
        }

        //Validation - Check soil_type is valid
        for (let i = 0; i < soil_type.length; i++) {
            if (!Object.values(Plant.schema.path('soil_type').$embeddedSchemaType.enumValues).includes(soil_type[i])) {
                return response.status(400).json({ errorMessage: "Invalid soil_type." });
            }
        }

        //Validation - Check soil_ph is valid
        for (let i = 0; i < soil_ph.length; i++) {
            if (!Object.values(Plant.schema.path('soil_ph').$embeddedSchemaType.enumValues).includes(soil_ph[i])) {
                return response.status(400).json({ errorMessage: "Invalid soil_ph." });
            }
        }

        //Validation - Check water_schedule is Valid
        if (water_schedule.length != 2) {
            return response.status(400).json({ errorMessage: "Water schedule start and end must both be specified." });
        }
        for (let i = 0; i < water_schedule.length; i++) {
            if (typeof water_schedule[i] !== 'number' || water_schedule[i] < 1) {
                return response.status(400).json({ errorMessage: "Schedule value must be greater than 0." });
            }
        }

        //Validation - Check prune_schedule is Valid
        if (prune_schedule != undefined && prune_schedule.length != 0) {
            if (prune_schedule.length == 2) {
                for (let i = 0; i < prune_schedule.length; i++) {
                    if (typeof prune_schedule[i] !== 'number' || prune_schedule[i] < 1) {
                        return response.status(400).json({ errorMessage: "Schedule value must be greater than 0." });
                    }
                }
            }
        }

        //Validation - Check feed_schedule is Valid
        if (feed_schedule != undefined && feed_schedule.length != 0) {
            if (feed_schedule.length == 2) {
                for (let i = 0; i < feed_schedule.length; i++) {
                    if (typeof feed_schedule[i] !== 'number' || feed_schedule[i] < 1) {
                        return response.status(400).json({ errorMessage: "Schedule value must be greater than 0." });
                    }
                }
            }
        }

        //Validation - Check indoor_schedule is Valid
        if (indoor_schedule.length == 2) {
            for (let i = 0; i < indoor_schedule.length; i++) {
                if (typeof indoor_schedule[i] !== 'number' || indoor_schedule[i] < 1) {
                    return response.status(400).json({ errorMessage: "Schedule value must be greater than 0." });
                }
            }
        }


        //Validation - Check spacing is Valid
        if (spacing.length != 2) {
            return response.status(400).json({ errorMessage: "Spacing min and max must both be specified." });
        }
        for (let i = 0; i < spacing.length; i++) {
            if (typeof spacing[i] !== 'number' || spacing[i] < 1) {
                return response.status(400).json({ errorMessage: "Spacing value must be greater than 0." });
            }
        }

        //Get image_id array
        const image_id = [];
        for (let i = 0; i < request.files.length; i++) {
            const id = request.files[i].id;
            image_id.push(id);
        }

        //Create Plant
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
});

module.exports = router;