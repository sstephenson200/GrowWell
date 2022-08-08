import axios from "axios";
import { unescape } from "underscore";

//Function to get garden names and plot numbers for plot selection dropdown
async function GetPlotsRequest() {

    try {
        const response = await axios.post("/garden/getAllGardens", { responseType: "json" });

        let status = response.status;

        if (status == 200) {
            let userGardens = response.data.gardens;
            let plotLabels = [];

            if (userGardens !== null) {
                userGardens.forEach((garden) => {
                    let name = garden.name;
                    name = unescape(name);
                    let garden_id = garden._id;

                    for (let i = 0; i < garden.plot.length; i++) {
                        let plot_number = garden.plot[i].plot_number;
                        let displayedPlotNumber = plot_number + 1;
                        let label = name + ": Plot " + displayedPlotNumber;
                        let value = garden_id + ":" + plot_number + ":" + label;
                        let entry = { label: label, value: value };
                        plotLabels.push(entry);
                    }
                });
            }
            return plotLabels;
        }
    } catch (error) {
        console.error(error);
    }
}

export default GetPlotsRequest;