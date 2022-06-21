const validator = require("../validators/validator");

const Note = require("../models/noteModel");

//Create Note Endpoint
const createNote = async (request, response) => {

    const parsedReq = JSON.parse(request.body.note);

    let { user_id, title, description, garden_id, plot_number } = parsedReq;
    const date = Date.now();

    //Check if required params are given
    if (!user_id) {
        return response.status(400).json({ errorMessage: "User_id required." });
    } else if (!title) {
        return response.status(400).json({ errorMessage: "Title required." });
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (!validator.checkValidLength(title, 1, 30)) {
        return response.status(400).json({ errorMessage: "Title must be between 1 and 30 characters." });

    }

    if (description != null) {
        if (!validator.checkValidLength(description, 1, 250)) {
            return response.status(400).json({ errorMessage: "Description must be between 1 and 250 characters." });

        }
    }

    if (!validator.checkValidId(user_id)) {
        return response.status(400).json({ errorMessage: "Invalid user_id." });
    }

    if (garden_id != null) {
        if (!validator.checkValidId(garden_id)) {
            return response.status(400).json({ errorMessage: "Invalid garden_id." });
        }
        if (await validator.checkExistingGarden(garden_id, user_id)) {
            return response.status(400).json({ errorMessage: "Invalid garden_id for given user_id." });
        }
    }

    if (!validator.checkGardenAndPlotsProvided(garden_id, plot_number)) {
        return response.status(400).json({ errorMessage: "Plot_number must be provided with garden_id." });
    }

    if (plot_number != null) {
        if (!validator.checkValidPlotNumber(garden_id, plot_number)) {
            return response.status(400).json({ errorMessage: "Invalid plot number." });
        }
    }

    //Get image_id array
    const image_id = [];
    for (let i = 0; i < request.files.length; i++) {
        const id = request.files[i].id;
        image_id.push(id);
    }

    try {

        const newNote = new Note({
            user_id, title, description, date, image: image_id, garden_id, plot_number
        });
        const savedNote = await newNote.save();

        return response.status(200).json({ message: "Note created successfully." });

    } catch (error) {
        console.error(error);
        response.status(500).send();
    }

}

module.exports = {
    createNote
}