import axios from "axios";

//Function to get plant data for a given plant_id
async function GetPlantByID(plant_id, requiredData) {
    try {
        const response = await axios.post("/plant/getPlantByID", {
            "plant_id": plant_id
        }, { responseType: "json" });

        let status = response.status;

        if (status == 200) {
            if (requiredData == "name") {
                return response.data.plant.name;
            } else if (requiredData == "all") {
                return response.data.plant;
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default GetPlantByID;