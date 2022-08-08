import axios from "axios";

//Function to get all available plant data
async function GetAllPlants() {
    try {
        const response = await axios.get("/plant/getAllPlants");
        let plantList = response.data.plants;

        return plantList;
    } catch (error) {
        console.error(error);
    }
}

export default GetAllPlants;