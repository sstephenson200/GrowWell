import axios from "axios";

import GetAllGardens from "../../../src/app/requests/Garden/GetAllGardens";

jest.mock("axios");

describe("Get All Gardens Request", () => {

    const response = {
        status: 200,
        data: {
            gardens: [
                {
                    _id: "62cece2c3dd3dfcf2a4a61bb",
                    user_id: "62cec6b63dd3dfcf2a4a6185",
                    size: [2, 1],
                    name: "Front Garden",
                    plot: [
                        {
                            plot_number: 0,
                            plant_id: "62b84c313eeb64eba7ae592c",
                            date_planted: "2022-08-06T20:27:43.844Z",
                            plot_history: [],
                            _id: "62cece2c3dd3dfcf2a4a61bc"
                        },
                        {
                            plot_number: 1,
                            plant_id: null,
                            date_planted: "2022-08-06T20:27:43.844Z",
                            plot_history: [],
                            _id: "62cece2c3dd3dfcf2a4a61bd"
                        }
                    ],
                    __v: 0
                },
                {
                    _id: "62cece2c3dd3dfcf2a4a61bc",
                    user_id: "62cec6b63dd3dfcf2a4a6186",
                    size: [1, 1],
                    name: "Back Garden",
                    plot: [
                        {
                            plot_number: 0,
                            plant_id: "62b84c313eeb64eba7ae592c",
                            date_planted: "2022-08-06T20:27:43.844Z",
                            plot_history: [],
                            _id: "62cece2c3dd3dfcf2a4a61bc"
                        }
                    ],
                    __v: 0
                }
            ]
        }
    };

    axios.post.mockResolvedValue(response);

    it("returns garden plot data for empty plots when plotsType equals unfilledPlots", async () => {

        let plotsType = "unfilledPlots";
        let expectedResult = [];

        let garden1 = response.data.gardens[0];

        let label = garden1.name + ": Plot " + (1 + 1);
        let value = garden1._id + ":" + 1 + ":" + label;
        expectedResult.push({ label: label, value: value });

        expect(await GetAllGardens(plotsType)).toEqual(expectedResult);
    });

    it("returns all garden plot data when plotsType equals allPlots", async () => {

        let plotsType = "allPlots";
        let expectedResult = [];

        let garden1 = response.data.gardens[0];
        let garden2 = response.data.gardens[1];

        for (let i = 0; i < garden1.plot.length; i++) {
            let label = garden1.name + ": Plot " + (i + 1);
            let value = garden1._id + ":" + i + ":" + label;
            expectedResult.push({ label: label, value: value });
        }

        for (let i = 0; i < garden2.plot.length; i++) {
            let label = garden2.name + ": Plot " + (i + 1);
            let value = garden2._id + ":" + i + ":" + label;
            expectedResult.push({ label: label, value: value });
        }

        expect(await GetAllGardens(plotsType)).toEqual(expectedResult);
    });

    it("returns garden name and ID when plotsType equals gardenPlots", async () => {

        let plotsType = "gardenPlots";
        let expectedResult = [];

        let garden1 = response.data.gardens[0];

        for (let i = 0; i < response.data.gardens.length; i++) {
            let label = response.data.gardens[i].name;
            let value = response.data.gardens[i]._id;
            expectedResult.push({ label: label, value: value });
        }

        expect(await GetAllGardens(plotsType)).toEqual(expectedResult);
    });

});