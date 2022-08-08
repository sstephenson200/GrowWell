import axios from "axios";
import { unescape } from "underscore";

//Function to get garden name for display purposes
async function GetGardenByID(garden_id) {
    try {
        const response = await axios.post("/garden/getGardenByID", {
            "garden_id": garden_id
        }, { responseType: 'json' });

        let status = response.status;

        if (status == 200) {
            let name = response.data.garden.name;
            name = unescape(name);
            return name;
        }
    } catch (error) {
        console.log(error);
    }
}

export default GetGardenByID;