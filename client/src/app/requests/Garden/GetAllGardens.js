import axios from "axios";
import { unescape } from "underscore";

//Function to get garden names and plot numbers for plot selection dropdown
async function GetAllGardens(plotsType) {

    try {
        const response = await axios.post("/garden/getAllGardens", { responseType: "json" });

        let status = response.status;

        if (status == 200) {
            let userGardens = response.data.gardens;
            let labels = [];

            if (userGardens !== null) {
                userGardens.forEach((garden) => {
                    let name = garden.name;
                    name = unescape(name);
                    let garden_id = garden._id;

                    let entry = null;

                    if (plotsType == "allPlots") {
                        //If all plots are being shown
                        for (let i = 0; i < garden.plot.length; i++) {
                            let plot_number = garden.plot[i].plot_number;
                            let displayedPlotNumber = plot_number + 1;
                            let label = name + ": Plot " + displayedPlotNumber;
                            let value = garden_id + ":" + plot_number + ":" + label;
                            entry = { label: label, value: value };
                            labels.push(entry);
                        }
                    } else if (plotsType == "gardenPlots") {
                        //If plots per garden are being shown
                        entry = { label: name, value: garden_id };
                        labels.push(entry);
                    }
                });
            }
            return labels;
        }
    } catch (error) {
        console.error(error);
    }
}

export default GetAllGardens;