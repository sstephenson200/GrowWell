import axios from "axios";

//Function to add or remove a plant from a given plot
async function UpdatePlotPlant(selectedPlant, plot_number, garden_id) {

    try {
        let response = null;

        if (selectedPlant !== null) {
            //Adding plant to plot
            response = await axios.put("/garden/updatePlotPlant", {
                "plant_id": selectedPlant,
                "plot_number": plot_number,
                "garden_id": garden_id
            }, { responseType: "json" });
        } else {
            //Removing plant from plot
            response = await axios.put("/garden/updatePlotPlant", {
                "plot_number": plot_number,
                "garden_id": garden_id
            }, { responseType: "json" });
        }

        let status = response.status;

        if (status == 200) {
            return response;
        }
    } catch (error) {
        console.log(error);
    }
}

export default UpdatePlotPlant;